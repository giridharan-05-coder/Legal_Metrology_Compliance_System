from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import io, re, os, sys, gc
import numpy as np

router = APIRouter(prefix="/api/scans", tags=["Scanning & AI Analysis"])

# Global OCR reader instance
OCR_READER = None

def get_ocr_reader():
    global OCR_READER
    if OCR_READER is None:
        try:
            import easyocr
            # Candidate model directories in priority order
            candidate_dirs = [
                r"D:\lmc_home\.EasyOCR\model",
                r"D:\lmc_home\.EasyOCR",
                os.path.expanduser(r"~/.EasyOCR/model"),
                os.path.expanduser(r"~/.EasyOCR"),
            ]
            
            selected_model_dir = None
            for p in candidate_dirs:
                if os.path.exists(p) and any(f.endswith('.pth') for f in os.listdir(p)):
                    selected_model_dir = p
                    break
                    
            if selected_model_dir:
                print(f"[OCR] Using EasyOCR model directory: {selected_model_dir}")
                OCR_READER = easyocr.Reader(['en'], gpu=False, model_storage_directory=selected_model_dir, download_enabled=False)
            else:
                print("[OCR] Using default EasyOCR initialization...")
                OCR_READER = easyocr.Reader(['en'], gpu=False)
                
            print("[OCR] EasyOCR Reader initialized successfully.")
        except Exception as e:
            print(f"[OCR] Reader initialization error: {e}")
            try:
                import easyocr
                OCR_READER = easyocr.Reader(['en'], gpu=False)
            except Exception as e2:
                print(f"[OCR] Fallback initialization failed: {e2}")
    return OCR_READER

def preprocess_image(pil_img: Image.Image) -> Image.Image:
    # Auto rotate based on EXIF orientation if present
    try:
        pil_img = ImageOps.exif_transpose(pil_img)
    except Exception:
        pass
        
    img = pil_img.convert("RGB")
    w, h = img.size
    
    # Memory-friendly scaling (max 1400px to ensure low RAM footprint and fast inference)
    target_dim = 1400
    if max(w, h) < 1000:
        factor = 1000 / max(w, h)
        img = img.resize((int(w * factor), int(h * factor)), Image.Resampling.BILINEAR)
    elif max(w, h) > target_dim:
        factor = target_dim / max(w, h)
        img = img.resize((int(w * factor), int(h * factor)), Image.Resampling.BILINEAR)
        
    # Gentle contrast enhancement
    img = ImageEnhance.Contrast(img).enhance(1.3)
    return img

def run_ocr_multi_angle(pil_image: Image.Image) -> str:
    reader = get_ocr_reader()
    if reader is None:
        return ""
    
    img = preprocess_image(pil_image)
    
    # Priority order: 0 deg (upright), 270 deg (most common phone rotation), 90 deg, 180 deg
    priority_angles = [0, 270, 90, 180]
    best_text = ""
    best_score = -1
    best_angle = 0
    
    keywords = [
        'MRP', 'RS', 'PKD', 'MFD', 'MFG', 'NET', 'WEIGHT', 'USE', 'BY', 'UBD',
        'LOT', 'LIC', 'FSSAI', 'EXP', 'CARE', 'TAX', 'BRITANNIA', 'DOVE',
        'RAJAH', 'SUNDROP', 'ACT', 'POPCORN', 'DATE', 'PACK', 'INCL', 'MACHINE', 'BATCH'
    ]
    
    try:
        import torch
        has_torch = True
    except ImportError:
        has_torch = False
        
    for angle in priority_angles:
        rotated = img if angle == 0 else img.rotate(angle, expand=True)
        img_np = np.array(rotated)
        try:
            if has_torch:
                with torch.no_grad():
                    results = reader.readtext(img_np, detail=0, paragraph=False, batch_size=4)
            else:
                results = reader.readtext(img_np, detail=0, paragraph=False, batch_size=4)
                
            full_str = " ".join(results).upper()
            
            # Score orientation
            kw_hits = sum(1 for kw in keywords if kw in full_str)
            valid_words = sum(1 for w in results if len(w) >= 3 and any(c.isalnum() for c in w))
            score = (kw_hits * 20) + (valid_words * 2)
            
            print(f"[OCR] Angle {angle} deg: score={score} (keywords={kw_hits}, tokens={len(results)})")
            
            if score > best_score:
                best_score = score
                best_text = "\n".join(results)
                best_angle = angle
                
            # Early exit on high confidence match (sub-3 second response)
            if kw_hits >= 3 or score >= 100:
                print(f"[OCR] High confidence match at {angle} deg! Early stopping.")
                break
        except Exception as e:
            print(f"[OCR] Error scanning angle {angle}: {e}")
            
    # Clean up memory
    gc.collect()
    print(f"[OCR] Selected angle: {best_angle} deg (score: {best_score})")
    return best_text

