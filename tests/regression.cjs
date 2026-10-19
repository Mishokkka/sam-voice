const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { loadBundle, wav } = require('./harness.cjs');
const jsonResponse = data => new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } });
const modelResponse = (size = '1.7B') => jsonResponse({ data: [{ id: `Qwen3-TTS-12Hz-${size}-CustomVoice` }] });
const audioResponse = () => new Response(wav(), { headers: { 'content-type': 'audio/wav' } });
const tick = () => new Promise(resolve => setImmediate(resolve));

function stubDialogPreparation(c, engine = 'qwen') {
  c.q = () => ({});
  c.Ia = () => ({ piperVoice: '' });
  c.samReadSilero = () => ({});
  c.samReadQwen = () => ({ qwenVoice: 'ryan' });
  c.so = () => ({});
  c.Ro = () => ({});
  c.zo = () => 'interrupt';
  return { find: () => ({ val: () => engine }) };
}

test('Qwen settings and profiles preserve URL, voice and instructions', async () => {
  const { context: c } = loadBundle();
  const settings = { engine: 'qwen', qwenServerUrl: 'http://127.0.0.1:8081', qwenVoice: 'serena', qwenInstructions: 'Speak softly.' };
  await c.ce(settings);
  const id = await c.he('NPC', settings);
  for (const [key, value] of Object.entries(settings)) {
    assert.equal(c.oe()[key], value);
    assert.equal(c.E()[id][key], value);
  }
});
test('imported Qwen profiles strip remote URLs and preserve instructions', async () => {
  const { context: c } = loadBundle();
  await c._e({ profiles: [{ name: 'NPC', engine: 'qwen', qwenServerUrl: 'https://example.test', qwenInstructions: 'Softly' }] });
  const profile = Object.values(c.E())[0];
  assert.equal(profile.qwenServerUrl, 'http://127.0.0.1:8081');
  assert.equal(profile.qwenInstructions, 'Softly');
});
test('Qwen 1.7B request matches speech.cpp API and produces valid transport payload', async () => {
  const calls = [];
  const { context: c } = loadBundle({ fetch: async (url, options) => {
    calls.push({ url, options });
    return url.endsWith('/v1/models') ? modelResponse() : audioResponse();
  } });
  const result = await c.samQwenGenerate({ text: 'Привет', qwenVoice: 'serena', qwenInstructions: 'Speak softly.' });
  const body = JSON.parse(calls[1].options.body);
  assert.deepEqual(body, { input: 'Привет', voice: 'serena', language: 'ru', response_format: 'wav', instructions: 'Speak softly.' });
  assert.equal(c.at(result).engine, 'qwen');
  assert.equal(c.at(result).sizeBytes, wav().length);
});
test('Qwen request without instructions omits unsupported parameter', async () => {
  const calls = [];
  const { context: c } = loadBundle({ fetch: async (url, options) => { calls.push({ url, options }); return audioResponse(); } });
  await c.samQwenGenerate({ text: 'Привет', qwenVoice: 'ryan' });
  assert.equal(calls.length, 1);
  assert.equal('instructions' in JSON.parse(calls[0].options.body), false);
});
test('Qwen 0.6B with instructions is rejected before synthesis', async () => {
  const calls = [];
  const { context: c } = loadBundle({ fetch: async url => { calls.push(url); return modelResponse('0.6B'); } });
  await assert.rejects(c.samQwenGenerate({ text: 'Привет', qwenInstructions: 'Softly' }), /1.7B/);
  assert.equal(calls.length, 1);
});
test('Qwen Check rejects an unrelated model', async () => {
  const { context: c } = loadBundle({ fetch: async () => jsonResponse({ data: [{ id: 'irodori-tts' }] }) });
  await assert.rejects(c.samQwenFetchInfo('http://127.0.0.1:8081'), /No Qwen/);
});
test('remote Qwen URL is denied before any fetch', async () => {
  let called = false;
  const { context: c } = loadBundle({ fetch: async () => { called = true; return audioResponse(); } });
  await assert.rejects(c.samQwenGenerate({ text: 'Hello', qwenServerUrl: 'https://example.test' }), /Non-local/);
  assert.equal(called, false);
});
test('shared audio payload rejects files over 4 MiB', async () => {
  const { context: c } = loadBundle();
  await assert.rejects(c.fa(new Blob([Buffer.alloc(4 * 1024 * 1024 + 1)], { type: 'audio/wav' })), /too large/);
});
test('fallback MIME detection identifies WAV and rejects unknown data', async () => {
  const { context: c } = loadBundle();
  assert.equal((await c.fa(new Blob([wav()]))).mimeType, 'audio/wav');
  await assert.rejects(c.fa(new Blob(['not audio'])), /recognizable/);
});
test('playback schema limits text for all four engines', () => {
  const { context: c } = loadBundle();
  for (const engine of ['sam', 'piper', 'silero', 'qwen']) {
    const limit = engine === 'sam' ? 800 : 1000;
    const request = { engine, text: 'a'.repeat(limit), audioDataUrl: `data:audio/wav;base64,${wav().toString('base64')}` };
    assert.equal(c.at(request).text.length, limit);
    assert.throws(() => c.at({ ...request, text: request.text + 'a' }), /too long/);
  }
});
test('SAM fallback synthesizes nonempty finite samples', async () => {
  const { context: c } = loadBundle();
  const samples = await c.Fn('HELLO WORLD', { pitch: 64, speed: 72, mouth: 128, throat: 128 });
  assert.ok(samples.length > 1000);
  assert.ok(samples.every(Number.isFinite));
  assert.ok(samples.some(value => value !== 0));
});

