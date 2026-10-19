# Qwen3-TTS for SAM Voice

The Qwen3-TTS engine uses the **native `speech.cpp` HTTP API**. No Python wrapper is needed. SAM, Piper and Silero are not modified by this backend. Model weights are not shipped with the Foundry module.

## Setup on Windows (RTX 3050 Laptop 4 GB)

This integration was tested with [speech.cpp](https://github.com/nyosegawa/speech.cpp) 0.8.10 and its Windows Vulkan build. For Qwen 1.7B Q6_K:

1. If speech.cpp 0.8.10 is not installed, run its [official Windows installer](https://github.com/nyosegawa/speech.cpp/blob/v0.8.10/docs/install.md) in PowerShell:

   ```powershell
   & ([scriptblock]::Create((Invoke-RestMethod https://raw.githubusercontent.com/nyosegawa/speech.cpp/v0.8.10/install.ps1))) -Version 0.8.10
   ```

   The installer adds `speech.exe` to your user PATH. **Open a new PowerShell window** afterward. No particular working directory is required. If you manually unpacked a release instead, use the full path to its executable in the commands below, for example `& 'C:\Tools\speech\speech.exe' pull qwen3-tts-1.7b:q6_k`.

2. Verify that PowerShell can find the executable, then download the model if needed:

   ```powershell
   Get-Command speech.exe
   speech.exe pull qwen3-tts-1.7b:q6_k
   ```

3. **Identify the exact browser origin of your Foundry page**. Open the Foundry tab, press F12, and enter `location.origin` in the browser console. An origin is scheme + hostname + port, for example `http://localhost:30000`, without any path or trailing slash.
4. Start the server, specifying every allowed Foundry origin (modify to match your actual browser URL):

   ```powershell
   speech.exe serve qwen3-tts-1.7b:q6_k --device gpu --host 127.0.0.1 --port 8081 --language ru --cors-origin http://localhost:30000 --cors-origin http://127.0.0.1:30000
   ```

   If Foundry runs at a custom address (e.g. `https://foundry.example.com`), add `--cors-origin https://foundry.example.com` as another argument. **Never use `--cors-origin *`**. Keep the server listening on `127.0.0.1`, not `0.0.0.0`: the service has no authentication.

5. In another PowerShell window, verify that `Invoke-RestMethod http://127.0.0.1:8081/health` returns `status : ok`.
6. In Foundry, install the test build of SAM Voice and choose **Qwen3-TTS**. Set its URL to `http://127.0.0.1:8081`, click **Check**, select a voice, add optional **Voice Instructions**, and try **Preview** then **Play for All**.

### Changing model

`speech serve` loads **one synthesis model at a time**. To use 0.6B, shut down the 1.7B server and instead start:

```powershell
speech.exe serve qwen3-tts-0.6b:q6_k --device gpu --host 127.0.0.1 --port 8081 --language ru --cors-origin http://localhost:30000 --cors-origin http://127.0.0.1:30000
```

**Clear Voice Instructions** when using the 0.6B model; only 1.7B supports them. The Qwen panel validates the loaded model before sending any instruction. It shows the active model reported by `/v1/models`. Each saved NPC voice profile stores its server URL, voice and instructions.

### Voices

`aiden`, `dylan`, `eric`, `ono_anna`, `ryan`, `serena`, `sohee`, `uncle_fu`, `vivian`.

### API

- `GET /v1/models` for active-model discovery and server diagnostics.
- `POST /v1/audio/speech` with JSON `{"input":"Привет","voice":"ryan","language":"ru","response_format":"wav","instructions":"Speak calmly."}` on 1.7B (omit `instructions` on 0.6B).
- Qwen returns WAV; the Foundry module enforces its shared transport limit of **4 MiB per audio file**, 1,000 characters per text request, and a 120-second HTTP timeout.
- Qwen synthesis takes place only in the GM's browser. The ready WAV is broadcast to players using the existing socketlib playback adapter.

### Browser access

`Invoke-RestMethod` does **not** verify CORS. If that works but Foundry's **Check** fails, inspect the browser console and restart the speech.cpp server with the exact `--cors-origin` of the Foundry page. Browsers can also impose mixed-content or local-network access restrictions.

### Testing and maintenance

The bundle `dist/samvoice.js` contains this integration, so all Foundry clients must reload the updated module. Testing in a real Foundry session remains required before merging. Edit `src/samvoice.js` and run `npm run validate`; the build includes Qwen and generates the runtime bundle and SAM Worker. `npm run package` produces a ready-to-install ZIP in `releases/` (Python 3 required).
