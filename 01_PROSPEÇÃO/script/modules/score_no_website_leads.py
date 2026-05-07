import pandas as pd
import numpy as np
from datetime import datetime

# =========================
# CONFIG
# =========================

INPUT = "leads_with_no_websites.csv"
OUTPUT = "leads_no_website_scored.csv"

# keywords com maior “dor + urgência”
HIGH_INTENT_KEYWORDS = {
    "plumber": 25,
    "electrician": 25,
    "locksmith": 30,
    "mechanic": 20,
    "construction": 20
}

BUSINESS_VALUE_KEYWORDS = {
    "dentist": 20,
    "lawyer": 25,
    "accountant": 15,
    "real estate agency": 20,
    "insurance agency": 20,
    "clinic": 15,
    "physiotherapy": 15
}

LOCAL_CITIES_HIGH_VALUE = [
    "Lisboa",
    "Porto",
    "Amadora",
    "Sintra",
    "Braga",
    "Funchal"
]

# =========================
# LOG
# =========================

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

# =========================
# SCORING ENGINE
# =========================

def score_lead(row):

    score = 0
    reasons = []

    keyword = str(row.get("keyword", "")).lower()
    city = str(row.get("city", "")).lower()

    rating = row.get("rating", 0)
    reviews = row.get("reviews", 0)

    # -------------------------
    # 1. KEYWORD INTENT
    # -------------------------
    if keyword in HIGH_INTENT_KEYWORDS:
        score += HIGH_INTENT_KEYWORDS[keyword]
        reasons.append("high intent service")

    if keyword in BUSINESS_VALUE_KEYWORDS:
        score += BUSINESS_VALUE_KEYWORDS[keyword]
        reasons.append("business service category")

    # -------------------------
    # 2. REVIEWS (proxy size)
    # -------------------------
    try:
        reviews = float(reviews)
    except:
        reviews = 0

    if reviews > 200:
        score += 20
        reasons.append("high activity business")
    elif reviews > 50:
        score += 10
        reasons.append("medium activity")
    elif reviews > 10:
        score += 5
    else:
        score += 0

    # -------------------------
    # 3. RATING QUALITY
    # -------------------------
    try:
        rating = float(rating)
    except:
        rating = 0

    if rating >= 4.5:
        score += 10
        reasons.append("high reputation")

    elif rating >= 4.0:
        score += 5

    # -------------------------
    # 4. CITY VALUE
    # -------------------------
    if any(c.lower() in city for c in LOCAL_CITIES_HIGH_VALUE):
        score += 10
        reasons.append("high value city")

    # -------------------------
    # 5. NO WEBSITE BONUS (já implícito)
    # -------------------------
    score += 10
    reasons.append("no website opportunity")

    # -------------------------
    # NORMALIZAÇÃO
    # -------------------------
    score = min(score, 100)

    return score, ", ".join(reasons)

# =========================
# LOAD DATA
# =========================

df = pd.read_csv(INPUT)

log(f"📥 Leads sem website: {len(df)}")

results = []

# =========================
# LOOP
# =========================

for i, row in df.iterrows():

    name = row.get("name")
    progress = (i / len(df)) * 100

    log(f"🔎 [{progress:.2f}%] {name}")

    score, reasons = score_lead(row)

    enriched = row.to_dict()
    enriched.update({
        "lead_score": score,
        "lead_reasons": reasons
    })

    results.append(enriched)

# =========================
# SAVE
# =========================

out_df = pd.DataFrame(results)
out_df = out_df.sort_values("lead_score", ascending=False)

out_df.to_csv(OUTPUT, index=False)

log("✅ SCORING COMPLETO")
log(f"📦 Leads processadas: {len(out_df)}")