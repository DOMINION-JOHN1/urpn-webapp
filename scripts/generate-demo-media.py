#!/usr/bin/env python3
"""Generate demo lesson posters, narrated videos, and audio for the portal.

This uses macOS `say` + ffmpeg. Replace these demo files with your own teaching
at any time: drop the new file into `media/`, keep the same name (or update
`lib/courses.ts`), update the duration in `lib/courses.ts`, and add a poster to
`public/posters/`.

Run from the project root:
    python3 scripts/generate-demo-media.py
"""

from __future__ import annotations

import json
import math
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / "media"
POSTERS = ROOT / "public" / "posters"
TMP = ROOT / ".tmp-media"
MEDIA.mkdir(parents=True, exist_ok=True)
POSTERS.mkdir(parents=True, exist_ok=True)
TMP.mkdir(parents=True, exist_ok=True)

FFMPEG = shutil.which("ffmpeg") or "/opt/homebrew/bin/ffmpeg"
FFPROBE = shutil.which("ffprobe") or "/opt/homebrew/bin/ffprobe"
SAY = "/usr/bin/say"
VOICE = "Daniel"
RATE = 172

FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_MONO = "/System/Library/Fonts/Menlo.ttc"
EMBLEM = ROOT / "public" / "brand" / "urpn-mark.png"

CANVAS = (13, 12, 15)
GOLD = (216, 181, 111)
MAGENTA = (176, 91, 168)
TEXT = (246, 243, 240)
MUTED = (167, 154, 134)
DIM = (128, 120, 132)


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def tracked(draw: ImageDraw.ImageDraw, xy, text, fnt, fill, spacing=2):
    x, y = xy
    for char in text:
        draw.text((x, y), char, font=fnt, fill=fill)
        x += fnt.getlength(char) + spacing


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    line = ""
    for word in words:
        candidate = f"{line} {word}".strip()
        if draw.textlength(candidate, font=fnt) <= max_width or not line:
            line = candidate
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def radial_glow(width: int, height: int, cx: int, cy: int, radius: float, strength: int) -> Image.Image:
    yy, xx = np.mgrid[0:height, 0:width]
    distance = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / radius
    alpha = (np.clip(1 - distance, 0, 1) ** 2 * strength).astype(np.uint8)
    layer = Image.new("RGBA", (width, height), (176, 91, 168, 0))
    layer.putalpha(Image.fromarray(alpha, mode="L"))
    return layer


def build_poster(lesson: dict) -> Image.Image:
    width, height = 1920, 1080
    image = Image.new("RGBA", (width, height), CANVAS + (255,))
    image = Image.alpha_composite(
        image, radial_glow(width, height, 1500, 300, 760, 20)
    )

    draw = ImageDraw.Draw(image, "RGBA")

    # Fine grid, barely visible.
    for x in range(0, width, 120):
        draw.line([(x, 0), (x, height)], fill=(255, 255, 255, 5), width=1)
    for y in range(0, height, 120):
        draw.line([(0, y), (width, y)], fill=(255, 255, 255, 5), width=1)

    left = 132

    # Wordmark
    emblem = Image.open(EMBLEM).convert("RGBA")
    emblem_small = emblem.resize((62, 62), Image.LANCZOS)
    image.alpha_composite(emblem_small, (left, 78))
    draw.text((left + 78, 82), "URPN", font=font(FONT_BOLD, 30), fill=TEXT)
    draw.text(
        (left + 78, 118),
        "UNIQUE REVIVAL PRAYER NETWORK",
        font=font(FONT_MONO, 13),
        fill=MUTED,
    )

    # Eyebrow
    eyebrow_y = 250
    draw.ellipse([left, eyebrow_y + 9, left + 11, eyebrow_y + 20], fill=GOLD)
    tracked(
        draw,
        (left + 26, eyebrow_y),
        f"{lesson['code']}  ·  {lesson['course'].upper()}",
        font(FONT_MONO, 19),
        GOLD,
        spacing=2,
    )

    # Title
    title_font = font(FONT_BOLD, 82)
    lines = wrap(draw, lesson["title"], title_font, 980)
    y = 326
    for line in lines[:4]:
        draw.text((left, y), line, font=title_font, fill=TEXT)
        y += 92

    # Meta
    meta_y = max(y + 26, 650)
    draw.line([(left, meta_y), (left + 86, meta_y)], fill=GOLD, width=3)
    tracked(
        draw,
        (left, meta_y + 28),
        f"WORKER FORMATION  ·  LESSON {lesson['number']:02d}",
        font(FONT_MONO, 17),
        MUTED,
        spacing=2,
    )
    tracked(
        draw,
        (left, height - 92),
        lesson["kind"].upper() + " TEACHING  ·  URPN TRAINING",
        font(FONT_MONO, 14),
        DIM,
        spacing=2,
    )

    # Emblem on the right with a quiet ring.
    big = emblem.resize((352, 352), Image.LANCZOS)
    big.putalpha(big.getchannel("A").point(lambda a: int(a * 0.92)))
    image.alpha_composite(big, (width - 470, 400))
    draw.ellipse(
        [width - 560, 310, width - 140, 730],
        outline=(42, 44, 47, 255),
        width=2,
    )
    draw.ellipse(
        [width - 520, 350, width - 180, 690],
        outline=(176, 91, 168, 54),
        width=1,
    )
    draw.text(
        (width - 230, height - 92),
        "urpn.org",
        font=font(FONT_MONO, 14),
        fill=DIM,
        anchor="rs",
    )

    return image.convert("RGB")


