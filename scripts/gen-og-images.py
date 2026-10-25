"""Draws the link preview images (og:image), 1200 x 630, one per app:

  assets/og-controlfreak.png   the mark and "ControlFreak"
  assets/og-event.png          the mark, "ControlFreak" and, under it, "Event"
  assets/og-startklocka.png    ... "Start"
  assets/og-run.png            ... "Run"
  assets/og-mcp.png            ... "MCP"
  assets/og-diff.png           ... "Diff"

The name is written as in the family header: "Control" in ink, "Freak" in the logo's
purple and the app's own word in its accent colour (FAMILY_APPS in src/family/apps.ts).
The words are names, never translated, so one image serves all five languages.

No dependencies, like gen-app-icons.py: the mark is drawn from signed distance fields,
the words are filled from their outlines in scripts/og-glyphs.json (written by
extract-og-glyphs.py, Nunito Sans 800) with the non-zero rule, everything at 3 x 3
samples per pixel, and the PNG is written by hand. Run it from the package root:

  python3 scripts/gen-og-images.py

These are drawn with the family's mark. An app with a mark of its own keeps its image in
its own repo and draws it with that mark, so a new mark needs no release of this package:

  python3 node_modules/controlfreak-design/scripts/gen-og-images.py \
    --app event --mark src/brand/app-mark-236.png --out src/brand/og-image.png

`--mark` is the app's mark as a 236 x 236 RGBA PNG (render its SVG in a browser)."""
import json, math, os, struct, sys, zlib

W, H = 1200, 630
SS = 3

PAGE = (0xF4, 0xEF, 0xE6)    # --cf-page
PAPER = (0xFD, 0xFA, 0xF2)   # --cf-paper
EDGE = (0xD8, 0xCD, 0xBA)    # --cf-edge
INK = (0x2C, 0x2C, 0x2A)     # --cf-ink
PURPLE = (0xA6, 0x24, 0x8F)  # --cf-purple
ORANGE = (0xF0, 0x7F, 0x2A)  # --cf-flag-orange
WHITE = (0xFF, 0xFF, 0xFF)

# The apps and their own words, as in FAMILY_APPS; "" for none.
APPS = [
    ("controlfreak", ""),
    ("event", "Event"),
    ("startklocka", "Start"),
    ("run", "Run"),
    ("mcp", "MCP"),
    ("diff", "Diff"),
]

# Layout: the paper strip along the bottom, as on the apps' start screens; the mark on
# the left; the name to its right, as large as fits.
PAPER_TOP = 545
MARK_SIZE = 236
MARK_LEFT = 104
TEXT_LEFT = MARK_LEFT + MARK_SIZE + 56
TEXT_MAX_WIDTH = W - TEXT_LEFT - 84
MAX_FONT_SIZE = 132
LINE_GAP = 1.12  # baseline to baseline, in font sizes
MIDDLE = PAPER_TOP / 2

GLYPHS = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "og-glyphs.json")))
UPEM = GLYPHS["unitsPerEm"]
CAP = GLYPHS["capHeight"] / UPEM


def sd_round_rect(px, py, cx, cy, hw, hh, r):
    qx, qy = abs(px - cx) - (hw - r), abs(py - cy) - (hh - r)
    return math.hypot(max(qx, 0), max(qy, 0)) + min(max(qx, qy), 0) - r


def sd_segment(px, py, ax, ay, bx, by):
    vx, vy, wx, wy = bx - ax, by - ay, px - ax, py - ay
    t = max(0.0, min(1.0, (wx * vx + wy * vy) / (vx * vx + vy * vy)))
    return math.hypot(wx - t * vx, wy - t * vy)


def draw_mark(pixels, left, top, size):
    """The mark (controlfreak-mark.svg, a 512 grid): the purple plate, the white ring and
    the chevron, blended over what is there."""
    s = size / 512.0
    cx, cy = left + size / 2, top + size / 2
    ax, ay = cx + (181 - 256) * s, cy + (285 - 256) * s
    bx, by = cx, cy + (210 - 256) * s
    ex, ey = cx + (331 - 256) * s, cy + (285 - 256) * s
    for y in range(int(top), int(top + size) + 1):
        for x in range(int(left), int(left + size) + 1):
            plate_cover = white_cover = 0.0
            for sy in range(SS):
                for sx in range(SS):
                    px, py = x + (sx + 0.5) / SS, y + (sy + 0.5) / SS
                    plate = sd_round_rect(px, py, cx, cy, size / 2, size / 2, 116 * s)
                    ring = abs(math.hypot(px - cx, py - cy) - 150 * s) - 19 * s
                    chev = min(sd_segment(px, py, ax, ay, bx, by), sd_segment(px, py, bx, by, ex, ey)) - 19 * s
                    p = min(1.0, max(0.0, 0.5 - plate))
                    plate_cover += p
                    white_cover += p * min(1.0, max(0.0, 0.5 - min(ring, chev)))
            n = SS * SS
            blend(pixels, x, y, PURPLE, plate_cover / n)
            blend(pixels, x, y, WHITE, white_cover / n)


