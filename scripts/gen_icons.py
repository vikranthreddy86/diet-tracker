"""Generates PWA app icons: emerald->teal gradient square with a leaf mark."""
from PIL import Image, ImageDraw, ImageChops

EMERALD = (6, 78, 59)  # emerald-900
TEAL = (19, 78, 74)  # teal-900
WHITE = (255, 255, 255)

OUT_DIR = "/Users/vikranthreddybollam/Projects/diet-tracker/public/icons"


def gradient_square(size, corner_radius_pct=0.0):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * (size - 1))
            r = round(EMERALD[0] + (TEAL[0] - EMERALD[0]) * t)
            g = round(EMERALD[1] + (TEAL[1] - EMERALD[1]) * t)
            b = round(EMERALD[2] + (TEAL[2] - EMERALD[2]) * t)
            px[x, y] = (r, g, b, 255)

    if corner_radius_pct > 0:
        mask = Image.new("L", (size, size), 0)
        mdraw = ImageDraw.Draw(mask)
        radius = int(size * corner_radius_pct)
        mdraw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
        img.putalpha(mask)

    return img


def build_leaf_glyph():
    """Builds a white leaf glyph (vesica-piscis + vein) on a tightly-cropped transparent canvas."""
    work = 800
    r = 260
    cx, cy = work // 2, work // 2
    offset = 150

    mask_a = Image.new("L", (work, work), 0)
    ImageDraw.Draw(mask_a).ellipse([cx - offset - r, cy - r, cx - offset + r, cy + r], fill=255)
    mask_b = Image.new("L", (work, work), 0)
    ImageDraw.Draw(mask_b).ellipse([cx + offset - r, cy - r, cx + offset + r, cy + r], fill=255)
    lens = ImageChops.darker(mask_a, mask_b)

    glyph = Image.new("RGBA", (work, work), (0, 0, 0, 0))
    glyph.paste(Image.new("RGBA", (work, work), WHITE + (255,)), (0, 0), lens)
    glyph = glyph.rotate(45, resample=Image.BICUBIC, expand=True)

    bbox = glyph.getbbox()
    glyph = glyph.crop(bbox)

    # Vein along the long axis.
    w, h = glyph.size
    vein = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vein)
    vd.line([(w * 0.08, h * 0.92), (w * 0.92, h * 0.08)], fill=EMERALD, width=max(2, w // 45))
    glyph.alpha_composite(vein)

    return glyph


def make_icon(size, corner_radius_pct, filename, leaf_scale=0.62):
    img = gradient_square(size, corner_radius_pct)
    glyph = build_leaf_glyph()

    target_w = int(size * leaf_scale)
    scale = target_w / glyph.width
    glyph = glyph.resize((target_w, max(1, round(glyph.height * scale))), Image.LANCZOS)

    paste_x = (size - glyph.width) // 2
    paste_y = (size - glyph.height) // 2
    img.alpha_composite(glyph, (paste_x, paste_y))

    img.save(f"{OUT_DIR}/{filename}")
    print(f"wrote {filename} ({size}x{size})")


make_icon(192, corner_radius_pct=0.22, filename="icon-192.png")
make_icon(512, corner_radius_pct=0.22, filename="icon-512.png")
make_icon(512, corner_radius_pct=0.0, filename="icon-maskable-512.png", leaf_scale=0.46)
make_icon(180, corner_radius_pct=0.0, filename="apple-touch-icon.png")
make_icon(32, corner_radius_pct=0.28, filename="favicon-32.png", leaf_scale=0.66)