VIDEO_LESSONS = [
    {
        "file": "foundation-welcome",
        "kind": "video",
        "course": "Foundation class",
        "code": "URPN 101",
        "track": 1,
        "number": 1,
        "title": "Welcome to the Foundation Class",
        "narration": (
            "Welcome to the U R P N Foundation Class. Over four weeks, you will meet the mandate, "
            "learn to keep a personal altar burning, settle your identity before your assignment, "
            "and discover how to hear God for the sphere He has given you. Work through every lesson "
            "at your own pace. Your progress is saved as you go. When the track is complete, the "
            "final exam unlocks. Take your time, stay present, and let the Word form you."
        ),
    },
    {
        "file": "foundation-serving",
        "kind": "video",
        "course": "Foundation class",
        "code": "URPN 101",
        "track": 1,
        "number": 6,
        "title": "Serving with a clean heart",
        "narration": (
            "Serving with a clean heart begins with knowing whose you are. Before Jesus healed anyone "
            "or taught anyone, the Father called Him beloved. You are not serving to earn a place. "
            "You already have one. Serve people, not the platform. Forgive quickly, because bitterness "
            "closes the door to the very presence you are carrying. Keep short accounts with God and "
            "with people. The hidden posture of your heart is the true measure of your ministry."
        ),
    },
    {
        "file": "ministers-mantle",
        "kind": "video",
        "course": "Ministers training",
        "code": "URPN 201",
        "track": 2,
        "number": 1,
        "title": "The weight of the mantle",
        "narration": (
            "The mantle is given, never seized. Elisha followed Elijah closely, served him faithfully, "
            "and asked for a double portion. He did not demand a title. He paid the price of following. "
            "A mantle is not a platform. It is a responsibility. It multiplies accountability before it "
            "multiplies influence. If God has placed a ministry in your hands, guard your heart, stay "
            "close to the people He has given you, and carry the weight with fear and trembling."
        ),
    },
    {
        "file": "ministers-altar",
        "kind": "video",
        "course": "Ministers training",
        "code": "URPN 201",
        "track": 2,
        "number": 7,
        "title": "Leading a corporate altar",
        "narration": (
            "Leading a corporate altar begins before you stand in front of anyone. Prepare the altar in "
            "private first. When you lead, give clear direction and leave room for silence. Protect the "
            "meeting from performance, from confusion, and from the need to impress. A room learns to pray "
            "by following a leader who is actually praying. Make space for the Word, for worship, and for "
            "the still small voice. The goal is not a good meeting. The goal is an encounter with God."
        ),
    },
    {
        "file": "pastors-heart",
        "kind": "video",
        "course": "Pastors training",
        "code": "URPN 301",
        "track": 3,
        "number": 1,
        "title": "A shepherd after God's heart",
        "narration": (
            "The flock belongs to God. You are a steward, never an owner. A shepherd knows the sheep by "
            "name, notices the one who is missing, and measures authority by service rather than by "
            "recognition. Guard your heart above your platform. Let the Father shepherd you before you "
            "attempt to shepherd others. The people you lead will eventually discern whether you are "
            "building a ministry or loving a family. Choose the heart of a shepherd."
        ),
    },
    {
        "file": "pastors-legacy",
        "kind": "video",
        "course": "Pastors training",
        "code": "URPN 301",
        "track": 3,
        "number": 7,
        "title": "Raising the next generation",
        "narration": (
            "Legacy is built on purpose, not by accident. The next generation needs more than a title. "
            "They need real responsibility, honest correction, and leaders secure enough to celebrate "
            "those who surpass them. Give away what you have learned. Make room at the table. Document "
            "the vision. A leader who refuses to be replaced builds a monument. A leader who prepares a "
            "successor builds a movement. Finish by handing on the fire."
        ),
    },
]

