# Silero for SAM Voice

Local CPU-only Russian TTS. SAM and Piper remain available; Silero has separate server URL and voice settings.

## Windows setup (existing Python 3.11 environment)

The tested environment used these packages:

- `torch==2.8.0+cpu`
- `silero` (with `v5_5_ru.pt` cached locally)

1. Copy `silero_server.py` to the user's `%USERPROFILE%\silero-tts` folder, where the working `.venv` already exists.
2. Ensure `v5_5_ru.pt` is cached at `.venv\Lib\site-packages\silero\model\v5_5_ru.pt`. Silero will try to download it if missing.
3. Configure the **exact** Foundry page origins before starting the server. By default, only `http://localhost:30000` and `http://127.0.0.1:30000` are allowed. Open your Foundry browser tab and run `location.origin` in the developer console to find its real origin. If you use a custom port, hostname or remote Foundry deployment, list its exact origin in `SILERO_ALLOWED_ORIGINS`. Do not use `*`, a trailing slash, a path, or an opaque `null` origin.

   For example, if Foundry is accessed at `https://foundry.example.com`, open PowerShell:

   ```powershell
   cd "$env:USERPROFILE\silero-tts"
   $env:SILERO_ALLOWED_ORIGINS="http://localhost:30000,http://127.0.0.1:30000,https://foundry.example.com"
   .\.venv\Scripts\python.exe .\silero_server.py
   ```

   For local Foundry on its default port, omit the `$env:SILERO_ALLOWED_ORIGINS` assignment and launch the server normally.

   Expect: `Silero ready.` and `Listening on http://127.0.0.1:5051`. Keep the window open.

4. Confirm a voice list in another PowerShell window:

   ```powershell
   Invoke-RestMethod http://127.0.0.1:5051/voices
   ```

5. Start Foundry v13 with the updated SAM Voice module (both GM and players use the same updated client bundle). Open SAM Voice. Select **Silero**, set `http://127.0.0.1:5051`, click **Check**, choose a voice, then **Preview** and **Play for All**.

## Protocol

- `GET /voices` returns the same object-of-voices shape used by the Piper adapter.
- `POST /` accepts UTF-8 JSON `{"text":"Привет","voice":"xenia"}`, returns `audio/wav`.
- `OPTIONS /` supports browser CORS preflight **only** for allowed origins. Browser `GET`/`POST` requests with an unapproved `Origin` receive 403 before synthesis begins; requests with no Origin header remain available for local CLI diagnostics.
- Binds **only** to `127.0.0.1`; no model weights are included in the Foundry module.
- Voices: `aidar`, `baya`, `kseniya`, `xenia`, `eugene`.

## Limits and caveats

- Maximum 1,000 characters per request and 4 MiB WAV response (shared playback transport limit). Split long text into shorter phrases.
- Server handles one synthesis job at a time using a lock; idle requests do not consume GPU memory.
- CORS is restricted to `SILERO_ALLOWED_ORIGINS` (comma-separated exact HTTP(S) origins). No wildcard CORS. Defaults allow only loopback Foundry URLs at port 30000; set the variable for another port or domain, and restart the server after changing it. This is browser-origin protection, **not user authentication**: native programs on the same computer can still connect. Run it only when needed and never bind it publicly.
- Browser policy may block loopback requests from some HTTPS or remote Foundry deployments; if the **Check** button fails but `Invoke-RestMethod` works, inspect browser developer tools for mixed-content / local-network-access errors.
- The existing repository distributes a compiled `dist/samvoice.js`. These UI changes are applied to that bundle; **future rebuilds from unpublished sources must port the Silero changes or they will be overwritten**.
- End-to-end Foundry playback requires a real Foundry session to verify. The adapter's request/response contract and HTTP behavior are testable separately.