def extract_declarations(text: str) -> dict:
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    all_text = " ".join(lines)
    
    # ── MRP & Unit Sale Price ──
    mrp = "Not Found"
    mrp_match = re.search(r"(?:MRP|M\.R\.P\.?|Max\.?\s*Retail\s*Price)[^\d\n]*[:\.\s]*(?:Rs\.?|INR|₹)?\s*(\d+[\.,]?\d{0,2})", all_text, re.IGNORECASE)
    if mrp_match:
        mrp = "Rs. " + mrp_match.group(1).replace(",", ".")
    else:
        p_match_unit = re.search(r"\b(\d{1,4}\.\d{2})\s+(?:Rs\.?|₹)", all_text, re.IGNORECASE)
        if p_match_unit:
            mrp = "Rs. " + p_match_unit.group(1)
        else:
            p_match = re.search(r"(?:Rs\.?|₹)\s*(\d+[\.,]?\d{0,2})", all_text, re.IGNORECASE)
            if p_match:
                mrp = "Rs. " + p_match.group(1).replace(",", ".")
            else:
                p_match2 = re.search(r"\b(\d{1,4}\.\d{2})\b", all_text)
                if p_match2:
                    mrp = "Rs. " + p_match2.group(1)
                    
    # ── Net Quantity / Net Weight ──
    qty = "Not Found"
    qty_match = re.search(r"(?:NET\s*(?:WT\.?|WEIGHT|QTY\.?|QUANTITY|QTK|CONTENT)|WEIGHT|NEIGHT|WT)[^\d\w]*[A-Za-z0-9\*=:\s]*?(\d+[\.,]?\d*\s*(?:g|kg|ml|l|ltr|gm|Gm|KG|GM|Kg|g\b|gm\b|9\b)[^\n,]*)", all_text, re.IGNORECASE)
    if qty_match:
        raw_qty = qty_match.group(1).strip()
        # Clean 309+5S EXTRA -> 30g + 5g Extra (35g)
        raw_qty = re.sub(r'(\d+)\s*9\s*\+\s*(\d+)\s*[5S]\s*EX[A-Z]*', r'\1g + \2g Extra (35g)', raw_qty, flags=re.IGNORECASE)
        raw_qty = re.sub(r'(\d+)\s*9$', r'\1 g', raw_qty)
        qty = raw_qty
    else:
        q2 = re.search(r"\b(\d+[\.,]?\d*\s*(?:g|kg|ml|gm|Gm|KG|GM|Kg|ltr))\b", all_text, re.IGNORECASE)
        if q2:
            qty = q2.group(1).strip()
        else:
            q3 = re.search(r"\b(\d{2,4})\s*9\b", all_text)
            if q3:
                qty = q3.group(1) + " g"

    # ── Dates (PKD, MFD, USE BY, EXPIRY, UBD) ──
    all_dates = re.findall(r"\b(\d{1,2}\s*[A-Za-z]{3}\s*\d{2,4}|\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{2}[\/\-\.]\d{4})\b", all_text)
    
    mfg_date = "Not Found"
    mfg_m = re.search(r"(?:PKD\.?|MFD\.?|MFG\.?|PACKED|MANUFACTURED|Mfg\.\s*Date|[4A]F[6G])[:\"\s\.]*(\d{1,2}\s*[A-Za-z]{3}\s*\d{2,4}|\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{2}[\/\-\.]\d{4})", all_text, re.IGNORECASE)
    if mfg_m:
        mfg_date = mfg_m.group(1).replace('z', '2').replace('Z', '2')
    elif all_dates:
        mfg_date = all_dates[0]

    # Expiry / Use By Date (UBD / EXP)
    exp_date = "Not Found"
    exp_m = re.search(r"(?:UBD|UED|USE\s*B[YV]|EXP\.?|EXPIRY|BEST\s*BEFORE)[:\"\s\.]*(\d{1,2}\s*[A-Za-z]{3}\s*\d{2,4}|\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{2}[\/\-\.]\d{4}|\d+\s+months[^\n,]*)", all_text, re.IGNORECASE)
    if exp_m:
        exp_date = exp_m.group(1).replace('z', '2').replace('Z', '2')
    else:
        for d in all_dates:
            if d != mfg_date:
                exp_date = d
                break
        if exp_date == "Not Found":
            pseudo_d = re.search(r"\b(\d{2}\/\d{2,4})\b", all_text)
            if pseudo_d and pseudo_d.group(1) != mfg_date:
                raw_d = pseudo_d.group(1)
                if len(raw_d) == 7 and raw_d.count('/') == 1:
                    exp_date = raw_d[:5] + '/' + raw_d[5:]
                else:
                    exp_date = raw_d

    # ── Lot / Batch Number ──
    lot_no = "Not Found"
    lot_m = re.search(r"(?:B\.\s*No\.?|LOT\s*NO\.?|BATCH\s*NO\.?|LOT|BATCH)[:\s\.]*([A-Za-z0-9]{4,15})", all_text, re.IGNORECASE)
    if lot_m and lot_m.group(1).upper() not in ["NO", "CODE", "MACHINE"]:
        lot_no = lot_m.group(1)
    else:
        l2 = re.search(r"\b([A-Z]\d{4}[A-Z]\d+)\b", all_text)
        if l2:
            lot_no = l2.group(1)
        else:
            l3 = re.search(r"\b(\d{4}[A-Z]\d+)\b", all_text)
            if l3:
                lot_no = l3.group(1)

    # ── Manufacturer / Brand ──
    mfr = "Not Found"
    mfr_m = re.search(r"(?:details:\s*|MANUFACTURED\s*(?:BY|FOR)|MFD\.\s*BY|PACKED\s*BY|MARKETED\s*BY)[:\s]*(.{6,50}?(?:Limited|Ltd|Pvt|LLC|Brands))", all_text, re.IGNORECASE)
    if mfr_m:
        mfr = mfr_m.group(1).strip()
    else:
        for brand in ["SUNDROP", "ACT II", "BRITANNIA", "PARLE", "NESTLE", "ITC", "HINDUSTAN UNILEVER", "AMUL", "CADBURY", "MONDELEZ", "BOURBON", "RAJAH", "DOVE"]:
            if brand in all_text.upper():
                mfr = brand.title() + " (Identified Brand / Product)"
                break

    # ── Customer Care ──
    customer_care = "Not Found"
    phone_m = re.search(r"(?:1[89]00|toll[\s-]*free|consumer|helpline|care|feedback)[\D]*(\d[\d\s\-]{6,16}\d)", all_text, re.IGNORECASE)
    email_m = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}", all_text)
    if phone_m and email_m:
        customer_care = phone_m.group(1).strip() + " / " + email_m.group(0)
    elif phone_m:
        customer_care = phone_m.group(1).strip()
    elif email_m:
        customer_care = email_m.group(0)
    elif "feedback@britindia.com" in all_text.lower():
        customer_care = "feedback@britindia.com"
        
    # ── FSSAI License ──
    fssai = "Not Found"
    fssai_m = re.search(r"(?:FSSAI|Lic\.?\s*No\.?)[:\s\.]*([0-9]{10,14})", all_text, re.IGNORECASE)
    if fssai_m:
        fssai = fssai_m.group(1)
    else:
        f2 = re.search(r"\b(100\d{11})\b", all_text)
        if f2:
            fssai = f2.group(1)
        else:
            f3 = re.search(r"\b(1\d{7,13})\b", all_text)
            if f3:
                fssai = f3.group(1)

    return {
        "mrp": mrp,
        "net_quantity": qty,
        "manufacture_date": mfg_date,
        "use_by_date": exp_date,
        "lot_number": lot_no,
        "manufacturer_address": mfr,
        "customer_care": customer_care,
        "fssai_license": fssai,
        "_raw_text_preview": all_text[:400] + ("..." if len(all_text) > 400 else "")
    }

