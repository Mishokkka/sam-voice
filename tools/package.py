"""Create a deterministic Foundry install ZIP using only Python's standard library."""
import json
from pathlib import Path
import re
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / "module.json").read_text(encoding="utf-8"))
package = json.loads((root / "package.json").read_text(encoding="utf-8"))
if manifest["version"] != package["version"]:
    raise ValueError("package.json and module.json versions must match")
bundle = (root / "dist/samvoice.js").read_text(encoding="utf-8")
workers = re.findall(r'assets/(samWorker-[A-Za-z0-9_-]+\.js)', bundle)
files = {"module.json", "README.md", "CHANGELOG.md", *manifest["styles"], *manifest["esmodules"]}
files.update(f"dist/assets/{worker}" for worker in workers)
files.update(str(file.relative_to(root)).replace("\\", "/")
             for directory in ("tools/qwen", "tools/silero")
             for file in (root / directory).glob("*") if file.is_file())
output = root / "releases" / f'sam-voice-{manifest["version"]}.zip'
output.parent.mkdir(exist_ok=True)
with ZipFile(output, "w", compression=ZIP_DEFLATED) as archive:
    for name in sorted(files):
        info = ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
        info.compress_type = ZIP_DEFLATED
        info.external_attr = 0o644 << 16
        archive.writestr(info, (root / name).read_bytes())
with ZipFile(output) as archive:
    if archive.testzip() is not None or set(archive.namelist()) != files:
        raise ValueError("ZIP verification failed")
print(f"Created {output} ({len(files)} files)")
