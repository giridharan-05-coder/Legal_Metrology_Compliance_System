from PIL import Image, ImageDraw, ImageFont
import os

dir_path = "D:/Legal_Metrology_Compliance_System/test_images"
os.makedirs(dir_path, exist_ok=True)

def get_font(size, bold=False):
    paths = [
        f"C:/Windows/Fonts/{'arialbd' if bold else 'arial'}.ttf",
        f"C:/Windows/Fonts/{'calibrib' if bold else 'calibri'}.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def make_label(filename, title, subtitle, lines, bg=(245,245,250), accent=(10,40,120)):
    W, H = 900, 1300
    img = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(img)

    # Header band
    draw.rectangle([0, 0, W, 120], fill=accent)
    draw.text((W//2, 30), title, font=get_font(46, bold=True), fill=(255,255,255), anchor="mt")
    draw.text((W//2, 85), subtitle, font=get_font(22), fill=(200,220,255), anchor="mt")

    # Border
    draw.rectangle([8, 128, W-8, H-8], outline=accent, width=3)

    y = 148
    for item in lines:
        if item.get("sep"):
            draw.line([(30, y+4), (W-30, y+4)], fill=(180,180,200), width=1)
            y += 20
            continue
        text = item.get("text", "")
        size = item.get("size", 22)
        bold = item.get("bold", False)
        color = item.get("color", (30, 30, 30))
        center = item.get("center", False)
        font = get_font(size, bold)
        if center:
            bbox = draw.textbbox((0, 0), text, font=font)
            tw = bbox[2] - bbox[0]
            draw.text(((W - tw) // 2, y), text, font=font, fill=color)
        else:
            draw.text((36, y), text, font=font, fill=color)
        y += size + 14

    img.save(os.path.join(dir_path, filename), "JPEG", quality=95)
    print(f"Created: {filename} ({W}x{H})")

# ── LABEL 1: Britannia Good Day – FULLY COMPLIANT ──────────────────────────
make_label(
    "1_britannia_cookies_COMPLIANT.jpg",
    "BRITANNIA GOOD DAY",
    "Butter Cookies",
    [
        {"text": "Net Wt.: 250 g", "size": 34, "bold": True},
        {"sep": True},
        {"text": "MRP: Rs. 35.00 (Incl. of all taxes)", "size": 36, "bold": True, "color": (180,0,0)},
        {"sep": True},
        {"text": "Manufactured By:", "size": 22, "bold": True},
        {"text": "Britannia Industries Ltd.,", "size": 22},
        {"text": "5/1A, Hungerford Street, Kolkata - 700017,", "size": 20, "color": (60,60,60)},
        {"text": "West Bengal, India", "size": 20, "color": (60,60,60)},
        {"sep": True},
        {"text": "Mfg. Date: 08/2025", "size": 24},
        {"text": "Best Before: 6 months from Mfg. Date", "size": 20, "color": (80,80,80)},
        {"sep": True},
        {"text": "Consumer Care:", "size": 22, "bold": True},
        {"text": "1800-103-1703 (Toll Free)", "size": 22, "color": (0,80,160)},
        {"text": "care@britannia.co.in", "size": 22, "color": (0,80,160)},
        {"sep": True},
        {"text": "FSSAI Lic. No.: 10013022002823", "size": 24, "bold": True},
        {"sep": True},
        {"text": "INGREDIENTS: Refined Wheat Flour (Maida),", "size": 18, "color": (60,60,60)},
        {"text": "Sugar, Edible Vegetable Oil, Butter (1.5%),", "size": 18, "color": (60,60,60)},
        {"text": "Invert Syrup, Salt, Raising Agents (503(i)).", "size": 18, "color": (60,60,60)},
    ],
    accent=(160,0,0)
)

# ── LABEL 2: Rajah Spices – NON-COMPLIANT (Missing MRP, FSSAI, customer care) ─
make_label(
    "2_rajah_masala_NONCOMPLIANT.jpg",
    "RAJAH PREMIUM SPICES",
    "Garam Masala Powder",
    [
        {"text": "Net Weight: 100 Gm", "size": 30, "bold": True},
        {"sep": True},
        # NO MRP - violation
        {"text": "Price: As per Market Rate", "size": 22, "color": (150,150,150)},
        {"sep": True},
        {"text": "Packed By:", "size": 22, "bold": True},
        {"text": "Rajah Foods Pvt. Ltd., Khari Baoli, Delhi", "size": 22},
        # address incomplete - no pincode
        {"sep": True},
        {"text": "Packed Date: 05-2025", "size": 22},
        {"sep": True},
        # NO customer care - violation
        {"text": "Website: www.rajahspices.com", "size": 20, "color": (0,80,160)},
        # NO FSSAI - violation
        {"sep": True},
        {"text": "INGREDIENTS: Coriander, Cumin, Black Pepper,", "size": 18, "color": (60,60,60)},
        {"text": "Cardamom, Cloves, Cinnamon, Red Chilli.", "size": 18, "color": (60,60,60)},
        {"sep": True},
        {"text": "** VIOLATIONS: MRP missing, FSSAI absent, **", "size": 18, "color": (200,0,0), "bold": True},
        {"text": "** Customer care details not provided      **", "size": 18, "color": (200,0,0), "bold": True},
    ],
    bg=(255,248,240), accent=(160,80,0)
)

# ── LABEL 3: Dove Shampoo – FULLY COMPLIANT ──────────────────────────────────
make_label(
    "3_dove_shampoo_COMPLIANT.jpg",
    "DOVE",
    "Intense Repair Shampoo",
    [
        {"text": "Net Content: 340 ml", "size": 32, "bold": True},
        {"sep": True},
        {"text": "MRP: Rs. 285.00", "size": 38, "bold": True, "color": (0,100,0)},
        {"text": "(Incl. of all taxes)  Non-Returnable", "size": 18, "color": (100,100,100)},
        {"sep": True},
        {"text": "Marketed By:", "size": 22, "bold": True},
        {"text": "Hindustan Unilever Limited,", "size": 22},
        {"text": "Unilever House, B.D. Sawant Marg, Chakala,", "size": 20, "color": (60,60,60)},
        {"text": "Andheri (E), Mumbai - 400099", "size": 20, "color": (60,60,60)},
        {"sep": True},
        {"text": "Mfg. Date: JUL 2025", "size": 24},
        {"text": "Best Before: 30 months from Mfg. Date", "size": 20, "color": (80,80,80)},
        {"sep": True},
        {"text": "Consumer Care: 1800-22-5247", "size": 24, "bold": True, "color": (0,80,160)},
        {"text": "contacthul@unilever.com", "size": 22, "color": (0,80,160)},
        {"sep": True},
        {"text": "FSSAI Lic. No.: 10016011002715", "size": 24, "bold": True},
        {"sep": True},
        {"text": "Country of Origin: India", "size": 20},
    ],
    accent=(0,60,140)
)

print("\nAll 3 test label images created in D:/Legal_Metrology_Compliance_System/test_images/")
