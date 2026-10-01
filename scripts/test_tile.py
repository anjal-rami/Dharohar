import requests
from PIL import Image
from io import BytesIO
import sys

PANO_ID = "CAoSK0FGMVFpcE1KcU5vSm9jTXBLNVl4clA4S2s1UXhUbkd3UGR1MmZ2dGFzVEk."

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://www.google.com/",
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
}

# Test multiple known tile endpoint formats
endpoints = [
    # Format 1: lh3 / photosphere CDN
    f"https://lh3.googleusercontent.com/p/{PANO_ID}=w2048",
    # Format 2: geo0 CDN used for photospheres
    f"https://geo0.ggpht.com/cbk?panoid={PANO_ID}&output=tile&x=0&y=0&zoom=3",
    # Format 3: maps.googleapis tiles (old)
    f"https://maps.googleapis.com/maps/api/streetview?size=640x640&pano={PANO_ID}&fov=90&key=",
    # Format 4: geo3 CDN
    f"https://geo3.ggpht.com/cbk?panoid={PANO_ID}&output=tile&x=0&y=0&zoom=3",
    # Format 5: streetviewpixels
    f"https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=maps_sv.tactile&panoid={PANO_ID}&x=0&y=0&zoom=3&nbt=1",
    # Format 6: maps photo
    f"https://maps.google.com/cbk?output=tile&panoid={PANO_ID}&zoom=3&x=0&y=0",
]

for url in endpoints:
    try:
        r = requests.get(url, headers=headers, timeout=10)
        ct = r.headers.get("Content-Type", "?")
        ok = "IMAGE" if "image" in ct.lower() else "text/json"
        print(f"[{r.status_code}] {ok} {len(r.content)}B  {url[:80]}")
    except Exception as e:
        print(f"[ERR] {str(e)[:60]}  {url[:80]}")