function loadSamWorker() {
  const bundle = fs.readFileSync(path.join(__dirname, '../dist/samvoice.js'), 'utf8');
  const worker = bundle.match(/assets\/(samWorker-[A-Za-z0-9_-]+\.js)/)[1];
  const replies = [];
  let receive;
  const context = vm.createContext({ self: {
    addEventListener(name, callback) { if (name === 'message') receive = callback; },
    postMessage(message, transfer = []) {
      // Exercise real transfer validation and buffer detachment, as in a browser.
      replies.push(structuredClone(message, { transfer }));
    }
  } });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../dist/assets', worker), 'utf8'), context);
  return { send: data => receive({ data }), replies };
}

test('SAM worker transfers valid audio samples and preserves the request ID', () => {
  const worker = loadSamWorker();
  worker.send({ id: 'valid', text: 'HELLO WORLD', settings: {} });
  assert.equal(worker.replies.length, 1);
  const reply = worker.replies[0];
  assert.equal(reply.id, 'valid');
  assert.equal(reply.ok, true);
  assert.ok(reply.samples instanceof Float32Array);
  assert.ok(reply.samples.length > 1000);
  assert.ok(reply.samples.every(Number.isFinite));
  assert.ok(reply.samples.some(value => value !== 0));
});

test('SAM worker explains unsupported text and remains usable for the next request', () => {
  const worker = loadSamWorker();
  worker.send({ id: 'unsupported', text: 'Привет', settings: {} });
  assert.equal(worker.replies.length, 1);
  assert.deepEqual(worker.replies[0], {
    id: 'unsupported', ok: false, error: 'SAM cannot pronounce this text.'
  });
  worker.send({ id: 'next', text: 'HELLO', settings: {} });
  assert.equal(worker.replies.length, 2);
  assert.equal(worker.replies[1].ok, true);
});