AUDIO_LESSONS = [
    {
        "file": "foundation-altar",
        "course": "Foundation class",
        "code": "URPN 101",
        "track": 1,
        "number": 3,
        "title": "Building a personal altar",
        "narration": (
            "An altar is a place of exchange. You bring your life, and God brings His fire. The private "
            "altar is where that exchange happens day after day, away from the crowd and the applause. "
            "Keep it simple. Open the Word. Worship. Pray. Listen. Consistency matters more than length. "
            "Some days will feel full. Other days will feel dry. Stay anyway. The fire on the altar must "
            "never go out. Your public assignment will be protected by a private altar that is still burning."
        ),
    },
    {
        "file": "foundation-hearing",
        "course": "Foundation class",
        "code": "URPN 101",
        "track": 1,
        "number": 7,
        "title": "Hearing God for your sphere",
        "narration": (
            "God speaks. The problem is usually our noise, not His silence. He speaks through the "
            "Scriptures, through the inward witness of the Spirit, through wise counsel, and through the "
            "circumstances He orders. Test every impression against the Word. A voice that contradicts "
            "Scripture is not the voice of God. Write down what you hear. Obey the small instruction. "
            "Obedience is the proof of hearing. Over time, you will recognize His voice more clearly "
            "because you have learned to follow."
        ),
    },
    {
        "file": "ministers-word",
        "course": "Ministers training",
        "code": "URPN 201",
        "track": 2,
        "number": 3,
        "title": "Preaching with fire and order",
        "narration": (
            "Preaching carries fire and order. The text is your anchor. The Spirit is your wind. Prepare "
            "as an act of love for the people who will listen. Read the passage in context. Ask what it "
            "meant before you ask what it means for your hearers. Let the gospel shape the application. "
            "Order does not quench fire. It gives the fire a wick. Speak clearly, point to Christ, and "
            "trust the Spirit to do what only He can do."
        ),
    },
    {
        "file": "ministers-prophetic",
        "course": "Ministers training",
        "code": "URPN 201",
        "track": 2,
        "number": 8,
        "title": "Prophetic protocol",
        "narration": (
            "Prophetic revelation is stewarded, never performed. Every word is tested, especially the "
            "word that flatters. Love never uses a prophecy to control, to manipulate, or to elevate a "
            "person above the Scriptures. Submit your gift to accountable relationships. Keep a record of "
            "what you receive and watch how God fulfils it. The prophet's spirit is subject to the prophet. "
            "Order protects both the messenger and the people. Hold the mystery with reverence."
        ),
    },
    {
        "file": "pastors-structure",
        "course": "Pastors training",
        "code": "URPN 301",
        "track": 3,
        "number": 4,
        "title": "Structure without losing fire",
        "narration": (
            "Structure is not the enemy of revival. When the early church grew, the apostles appointed "
            "seven trustworthy men to serve, so that prayer and the ministry of the Word would not be "
            "neglected. Delegation is a spiritual act. Give authority with scope, resources, and "
            "permission. Appoint people who fear God, tell the truth, and hate dishonest gain. Protect the "
            "fire by building order around it, and protect the people by refusing to carry everything alone."
        ),
    },
    {
        "file": "pastors-finish",
        "course": "Pastors training",
        "code": "URPN 301",
        "track": 3,
        "number": 8,
        "title": "Finishing well",
        "narration": (
            "The finish line is part of the race. Many begin well. Grace is needed to end well. Success "
            "can quietly replace dependence with expertise, listening with planning, and prayer with "
            "preparation. Guard the secret place, especially in the fruitful seasons. Keep people around "
            "you who knew you before the title. Confess your need. Let the Father minister to you. One day "
            "the microphone will be passed on. What remains is the person you became in the hidden place."
        ),
    },
]


