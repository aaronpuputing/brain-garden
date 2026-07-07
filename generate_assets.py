#!/usr/bin/env python3
"""Agnes AI image generator for Brain Garden game assets.
Usage: python3 generate_assets.py [--resize WxH] [--format webp|png]
"""

import json, sys, os, time, argparse
import requests
from PIL import Image
from io import BytesIO

API_KEY = "sk-qfFCt5CUZV2EcySNSRYKOfIOSOIjxaLQj6VwhfKsRUl2QDYq"
BASE_URL = "https://apihub.agnes-ai.com/v1/images/generations"
MODEL = "agnes-image-2.1-flash"
OUT_DIR = "public/assets/images/generated"

os.makedirs(OUT_DIR, exist_ok=True)

def generate(prompt, filename, size="256x256"):
    """Generate and save an image. Returns path or None."""
    start = time.time()
    print(f"🎨 Generating {filename}...", end=" ", flush=True)
    
    try:
        resp = requests.post(
            BASE_URL,
            headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
            json={"model": MODEL, "prompt": prompt, "n": 1, "size": size},
            timeout=120
        )
        data = resp.json()
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return None
    
    if "error" in data:
        print(f"❌ {data['error'].get('message', data['error'])}")
        return None
    
    if "data" not in data or not data["data"]:
        print(f"❌ No data in response")
        return None
    
    url = data["data"][0].get("url", "")
    if not url:
        print(f"❌ No URL in response")
        return None
    
    # Download the image
    img_resp = requests.get(url, timeout=60)
    
    outpath = os.path.join(OUT_DIR, filename)
    with open(outpath, "wb") as f:
        f.write(img_resp.content)
    
    elapsed = time.time() - start
    size_kb = len(img_resp.content) / 1024
    print(f"✅ {size_kb:.0f}KB ({elapsed:.1f}s)")
    return outpath

def optimize(path, size=None, fmt="png"):
    """Resize and optimize image."""
    img = Image.open(path)
    if size:
        img = img.resize(size, Image.LANCZOS)
    
    if fmt == "webp":
        outpath = path.rsplit(".", 1)[0] + ".webp"
        img.save(outpath, "WEBP", quality=85)
        os.remove(path)
        return outpath
    else:
        img.save(path, optimize=True)
        return path

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--resize", default=None, help="Resize to WxH, e.g. 256x256")
    parser.add_argument("--format", default="png", choices=["png","webp"])
    args = parser.parse_args()
    
    size = None
    if args.resize:
        w, h = args.resize.split("x")
        size = (int(w), int(h))
    
    assets = [
        # FeedAnimals - Animals
        ("a cute orange cartoon cat with big round eyes and pink blush cheeks, flat vector childrens illustration, simple clean shapes, soft warm colors, full body playful pose standing on two legs, white background, no shadows, no text", "feed_cat.png"),
        ("a cute brown cartoon dog with floppy ears and big round eyes and a small tongue out, flat vector childrens illustration, simple clean shapes, soft warm colors, full body happy pose standing on two legs, white background, no shadows, no text", "feed_dog.png"),
        ("a cute white cartoon bunny with long pink ears, pink nose, big round eyes, flat vector childrens illustration, simple clean shapes, soft pastel colors, full body sitting pose, white background, no shadows, no text", "feed_bunny.png"),
        # FeedAnimals - Food
        ("a cute cartoon fish, flat vector childrens illustration, simple clean shape, orange and yellow scales, big round eye, white background, no shadows, no text", "feed_fish.png"),
        ("a cute cartoon dog bone, flat vector childrens illustration, simple clean shape, cream and light brown colors, white background, no shadows, no text", "feed_bone.png"),
        ("a cute cartoon carrot with green leafy top, flat vector childrens illustration, simple clean shape, bright orange body with green leaves, white background, no shadows, no text", "feed_carrot.png"),
        # Memory game - Fruits
        ("a cute cartoon red apple with a small green leaf on top, flat vector childrens illustration, simple clean shape, bright red color, white background, no shadows, no text", "memory_apple.png"),
        ("a cute cartoon yellow banana, flat vector childrens illustration, simple clean shape, bright yellow, white background, no shadows, no text", "memory_banana.png"),
        ("a cute cartoon purple grape bunch with a small green stem, flat vector childrens illustration, simple clean shape, deep purple round grapes, white background, no shadows, no text", "memory_grape.png"),
        ("a cute cartoon red strawberry with green leafy top, flat vector childrens illustration, simple clean shape, bright red with small seeds, white background, no shadows, no text", "memory_strawberry.png"),
        # Gardener
        ("a cute cartoon brown seed, flat vector childrens illustration, simple small round shape, dark brown, white background, no shadows, no text", "gardener_seed.png"),
        ("a cute cartoon green sprout with two small round leaves emerging from brown soil, flat vector childrens illustration, simple shape, bright green, white background, no shadows, no text", "gardener_sprout.png"),
        ("a cute cartoon blue watering can with a spout and handle, flat vector childrens illustration, simple shape, light blue with water droplets, white background, no shadows, no text", "gardener_watering_can.png"),
    ]
    
    total = len(assets)
    for i, (prompt, filename) in enumerate(assets):
        print(f"[{i+1}/{total}]", end=" ")
        path = generate(prompt, filename)
        if path and (size or args.format != "png"):
            path = optimize(path, size, args.format)
        if i < total - 1:
            time.sleep(2)  # Rate limit buffer
    
    print(f"\n🎉 Done! {total} assets saved to {OUT_DIR}")

