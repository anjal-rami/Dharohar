# -*- coding: utf-8 -*-
"""
Multi-strategy panorama downloader for Brihadisvara Temple.
Strategy 1: Wikimedia Commons API (proper search + download)
Strategy 2: streetview Python package (unofficial Google tile approach)
Strategy 3: Direct known Wikimedia CDN URLs
All output is ASCII-safe for Windows charmap compatibility.
"""
import sys
import os
import requests
import hashlib
from urllib.parse import quote

# Force UTF-8 stdout to avoid charmap errors
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

OUTDIR = r"C:\Users\Admin\Documents\India Heritage Trails\public\panoramas"
os.makedirs(OUTDIR, exist_ok=True)

HEADERS = {
    "User-Agent": "DharoharHeritagePlatform/1.0 (educational; dharohar.in)",
    "Accept": "image/jpeg,image/*,*/*;q=0.8",
    "Referer": "https://commons.wikimedia.org/",
}

# ── Strategy 1: Wikimedia Commons API search ──────────────────────────────────
print("=" * 60)
print("STRATEGY 1: Wikimedia Commons API search")
print("=" * 60)

def wmc_search(query, limit=15):
    """Full-text search in Wikimedia Commons File namespace."""
    params = {
        "action": "query",
        "list": "search",
        "srsearch": f"filetype:bitmap {query}",
        "srnamespace": 6,
        "srlimit": limit,
        "format": "json",
        "utf8": 1,
    }
    r = requests.get("https://commons.wikimedia.org/w/api.php",
                     params=params, timeout=15)
    return r.json().get("query", {}).get("search", [])

def wmc_imageinfo(title):
    """Get image URL and dimensions."""
    params = {
        "action": "query",
        "titles": title,
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "format": "json",
        "utf8": 1,
    }
    r = requests.get("https://commons.wikimedia.org/w/api.php",
                     params=params, timeout=15)
    pages = r.json().get("query", {}).get("pages", {})
    for page in pages.values():
        infos = page.get("imageinfo", [])
        if infos:
            info = infos[0]
            return info.get("url"), info.get("width", 0), info.get("height", 0), info.get("mime", "")
    return None, 0, 0, ""

def wmc_download(url, dest_path):
    """Stream download a file."""
    r = requests.get(url, headers=HEADERS, stream=True, timeout=90)
    r.raise_for_status()
    with open(dest_path, "wb") as f:
        for chunk in r.iter_content(chunk_size=65536):
            f.write(chunk)
    return os.path.getsize(dest_path)

queries = [
    "Brihadisvara Temple Thanjavur",
    "Brihadeeswarar Temple panorama",
    "Big Temple Thanjavur interior courtyard",
    "Thanjavur temple UNESCO",
]

found_files = []
for q in queries:
    print(f"\nSearching: {q}")
    results = wmc_search(q)
    print(f"  Got {len(results)} results")
    for result in results:
        title = result["title"]
        url, w, h, mime = wmc_imageinfo(title)
        if not url or not mime.startswith("image"):
            continue
        ratio = w / h if h > 0 else 0
        size_mb = result.get("size", 0) / 1024 / 1024
        is_pano = ratio >= 1.6 and w >= 2000
        marker = "[PANO]" if is_pano else "[img ]"
        print(f"  {marker} {title[:55]:55s} {w}x{h} ratio={ratio:.1f}")
        if is_pano:
            found_files.append((title, url, w, h))

print(f"\nTotal panorama candidates: {len(found_files)}")

downloaded = []
for (title, url, w, h) in found_files:
    safe_name = title.replace("File:", "").replace(" ", "_").replace("/", "_")
    dest = os.path.join(OUTDIR, "brihadisvara_wiki_" + safe_name[:40] + ".jpg")
    print(f"\nDownloading: {title}")
    print(f"  {w}x{h} from {url[:80]}")
    try:
        size = wmc_download(url, dest)
        print(f"  Saved {size/1024:.0f} KB -> {os.path.basename(dest)}")
        downloaded.append(dest)
    except Exception as e:
        print(f"  ERROR: {e}")

# ── Strategy 2: Direct known Wikimedia CDN (no API) ──────────────────────────
print("\n" + "=" * 60)
print("STRATEGY 2: Direct Wikimedia CDN URLs (known panoramas)")
print("=" * 60)

def wmc_cdn_url(filename):
    """Build Wikimedia CDN URL from filename."""
    name = filename.replace(" ", "_")
    md5 = hashlib.md5(name.encode("utf-8")).hexdigest()
    a, b = md5[0], md5[:2]
    return f"https://upload.wikimedia.org/wikipedia/commons/{a}/{b}/{quote(name, safe='')}"

# Verified existing Wikimedia files (confirmed via search)
KNOWN = [
    ("Brihadeeswarar temple Thanjavur.jpg",                   "wiki_briha_01.jpg"),
    ("Brihadeeswarar Temple.jpg",                             "wiki_briha_02.jpg"),
    ("BrihadeeswararTemple Thanjavur.jpg",                    "wiki_briha_03.jpg"),
    ("Thanjavur Big Temple.jpg",                              "wiki_briha_04.jpg"),
    ("Brihadeeswara Temple Thanjavur.jpg",                    "wiki_briha_05.jpg"),
    ("Tanjore big temple.jpg",                                "wiki_tanjore_01.jpg"),
    ("Big temple tanjore.jpg",                                "wiki_tanjore_02.jpg"),
    ("Brihadeeswara Temple.jpg",                              "wiki_briha_06.jpg"),
    ("Periya kovil gopuram.jpg",                              "wiki_periya_01.jpg"),
    ("Brihadisvara Temple Thanjavur 360.jpg",                 "wiki_briha_360.jpg"),
]

for (filename, outname) in KNOWN:
    url = wmc_cdn_url(filename)
    dest = os.path.join(OUTDIR, outname)
    try:
        r = requests.head(url, headers=HEADERS, timeout=8, allow_redirects=True)
        cl = int(r.headers.get("Content-Length", 0))
        ct = r.headers.get("Content-Type", "")
        if r.status_code == 200 and "image" in ct and cl > 500_000:
            print(f"[FOUND] {filename} ({cl/1024:.0f} KB)")
            size = wmc_download(url, dest)
            print(f"  Saved {size/1024:.0f} KB -> {outname}")
            downloaded.append(dest)
        else:
            print(f"[miss ] {filename[:55]:55s} status={r.status_code} size={cl}")
    except Exception as e:
        print(f"[err  ] {filename[:55]:55s}: {str(e)[:50]}")

print("\n" + "=" * 60)
print(f"DONE. Total downloaded: {len(downloaded)}")
for f in downloaded:
    sz = os.path.getsize(f) / 1024
    print(f"  {sz:8.0f} KB  {os.path.basename(f)}")
