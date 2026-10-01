# -*- coding: utf-8 -*-
"""
Inspect the raw response from streetview.get_panorama to find the correct
tile URL format, then stitch manually.
"""
import sys, os, inspect
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import streetview
from streetview import api

# The confirmed working pano IDs from search
PANO_IDS = [
    "ArUY9YHp5VbJ1E_1V3X9uQ",   # nearest to coords
    "om5WseWIRnlkv4tKrwpi3Q",
    "g7KoPTq7fk4oAOShONvUpw",
]

OUTDIR = r"C:\Users\Admin\Documents\India Heritage Trails\public\panoramas"

# ── Inspect what get_panorama does internally ─────────────────────────────────
print("Inspecting streetview.api module...")
print("  api functions:", [f for f in dir(api) if not f.startswith('_')])
print()

# Look at get_panorama source
try:
    src = inspect.getsource(streetview.get_panorama)
    print("get_panorama source:\n")
    print(src[:3000])
except Exception as e:
    print(f"Could not get source: {e}")
