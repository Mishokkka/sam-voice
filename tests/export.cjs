const test = require('node:test');
const assert = require('node:assert/strict');
const { loadBundle } = require('./harness.cjs');

function audio(channels = [[0, .5, -.5]], sampleRate = 24000) {
  return { numberOfChannels: channels.length, length: channels[0].length,
    sampleRate, duration: channels[0].length / sampleRate,
    getChannelData: index => Float32Array.from(channels[index]) };
}
function remember(c, text = 'Первая фраза', effects = {}) {
  c.samRememberPlayback(audio(), { requestId: text, engine: 'qwen', text,
    originalText: text, profileName: 'NPC' }, effects, [], 48000, 1);
  return c.samLastExport;
}

test('WAV export writes PCM headers and interleaves stereo, with safe clipping', async () => {
  const { context: c } = loadBundle();
  const blob = c.samEncodeWav(audio([[-2, -.5, NaN, Infinity], [2, .5, 0, -1]]));
  const bytes = Buffer.from(await blob.arrayBuffer());
  assert.equal(blob.type, 'audio/wav');
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 12), 'WAVE');
  assert.equal(bytes.readUInt32LE(4), bytes.length - 8);
  assert.equal(bytes.readUInt16LE(20), 1);
  assert.equal(bytes.readUInt16LE(22), 2);
  assert.equal(bytes.readUInt32LE(24), 24000);
  assert.equal(bytes.readUInt32LE(28), 96000);
  assert.equal(bytes.readUInt16LE(32), 4);
  assert.equal(bytes.readUInt16LE(34), 16);
  assert.equal(bytes.readUInt32LE(40), 16);
  assert.deepEqual(Array.from({ length: 8 }, (_, i) => bytes.readInt16LE(44 + i * 2)),
    [-32768, 32767, -16384, 16384, 0, 0, 0, -32768]);
  const mono = Buffer.from(await c.samEncodeWav(audio()).arrayBuffer());
  assert.equal(mono.readUInt16LE(22), 1);
  assert.equal(mono.readUInt32LE(40), 6);
});

test('Export filenames preserve readable Unicode and remove forbidden path characters', () => {
  const { context: c } = loadBundle();
  const phrase = { engine: 'qwen', profileName: '../NPC:<bad>', text: 'Привет! / \\ ? * "\n' + 'а'.repeat(200), savedAt: 123 };
  const name = c.samExportFilename(phrase);
  assert.match(name, /^sam-voice-qwen-.*Привет!.*-123\.wav$/u);
  assert.ok(!/[<>:"/\\|?*\u0000-\u001f]/.test(name));
  assert.ok(name.length < 120);
});

test('Export remembers the original text, decoded take and a settings snapshot', () => {
  const { context: c } = loadBundle();
  const effects = { echo: { enabled: true, params: { time: 250 } } };
  const buffer = audio(), noise = audio(), effectBuffers = [noise];
  c.samRememberPlayback(buffer, { engine: 'sam', text: 'PRIVET', originalText: 'Привет' }, effects, effectBuffers, 44100, .8);
  effects.echo.enabled = false;
  effectBuffers.length = 0;
  assert.equal(c.samLastExport.text, 'Привет');
  assert.equal(c.samLastExport.buffer, buffer);
  assert.equal(c.samLastExport.effects.echo.enabled, true);
  assert.equal(c.samLastExport.effectBuffers[0], noise);
  assert.equal(c.samLastExport.masterGain, .8);
});

test('A playback failure and Stop preserve the last successful take', async () => {
  const { context: c } = loadBundle();
  const previous = remember(c);
  const result = await c.Dr({ engine: 'sam', text: 'HELLO' }); // WebAudio unavailable.
  assert.equal(result.ok, false);
  await c.jr();
  assert.equal(c.samLastExport, previous);
});

test('Players do not retain export audio or download it', async () => {
  const { context: c } = loadBundle();
  c.game.user.isGM = false;
  remember(c);
  assert.equal(c.samLastExport, null);
  await assert.rejects(c.samDownloadLastPhrase(), /ведущему/);
});

test('Oversized export is rejected before allocating an OfflineAudioContext', async () => {
  let allocations = 0;
  const { context: c } = loadBundle({ OfflineAudioContext: class { constructor() { allocations++; } } });
  const phrase = remember(c);
  phrase.buffer.duration = 100000;
  await assert.rejects(c.samRenderExport(phrase), /слишком длинная/);
  assert.equal(allocations, 0);
});

test('Export uses the clicked take during new playback, blocks duplicate clicks, and cleans the URL', async () => {
  const links = [], revocations = [], timers = [];
  const URLShim = class extends URL {
    static createObjectURL() { return 'blob:export'; }
    static revokeObjectURL(url) { revocations.push(url); }
  };
  const document = {
    querySelector: () => null,
    body: { append: link => links.push(link) },
    createElement: () => ({ click() { this.clicked = true; }, remove() { this.removed = true; } })
  };
  const { context: c } = loadBundle({ URL: URLShim, document,
    fetch: () => { throw new Error('Export must not request synthesis'); },
    setTimeout: (callback, ms) => timers.push({ callback, ms }) });
  const previous = remember(c);
  let finish, rendered;
  c.samRenderExport = phrase => { rendered = phrase; return new Promise(resolve => { finish = resolve; }); };
  const saving = c.samDownloadLastPhrase();
  assert.equal(c.samExportBusy, true);
  assert.equal(await c.samDownloadLastPhrase(), undefined);
  const latest = remember(c, 'Следующая реплика');
  finish(new Blob(['WAV']));
  const result = await saving;
  assert.equal(rendered, previous);
  assert.equal(result.requestId, previous.requestId);
  assert.equal(c.samLastExport, latest);
  assert.equal(links.length, 1);
  assert.equal(links[0].download, result.filename);
  assert.equal(links[0].clicked, true);
  assert.equal(links[0].removed, true);
  assert.equal(c.samExportBusy, false);
  assert.equal(revocations.length, 0);
  assert.equal(timers[0].ms, 60000);
  timers[0].callback();
  assert.deepEqual(revocations, ['blob:export']);
});

test('Export rendering failure releases the busy state and preserves the take for retry', async () => {
  const { context: c } = loadBundle();
  await assert.rejects(c.samDownloadLastPhrase(), /Сначала/);
  const previous = remember(c);
  c.samRenderExport = async () => { throw new Error('Rendering failed'); };
  await assert.rejects(c.samDownloadLastPhrase(), /Rendering failed/);
  assert.equal(c.samExportBusy, false);
  assert.equal(c.samLastExport, previous);
});
