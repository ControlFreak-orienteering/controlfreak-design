"""Writes scripts/og-glyphs.json: the outlines of the words on the link preview images, in
Nunito Sans ExtraBold (weight 800, the weight of the family name in the header), shaped
with the font's kerning and the header's letter spacing (-0.01 em).

gen-og-images.py draws the images from that file with no dependencies. This script is
only needed when a word changes (an app is added or renamed), and needs fontTools,
brotli and uharfbuzz, e.g. in a virtual environment:

  python3 -m venv /tmp/og && /tmp/og/bin/pip install fonttools brotli uharfbuzz
  /tmp/og/bin/python scripts/extract-og-glyphs.py

Run it from the package root after `npm install` (the font comes from
@fontsource-variable/nunito-sans, under the SIL Open Font License)."""
import io, json

import uharfbuzz as hb
from fontTools.pens.basePen import BasePen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

FONT = "node_modules/@fontsource-variable/nunito-sans/files/nunito-sans-latin-wght-normal.woff2"
WEIGHT = 800
LETTER_SPACING_EM = -0.01
# "ControlFreak" and every app's own word (FAMILY_APPS in src/family/apps.ts).
WORDS = ["ControlFreak", "Event", "Start", "Run", "MCP", "Diff"]
# Straight segments per curve: plenty at the images' sizes.
STEPS = 12


class FlatPen(BasePen):
    """Collects a glyph's contours as polygons, with curves cut into straight pieces."""

    def __init__(self, glyph_set, dx):
        super().__init__(glyph_set)
        self.dx, self.contours, self.points = dx, [], None

    def _add(self, pt):
        self.points.append((round(pt[0] + self.dx, 1), round(pt[1], 1)))

    def _moveTo(self, pt):
        self.points = []
        self._add(pt)

    def _lineTo(self, pt):
        self._add(pt)

    def _qCurveToOne(self, p1, p2):
        p0 = self._getCurrentPoint()
        for i in range(1, STEPS + 1):
            t = i / STEPS
            self._add(tuple((1 - t) ** 2 * p0[k] + 2 * (1 - t) * t * p1[k] + t * t * p2[k] for k in (0, 1)))

    def _curveToOne(self, p1, p2, p3):
        p0 = self._getCurrentPoint()
        for i in range(1, STEPS + 1):
            t = i / STEPS
            u = 1 - t
            self._add(tuple(u**3 * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t**3 * p3[k] for k in (0, 1)))

    def _closePath(self):
        if self.points and len(self.points) > 2:
            self.contours.append(self.points)
        self.points = None

    _endPath = _closePath


font = instancer.instantiateVariableFont(TTFont(FONT), {"wght": WEIGHT})
# HarfBuzz reads plain TrueType, not the WOFF2 the font comes in.
font.flavor = None
buffer = io.BytesIO()
font.save(buffer)
hb_font = hb.Font(hb.Face(buffer.getvalue()))
upem = font["head"].unitsPerEm
glyph_set = font.getGlyphSet()
order = font.getGlyphOrder()
spacing = LETTER_SPACING_EM * upem

words = {}
for word in WORDS:
    buf = hb.Buffer()
    buf.add_str(word)
    buf.guess_segment_properties()
    hb.shape(hb_font, buf, {"kern": True, "liga": True})
    x, glyphs = 0.0, []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        pen = FlatPen(glyph_set, x + pos.x_offset)
        glyph_set[order[info.codepoint]].draw(pen)
        glyphs.append({"char": info.cluster, "contours": pen.contours})
        x += pos.x_advance + spacing
    words[word] = {"width": round(x - spacing, 1), "glyphs": glyphs}

json.dump(
    {
        "font": f"Nunito Sans {WEIGHT}",
        "unitsPerEm": upem,
        "capHeight": font["OS/2"].sCapHeight,
        "words": words,
    },
    open("scripts/og-glyphs.json", "w"),
    separators=(",", ":"),
)
print("scripts/og-glyphs.json:", ", ".join(f"{w} {words[w]['width']:.0f}" for w in WORDS))
