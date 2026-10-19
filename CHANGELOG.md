# Changelog

## 1.4.4 (phrase export)

- Add a Download WAV button for the last phrase actually started on the GM client, for all four engines and Preview/Play for All.
- Reuse decoded speech, playback settings and random effect buffers; exporting does not run synthesis again.
- Render the complete isolated phrase with its original effects, speed, pitch, output compressor and effect tails to stereo 16-bit PCM WAV.
- Preserve the export across Stop, failed requests and dialog reopening; keep only the latest started phrase in memory until page reload.
- Include a readable phrase excerpt and timestamp in the filename.

## 1.4.3 (playback reliability)

- Collect playback/Stop acknowledgements from each active remote client with a bounded wait; identify failed clients.
- Reject playback and queue requests while WebAudio is locked; unlock only in gesture/Unlock handlers.
- Prevent delayed playback if audio becomes suspended during decoding.
- Cancel synthesis and request preparation from both the Stop button and the public API.
- Preserve new queued speech when an earlier decoding operation finishes after Stop.
- Validate text before synthesis, including Qwen, and show backend timeouts as errors.
- Check audio signatures against declared MIME types before sending generated files.
- Emit the correct Preview completion status and failures.
- Restore a dependency-free source/build/test project and deterministic install ZIP packaging.
- Return a clear unsupported-text error from both the SAM worker and its main-thread fallback.
- Restrict validation workflow credentials and detect untracked generated assets.
- Document the versioned Windows speech.cpp installer and invoke the executable through PATH.
- Preserve the existing UI, profiles, effects and trusted-table sender behavior.

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
