#!/usr/bin/env python3
"""Generate the two sprite sheets SpriteAnimationSample animates.

Upstream's sample hot-linked both sheets from third-party sites
(`polybeast.de`, `media.pyweek.org`); neither URL resolves any more, so the
sample showed two empty boxes. These stand-ins keep the exact geometry the
sample declares, so they still demonstrate what it set out to demonstrate --
the two `cellOrientation` values and what `duration` does to each.

    burst-sprite.png   320x240 cells, 4 columns x 5 rows, horizontal order
                       (left to right, then down: 20 frames)
    fish-sprite.png    50x50 cells, 16 columns x 3 rows, vertical order
                       (down each column, then across: 48 frames)

"Horizontal" and "vertical" are SpriteAnimation's own terms for which axis it
steps along first; see `steps()` in `src/SpriteAnimation/SpriteAnimation.js`.

No dependencies -- the PNGs are written by hand through zlib.

    python3 make-sprites.py
"""

import math
import struct
import zlib


def write_png(path, width, height, pixels):
    """pixels: a bytearray of width*height*4 bytes, RGBA, row-major."""
    raw = bytearray()
    stride = width * 4
    for y in range(height):
        raw.append(0)  # filter type 0 (None)
        raw += pixels[y * stride:(y + 1) * stride]

    def chunk(tag, data):
        return (struct.pack('>I', len(data)) + tag + data +
                struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff))

    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    png += chunk(b'IDAT', zlib.compress(bytes(raw), 9))
    png += chunk(b'IEND', b'')
    with open(path, 'wb') as f:
        f.write(png)
    return len(png)


def blend(pixels, width, x, y, rgb, alpha):
    if alpha <= 0:
        return
    if alpha > 1:
        alpha = 1.0
    i = (y * width + x) * 4
    for c in range(3):
        pixels[i + c] = int(pixels[i + c] * (1 - alpha) + rgb[c] * alpha)
    pixels[i + 3] = int(pixels[i + 3] + (255 - pixels[i + 3]) * alpha)


# --- sheet 1: a burst, 4 columns x 5 rows of 320x240, horizontal order -------

def burst():
    cw, ch, cols, rows = 320, 240, 4, 5
    w, h = cw * cols, ch * rows
    px = bytearray(w * h * 4)
    frames = cols * rows

    for f in range(frames):
        t = f / (frames - 1.0)                 # 0 .. 1 through the burst
        ox, oy = (f % cols) * cw, (f // cols) * ch
        cx, cy = ox + cw / 2.0, oy + ch / 2.0
        # the fireball grows fast and fades late; the shock ring outruns it
        core = 12 + 86 * math.sin(min(t * 1.35, 1.0) * math.pi / 2)
        ring = 20 + 150 * t
        fade = 1.0 if t < 0.45 else max(0.0, 1 - (t - 0.45) / 0.55)

        for y in range(oy, oy + ch):
            dy = y - cy
            for x in range(ox, ox + cw):
                d = math.hypot(x - cx, dy)
                # fireball: white centre through yellow and orange to red
                if d < core * 1.35:
                    k = d / (core * 1.35)
                    if k < 0.35:
                        rgb, a = (255, 250, 225), 1.0
                    elif k < 0.6:
                        rgb, a = (255, 205, 70), 1.0
                    elif k < 0.85:
                        rgb, a = (240, 120, 30), 0.95
                    else:
                        rgb, a = (170, 45, 20), 0.8 * (1 - (k - 0.85) / 0.15)
                    blend(px, w, x, y, rgb, a * fade)
                # shock ring
                dr = abs(d - ring)
                if dr < 9:
                    blend(px, w, x, y, (255, 240, 200),
                          (1 - dr / 9.0) * 0.5 * max(0.0, 1 - t) * fade)
        # a few sparks thrown outward, deterministic so the sheet is stable
        for s in range(14):
            ang = s * 2.399963 + f * 0.17
            dist = ring * (0.75 + 0.3 * ((s * 37) % 11) / 10.0)
            sx, sy = int(cx + math.cos(ang) * dist), int(cy + math.sin(ang) * dist)
            for yy in range(sy - 2, sy + 3):
                for xx in range(sx - 2, sx + 3):
                    if ox <= xx < ox + cw and oy <= yy < oy + ch:
                        k = 1 - math.hypot(xx - sx, yy - sy) / 3.0
                        blend(px, w, xx, yy, (255, 215, 140), k * 0.8 * fade)

    return write_png('burst-sprite.png', w, h, px)


# --- sheet 2: a fish, 16 columns x 3 rows of 50x50, vertical order ------------

def fish():
    cw, ch, cols, rows = 50, 50, 16, 3
    w, h = cw * cols, ch * rows
    px = bytearray(w * h * 4)
    frames = cols * rows

    for f in range(frames):
        # vertical orientation steps down a column before moving across
        col, row = f // rows, f % rows
        ox, oy = col * cw, row * ch
        phase = f / float(frames) * 2 * math.pi
        cx, cy = ox + 27.0, oy + 25.0 + 2.5 * math.sin(phase * 2)
        wag = math.sin(phase * 4)
        body = (70, 150, 210)
        fin = (40, 110, 170)

        for y in range(oy, oy + ch):
            for x in range(ox, ox + cw):
                # body: an ellipse, 15 long and 8 tall
                ex, ey = (x - cx) / 15.0, (y - cy) / 8.0
                d = ex * ex + ey * ey
                if d < 1.0:
                    k = 1 - d
                    blend(px, w, x, y, body, min(1.0, 0.45 + k * 1.2))
                # tail: a triangle behind the body, wagging
                tx = x - (cx - 14)
                if -11 <= tx <= 0:
                    spread = (-tx) * 0.65
                    mid = cy + wag * (-tx) * 0.55
                    if abs(y - mid) <= spread:
                        blend(px, w, x, y, fin, 0.9)
        # eye
        ex, ey = int(cx + 8), int(cy - 2)
        for yy in range(ey - 2, ey + 3):
            for xx in range(ex - 2, ex + 3):
                if math.hypot(xx - ex, yy - ey) <= 2:
                    blend(px, w, xx, yy, (20, 25, 35), 1.0)

    return write_png('fish-sprite.png', w, h, px)


if __name__ == '__main__':
    print('burst-sprite.png %d bytes' % burst())
    print('fish-sprite.png  %d bytes' % fish())
