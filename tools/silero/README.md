# Silero for SAM Voice

Local CPU-only Russian TTS. SAM and Piper remain available; Silero has separate server URL and voice settings.

## Windows setup (existing Python 3.11 environment)

The tested environment used these packages:

- `torch==2.8.0+cpu`
- `silero` (with `v5_5_ru.pt` cached locally)

1. Copy `silero_server.py` to the user's `%USERPROFILE%\silero-tts` folder, where the working `.venv` already exists.
2. Ensure `v5_5_ru.pt` is cached at `.venv\Lib\site-packages\silero\model\v5_5_ru.pt`. Silero will try to download it if missing.
3. Open PowerShell:

   ```powershell
   cd "$env:USERPROFILE\silero-tts"
   .\.venv\Scripts\python.exe .\silero_server.py
   ```

   Expect: `Silero ready.` and `Listening on http://127.0.0.1:5051`. Keep the window open.

4. Confirm a voice list in another PowerShell window:

   ```powershell
   Invoke-RestMethod http://127.0.0.1:5051/voices
   ```

5. Start Foundry v13 with the updated SAM Voice module (both GM and players use the same updated client bundle). Open SAM Voice. Select **Silero**, set `http://127.0.0.1:5051`, click **Check**, choose a voice, then **Preview** and **Play for All**.

## Protocol

- `GET /voices` returns the same object-of-voices shape used by the Piper adapter.
- `POST /` accepts UTF-8 JSON `{"text":"Привет","voice":"xenia"}`, returns `audio/wav`.
- `OPTIONS /` supports browser CORS preflight.
- Binds **only** to `127.0.0.1`; no model weights are included in the Foundry module.
- Voices: `aidar`, `baya`, `kseniya`, `xenia`, `eugene`.

## Limits and caveats

- Maximum 1,000 characters per request and 4 MiB WAV response (shared playback transport limit). Split long text into shorter phrases.
- Server handles one synthesis job at a time using a lock; idle requests do not consume GPU memory.
- Loopback server grants CORS requests from any web origin so a remotely-hosted Foundry tab can connect. It is not protected by authentication. Run it only when needed, never bind it publicly, and only browse trusted sites while it runs.
- Browser policy may block loopback requests from some HTTPS or remote Foundry deployments; if the **Check** button fails but `Invoke-RestMethod` works, inspect browser developer tools for mixed-content / local-network-access errors.
- The existing repository distributes a compiled `dist/samvoice.js`. These UI changes are applied to that bundle; **future rebuilds from unpublished sources must port the Silero changes or they will be overwritten**.
- End-to-end Foundry playback requires a real Foundry session to verify. The adapter's request/response contract and HTTP behavior are testable separately.