def read_png(path):
    """An 8-bit RGBA, non-interlaced PNG as (width, height, rows of bytes)."""
    data = open(path, "rb").read()
    pos, idat, width, height = 8, b"", 0, 0
    while pos < len(data):
        (length,) = struct.unpack(">I", data[pos:pos + 4])
        tag, body = data[pos + 4:pos + 8], data[pos + 8:pos + 8 + length]
        if tag == b"IHDR":
            width, height, depth, kind = struct.unpack(">IIBB", body[:10])
            assert depth == 8 and kind == 6, f"{path}: not 8-bit RGBA"
        elif tag == b"IDAT":
            idat += body
        pos += 12 + length
    raw, stride, rows, prev = zlib.decompress(idat), width * 4, [], bytearray(width * 4)
    for y in range(height):
        f, line = raw[y * (stride + 1)], bytearray(raw[y * (stride + 1) + 1:(y + 1) * (stride + 1)])
        for i in range(stride):
            a = line[i - 4] if i >= 4 else 0
            b = prev[i]
            c = prev[i - 4] if i >= 4 else 0
            if f == 1:
                line[i] = (line[i] + a) & 255
            elif f == 2:
                line[i] = (line[i] + b) & 255
            elif f == 3:
                line[i] = (line[i] + (a + b) // 2) & 255
            elif f == 4:
                pa, pb, pc = abs(b - c), abs(a - c), abs(a + b - 2 * c)
                line[i] = (line[i] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        rows.append(line)
        prev = line
    return width, height, rows


def draw_image(pixels, left, top, path):
    """An RGBA PNG blended over what is there, its top left corner at (left, top)."""
    width, height, rows = read_png(path)
    for y in range(height):
        for x in range(width):
            r, g, b, a = rows[y][x * 4:x * 4 + 4]
            blend(pixels, int(left) + x, int(top) + y, (r, g, b), a / 255)


def blend(pixels, x, y, color, alpha):
    if alpha <= 0 or not (0 <= x < W and 0 <= y < H):
        return
    i = (y * W + x) * 3
    for k in range(3):
        pixels[i + k] = round(pixels[i + k] + (color[k] - pixels[i + k]) * alpha)


def fill(pixels, contours, color):
    """Fills polygons (in pixels) with the non-zero rule, SS x SS samples per pixel."""
    edges = []
    for contour in contours:
        for (x0, y0), (x1, y1) in zip(contour, contour[1:] + contour[:1]):
            if y0 != y1:
                edges.append((x0, y0, x1, y1, 1 if y1 > y0 else -1))
    if not edges:
        return
    top = max(0, int(min(min(e[1], e[3]) for e in edges)))
    bottom = min(H - 1, int(max(max(e[1], e[3]) for e in edges)) + 1)
    for y in range(top, bottom + 1):
        counts = [0] * (W * SS)
        for sy in range(SS):
            yy = y + (sy + 0.5) / SS
            hits = []
            for x0, y0, x1, y1, d in edges:
                if (y0 <= yy < y1) or (y1 <= yy < y0):
                    hits.append((x0 + (yy - y0) * (x1 - x0) / (y1 - y0), d))
            hits.sort()
            winding = 0
            for (xa, d), (xb, _) in zip(hits, hits[1:]):
                winding += d
                if winding != 0:
                    # Samples sit at (i + 0.5) / SS; mark those inside [xa, xb).
                    i0 = max(0, math.ceil(xa * SS - 0.5))
                    i1 = min(W * SS, math.ceil(xb * SS - 0.5))
                    for i in range(i0, i1):
                        counts[i] += 1
        n = SS * SS
        for x in range(W):
            c = counts[x * SS] + counts[x * SS + 1] + counts[x * SS + 2]
            if c:
                blend(pixels, x, y, color, c / n)


def word_contours(word, left, baseline, size, first=0, last=None):
    """The outlines of a shaped word in pixels, for its characters first..last."""
    k = size / UPEM
    out = []
    for glyph in GLYPHS["words"][word]["glyphs"]:
        if glyph["char"] < first or (last is not None and glyph["char"] >= last):
            continue
        for contour in glyph["contours"]:
            out.append([(left + gx * k, baseline - gy * k) for gx, gy in contour])
    return out


def png(pixels):
    raw = b"".join(b"\x00" + bytes(pixels[y * W * 3:(y + 1) * W * 3]) for y in range(H))

    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    return (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw, 9))
            + chunk(b"IEND", b""))


def render(word, mark=None):
    pixels = bytearray()
    for y in range(H):
        row = EDGE if PAPER_TOP <= y < PAPER_TOP + 2 else PAPER if y >= PAPER_TOP else PAGE
        pixels += bytes(row) * W
    widths = [GLYPHS["words"]["ControlFreak"]["width"]] + ([GLYPHS["words"][word]["width"]] if word else [])
    size = min(MAX_FONT_SIZE, TEXT_MAX_WIDTH * UPEM / max(widths))
    lines = 2 if word else 1
    # The block from the first line's cap height to the last baseline, centred.
    block = CAP * size + (lines - 1) * LINE_GAP * size
    first_baseline = MIDDLE - block / 2 + CAP * size
    if mark:
        draw_image(pixels, MARK_LEFT, round(MIDDLE - MARK_SIZE / 2), mark)
    else:
        draw_mark(pixels, MARK_LEFT, MIDDLE - MARK_SIZE / 2, MARK_SIZE)
    fill(pixels, word_contours("ControlFreak", TEXT_LEFT, first_baseline, size, 0, 7), INK)
    fill(pixels, word_contours("ControlFreak", TEXT_LEFT, first_baseline, size, 7), PURPLE)
    if word:
        fill(pixels, word_contours(word, TEXT_LEFT, first_baseline + LINE_GAP * size, size), ORANGE)
    return png(pixels)


args = sys.argv[1:]
if args:
    opts = dict(zip(args[::2], args[1::2]))
    app = opts["--app"]
    word = dict(APPS)[app]
    open(opts["--out"], "wb").write(render(word, opts.get("--mark")))
    print(opts["--out"])
else:
    for app, word in APPS:
        path = f"assets/og-{app}.png"
        open(path, "wb").write(render(word))
        print(path)