def run(command: list[str]) -> None:
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(
            f"Command failed ({' '.join(command)}):\n{result.stderr[-2000:]}"
        )


def duration_of(path: Path) -> float:
    result = subprocess.run(
        [
            FFPROBE,
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    return float(result.stdout.strip())


def narrate(text: str, output: Path) -> None:
    aiff = TMP / f"{output.stem}.aiff"
    run([SAY, "-v", VOICE, "-r", str(RATE), "-o", str(aiff), text])
    run(
        [
            FFMPEG,
            "-y",
            "-i",
            str(aiff),
            "-c:a",
            "aac",
            "-b:a",
            "96k",
            "-ar",
            "44100",
            str(output),
        ]
    )
    aiff.unlink(missing_ok=True)


def make_video(poster: Image.Image, audio: Path, output: Path, duration: float) -> None:
    png = TMP / f"{output.stem}.png"
    poster.save(png)
    fade_out = max(0.4, duration - 0.8)
    video_filter = (
        "[0:v]scale=1920:1080,"
        f"zoompan=z='min(zoom+0.00022,1.06)':"
        "x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
        f"d=1:s=1280x720:fps=30,"
        "fade=t=in:st=0:d=0.6,"
        f"fade=t=out:st={fade_out:.2f}:d=0.8,"
        "format=yuv420p[v]"
    )
    run(
        [
            FFMPEG,
            "-y",
            "-loop",
            "1",
            "-i",
            str(png),
            "-i",
            str(audio),
            "-filter_complex",
            video_filter,
            "-map",
            "[v]",
            "-map",
            "1:a",
            "-t",
            f"{duration:.2f}",
            "-r",
            "30",
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "25",
            "-profile:v",
            "high",
            "-level",
            "4.0",
            "-movflags",
            "+faststart",
            "-c:a",
            "aac",
            "-b:a",
            "96k",
            "-shortest",
            str(output),
        ]
    )
    png.unlink(missing_ok=True)


def main() -> None:
    durations: dict[str, int] = {}

    for lesson in VIDEO_LESSONS:
        print(f"Building video: {lesson['file']}")
        item = {**lesson, "number": lesson["number"]}
        poster = build_poster(item)
        poster.resize((1280, 720), Image.LANCZOS).save(
            POSTERS / f"{lesson['file']}.jpg", "JPEG", quality=86, optimize=True
        )
        audio = TMP / f"{lesson['file']}.m4a"
        narrate(lesson["narration"], audio)
        seconds = duration_of(audio)
        output = MEDIA / f"{lesson['file']}.mp4"
        make_video(poster, audio, output, seconds)
        key = f"{lesson['file']}.mp4"
        durations[key] = math.ceil(duration_of(output))
        audio.unlink(missing_ok=True)
        print(f"  {output.name}: {durations[key]}s")

    for lesson in AUDIO_LESSONS:
        print(f"Building audio: {lesson['file']}")
        output = MEDIA / f"{lesson['file']}.m4a"
        narrate(lesson["narration"], output)
        key = f"{lesson['file']}.m4a"
        durations[key] = math.ceil(duration_of(output))
        print(f"  {output.name}: {durations[key]}s")

    # Keep the course metadata in sync with the actual generated durations.
    courses_path = ROOT / "lib" / "courses.ts"
    source = courses_path.read_text()
    for file_name, seconds in durations.items():
        pattern = re.compile(
            r"(file:\s*'" + re.escape(file_name) + r"',[\s\S]{0,200}?durationSeconds:\s*)\d+"
        )
        source, count = pattern.subn(rf"\g<1>{seconds}", source)
        if count != 1:
            raise RuntimeError(f"Expected exactly one duration entry for {file_name}, got {count}")
    courses_path.write_text(source)

    (MEDIA / "durations.json").write_text(json.dumps(durations, indent=2) + "\n")
    print("\nAll media generated. Durations:")
    print(json.dumps(durations, indent=2))


if __name__ == "__main__":
    main()
