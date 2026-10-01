"""
Alternative 2: Mapillary API v4
Free street-level imagery platform. Search near Brihadisvara Temple coords.
Requires free account token (or we use public demo endpoint).
"""
import requests, json, os

LAT = 10.782806
LON = 79.131833
RADIUS = 200  # metres
OUTDIR = r"C:\Users\Admin\Documents\India Heritage Trails\public\panoramas"

# Mapillary v4 API - search for images near coordinates (no key for basic search)
# Using the public tile endpoint approach
search_url = (
    f"https://graph.mapillary.com/images"
    f"?fields=id,thumb_2048_url,thumb_original_url,is_pano,captured_at,compass_angle"
    f"&bbox={LON-0.002},{LAT-0.002},{LON+0.002},{LAT+0.002}"
    f"&is_pano=true&limit=5"
)

print("Querying Mapillary v4 API...")
r = requests.get(search_url, timeout=15)
print(f"Status: {r.status_code}")
print(r.text[:500])
