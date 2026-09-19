#!/usr/bin/env python3
"""
Generates every placeholder asset used to seed the site, since this build
environment has no access to Pexels/Unsplash (see DECISIONS.md). Produces
abstract editorial gradient cards in the brand palette instead of fake
human photos — never a fabricated "stock photo" of a person.

Run: python3 scripts/generate_placeholder_media.py
Requires: pillow (pip install pillow), ffmpeg (apt install ffmpeg)
"""
import math
import os
import random
import subprocess

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "seed-media")
os.makedirs(OUT, exist_ok=True)

PAPER = (244, 237, 228)
INK = (28, 21, 18)
ACCENT = (123, 30, 44)
SOFT = (234, 203, 198)
DETAIL = (184, 135, 90)

FONT_SERIF_BOLD_ITALIC = "/usr/share/fonts/truetype/noto/NotoSerifDisplay-BoldItalic.ttf"
FONT_SERIF_BOLD = "/usr/share/fonts/truetype/noto/NotoSerifDisplay-Bold.ttf"
FONT_SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

random.seed(7)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def radial_gradient(size, inner, outer, center=(0.5, 0.42), radius=0.9):
    """Vectorized radial gradient (numpy) — fast enough to call per video frame."""
    w, h = size
    yy, xx = np.mgrid[0:h, 0:w]
    cx, cy = center[0] * w, center[1] * h
    max_r = radius * math.hypot(w, h) / 2
    d = np.hypot(xx - cx, yy - cy) / max_r
    t = np.clip(d, 0, 1)[..., None]
    inner_arr = np.array(inner, dtype=np.float32)
    outer_arr = np.array(outer, dtype=np.float32)
    rgb = inner_arr + (outer_arr - inner_arr) * t
    return Image.fromarray(rgb.astype(np.uint8), "RGB")


_VIGNETTE_CACHE = {}


def _vignette_factor(size, strength):
    """1.0 at center fading to (1-strength) at the edges — cached per size."""
    key = (size, strength)
    if key in _VIGNETTE_CACHE:
        return _VIGNETTE_CACHE[key]
    w, h = size
    yy, xx = np.mgrid[0:h, 0:w]
    cx, cy = w / 2, h / 2
    max_r = math.hypot(w, h) / 2
    d = np.clip(np.hypot(xx - cx, yy - cy) / max_r, 0, 1)
    factor = (1 - strength * (d ** 1.6))[..., None]
    _VIGNETTE_CACHE[key] = factor
    return factor


def vignette(img, strength=0.55):
    arr = np.asarray(img, dtype=np.float32)
    factor = _vignette_factor(img.size, strength)
    arr = arr * factor
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def grain(img, amount=10):
    w, h = img.size
    noise = Image.effect_noise((w, h), amount).convert("L")
    noisy = Image.merge("RGB", [Image.blend(c, noise, 0.04) for c in img.split()])
    return noisy