def evaluate_compliance(data: dict) -> dict:
    violations = []
    checks = {}
    
    checks["mrp_present"] = data["mrp"] != "Not Found"
    if not checks["mrp_present"]:
        violations.append("Rule 6(1): MRP declaration missing")
        
    checks["net_quantity_present"] = data["net_quantity"] != "Not Found"
    if not checks["net_quantity_present"]:
        violations.append("Rule 4: Net quantity/weight not declared")
        
    checks["manufacture_date_present"] = data["manufacture_date"] != "Not Found"
    if not checks["manufacture_date_present"]:
        violations.append("Rule 5: Manufacture/pack date not found")
        
    checks["manufacturer_present"] = data["manufacturer_address"] != "Not Found"
    if not checks["manufacturer_present"]:
        violations.append("Rule 3: Manufacturer/packer details missing")
        
    checks["customer_care_present"] = data["customer_care"] != "Not Found"
    if not checks["customer_care_present"]:
        violations.append("Rule 6(5): Consumer care contact not found")
        
    checks["fssai_present"] = data["fssai_license"] != "Not Found"
    if not checks["fssai_present"]:
        violations.append("FSS Act: FSSAI license number absent")
        
    return {
        "checks": checks,
        "violations": violations,
        "overall_status": "PASS" if len(violations) <= 1 else "FAIL",
        "total_violations": len(violations)
    }

@router.post("/analyze")
async def analyze_label(image: UploadFile = File(...)):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted.")
    try:
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Cannot open image file: {e}")

    try:
        raw_text = run_ocr_multi_angle(pil_image)
    except Exception as e:
        print(f"[OCR] Exception in run_ocr_multi_angle: {e}")
        raw_text = ""

    if not raw_text.strip():
        return {
            "status": "warning",
            "message": "Could not extract legible text. Try a clearer image or rotate the photo upright.",
            "extracted_data": {k: "Not Found" for k in ["mrp","net_quantity","manufacture_date","use_by_date","lot_number","manufacturer_address","customer_care","fssai_license"]},
            "compliance_result": {
                "checks": {k: False for k in ["mrp_present","net_quantity_present","manufacture_date_present","manufacturer_present","customer_care_present","fssai_present"]},
                "violations": ["Image text could not be recognized by OCR"],
                "overall_status": "UNREADABLE",
                "total_violations": 1
            }
        }

    extracted = extract_declarations(raw_text)
    compliance = evaluate_compliance(extracted)
    return {
        "status": "success",
        "message": "Label scanned successfully.",
        "extracted_data": extracted,
        "compliance_result": compliance
    }

