#!/usr/bin/env python3
"""Generate the cropped URPN emblem and installable-app icon set.

Run from the project root:
    python3 scripts/generate-brand-assets.py

Requires Pillow.
"""

from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "urpn-logo-mark.png"
BRAND = ROOT / "public" / "brand"
ICONS = ROOT / "public" / "icons"
BRAND.mkdir(parents=True, exist_ok=True)
ICONS.mkdir(parents=True, exist_ok=True)

CANVAS = (13, 12, 15, 255)  # #0D0C0F
ACCENT = (176, 91, 168, 255)  # orchid-violet

source = Image.open(SRC).convert("RGBA")
# The source contains the emblem above and the wordmark below. Crop only the
# emblem (menorah, shofar, laurel) and keep the transparent background.
emblem = source.crop((60, 70, 440, 340))
bbox = emblem.getbbox()
if bbox:
    emblem = emblem.crop(bbox)


def fit(image: Image.Image, box: int) -> Image.Image:
    width, height = image.size
    scale = min(box / width, box / height)
    resized = image.resize((max(1, round(width * scale)), max(1, round(height * scale))), Image.LANCZOS)
    return resized


def centered(canvas_size: int, image: Image.Image, fill: int) -> Image.Image:
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    offset = ((canvas_size - image.width) // 2, (canvas_size - image.height) // 2)
    canvas.paste(image, offset, image)
    return canvas


# Transparent wordmark asset used in the site header, portal, and certificate.
mark_canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
mark = fit(emblem, 448)
mark_canvas.paste(mark, ((512 - mark.width) // 2, (512 - mark.height) // 2), mark)
mark_canvas.save(BRAND / "urpn-mark.png", "PNG", optimize=True)


def app_icon(size: int, mark_ratio: float, path: Path) -> None:
    """Dark full-bleed icon so Android/iOS masking never clips the emblem."""
    canvas = Image.new("RGBA", (size, size), CANVAS)
    # Smooth, very subtle mint light behind the mark (no banding).
    yy, xx = np.mgrid[0:size, 0:size]
    distance = np.sqrt((xx - size / 2) ** 2 + (yy - size / 2) ** 2) / (size * 0.72)
    alpha = (np.clip(1 - distance, 0, 1) ** 2 * 16).astype(np.uint8)
    glow = Image.new("RGBA", (size, size), (176, 91, 168, 0))
    glow.putalpha(Image.fromarray(alpha, mode="L"))
    canvas = Image.alpha_composite(canvas, glow)

    inner = fit(emblem, round(size * mark_ratio))
    canvas.paste(inner, ((size - inner.width) // 2, (size - inner.height) // 2), inner)
    canvas.convert("RGB").save(path, "PNG", optimize=True)


app_icon(512, 0.62, ICONS / "icon-512.png")
app_icon(192, 0.64, ICONS / "icon-192.png")
app_icon(512, 0.46, ICONS / "maskable-512.png")  # extra safe-zone padding
app_icon(180, 0.62, ICONS / "apple-touch-icon.png")
app_icon(32, 0.72, ICONS / "favicon-32.png")

print("Brand assets written:")
for path in sorted([BRAND / "urpn-mark.png", *ICONS.glob("*.png")]):
    print(f"  {path.relative_to(ROOT)} ({path.stat().st_size} bytes)")
