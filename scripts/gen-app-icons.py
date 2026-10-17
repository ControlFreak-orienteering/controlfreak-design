"""Ritar app-ikonerna ur märkets former: inga beroenden, signed distance
fields, 3x supersampling, PNG skriven för hand. Kör från paketets rot.
(Flyttat hit från ControlFreak 2026-10-17, så att alla appar har samma ikoner.)

  assets/apple-touch-icon.png  180x180, heltäckande lila — iOS rundar hörnen
                               själv och tål ingen genomskinlighet.
  assets/icon-192.png          192x192, märket med rundade hörn på
  assets/icon-512.png          512x512  genomskinlig botten, för manifestet.
  assets/favicon.ico           16, 32 och 48 px, samma som 192 — för de
                               webbläsare som tar .ico framför SVG:en.

Måtten är märkets egna i dess 512-rutnät (se controlfreak-mark.svg)."""
import math, struct, zlib

PURPLE = (0xA6, 0x24, 0x8F)   # --cf-purple
SS = 3

def sd_round_rect(px, py, cx, cy, hw, hh, r):
    qx, qy = abs(px - cx) - (hw - r), abs(py - cy) - (hh - r)
    return math.hypot(max(qx, 0), max(qy, 0)) + min(max(qx, qy), 0) - r

def sd_circle(px, py, cx, cy, r):
    return math.hypot(px - cx, py - cy) - r

def sd_segment(px, py, ax, ay, bx, by):
    vx, vy, wx, wy = bx - ax, by - ay, px - ax, py - ay
    t = 0.0 if (vx * vx + vy * vy) == 0 else max(0.0, min(1.0, (wx * vx + wy * vy) / (vx * vx + vy * vy)))
    return math.hypot(wx - t * vx, wy - t * vy)

def mark_shapes(px, py, size, plate_radius):
    """(avstånd till plattan, avstånd till det vita) i en size×size-bild."""
    s = size / 512.0
    m = size / 2.0
    plate = sd_round_rect(px, py, m, m, m, m, plate_radius * s)
    ring = abs(sd_circle(px, py, m, m, 150 * s)) - 19 * s
    ax, ay = m + (181 - 256) * s, m + (285 - 256) * s
    bx, by = m, m + (210 - 256) * s
    cx, cy = m + (331 - 256) * s, m + (285 - 256) * s
    chev = min(sd_segment(px, py, ax, ay, bx, by), sd_segment(px, py, bx, by, cx, cy)) - 19 * s
    return plate, min(ring, chev)

def render(size, plate_radius, alpha):
    rows = []
    for y in range(size):
        row = bytearray()
        for x in range(size):
            acc = [0.0, 0.0, 0.0, 0.0]
            for sy in range(SS):
                for sx in range(SS):
                    px, py = x + (sx + 0.5) / SS, y + (sy + 0.5) / SS
                    plate, white = mark_shapes(px, py, size, plate_radius)
                    cover = min(1.0, max(0.0, 0.5 - plate))
                    w = min(1.0, max(0.0, 0.5 - white))
                    c = tuple(PURPLE[i] + (255 - PURPLE[i]) * w for i in range(3))
                    for i in range(3):
                        acc[i] += c[i] * cover
                    acc[3] += cover
            a = acc[3] / (SS * SS)
            if alpha:
                # Rak (ej förmultiplicerad) färg: dela ut täckningen igen.
                rgb = [round(acc[i] / acc[3]) if acc[3] > 0 else 0 for i in range(3)]
                row += bytes(rgb) + bytes([round(a * 255)])
            else:
                row += bytes(round(acc[i] / (SS * SS)) for i in range(3))
        rows.append(bytes(row))
    raw = b"".join(b"\x00" + r for r in rows)
    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    return (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6 if alpha else 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw, 9))
            + chunk(b"IEND", b""))

# plate_radius: hörnradie i 512-rutnätet. 0 fyller hela rutan.
for path, size, plate_radius, alpha in [
    ("assets/apple-touch-icon.png", 180, 0, False),
    ("assets/icon-192.png", 192, 116, True),
    ("assets/icon-512.png", 512, 116, True),
]:
    png = render(size, plate_radius, alpha)
    open(path, "wb").write(png)
    print(path, len(png), "bytes", f"{size}x{size}")

# favicon.ico: en ICO-behållare med PNG-bilder i, som alla nutida
# webbläsare läser. Små storlekar ritas var för sig i stället för att
# skalas ned, så att kanterna blir skarpa.
sizes = [16, 32, 48]
images = [render(n, 116, True) for n in sizes]
header = struct.pack("<HHH", 0, 1, len(images))
offset = 6 + 16 * len(images)
entries = b""
for n, png in zip(sizes, images):
    entries += struct.pack("<BBBBHHII", n, n, 0, 0, 1, 32, len(png), offset)
    offset += len(png)
ico = header + entries + b"".join(images)
open("assets/favicon.ico", "wb").write(ico)
print("assets/favicon.ico", len(ico), "bytes", "+".join(map(str, sizes)))
