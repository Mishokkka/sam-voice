"""CPU-only Silero backend for SAM Voice; run with the tested Silero Python environment."""
from __future__ import annotations

import json
import logging
import os
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

import torch
from silero import silero_tts

HOST = "127.0.0.1"
PORT = int(os.getenv("SILERO_PORT", "5051"))
MODEL_NAME = os.getenv("SILERO_MODEL", "v5_5_ru")
DEFAULT_VOICE = "xenia"
VOICES = ("aidar", "baya", "kseniya", "xenia", "eugene")
MAX_TEXT_LENGTH = 1000
MAX_WAV_SIZE = 4 * 1024 * 1024
MAX_REQUEST_SIZE = 16 * 1024
SAMPLE_RATE = 24000
DEFAULT_ALLOWED_ORIGINS = ("http://localhost:30000", "http://127.0.0.1:30000")


def parse_allowed_origins(value):
    """Accept only explicit HTTP(S) origins; never permit wildcard or opaque origins."""
    origins = set()
    for entry in value.split(","):
        origin = entry.strip()
        if not origin:
            continue
        parts = urlsplit(origin)
        try:
            _ = parts.port
        except ValueError as exc:
            raise ValueError(f"Invalid Foundry origin: {origin!r}") from exc
        if (
            parts.scheme not in ("http", "https")
            or not parts.hostname
            or parts.username is not None
            or parts.password is not None
            or parts.path
            or parts.query
            or parts.fragment
            or origin != f"{parts.scheme}://{parts.netloc}"
            or "*" in origin
        ):
            raise ValueError(f"Invalid Foundry origin: {origin!r}")
        origins.add(origin)
    return frozenset(origins)


ALLOWED_ORIGINS = parse_allowed_origins(
    os.getenv("SILERO_ALLOWED_ORIGINS", ",".join(DEFAULT_ALLOWED_ORIGINS))
)
synthesis_lock = threading.Lock()


def load_model():
    torch.set_num_threads(4)
    print(f"Loading Silero {MODEL_NAME} on CPU...", flush=True)
    model, _ = silero_tts(language="ru", speaker=MODEL_NAME)
    model.to("cpu")
    print("Silero ready.", flush=True)
    return model


model = None


class Handler(BaseHTTPRequestHandler):
    server_version = "SAMVoiceSilero/0.1"

    def _headers(self, status, mime, size):
        self.send_response(status)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(size))
        self.send_header("Vary", "Origin")
        origin = self.headers.get("Origin")
        if origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()

    def _respond(self, status, data, mime):
        self._headers(status, mime, len(data))
        try:
            self.wfile.write(data)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def _json(self, status, obj):
        payload = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self._respond(status, payload, "application/json; charset=utf-8")

    def _check_origin(self):
        origins = self.headers.get_all("Origin", [])
        if origins and (len(origins) != 1 or origins[0] not in ALLOWED_ORIGINS):
            self._json(403, {"error": "Origin is not permitted"})
            return False
        return True

    def do_OPTIONS(self):
        if not self._check_origin():
            return
        self._headers(204, "text/plain", 0)

    def do_GET(self):
        if not self._check_origin():
            return
        if self.path == "/voices":
            self._json(200, {voice: {"name": voice} for voice in VOICES})
        elif self.path in ("/", "/health"):
            self._json(200, {"ok": True, "engine": "silero", "model": MODEL_NAME})
        else:
            self._json(404, {"error": "Not found"})

    def do_POST(self):
        if not self._check_origin():
            return
        if self.path != "/":
            return self._json(404, {"error": "Not found"})
        try:
            size = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            size = 0
        if not 0 < size <= MAX_REQUEST_SIZE:
            return self._json(413, {"error": "Invalid or oversized request"})
        try:
            request = json.loads(self.rfile.read(size).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            return self._json(400, {"error": "Expected UTF-8 JSON"})
        if not isinstance(request, dict):
            return self._json(400, {"error": "Expected JSON object"})
        text = request.get("text")
        voice = request.get("voice") or DEFAULT_VOICE
        if not isinstance(text, str) or not text.strip():
            return self._json(400, {"error": "Text is empty"})
        if len(text) > MAX_TEXT_LENGTH:
            return self._json(413, {"error": f"Text exceeds {MAX_TEXT_LENGTH} characters"})
        if voice not in VOICES:
            return self._json(400, {"error": f"Unknown voice: {voice}"})

        audio_path = None
        try:
            with synthesis_lock:
                fd, name = tempfile.mkstemp(prefix="samvoice_silero_", suffix=".wav")
                os.close(fd)
                audio_path = Path(name)
                model.save_wav(
                    text=text.strip(), speaker=voice,
                    sample_rate=SAMPLE_RATE, audio_path=str(audio_path),
                )
                audio = audio_path.read_bytes()
            if len(audio) > MAX_WAV_SIZE:
                return self._json(413, {
                    "error": "Generated WAV exceeds SAM Voice 4 MB limit. Shorten the text."
                })
            self._respond(200, audio, "audio/wav")
        except Exception:
            logging.exception("Silero synthesis failed")
            self._json(500, {"error": "Silero synthesis failed; see server console"})
        finally:
            if audio_path is not None:
                audio_path.unlink(missing_ok=True)


def main():
    global model
    model = load_model()
    print(f"Allowed Foundry origins: {', '.join(sorted(ALLOWED_ORIGINS)) or '(none)'}", flush=True)
    with ThreadingHTTPServer((HOST, PORT), Handler) as server:
        print(f"Listening on http://{HOST}:{PORT}", flush=True)
        print("Keep this window open during Foundry sessions.", flush=True)
        try:
            server.serve_forever(poll_interval=0.2)
        except KeyboardInterrupt:
            print("Stopping Silero server.", flush=True)


if __name__ == "__main__":
    main()
