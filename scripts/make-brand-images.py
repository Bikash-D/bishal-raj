# NOTE (Stage 5): the social-share image public/og-image.jpg is now built by scripts/build-og-image.mjs
# (real Newsreader font, text from src/content/site.ts). Do not re-run the og-image step of this script,
# it would replace it with the older stand-in-font version (kept in media-derived/previous/).
"""
Generates the social-sharing card and icons from the ORIGINAL photograph p5 (never modified).
Outputs: public/og-image.jpg (1200x630), public/apple-touch-icon.png (180), public/favicon-32.png.
Needs Pillow. The serif here is a stand-in for Newsreader (not installable in the build sandbox);
re-run on your machine after changing FONT_* if you prefer another face. Run from the project root:
  python scripts/make-brand-images.py
"""
from PIL import Image, ImageDraw, ImageFont

BG, BONE, ASH, BRONZE = (3, 3, 3), (236, 230, 218), (163, 155, 142), (176, 128, 81)
FONT_SERIF = "/usr/share/fonts/truetype/freefont/FreeSerif.ttf"
FONT_UI = "/usr/share/fonts/opentype/inter/Inter-Light.otf"

def tracked(draw, xy, text, font, fill, tracking):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x

W, H = 1200, 630
card = Image.new("RGB", (W, H), BG)
photo = Image.open("media-src/originals/p5.jpeg").convert("RGB")
ph = H
pw = round(photo.width * ph / photo.height)
photo = photo.resize((pw, ph), Image.LANCZOS)
card.paste(photo, (W - pw, 0))
d = ImageDraw.Draw(card)
serif = ImageFont.truetype(FONT_SERIF, 92)
ui = ImageFont.truetype(FONT_UI, 20)
small = ImageFont.truetype(FONT_UI, 17)
x0 = 84
tracked(d, (x0, 150), "BISHAL", serif, BONE, 6)
tracked(d, (x0, 252), "RAJ", serif, BONE, 6)
d.line((x0, 392, x0 + 56, 392), fill=BRONZE, width=2)
tracked(d, (x0 + 76, 380), "ACTOR", ui, ASH, 7)
tracked(d, (x0, 520), "THEATRE TRAINING  \u00b7  MANDALA THEATRE", small, ASH, 3.2)
card.save("public/og-image.jpg", quality=90, optimize=True)

def icon(size):
    im = Image.new("RGB", (size, size), BG)
    dd = ImageDraw.Draw(im)
    s = size / 32
    dd.ellipse((6 * s, 10 * s, 26 * s, 22 * s), outline=BRONZE, width=max(1, round(1.5 * s)))
    return im
icon(180).save("public/apple-touch-icon.png")
icon(32).save("public/favicon-32.png")
print("ok")
