// Optional real-browser integration check. Requires Playwright and Chrome/Chromium.
// Run: node tests/browser-export.cjs (NODE_PATH may point to an existing Playwright installation).
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'test-results/export');
fs.mkdirSync(output, { recursive: true });
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'module.json'), 'utf8'));
const bootstrap = `
class Collection extends Map { [Symbol.iterator]() { return this.values(); } }
const values = new Map(), hooks = new Map();
window.game = {
  user: { id: 'gm', isGM: true }, userId: 'gm',
  users: new Collection([['gm', { id:'gm', name:'GM', active:true, isGM:true }]]),
  settings: { register: (m,k,c) => values.set(k,c.default), get:(m,k)=>values.get(k),
    set: async(m,k,v)=>{values.set(k,v); return v;} },
  modules: new Map([['sam-voice', {}]])
};
window.foundry = { applications:{api:{ApplicationV2:class{}}} };
window.Hooks = { once:(k,f)=>hooks.set(k,f), on:(k,f)=>hooks.set(k,f), callAll(){} };
window.notices = [];
window.ui = { notifications:Object.fromEntries(['info','warn','error'].map(level=>[level,message=>notices.push({level,message})])) };
window.socketlib = { registerModule:()=>({register(){}, executeAsUser:async()=>({ok:true})}) };
window.testInit = () => {
  hooks.get('init')(); hooks.get('socketlib.ready')();
  document.querySelector('.window-content').innerHTML = Do();
  Eo(ts()); Oo(document.querySelector('#sam-voice-dialog'));
};`;
let browser;
const server = http.createServer((request, response) => {
  if (request.url === '/') {
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.end(`<!doctype html><html><head><meta charset="utf-8">
      ${manifest.styles.map(file => `<link rel="stylesheet" href="/${file}">`).join('')}
      <style>*{box-sizing:border-box}body{background:#131720;margin:24px;font-family:Arial,sans-serif}.samvoice-window{width:820px;height:660px;margin:auto}.window-content{height:630px}.window-header{display:flex}.window-title{margin:0}</style>
      </head><body><section class="samvoice-window" id="sam-voice-dialog"><header class="window-header"><h1 class="window-title">SAM Voice</h1></header><div class="window-content"></div></section>
      <script>${bootstrap}</script><script src="/bundle.js"></script><script>testInit()</script></body></html>`);
    return;
  }
  if (request.url === '/bundle.js') {
    response.setHeader('Content-Type', 'text/javascript');
    response.end(fs.readFileSync(path.join(root, 'dist/samvoice.js'), 'utf8')
      .replaceAll('import.meta.url', JSON.stringify(`http://127.0.0.1:${server.address().port}/bundle.js`)));
    return;
  }
  const file = request.url.startsWith('/assets/') ? 'dist' + request.url : request.url.slice(1);
  if (manifest.styles.includes(file) || /^dist\/assets\/samWorker-[A-Za-z0-9_-]+\.js$/.test(file)) {
    response.setHeader('Content-Type', file.endsWith('.css') ? 'text/css' : 'text/javascript');
    response.end(fs.readFileSync(path.join(root, file)));
  } else { response.statusCode = 404; response.end(); }
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  browser = await chromium.launch({ headless:true,
    ...(process.env.SAMVOICE_BROWSER_PATH ? { executablePath:process.env.SAMVOICE_BROWSER_PATH } : { channel:'chrome' }),
    args:['--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport:{width:1000,height:800}, acceptDownloads:true });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  assert.equal(await page.locator('#sam-export-last').isDisabled(), true);

  const rendering = await page.evaluate(async () => {
    // Run the actual playback graph in an offline context and compare it with the
    // exported graph. Only the running-context check and the wall-clock cleanup
    // are bypassed; synthesis, effect nodes, random buffers and WAV encoding are real.
    const samples = await Fn('HELLO WORLD', { pitch:64, speed:72, mouth:128, throat:128 });
    const originalRequire = samRequireRunningAudio;
    const defaults = Hn({}), names = ['dry', ...Object.keys(defaults), 'combined'];
    const results = [];
    samRequireRunningAudio = () => B;
    try {
      for (const name of names) {
        const effects = Hn({});
        if (name === 'combined') for (const key of ['radio','noise','reverb','specter','echo','vibrato','pitch','pace']) effects[key].enabled = true;
        else if (name !== 'dry') effects[name].enabled = true;
        if (effects.pitch.enabled) effects.pitch.params.semitones = -4;
        if (effects.pace.enabled) effects.pace.params.percent = 15;
        const duration = samples.length / 22050 / Un(effects) + Wn(effects);
        B = new OfflineAudioContext(2, Math.ceil((duration + .05) * 48000), 48000);
        hr = B.createGain(); hr.gain.value = 1;
        V = samConfigureCompressor(B.createDynamicsCompressor()); hr.connect(V).connect(B.destination);
        const buffer = B.createBuffer(1, samples.length, 22050); buffer.copyToChannel(samples,0);
        Rr(buffer, { engine:'sam', requestId:name, text:'HELLO WORLD', originalText:'Привет, мир', effects }, W);
        const session = [...H].at(-1); session.source.onended = null;
        const snapshot = samLastExport;
        const heard = samEncodeWav(await B.startRendering());
        const exported = await samRenderExport(snapshot), again = await samRenderExport(snapshot);
        const a = new Uint8Array(await heard.arrayBuffer()), b = new Uint8Array(await exported.arrayBuffer()), c = new Uint8Array(await again.arrayBuffer());
        if (a.length !== b.length || a.slice(0,44).some((value,i)=>value !== b[i])) throw Error('WAV header mismatch: ' + name);
        const av = new DataView(a.buffer), bv = new DataView(b.buffer);
        let maxDelta = 0;
        for (let offset = 44; offset < a.length; offset += 2)
          maxDelta = Math.max(maxDelta, Math.abs(av.getInt16(offset,true)-bv.getInt16(offset,true)));
        // Parallel WebAudio sums may round differently at a PCM quantization boundary.
        // Allow one 16-bit step; any meaningful signal/timing difference still fails.
        if (maxDelta > 1) throw Error('Playback/export PCM mismatch: ' + JSON.stringify({name,maxDelta}));
        if (b.some((value,i)=>value !== c[i])) throw Error('Repeated export changed: ' + name);
        if (b.length <= 44 || !b.slice(44).some(value=>value !== 0)) throw Error('Empty audio: ' + name);
        results.push({effect:name, bytes:b.length, randomBuffers:snapshot.effectBuffers.length, maxPcmDelta:maxDelta, repeatedExportIdentical:true});
        Br(session); H.delete(session);
      }
    } finally { samRequireRunningAudio = originalRequire; B = undefined; hr = undefined; V = undefined; }
    return results;
  });
  console.log(`Playback/export PCM matches for ${rendering.length} effect configurations, including repeat exports.`);

  // Exercise the actual dialog Preview button and browser download.
  await page.locator('#sam-text').fill('Привет, путник!');
  await page.locator('#sam-preview-only').click();
  await page.waitForFunction(() => samLastExport?.text === 'Привет, путник!');
  const playbackId = await page.evaluate(() => samLastExport.requestId);
  await page.locator('#sam-text').fill('Этот текст ещё не звучал');
  const downloadEvent = page.waitForEvent('download');
  await page.locator('#sam-export-last').click();
  const download = await downloadEvent;
  assert.match(download.suggestedFilename(), /Привет, путник!/);
  const downloadPath = path.join(output, 'exported-phrase.wav');
  await download.saveAs(downloadPath);
  const wav = fs.readFileSync(downloadPath);
  assert.equal(wav.toString('ascii',0,4), 'RIFF');
  assert.equal(wav.readUInt16LE(22), 2);
  assert.equal(wav.readUInt32LE(40), wav.length-44);
  assert.equal(await page.evaluate(() => samLastExport.requestId), playbackId);

  const externalEngines = await page.evaluate(async audioDataUrl => {
    const results = [];
    for (const engine of ['piper','silero','qwen']) {
      const result = await $.preview({ engine, text:engine + ' take', audioDataUrl });
      if (!result.ok || samLastExport.engine !== engine) throw Error('Playback failed for ' + engine);
      const before = samLastExport;
      const file = await samRenderExport(before);
      if (file.size <= 44 || file.type !== 'audio/wav') throw Error('Export failed for ' + engine);
      results.push({engine, bytes:file.size});
    }
    const shared = await $.speak({ engine:'qwen', text:'Shared Qwen take', audioDataUrl });
    if (!shared.ok || samLastExport.text !== 'Shared Qwen take') throw Error('Shared playback did not retain its take');
    await samRenderExport(samLastExport);
    return results;
  }, 'data:audio/wav;base64,' + wav.toString('base64'));

  const state = await page.evaluate(async () => {
    // Reopening the dialog must show the retained take without new synthesis.
    document.querySelector('.window-content').innerHTML = Do();
    Oo(document.querySelector('#sam-voice-dialog'));
    const kept = samLastExport, originalAdapter = rt('qwen');
    let finish;
    nt('qwen', { createAudioBuffer:()=>new Promise(resolve=>{finish=resolve;}) });
    const queued = await Dr({ engine:'qwen', text:'Queued', audioDataUrl:'data:audio/wav;base64,UklGRg==', playbackMode:'queue' });
    if (!queued.ok || samLastExport !== kept) throw Error('Queue replaced export before playback');
    await jr(); finish(kept.buffer); await new Promise(resolve=>setTimeout(resolve,20));
    nt('qwen',originalAdapter);
    if (samLastExport !== kept) throw Error('Cancelled queue replaced last export');
    return {text:samLastExport.text, ready:!document.querySelector('#sam-export-last').disabled};
  });
  assert.equal(state.ready, true);
  assert.equal(state.text, 'Shared Qwen take');
  await page.screenshot({path:path.join(output,'dialog-export.png')});
  const bounds = await page.locator('#sam-export-last').evaluate(button => {
    const r = button.getBoundingClientRect(), parent = button.closest('.samvoice-composer').getBoundingClientRect();
    return {fits:r.left >= parent.left && r.right <= parent.right && r.height > 0};
  });
  assert.equal(bounds.fits, true);
  assert.deepEqual(pageErrors, []);
  await page.setViewportSize({width:760,height:800});
  await page.locator('#sam-voice-dialog').evaluate(element => element.style.width = '720px');
  assert.equal(await page.locator('#sam-export-last').evaluate(button => {
    const r = button.getBoundingClientRect(), parent = button.closest('.samvoice-composer').getBoundingClientRect();
    return r.left >= parent.left && r.right <= parent.right;
  }), true);
  await page.screenshot({path:path.join(output,'dialog-export-narrow.png')});
  fs.writeFileSync(path.join(output,'results.json'), JSON.stringify({rendering, externalEngines, download:download.suggestedFilename(), bytes:wav.length, state, bounds},null,2));
  console.log('Dialog Preview, WAV download for all four engines, shared playback, reopen, cancelled queue and two layouts: passed.');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  await browser?.close(); server.close();
});
