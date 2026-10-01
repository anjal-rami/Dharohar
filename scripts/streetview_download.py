# -*- coding: utf-8 -*-
"""
Test tile URLs with real pano IDs found by search_panoramas,
then download the panorama directly.
"""
import sys, os, requests, time
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from PIL import Image
from io import BytesIO

OUTDIR = r"C:\Users\Admin\Documents\India Heritage Trails\public\panoramas"

# Real pano IDs found by streetview.search_panoramas near Brihadisvara Temple
PANO_IDS = [
    "ArUY9YHp5VbJ1E_1V3X9uQ",
    "om5WseWIRnlkv4tKrwpi3Q",
    "g7KoPTq7fk4oAOShONvUpw",
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.google.com/maps/",
    "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    "sec-fetch-dest": "image",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "cross-site",
}

def try_tile_url(pano_id, zoom, x, y):
    """Try multiple tile URL formats."""
    urls = [
        f"https://streetviewpixels-pa.googleapis.com/v1/tile?panoid={pano_id}&x={x}&y={y}&zoom={zoom}&nbt=1&fover=2",
        f"https://streetviewpixels-pa.googleapis.com/v1/tile?panoid={pano_id}&x={x}&y={y}&zoom={zoom}",
        f"https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{zoom}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i{pano_id}!3m14!2sen!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!4e0",
    ]
    for url in urls:
        try:
            r = requests.get(url, headers=HEADERS, timeout=10)
            ct = r.headers.get("Content-Type", "")
            if r.status_code == 200 and "image" in ct:
                return r.content, url
            elif r.status_code == 200:
                # might still be image with wrong content-type
                try:
                    Image.open(BytesIO(r.content))
                    return r.content, url
                except:
                    pass
        except Exception as e:
            pass
    return None, None

print("Testing tile URLs with real pano IDs...")
print()

working_pano = None
working_url_template = None

for pano_id in PANO_IDS:
    print(f"Pano: {pano_id}")
    data, url = try_tile_url(pano_id, zoom=2, x=0, y=0)
    if data:
        try:
            img = Image.open(BytesIO(data))
            print(f"  [WORKS] {img.size} via {url[:70]}")
            working_pano = pano_id
            break
        except Exception as e:
            print(f"  [DATA but not image] status data={len(data)}B err={e}")
    else:
        # Show what we got
        for url_fmt in [
            f"https://streetviewpixels-pa.googleapis.com/v1/tile?panoid={pano_id}&x=0&y=0&zoom=2&nbt=1&fover=2",
        ]:
            try:
                r = requests.get(url_fmt, headers=HEADERS, timeout=10)
                ct = r.headers.get("Content-Type","?")
                print(f"  [{r.status_code}] {ct[:40]} {len(r.content)}B : {url_fmt[:65]}")
                if r.status_code == 200:
                    print(f"  Preview: {r.content[:100]}")
            except Exception as e:
                print(f"  [ERR] {str(e)[:60]}")
    print()

if working_pano:
    print(f"\nDownloading full panorama for pano_id={working_pano} at zoom=3...")
    ZOOM = 3
    COLS = 2**ZOOM
    ROWS = 2**(ZOOM-1)
    TILE_W, TILE_H = 512, 512
    canvas = Image.new("RGB", (COLS*TILE_W, ROWS*TILE_H))
    ok, fail = 0, 0
    for y in range(ROWS):
        for x in range(COLS):
            data, url = try_tile_url(working_pano, ZOOM, x, y)
            if data:
                try:
                    tile = Image.open(BytesIO(data)).convert("RGB")
                    canvas.paste(tile, (x*TILE_W, y*TILE_H))
                    ok += 1
                except:
                    fail += 1
            else:
                fail += 1
            time.sleep(0.05)
        print(f"  Row {y+1}/{ROWS} done (ok={ok} fail={fail})")

    out_path = os.path.join(OUTDIR, "brihadisvara_streetview_real.jpg")
    canvas.save(out_path, "JPEG", quality=90)
    size = os.path.getsize(out_path)
    print(f"\nSaved {size/1024:.0f} KB -> {out_path}")
    print(f"Coverage: {ok}/{COLS*ROWS} tiles ({100*ok//(COLS*ROWS)}%)")
else:
    print("\nNo working tile URL found. Tile APIs require auth.")
    print("The existing AI-generated panorama and pre-existing 6MB pano are available.")
