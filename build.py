#!/usr/bin/env python3
"""Validate and package the Thunderbird theme as an XPI."""

import json
import re
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / "manifest.json"
FILES = ("manifest.json", "material.css", "icon.svg")


def contrast(first: str, second: str) -> float:
    def luminance(color: str) -> float:
        channels = [int(color[i : i + 2], 16) / 255 for i in (1, 3, 5)]
        channels = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in channels]
        return sum(a * b for a, b in zip(channels, (0.2126, 0.7152, 0.0722)))

    light, dark = sorted((luminance(first), luminance(second)), reverse=True)
    return (light + 0.05) / (dark + 0.05)


def main() -> None:
    manifest = json.loads(MANIFEST.read_text())
    output = ROOT / "dist" / f"material-you-thunderbird-{manifest['version']}.xpi"
    assert manifest["manifest_version"] == 3
    assert manifest["browser_specific_settings"]["gecko"]["id"]

    mapping = set(manifest["theme_experiment"]["colors"])
    pairs = (
        ("md3_on_surface", "md3_surface"),
        ("md3_on_surface", "md3_surface_low"),
        ("md3_on_primary", "md3_primary"),
        ("md3_on_primary_container", "md3_primary_container"),
        ("sidebar_text", "sidebar"),
        ("sidebar_highlight_text", "sidebar_highlight"),
        ("toolbar_text", "toolbar"),
    )
    for variant in ("theme", "dark_theme"):
        colors = manifest[variant]["colors"]
        assert mapping <= colors.keys(), f"Missing mapped color in {variant}"
        for key, value in colors.items():
            assert re.fullmatch(r"#[0-9A-Fa-f]{6}", value), f"Invalid {variant}.{key}"
        for foreground, background in pairs:
            ratio = contrast(colors[foreground], colors[background])
            assert ratio >= 4.5, f"Low contrast: {variant}.{foreground}/{background}: {ratio:.2f}"

    output.parent.mkdir(exist_ok=True)
    with ZipFile(output, "w", ZIP_DEFLATED) as package:
        for name in FILES:
            package.write(ROOT / name, arcname=name)
    print(f"Built {output}")


if __name__ == "__main__":
    main()
