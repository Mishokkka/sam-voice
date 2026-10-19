"""Regression tests for Silero's loopback CORS policy; no weights or PyTorch required."""
import http.client
import importlib.util
import io
import json
import os
import sys
import threading
import types
import unittest
import wave
from pathlib import Path
from http.server import ThreadingHTTPServer
from unittest.mock import patch


class FakeModel:
    def __init__(self):
        self.calls = []

    def save_wav(self, *, text, speaker, sample_rate, audio_path):
        self.calls.append((text, speaker))
        with wave.open(audio_path, "wb") as wav:
            wav.setnchannels(1)
            wav.setsampwidth(2)
            wav.setframerate(sample_rate)
            wav.writeframes(b"\x00\x00" * 100)


def load_server_module():
    # Avoid requiring heavyweight libraries for an HTTP policy test.
    torch = types.ModuleType("torch")
    torch.set_num_threads = lambda _: None
    silero = types.ModuleType("silero")
    silero.silero_tts = lambda **_: (None, None)
    path = Path(__file__).with_name("silero_server.py")
    spec = importlib.util.spec_from_file_location("sam_voice_silero_tested", path)
    module = importlib.util.module_from_spec(spec)
    with patch.dict(sys.modules, {"torch": torch, "silero": silero}), patch.dict(
        os.environ, {"SILERO_ALLOWED_ORIGINS": "http://localhost:30000,https://foundry.example.test"}
    ):
        spec.loader.exec_module(module)
    return module


class CorsPolicyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = load_server_module()
        cls.fake = FakeModel()
        cls.app.model = cls.fake
        cls.httpd = ThreadingHTTPServer(("127.0.0.1", 0), cls.app.Handler)
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.thread.join(timeout=2)

    def request(self, method, path="/", *, origin=None, json_body=None):
        connection = http.client.HTTPConnection("127.0.0.1", self.httpd.server_port, timeout=3)
        headers = {}
        if origin is not None:
            headers["Origin"] = origin
        body = None
        if json_body is not None:
            headers["Content-Type"] = "application/json"
            body = json.dumps(json_body).encode("utf-8")
        connection.request(method, path, body=body, headers=headers)
        response = connection.getresponse()
        result = (response.status, dict(response.getheaders()), response.read())
        connection.close()
        return result

    def test_default_origins_and_config_validation(self):
        parse = self.app.parse_allowed_origins
        self.assertEqual(parse("http://localhost:30000, https://foundry.example.test"),
                         frozenset(("http://localhost:30000", "https://foundry.example.test")))
        for value in ("*", "null", "http://localhost:30000/", "http://localhost:30000/x",
                      "ftp://localhost:30000", "https://user:pass@example.com"):
            with self.subTest(value=value), self.assertRaises(ValueError):
                parse(value)

    def test_approved_preflight_and_post(self):
        preflight = self.request("OPTIONS", origin="http://localhost:30000")
        self.assertEqual(preflight[0], 204)
        self.assertEqual(preflight[1].get("Access-Control-Allow-Origin"), "http://localhost:30000")
        self.assertEqual(preflight[1].get("Access-Control-Allow-Private-Network"), "true")
        valid = self.request("POST", origin="https://foundry.example.test",
                             json_body={"text": "Привет", "voice": "xenia"})
        self.assertEqual(valid[0], 200)
        self.assertEqual(valid[1]["Access-Control-Allow-Origin"], "https://foundry.example.test")
        self.assertEqual(valid[1]["Content-Type"], "audio/wav")
        self.assertTrue(valid[2].startswith(b"RIFF"))

    def test_forbidden_origin_cannot_trigger_synthesis(self):
        before = len(self.fake.calls)
        forbidden = "https://evil.example.test"
        for method, path, body in (
            ("OPTIONS", "/", None),
            ("GET", "/voices", None),
            ("POST", "/", {"text": "CPU work", "voice": "xenia"}),
        ):
            with self.subTest(method=method):
                status, headers, _ = self.request(method, path, origin=forbidden, json_body=body)
                self.assertEqual(status, 403)
                self.assertNotIn("Access-Control-Allow-Origin", headers)
        self.assertEqual(before, len(self.fake.calls))

    def test_no_origin_still_allows_local_cli(self):
        status, headers, data = self.request("GET", "/voices")
        self.assertEqual(status, 200)
        self.assertNotIn("Access-Control-Allow-Origin", headers)
        self.assertIn("aidar", json.loads(data))


if __name__ == "__main__":
    unittest.main()