test('SAM fallback rejects unsupported text before allocating an audio buffer', async () => {
  const { context: c } = loadBundle();
  let allocations = 0;
  await assert.rejects(c.Pn.createAudioBuffer({
    request: { text: 'Привет' }, isCancelled: () => false,
    audioContext: { createBuffer() { allocations++; throw new Error('invalid audio length'); } }
  }), /SAM cannot pronounce this text\./);
  assert.equal(allocations, 0);
});
test('cancelled generation discards late results', async () => {
  const { context: c } = loadBundle();
  let finish;
  const result = c.Lo({ notification: 'start', generateFn: () => new Promise(resolve => { finish = resolve; }) });
  c.si();
  finish({ engine: 'qwen', text: 'late' });
  assert.equal(await result, null);
});
test('all engine views render with unique HTML IDs and escaped instructions', async () => {
  const { context: c } = loadBundle();
  for (const engine of ['sam', 'piper', 'silero', 'qwen']) {
    await c.ce({ engine, qwenInstructions: '</textarea><script>bad()</script>' });
    const html = c.Do();
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(ids.length, new Set(ids).size, `duplicate IDs with ${engine}`);
    assert.ok(html.includes('id="sam-qwen-instructions"'));
    assert.ok(!html.includes('<script>bad()</script>'));
  }
});
test('profile import rejects excess count without changing existing profiles', async () => {
  const { context: c } = loadBundle();
  const id = await c.he('Existing NPC', { engine: 'sam' });
  await assert.rejects(c._e({ profiles: Array.from({ length: 101 }, () => ({ name: 'NPC' })) }), /Too many/);
  assert.equal(Object.keys(c.E()).length, 1);
  assert.equal(c.E()[id].name, 'Existing NPC');
});
test('diagnostics handles an unresponsive client with a timeout', async () => {
  const { context: c } = loadBundle({ setTimeout: (fn, ms) => setTimeout(fn, Math.min(ms, 5)) });
  const orchestrator = new c.Gr({ getSocket: () => ({ executeAsUser: () => new Promise(() => {}) }), isSocketReady: () => true });
  const statuses = await orchestrator.collectClientAudioStatuses();
  assert.equal(statuses.length, 2);
  assert.equal(statuses.find(s => s.userId === 'player').status.state, 'timeout');
});
test('manifest assets and SAM worker are present', () => {
  const root = path.join(__dirname, '..');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'module.json'), 'utf8'));
  const bundle = fs.readFileSync(path.join(root, 'dist/samvoice.js'), 'utf8');
  const worker = bundle.match(/assets\/(samWorker-[A-Za-z0-9_-]+\.js)/)[1];
  for (const asset of [...manifest.styles, ...manifest.esmodules, `dist/assets/${worker}`]) {
    assert.ok(fs.existsSync(path.join(root, asset)), `missing ${asset}`);
  }
  assert.equal(manifest.socket, true);
  assert.ok(manifest.relationships.requires.some(r => r.id === 'socketlib'));
});
test('Regression Q1: overlong Qwen text must be rejected before expensive synthesis', async () => {
  let posts = 0;
  const { context: c } = loadBundle({ fetch: async () => { posts++; return audioResponse(); } });
  await assert.rejects(c.samQwenGenerate({ text: 'а'.repeat(1001) }), /too long/);
  assert.equal(posts, 0, 'Qwen performed synthesis for text which playback will reject');
});
test('G1: shared playback collects remote playback failure', async () => {
  const { context: c } = loadBundle();
  let delivery;
  const remote = loadBundle(); // no WebAudio: actual receiver returns AUDIO_UNSUPPORTED
  const socket = { executeAsUser(handler, userId, request) { delivery = remote.context.Dr(request); return delivery; } };
  const orchestrator = new c.Gr({ getSocket: () => socket, isSocketReady: () => true, playLocal: async () => ({ ok: true }) });
  const result = await orchestrator.speak({ engine: 'sam', text: 'HELLO' });
  assert.equal((await delivery).ok, false);
  assert.equal(result.ok, false, `reported success despite failed receiver; remote results: ${result.remote.length}`);
});
test('G2: player-origin socket playback must be denied on receiving client', { skip: 'Excluded by user: trusted table; sender authorization unchanged.' }, async () => {
  const { context: c, hooks, handlers } = loadBundle();
  hooks.get('socketlib.ready')();
  c.Lr = async () => ({});
  c.nt('sam', { createAudioBuffer: async () => ({ duration: 1 }) });
  c.Rr = () => ({ result: { ok: true }, completion: Promise.resolve() });
  const result = await handlers.get('playVoice').call({ socketdata: { userId: 'player' } }, { engine: 'sam', text: 'HELLO' });
  assert.equal(result.ok, false, 'player-origin command was played');
});
test('G2: player-origin socket stop must be denied on receiving client', { skip: 'Excluded by user: trusted table; sender authorization unchanged.' }, async () => {
  const { hooks, handlers } = loadBundle();
  hooks.get('socketlib.ready')();
  const result = await handlers.get('stopAllAudio').call({ socketdata: { userId: 'player' } }, {});
  assert.equal(result.ok, false, 'player-origin stop was accepted');
});
test('Regression G3: blocked audio must not start an old utterance after later unlock', async () => {
  const { context: c } = loadBundle();
  let resumes = 0, starts = 0;
  c.B = { state: 'suspended', resume: () => { resumes++; return new Promise(() => {}); } };
  c.nt('sam', { createAudioBuffer: async () => ({ duration: 1 }) });
  c.Rr = () => { starts++; return { result: { ok: true, stage: 'started' }, completion: Promise.resolve() }; };
  for (const playbackMode of ['interrupt', 'queue', 'overlap']) {
    const result = await c.Dr({ engine: 'sam', text: 'HELLO', playbackMode });
    assert.equal(result.ok, false);
    assert.equal(result.error.code, 'AUDIO_LOCKED');
  }
  c.B.state = 'running';
  await tick();
  assert.equal(resumes, 0, 'receiving speech must not call resume');
  assert.equal(starts, 0, 'old utterances must not play after later unlock');
  assert.equal(c.Or().queuedCount, 0);
});
test('Regression G4: timeout should show a useful error instead of silently treating it as Stop', async () => {
  const { context: c, notices } = loadBundle();
  const result = await c.Lo({ notification: 'Generating...', generateFn: async () => { throw new DOMException('Backend timeout', 'TimeoutError'); } });
  assert.equal(result, null);
  assert.ok(notices.some(n => n.level === 'error'), 'only Generating notice is emitted; timeout is swallowed');
});
test('Regression G5: public Stop must cancel in-flight generation', async () => {
  const { context: c } = loadBundle();
  c.is();
  const generation = c.oi();
  await c.game.modules.get('sam-voice').api.stop();
  assert.equal(generation.signal.aborted, true, 'API Stop stops playback but leaves synthesis active');
});
test('Regression G6: successful preview should emit successful dispatchFinished hook', async () => {
  const { context: c, events } = loadBundle();
  const orchestrator = new c.Gr({ getSocket: () => null, isSocketReady: () => false, playLocal: async () => ({ ok: true }) });
  assert.equal((await orchestrator.preview({ engine: 'sam', text: 'HELLO' })).ok, true);
  assert.equal(events.find(e => e.name === 'samVoice.dispatchFinished').data.ok, true);
});
test('Regression G7: malformed WAV must be rejected before network dispatch as README promises', async () => {
  const { context: c } = loadBundle();
  await assert.rejects(c.fa(new Blob(['not a WAV file'], { type: 'audio/wav' })), /audio|WAV|signature/);
});

