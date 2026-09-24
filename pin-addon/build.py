#!/usr/bin/env python3
"""Build the Material Pin companion extension."""

import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parent
FILES = (
    "manifest.json",
    "background.js",
    "api/schema.json",
    "api/implementation.js",
    "pin.svg",
)


def main() -> None:
    manifest = json.loads((ROOT / "manifest.json").read_text())
    json.loads((ROOT / "api/schema.json").read_text())
    output = ROOT.parent / "dist" / f"material-pin-thunderbird-{manifest['version']}.xpi"
    output.parent.mkdir(exist_ok=True)
    with ZipFile(output, "w", ZIP_DEFLATED) as package:
        for name in FILES:
            package.write(ROOT / name, arcname=name)
    print(f"Built {output}")


if __name__ == "__main__":
    main()
