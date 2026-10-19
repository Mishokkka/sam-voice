# Changelog

## 1.4.2 (Qwen3-TTS)

- Added independent Qwen3-TTS engine using `speech.cpp` OpenAI-compatible HTTP endpoint.
- Added nine Qwen voices and persistent per-NPC Voice Instructions (only Qwen 1.7B).
- Kept synchronized playback, audio effects, and existing SAM, Piper and Silero engines.
- Added local-server setup and exact-origin CORS guidance for Foundry.


## 1.4.1 (Silero integration)

- Added a separate Silero engine (Russian CPU-based TTS) alongside SAM and Piper.
- Added independent local backend URL and five-voice selection, health checks and voice profile persistence.
- Reused validated generated-audio transport and synchronized playback for players.
- Added a loopback-only Python server and Windows setup documentation in `tools/silero/`.
- No model weights bundled. The server must be started separately.


## 1.4.0

### Fixed

- Shared playback now runs on the invoking GM and all other clients.
- Preview, shared playback, session tests, `/sam`, and public API now return or await observable results.
- Receiver playback errors are no longer swallowed.
- Audio unlock timestamps are written only after successful unlock.
- Suspended or blocked AudioContext cannot defer a received phrase until a later gesture.
- Session diagnostics can no longer hang indefinitely on one client.
- Stale Session Ready refreshes no longer overwrite newer status.
- Piper error bodies are truncated before display.
- Piper audio MIME and actual payload size are validated.
- The chat launcher is restored after Chat Log rerenders.
- Voice profile deletion now requires confirmation.

### Architecture

- Added speech request schema v2 and request IDs.
- Added `SpeechOrchestrator` for local/remote dispatch.
- Added playback engine registry and SAM/Piper adapters.
- Added structured error taxonomy and playback results.
- Added settings/profile migrations and read-time profile normalization.
- Removed legacy effect dual-write.
- Removed dead Chatterbox and player unlock source files.
- Added bounded queue and unit/integration tests.

### Performance

- SAM synthesis moved to a Web Worker with fallback.
- Piper health checks are cached and deduplicated.
- Unchanged client settings are no longer rewritten on every playback.
- Session checks run concurrently.

### Security

- Non-local Piper backends require explicit opt-in.
- Imported profiles still strip non-local backend URLs.
- Profile import count and file size are limited.
