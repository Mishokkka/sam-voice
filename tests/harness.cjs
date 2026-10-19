const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

// Loads the published bundle without changing it. Foundry/browser services are
// explicit doubles; no real game, socket connection, or audio output is opened.
function loadBundle(overrides = {}, bundleSource = null) {
  const values = new Map(), hooks = new Map(), handlers = new Map(), events = [], notices = [];
  class Collection extends Map { [Symbol.iterator]() { return this.values(); } }
  const game = {
    user: { id: 'gm', isGM: true }, userId: 'gm',
    users: new Collection([['gm', { id: 'gm', name: 'GM', isGM: true, active: true }],
      ['player', { id: 'player', name: 'Player', isGM: false, active: true }]]),
    settings: {
      register: (module, key, config) => values.set(key, config.default),
      get: (module, key) => values.get(key),
      set: async (module, key, value) => { values.set(key, value); return value; }
    }, modules: new Map([['sam-voice', {}]])
  };
  class Reader {
    readAsDataURL(blob) {
      blob.arrayBuffer().then(data => {
        this.result = `data:${blob.type};base64,${Buffer.from(data).toString('base64')}`;
        this.onloadend?.();
      }, error => { this.error = error; this.onerror?.(); });
    }
  }
  const context = vm.createContext({
    console: { info() {}, debug() {}, warn() {}, error() {}, log() {} },
    URL, Blob, FileReader: Reader, AbortController, DOMException,
    atob, btoa, setTimeout, clearTimeout, fetch,
    crypto: require('node:crypto').webcrypto,
    foundry: { applications: { api: { ApplicationV2: class {} } } },
    window: {}, game,
    Hooks: {
      once: (name, fn) => hooks.set(name, fn),
      on: (name, fn) => hooks.set(name, fn),
      callAll: (name, data) => events.push({ name, data })
    },
    socketlib: { registerModule: () => ({ register: (name, fn) => handlers.set(name, fn) }) },
    ui: { notifications: Object.fromEntries(['info', 'warn', 'error'].map(level =>
      [level, message => notices.push({ level, message })])) },
    ...overrides
  });
  const file = path.join(__dirname, '../dist/samvoice.js');
  const source = (bundleSource ?? fs.readFileSync(file, 'utf8')).replaceAll('import.meta.url', JSON.stringify(require('node:url').pathToFileURL(file).href));
  vm.runInContext(source, context, { filename: file, timeout: 10000 });
  hooks.get('init')();
  return { context, values, hooks, handlers, events, notices };
}

function wav() {
  const data = Buffer.alloc(244);
  data.write('RIFF', 0); data.writeUInt32LE(data.length - 8, 4); data.write('WAVEfmt ', 8);
  data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(1, 22);
  data.writeUInt32LE(24000, 24); data.writeUInt32LE(48000, 28);
  data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34);
  data.write('data', 36); data.writeUInt32LE(data.length - 44, 40);
  return data;
}
module.exports = { loadBundle, wav };
