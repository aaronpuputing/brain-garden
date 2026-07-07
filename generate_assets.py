#!/usr/bin/env python3
"""Agnes AI image generator for Brain Garden - ALL 7 games.
Usage: python3 generate_assets.py [--skip-existing]
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
    start = time.time()
    print("  Generating {}...".format(filename), end=" ", flush=True)
    try:
        resp = requests.post(
            BASE_URL,
            headers={"Authorization": "Bearer " + API_KEY, "Content-Type": "application/json"},
            json={"model": MODEL, "prompt": prompt, "n": 1, "size": size},
            timeout=120
        )
        data = resp.json()
    except Exception as e:
        print("FAIL request: {}".format(e))
        return None

    if "error" in data:
        print("FAIL {}".format(data["error"].get("message", str(data["error"]))))
        return None

    if "data" not in data or not data["data"]:
        print("FAIL no data")
        return None

    url = data["data"][0].get("url", "")
    if not url:
        print("FAIL no URL")
        return None

    img_resp = requests.get(url, timeout=60)
    outpath = os.path.join(OUT_DIR, filename)
    with open(outpath, "wb") as f:
        f.write(img_resp.content)

    elapsed = time.time() - start
    size_kb = len(img_resp.content) / 1024
    print("OK {}KB ({:.1f}s)".format(size_kb, elapsed))
    return outpath

def optimize(path, size=None, fmt="png"):
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
    parser.add_argument("--skip-existing", action="store_true", help="Skip already generated assets")
    args = parser.parse_args()

    size = None
    if args.resize:
        w, h = args.resize.split("x")
        size = (int(w), int(h))

    assets = [
        # ===== FeedAnimals (6) =====
        ("a cute orange cartoon cat with big round eyes and pink blush cheeks, flat vector childrens illustration, simple clean shapes, soft warm colors, full body playful pose standing on two legs, white background, no shadows, no text", "feed_cat.png"),
        ("a cute brown cartoon dog with floppy ears and big round eyes and a small tongue out, flat vector childrens illustration, simple clean shapes, soft warm colors, full body happy pose standing on two legs, white background, no shadows, no text", "feed_dog.png"),
        ("a cute white cartoon bunny with long pink ears, pink nose, big round eyes, flat vector childrens illustration, simple clean shapes, soft pastel colors, full body sitting pose, white background, no shadows, no text", "feed_bunny.png"),
        ("a cute cartoon fish, flat vector childrens illustration, simple clean shape, orange and yellow scales, big round eye, white background, no shadows, no text", "feed_fish.png"),
        ("a cute cartoon dog bone, flat vector childrens illustration, simple clean shape, cream and light brown colors, white background, no shadows, no text", "feed_bone.png"),
        ("a cute cartoon carrot with green leafy top, flat vector childrens illustration, simple clean shape, bright orange body with green leaves, white background, no shadows, no text", "feed_carrot.png"),
        # ===== Memory (4) =====
        ("a cute cartoon red apple with a small green leaf on top, flat vector childrens illustration, simple clean shape, bright red color, white background, no shadows, no text", "mem_apple.png"),
        ("a cute cartoon yellow banana, flat vector childrens illustration, simple clean shape, bright yellow, white background, no shadows, no text", "mem_banana.png"),
        ("a cute cartoon purple grape bunch with a small green stem, flat vector childrens illustration, simple clean shape, deep purple round grapes, white background, no shadows, no text", "mem_grape.png"),
        ("a cute cartoon red strawberry with green leafy top, flat vector childrens illustration, simple clean shape, bright red with small seeds, white background, no shadows, no text", "mem_strawberry.png"),
        # ===== Gardener (3) =====
        ("a cute cartoon brown seed, flat vector childrens illustration, simple small round shape, dark brown, white background, no shadows, no text", "gardener_seed.png"),
        ("a cute cartoon green sprout with two small round leaves emerging from brown soil, flat vector childrens illustration, simple shape, bright green, white background, no shadows, no text", "gardener_sprout.png"),
        ("a cute cartoon blue watering can with a spout and handle, flat vector childrens illustration, simple shape, light blue with water droplets, white background, no shadows, no text", "gardener_watering_can.png"),
        # ===== BearSort items (5) =====
        ("a cute cartoon blue bowl, flat vector childrens illustration, simple clean shape, light blue ceramic, white background, no shadows, no text", "bearsort_bowl.png"),
        ("a cute cartoon bed with wooden frame and blue blanket, flat vector childrens illustration, simple clean shape, white background, no shadows, no text", "bearsort_bed.png"),
        ("a cute cartoon wooden chair, flat vector childrens illustration, simple clean shape, brown wood, white background, no shadows, no text", "bearsort_chair.png"),
        ("a cute cartoon red coat jacket, flat vector childrens illustration, simple clean shape, bright red with white buttons, white background, no shadows, no text", "bearsort_coat.png"),
        ("a cute cartoon green backpack school bag, flat vector childrens illustration, simple clean shape, bright green with yellow zipper, white background, no shadows, no text", "bearsort_backpack.png"),
        # ===== ColorTrain (7) =====
        ("a cute cartoon red train carriage car, flat vector childrens illustration, simple clean shape, bright red, white background, no shadows, no text", "train_red.png"),
        ("a cute cartoon blue train carriage car, flat vector childrens illustration, simple clean shape, bright blue, white background, no shadows, no text", "train_blue.png"),
        ("a cute cartoon green train carriage car, flat vector childrens illustration, simple clean shape, bright green, white background, no shadows, no text", "train_green.png"),
        ("a cute cartoon yellow train carriage car, flat vector childrens illustration, simple clean shape, bright yellow, white background, no shadows, no text", "train_yellow.png"),
        ("a cute cartoon orange train carriage car, flat vector childrens illustration, simple clean shape, bright orange, white background, no shadows, no text", "train_orange.png"),
        ("a cute cartoon purple train carriage car, flat vector childrens illustration, simple clean shape, bright purple, white background, no shadows, no text", "train_purple.png"),
        ("a cute cartoon steam train locomotive engine, flat vector childrens illustration, simple clean shape, bright red with gold accents, white background, no shadows, no text", "train_engine.png"),
        # ===== Puzzle (4) =====
        ("a cute cartoon orange cat face, simple flat vector childrens illustration, big round eyes, pink nose, whiskers, white background, no shadows, no text", "puzzle_cat.png"),
        ("a cute cartoon brown dog face, simple flat vector childrens illustration, big round eyes, floppy ears, tongue out, white background, no shadows, no text", "puzzle_dog.png"),
        ("a cute cartoon white bunny face, simple flat vector childrens illustration, big round eyes, long pink ears, pink nose, white background, no shadows, no text", "puzzle_bunny.png"),
        ("a cute cartoon fish, simple flat vector childrens illustration, orange scales, big round eye, white background, no shadows, no text", "puzzle_fish.png"),
        # ===== OddOut (6) =====
        ("a cute cartoon red apple, flat vector childrens illustration, simple shape, bright red with green leaf, white background, no shadows, no text", "oddout_apple.png"),
        ("a cute cartoon yellow banana, flat vector childrens illustration, simple shape, bright yellow, white background, no shadows, no text", "oddout_banana.png"),
        ("a cute cartoon orange carrot with green leafy top, flat vector childrens illustration, simple shape, white background, no shadows, no text", "oddout_carrot.png"),
        ("a cute cartoon fish with orange scales, flat vector childrens illustration, simple shape, white background, no shadows, no text", "oddout_fish.png"),
        ("a cute cartoon green tree with a brown trunk, flat vector childrens illustration, simple shape, white background, no shadows, no text", "oddout_tree.png"),
        ("a cute cartoon yellow flower with five petals, flat vector childrens illustration, simple shape, white background, no shadows, no text", "oddout_flower.png"),
        # ===== Misc (3) =====
        ("a cute cartoon brown bear face, simple flat vector childrens illustration, big round eyes, small round ears, happy smile, white background, no shadows, no text", "bear_face.png"),
        ("a cute cartoon playing card back with colorful question mark pattern, flat vector childrens illustration, simple clean shape, rainbow colors, white background, no shadows, no text", "card_back.png"),
        ("a cute cartoon pink flower with five petals and yellow center, flat vector childrens illustration, simple clean shape, bright pink, white background, no shadows, no text", "menu_flower.png"),
    ]

    total = len(assets)
    print("Total assets: {}".format(total))
    count = 0

    for i, (prompt, filename) in enumerate(assets):
        outpath = os.path.join(OUT_DIR, filename)
        if args.skip_existing and os.path.exists(outpath):
            print("[{}/{}] SKIP {} (exists)".format(i+1, total, filename))
            continue
        print("[{}/{}]".format(i+1, total), end=" ")
        path = generate(prompt, filename, "256x256")
        if path and (size or args.format != "png"):
            path = optimize(path, size, args.format)
        if path:
            count += 1
        if i < total - 1:
            time.sleep(1.5)

    print("\nDone! {} new assets generated, total {} in {}".format(count, len(os.listdir(OUT_DIR)), OUT_DIR))

