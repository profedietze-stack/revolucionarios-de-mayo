"""
Genera iconos PWA para Revolucionarios de Mayo.
Sol de Mayo estilizado: fondo oscuro colonial, sol dorado con rayos alternados.
"""
import math
import struct
import zlib
from PIL import Image, ImageDraw

BG      = (28, 16, 9)       # #1c1009
GOLD    = (197, 154, 64)    # #c59a40
GOLD2   = (232, 201, 122)   # #e8c97a (highlight)
CREAM   = (240, 220, 170)   # cara del sol

def draw_sun(draw, cx, cy, r, rays=16):
    """Sol de Mayo: disco central + rayos alternados rectos/ondulados (simplificados como triangulos)."""
    # Rayos (alternar largo/corto)
    for i in range(rays):
        angle = math.radians(i * 360 / rays - 90)
        long_ray = i % 2 == 0
        r_inner = r * 0.55
        r_outer = r * (1.0 if long_ray else 0.82)
        w_half  = math.radians(360 / rays * 0.22)

        pts = [
            (cx + r_inner * math.cos(angle - w_half), cy + r_inner * math.sin(angle - w_half)),
            (cx + r_outer * math.cos(angle),           cy + r_outer * math.sin(angle)),
            (cx + r_inner * math.cos(angle + w_half), cy + r_inner * math.sin(angle + w_half)),
        ]
        draw.polygon(pts, fill=GOLD)

    # Disco central
    draw.ellipse([cx - r*0.52, cy - r*0.52, cx + r*0.52, cy + r*0.52], fill=GOLD)
    # Cara: ojos
    ey = cy - r * 0.06
    ex_off = r * 0.14
    erd = r * 0.055
    draw.ellipse([cx-ex_off-erd, ey-erd, cx-ex_off+erd, ey+erd], fill=BG)
    draw.ellipse([cx+ex_off-erd, ey-erd, cx+ex_off+erd, ey+erd], fill=BG)
    # Cara: nariz
    nd = r * 0.04
    draw.ellipse([cx-nd, cy+r*0.02-nd, cx+nd, cy+r*0.02+nd], fill=BG)
    # Cara: sonrisa (arco)
    sm = r * 0.18
    draw.arc([cx-sm, cy+r*0.04, cx+sm, cy+r*0.22], start=10, end=170, fill=BG, width=max(1, int(r*0.04)))

def make_icon(size, maskable=False):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    pad = size * 0.08 if maskable else 0
    # Fondo
    r_corner = size * 0.18
    draw.rounded_rectangle([pad, pad, size-pad, size-pad], radius=r_corner, fill=BG + (255,))

    # Borde dorado fino
    bw = max(1, int(size * 0.025))
    draw.rounded_rectangle(
        [pad + bw, pad + bw, size - pad - bw, size - pad - bw],
        radius=r_corner * 0.8,
        outline=GOLD + (200,),
        width=bw
    )

    cx = size / 2
    cy = size / 2
    # Ajuste vertical sutil: sol ligeramente arriba
    cy = size * 0.48
    sun_r = size * (0.33 if maskable else 0.36)
    draw_sun(draw, cx, cy, sun_r)

    return img

def save_png(img, path):
    img.save(path, 'PNG', optimize=True)
    print(f"  {path}")

# ── Favicon ICO (16, 32, 48) ──────────────────────────────────────────────────
def save_ico(path):
    sizes = [16, 32, 48]
    imgs = []
    for s in sizes:
        ico = make_icon(s)
        # ICO necesita RGB sin alpha para compat maxima, o RGBA
        imgs.append(ico.convert('RGBA'))
    imgs[0].save(path, format='ICO', sizes=[(s, s) for s in sizes],
                 append_images=imgs[1:])
    print(f"  {path}")

base = r"C:\Users\nicod\Documents\JuegosEducativos\Finalizados\Revolucionarios_De_Mayo\assets\icons"

import os
os.makedirs(base, exist_ok=True)

print("Generando iconos...")
save_png(make_icon(16),  f"{base}/favicon-16x16.png")
save_png(make_icon(32),  f"{base}/favicon-32x32.png")
save_png(make_icon(180), f"{base}/apple-touch-icon.png")
save_png(make_icon(192), f"{base}/icon-192.png")
save_png(make_icon(512), f"{base}/icon-512.png")
save_png(make_icon(512, maskable=True), f"{base}/icon-maskable-512.png")
save_ico(f"{base}/favicon.ico")
print("Listo.")