def editorial_card(size, palette_pair, label=None, out_path=None):
    inner, outer = palette_pair
    img = radial_gradient(size, inner, outer)
    img = vignette(img, strength=0.35)
    img = grain(img, amount=14)
    if label:
        draw = ImageDraw.Draw(img)
        font = ImageFont.truetype(FONT_SANS, max(14, size[0] // 40))
        bbox = draw.textbbox((0, 0), label, font=font)
        tw = bbox[2] - bbox[0]
        draw.text(((size[0] - tw) / 2, size[1] - size[1] // 10), label, font=font, fill=(*PAPER, 255) if outer != PAPER else INK)
    if out_path:
        img.save(out_path, quality=90)
    return img


def silhouette_cutout(size, out_path):
    """Abstract transparent 'depth cutout' shape — stands in for Mo's cutout."""
    w, h = size
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Size relative to height (not width) so the "person" reads proportionally
    # whether the frame is a tall mobile crop or a wide desktop crop.
    cx = w * 0.5
    head_r = min(h * 0.1, w * 0.28)
    head_cy = h * 0.46
    draw.ellipse([cx - head_r, head_cy - head_r, cx + head_r, head_cy + head_r], fill=(*INK, 255))
    shoulder_top = head_cy + head_r * 0.7
    shoulder_half_w = min(w * 0.34, head_r * 2.2)
    draw.polygon(
        [
            (cx - shoulder_half_w, h * 1.05),
            (cx - shoulder_half_w * 0.65, shoulder_top),
            (cx + shoulder_half_w * 0.65, shoulder_top),
            (cx + shoulder_half_w, h * 1.05),
        ],
        fill=(*INK, 255),
    )
    img = img.filter(ImageFilter.GaussianBlur(2))
    # gradient tint overlay within the silhouette alpha
    tint = radial_gradient(size, DETAIL, ACCENT, center=(0.5, 0.3)).convert("RGBA")
    alpha = img.split()[3]
    tint.putalpha(alpha)
    tint.save(out_path)


def favicon_pngs():
    for name, bg in [("apple-icon.png", PAPER)]:
        size = (180, 180)
        img = Image.new("RGB", size, bg)
        draw = ImageDraw.Draw(img)
        font = ImageFont.truetype(FONT_SERIF_BOLD_ITALIC, 120)
        bbox = draw.textbbox((0, 0), "M", font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        draw.text(((size[0] - tw) / 2 - bbox[0], (size[1] - th) / 2 - bbox[1]), "M", font=font, fill=ACCENT)
        img.save(os.path.join(ROOT, "src", "app", "(site)", name))
        print("wrote", name)


PALETTES = [
    (PAPER, SOFT), (SOFT, ACCENT), (DETAIL, INK), (PAPER, DETAIL),
    (SOFT, INK), (ACCENT, INK), (PAPER, ACCENT), (DETAIL, ACCENT),
]


def make_video(path, size, seconds, palette_index, motion="drift", fps=24):
    """Render N frames of a slow animated gradient and encode with ffmpeg."""
    w, h = size
    frame_dir = path + "_frames"
    os.makedirs(frame_dir, exist_ok=True)
    inner, outer = PALETTES[palette_index % len(PALETTES)]
    n = seconds * fps
    for i in range(n):
        t = i / n
        if motion == "drift":
            cx = 0.5 + 0.08 * math.sin(t * 2 * math.pi)
            cy = 0.4 + 0.05 * math.cos(t * 2 * math.pi)
        elif motion == "pulse":
            cx, cy = 0.5, 0.45
        else:
            cx = 0.5 + 0.1 * t
            cy = 0.45
        blend = 0.5 + 0.5 * math.sin(t * 2 * math.pi)
        mixed_inner = lerp(inner, outer, 0.15 * blend)
        img = radial_gradient((w, h), mixed_inner, outer, center=(cx, cy))
        img = vignette(img, strength=0.3)
        img.save(os.path.join(frame_dir, f"f{i:04d}.jpg"), quality=88)

    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error", "-framerate", str(fps),
            "-i", os.path.join(frame_dir, "f%04d.jpg"),
            "-vf", f"scale={w}:{h}",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "24",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
            path,
        ],
        check=True,
    )
    for f in os.listdir(frame_dir):
        os.remove(os.path.join(frame_dir, f))
    os.rmdir(frame_dir)
    print("wrote", path)


def grab_thumb(video_path, out_path, t=1.0):
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-ss", str(t), "-i", video_path, "-frames:v", "1", out_path],
        check=True,
    )
    print("wrote", out_path)


def brand_logo_svg(name, out_path):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="600" height="160" viewBox="0 0 600 160">
  <text x="300" y="95" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700"
        font-size="46" letter-spacing="4" fill="#1C1512">{name.upper()}</text>
</svg>'''
    with open(out_path, "w") as f:
        f.write(svg)
    print("wrote", out_path)


def main():
    covers = os.path.join(OUT, "covers")
    projects = os.path.join(OUT, "projects")
    reasoning = os.path.join(OUT, "reasoning")
    bts = os.path.join(OUT, "bts")
    about = os.path.join(OUT, "about")
    intro = os.path.join(OUT, "intro")
    logos = os.path.join(OUT, "logos")
    for d in [covers, projects, reasoning, bts, about, intro, logos]:
        os.makedirs(d, exist_ok=True)

    # Favicons
    favicon_pngs()

    # Cover images + cutouts
    editorial_card((1200, 1800), (SOFT, PAPER), out_path=os.path.join(covers, "cover-mobile.jpg"))
    editorial_card((2400, 1350), (SOFT, DETAIL), out_path=os.path.join(covers, "cover-desktop.jpg"))
    silhouette_cutout((1200, 1800), os.path.join(covers, "cutout-mobile.png"))
    silhouette_cutout((2400, 1350), os.path.join(covers, "cutout-desktop.png"))

    # Intro video + poster
    make_video(os.path.join(intro, "intro.mp4"), (1080, 1920), 6, 0, motion="drift")
    grab_thumb(os.path.join(intro, "intro.mp4"), os.path.join(intro, "poster.jpg"), t=1)

    # 10 project videos: 8 vertical + 2 horizontal
    orientations = ["vertical"] * 8 + ["horizontal"] * 2
    random.shuffle(orientations)
    for i in range(1, 11):
        orientation = orientations[i - 1]
        size = (1080, 1920) if orientation == "vertical" else (1920, 1080)
        path = os.path.join(projects, f"project-{i:02d}.mp4")
        make_video(path, size, 5, i, motion=["drift", "pulse", "sweep"][i % 3])
        grab_thumb(path, os.path.join(projects, f"project-{i:02d}-thumb.jpg"), t=1.2)

    # 3 reasoning videos
    for i in range(1, 4):
        path = os.path.join(reasoning, f"reasoning-{i:02d}.mp4")
        make_video(path, (1080, 1920), 5, i + 3, motion="pulse")

    # 3 BTS clips
    for i in range(1, 4):
        path = os.path.join(bts, f"bts-{i:02d}.mp4")
        make_video(path, (1080, 1920), 5, i + 5, motion="pulse")
        grab_thumb(path, os.path.join(bts, f"bts-{i:02d}-poster.jpg"), t=0.5)

    # 3 About photos
    for i in range(1, 4):
        editorial_card((1600, 2000), PALETTES[i], out_path=os.path.join(about, f"about-{i:02d}.jpg"))

    # 6 placeholder brand logos
    for name in ["Sample Fintech", "Sample Skincare Co.", "Sample Ride", "Sample Foods", "Sample Fashion House", "Sample Tech"]:
        slug = name.lower().replace(" ", "-").replace(".", "")
        brand_logo_svg(name, os.path.join(logos, f"{slug}.svg"))

    print("\nAll placeholder media generated in", OUT)


if __name__ == "__main__":
    main()