test('Shared playback contacts every active remote client exactly once and keeps local playback', async () => {
  const { context: c } = loadBundle();
  c.game.users.set('offline', { id: 'offline', name: 'Offline', active: false });
  c.game.users.set('gm2', { id: 'gm2', name: 'Second GM', active: true, isGM: true });
  const calls = [];
  let localCount = 0;
  const orchestrator = new c.Gr({
    getSocket: () => ({ executeAsUser: async (handler, userId, request) => {
      calls.push({ handler, userId, request }); return { ok: true, stage: 'started' };
    } }), isSocketReady: () => true,
    playLocal: async () => { localCount++; return { ok: true, stage: 'started' }; }
  });
  const result = await orchestrator.speak({ engine: 'sam', text: 'HELLO' });
  assert.equal(result.ok, true);
  assert.equal(localCount, 1);
  assert.deepEqual(calls.map(call => call.userId), ['player', 'gm2']);
  assert.equal(result.remote.length, 2);
  assert.ok(calls.every(call => call.request.requestId === result.requestId));
});
test('A disconnect, timeout or obsolete client produces an attributed failure', async () => {
  for (const behavior of ['disconnect', 'timeout', 'obsolete']) {
    const { context: c } = loadBundle({ setTimeout: (fn, ms) => setTimeout(fn, Math.min(ms, 5)) });
    const orchestrator = new c.Gr({
      getSocket: () => ({ executeAsUser: async () => {
        if (behavior === 'disconnect') throw new Error('Player disconnected');
        if (behavior === 'timeout') return new Promise(() => {});
      } }), isSocketReady: () => true, playLocal: async () => ({ ok: true })
    });
    const result = await orchestrator.speak({ engine: 'sam', text: 'HELLO' });
    assert.equal(result.ok, false);
    assert.equal(result.failures.length, 1);
    assert.equal(result.failures[0].userId, 'player');
    assert.match(result.failures[0].error.message, /Player/);
    if (behavior === 'timeout') assert.equal(result.failures[0].error.code, 'SOCKET_TIMEOUT');
  }
});
test('Stop reports a remote failure and still stops locally', async () => {
  const { context: c } = loadBundle();
  let stopped = 0;
  const orchestrator = new c.Gr({
    getSocket: () => ({ executeAsUser: async () => ({ ok: false, error: { message: 'Stop failed' } }) }),
    isSocketReady: () => true, stopLocal: async () => { stopped++; return { ok: true }; }
  });
  const result = await orchestrator.stop();
  assert.equal(stopped, 1);
  assert.equal(result.ok, false);
  assert.equal(result.failures[0].userId, 'player');
});
test('Explicit Unlock resumes audio, with a bounded wait when the browser refuses', async () => {
  const { context: c } = loadBundle({ setTimeout: (fn, ms) => setTimeout(fn, Math.min(ms, 5)) });
  c.B = { state: 'suspended', resume() { this.state = 'running'; return Promise.resolve(); } };
  await c.Er();
  assert.equal(c.B.state, 'running');
  assert.ok(c.Or().lastUnlockGestureAt);
  c.B = { state: 'suspended', resume: () => new Promise(() => {}) };
  await assert.rejects(c.Er(), error => error.code === 'AUDIO_LOCKED');
});
test('Audio suspended while decoding is rejected instead of scheduling delayed playback', async () => {
  const { context: c } = loadBundle();
  c.B = { state: 'running' };
  let finishDecode;
  c.nt('sam', { createAudioBuffer: () => new Promise(resolve => { finishDecode = resolve; }) });
  const playback = c.Dr({ engine: 'sam', text: 'HELLO' });
  c.B.state = 'suspended';
  finishDecode({ duration: 1 });
  const result = await playback;
  assert.equal(result.ok, false);
  assert.equal(result.error.code, 'AUDIO_LOCKED');
});
test('Stop during decoding cancels the old queue but preserves a newly queued phrase', async () => {
  const { context: c } = loadBundle();
  c.B = { state: 'running' };
  let finishDecode;
  const started = [];
  c.nt('sam', { createAudioBuffer: ({ request }) => request.text === 'OLD'
    ? new Promise(resolve => { finishDecode = resolve; }) : Promise.resolve({ duration: 1 }) });
  c.Rr = (buffer, request) => {
    started.push(request.text);
    return { result: { ok: true }, completion: Promise.resolve() };
  };
  await c.Dr({ engine: 'sam', text: 'OLD', playbackMode: 'queue' });
  await c.jr();
  await c.Dr({ engine: 'sam', text: 'NEW', playbackMode: 'queue' });
  finishDecode({ duration: 1 });
  await tick();
  assert.deepEqual(started, ['NEW']);
  assert.equal(c.Or().queuedCount, 0);
});
test('Stop during asynchronous settings preparation prevents a later synthesis request', async () => {
  const { context: c } = loadBundle();
  const dialog = stubDialogPreparation(c);
  let saveSettings, calls = 0;
  c.de = () => new Promise(resolve => { saveSettings = resolve; });
  c.samQwenGenerate = async () => { calls++; return {}; };
  const preparing = c.Io(dialog, 'Привет');
  assert.equal(c.di(), true);
  c.is();
  await c.game.modules.get('sam-voice').api.stop();
  saveSettings();
  assert.equal(await preparing, null);
  assert.equal(calls, 0);
});
test('Too-long dialog input fails before settings/history writes for every engine', async () => {
  for (const engine of ['sam', 'piper', 'silero', 'qwen']) {
    const { context: c, values } = loadBundle();
    const dialog = stubDialogPreparation(c, engine);
    let writes = 0;
    c.de = async () => { writes++; };
    await assert.rejects(c.Io(dialog, 'a'.repeat(1001), { saveToHistory: true }), /too long/);
    assert.equal(writes, 0);
    assert.equal(values.get('phraseHistory'), '[]');
    assert.equal(c.di(), false);
  }
});
test('Empty Qwen text is rejected without HTTP; surrounding whitespace is trimmed', async () => {
  let calls = 0, input;
  const { context: c } = loadBundle({ fetch: async (url, options) => {
    calls++; input = JSON.parse(options.body).input; return audioResponse();
  } });
  await assert.rejects(c.samQwenGenerate({ text: '   ' }), /empty/);
  assert.equal(calls, 0);
  const result = await c.samQwenGenerate({ text: '  Привет  ' });
  assert.equal(input, 'Привет');
  assert.equal(result.text, 'Привет');
});
test('Cancelled or superseded generations do not show stale server errors', async () => {
  const { context: c, notices } = loadBundle();
  let fail;
  const first = c.Lo({ generateFn: () => new Promise((resolve, reject) => { fail = reject; }) });
  const second = c.oi();
  fail(new DOMException('Old request timeout', 'TimeoutError'));
  assert.equal(await first, null);
  assert.equal(c.ci(second.token), true);
  assert.equal(notices.some(notice => notice.level === 'error'), false);
  c.si();
});
test('Preview reports playback exceptions in both its result and completion hook', async () => {
  const { context: c, events } = loadBundle();
  const orchestrator = new c.Gr({ getSocket: () => null, isSocketReady: () => false, playLocal: async () => { throw new Error('decode failed'); } });
  const result = await orchestrator.preview({ engine: 'sam', text: 'HELLO' });
  const hook = events.find(event => event.name === 'samVoice.dispatchFinished').data;
  assert.equal(result.ok, false);
  assert.equal(hook.ok, false);
  assert.equal(hook.failures.length, 1);
});
test('Audio validation accepts WAV aliases and rejects a mismatched declared container', async () => {
  const { context: c } = loadBundle();
  for (const mime of ['audio/wav', 'audio/x-wav', 'audio/wave', 'audio/vnd.wave', 'application/octet-stream']) {
    assert.equal((await c.fa(new Blob([wav()], { type: mime }), mime)).mimeType, 'audio/wav');
  }
  await assert.rejects(c.fa(new Blob([wav()], { type: 'audio/mpeg' })), /signature/);
});

