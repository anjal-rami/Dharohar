"""
Alternative 1: Wikimedia Commons API
Search for equirectangular panoramas of Brihadisvara Temple (free, public domain)
"""
import requests
import os
from urllib.parse import urlencode

BASE = "https://commons.wikimedia.org/w/api.php"
OUTDIR = r"C:\Users\Admin\Documents\India Heritage Trails\public\panoramas"

def search_wikimedia(query, limit=10):
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "srnamespace": 6,   # File namespace
        "srlimit": limit,
        "format": "json",
    }
    r = requests.get(BASE, params=params, timeout=10)
    return r.json().get("query", {}).get("search", [])

def get_file_url(title):
    params = {
        "action": "query",
        "titles": title,
        "prop": "imageinfo",
        "iiprop": "url|size|mime",
        "format": "json",
    }
    r = requests.get(BASE, params=params, timeout=10)
    pages = r.json().get("query", {}).get("pages", {})
    for page in pages.values():
        info = page.get("imageinfo", [{}])[0]
        return info.get("url"), info.get("width"), info.get("height"), info.get("mime")
    return None, None, None, None

def download_file(url, dest):
    headers = {"User-Agent": "DharoharHeritagePlatform/1.0 (education@dharohar.in)"}
    r = requests.get(url, headers=headers, stream=True, timeout=60)
    r.raise_for_status()
    with open(dest, "wb") as f:
        for chunk in r.iter_content(65536):
            f.write(chunk)
    return os.path.getsize(dest)

# Try several search queries
queries = [
    "Brihadisvara Temple panorama equirectangular",
    "Brihadeeswarar Temple Thanjavur panorama",
    "Brihadeeswara Temple 360",
    "Thanjavur Temple interior panorama",
    "Big Temple Thanjavur equirectangular",
]

candidates = []
for q in queries:
    results = search_wikimedia(q)
    for r in results:
        title = r["title"]
        if any(kw in title.lower() for kw in ["briha", "thanjavur", "tanjore", "big temple"]):
            candidates.append(title)

# Also directly try known Wikimedia files
known_files = [
    "File:Brihadeeswara Temple, Thanjavur.jpg",
    "File:Brihadisvara Temple panorama.jpg",
    "File:Brihadeeswarar Temple Thanjavur panorama.jpg",
    "File:Thanjavur Big Temple Panoramic.jpg",
    "File:Big temple thanjavur.jpg",
]
candidates.extend(known_files)
candidates = list(dict.fromkeys(candidates))  # deduplicate

print(f"Found {len(candidates)} candidates:")
for c in candidates:
    print(" -", c)
    url, w, h, mime = get_file_url(c)
    if url and w and h:
        ratio = w / h if h else 0
        print(f"   {w}x{h} ratio={ratio:.2f} mime={mime} url={url[:80]}")
        # Equirectangular panoramas are 2:1 ratio, very wide
        if ratio >= 1.8 and w >= 2000:
            print(f"   ✅ PANORAMA CANDIDATE! Downloading...")
            dest = os.path.join(OUTDIR, "brihadisvara_wiki_pano.jpg")
            try:
                size = download_file(url, dest)
                print(f"   Saved {size/1024:.0f} KB to {dest}")
                break
            except Exception as e:
                print(f"   Download failed: {e}")
    else:
        print("   (file not found or no imageinfo)")

print("Done.")
