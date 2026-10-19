import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const worker = (await readFile(path.join(root, 'src/samWorker.js'), 'utf8')).replaceAll('\r\n', '\n');
const source = (await readFile(path.join(root, 'src/samvoice.js'), 'utf8')).replaceAll('\r\n', '\n');
const hash = createHash('sha256').update(worker).digest('hex').slice(0, 12);
const workerName = `samWorker-${hash}.js`;
if (!source.includes('__SAM_WORKER__.js')) throw new Error('Missing SAM worker build placeholder.');
const assets = path.join(root, 'dist/assets');
await mkdir(assets, { recursive: true });
await writeFile(path.join(assets, workerName), worker);
await writeFile(path.join(root, 'dist/samvoice.js'), source.replaceAll('__SAM_WORKER__.js', workerName));
// Only stale generated SAM workers are removed; other assets are left alone.
for (const file of await readdir(assets)) {
  if (/^samWorker-[A-Za-z0-9_-]+\.js$/.test(file) && file !== workerName) await unlink(path.join(assets, file));
}
console.log(`Built dist/samvoice.js and dist/assets/${workerName}`);