const socketlibPath = [process.env.SAMVOICE_SOCKETLIB_PATH,
  path.resolve(__dirname, '../../socketlib/src/socketlib.js'),
  path.resolve(__dirname, '../../../../socketlib/src/socketlib.js')].find(file => file && fs.existsSync(file));
test('Installed socketlib integration: real executeAsUser routes and returns a receiver failure',
  { skip: socketlibPath ? false : 'Optional integration: socketlib is not installed next to the module.' }, async () => {
  const { context: gm } = loadBundle(), { context: player } = loadBundle();
  player.game.user = { id: 'player', isGM: false };
  player.game.userId = 'player';
  const source = fs.readFileSync(socketlibPath, 'utf8').replace('import * as errors from "./errors.js";', 'const errors = {};');
  for (const [context, other] of [[gm, player], [player, gm]]) {
    context.foundry.utils = { randomID: () => require('node:crypto').randomUUID() };
    context.game.socket = {
      on(name, callback) { context.receiveSocket = callback; },
      emit(name, message) {
        // JSON round trip simulates the transport and preserves each VM's Array type.
        other.socketMessage = JSON.stringify(message);
        other.socketSender = context.game.user.id;
        vm.runInContext('receiveSocket(JSON.parse(socketMessage), socketSender)', other);
      }
    };
    vm.runInContext(source, context);
    context.nativeSocket = vm.runInContext('new SocketlibSocket("sam-voice", "module")', context);
    context.nativeSocket.register('playVoice', context.Dr);
  }
  const orchestrator = new gm.Gr({ getSocket: () => gm.nativeSocket, isSocketReady: () => true, playLocal: async () => ({ ok: true }) });
  const result = await orchestrator.speak({ engine: 'sam', text: 'HELLO' });
  assert.equal(result.ok, false);
  assert.equal(result.remote.length, 1);
  assert.equal(result.remote[0].error.code, 'AUDIO_UNSUPPORTED');
  assert.equal(gm.nativeSocket.pendingRequests.size, 0);
});
