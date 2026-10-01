import os
import shutil
import urllib.request

target_dir = os.path.join("public", "images", "arts")
os.makedirs(target_dir, exist_ok=True)

culture_dir = os.path.join("public", "images", "culture")

copy_map = {
    "kathakali_kerala.jpg": "dance_kathakali_kerala.jpg",
    "bharatanatyam_tamilnadu.jpg": "dance_bharatanatyam_tamilnadu.jpg",
    "garba_dance_gujarat.jpg": "dance_garba_gujarat.jpg",
    "bhangra_punjab.jpg": "dance_bhangra_punjab.jpg",
    "ghoomar_rajasthan.jpg": "dance_ghoomar_rajasthan.jpg",
    "odissi_odisha.jpg": "dance_odissi_odisha.jpg",
    "kathak_up.jpg": "dance_kathak_up.jpg",
    "yakshagana_karnataka.jpg": "dance_yakshagana_karnataka.jpg",
    "manipuri_raas_manipur.jpg": "dance_manipuri.jpg",
    "sattriya_assam.jpg": "dance_sattriya_assam.jpg",
    "pandavani_chhattisgarh.jpg": "dance_pandavani_chhattisgarh.jpg",
}

for dest_name, src_name in copy_map.items():
    src_path = os.path.join(culture_dir, src_name)
    dest_path = os.path.join(target_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dest_path)
        print(f"✓ Copied {src_name} -> {dest_name} ({os.path.getsize(dest_path)} bytes)")
    else:
        print(f"✗ Source not found: {src_path}")

# Download Chhau dance
chhau_dest = os.path.join(target_dir, "chhau_dance_east.jpg")
if not os.path.exists(chhau_dest) or os.path.getsize(chhau_dest) < 1000:
    chhau_url = "https://upload.wikimedia.org/wikipedia/commons/d/d5/Chhau_dance.jpg"
    headers = {"User-Agent": "DharoharHeritageApp/1.0 (sih2026_demo@heritage.gov.in; Python Urllib)"}
    req = urllib.request.Request(chhau_url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp, open(chhau_dest, "wb") as out_f:
            shutil.copyfileobj(resp, out_f)
        print(f"✓ Downloaded chhau_dance_east.jpg ({os.path.getsize(chhau_dest)} bytes)")
    except Exception as e:
        print(f"Failed to download chhau dance: {e}")
        # fallback to one of the rich dance images if network fails
        shutil.copy2(os.path.join(target_dir, "kathakali_kerala.jpg"), chhau_dest)
        print("✓ Fallback copied to chhau_dance_east.jpg")

print(f"Total files in {target_dir}: {len(os.listdir(target_dir))}")
