import requests
import pandas as pd
import os
import time
from datetime import datetime

# =========================
# CONFIG
# =========================

API_KEY = "AIzaSyBTL4TKMOVTe1h7b2C7ddAh7upXSg4S8hA"

INPUT_FILE = "leads_raw.csv"
OUTPUT_FILE = "leads_enriched.csv"

SLEEP = 0.25
SAVE_EVERY = 50

# =========================
# LOG
# =========================

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

# =========================
# LOAD INPUT
# =========================

df = pd.read_csv(INPUT_FILE)

log(f"📥 Leads carregadas: {len(df)}")

# =========================
# RESUME LOGIC
# =========================

start_index = 0

if os.path.exists(OUTPUT_FILE):
    try:
        done = pd.read_csv(OUTPUT_FILE)

        if len(done) > 0:
            last_place_id = done.iloc[-1]["place_id"]

            match = df[df["place_id"] == last_place_id]

            if not match.empty:
                start_index = match.index[0] + 1
                log(f"♻️ Resume ativo")
                log(f"   Último place_id: {last_place_id}")
                log(f"   A retomar do índice: {start_index}")

    except Exception as e:
        log(f"⚠️ Erro no resume: {e}")

# =========================
# DATA
# =========================

results = []

# se já existe ficheiro, carregar para continuar append lógico
if os.path.exists(OUTPUT_FILE):
    try:
        existing = pd.read_csv(OUTPUT_FILE)
        results = existing.to_dict("records")
    except:
        results = []

# =========================
# LOOP
# =========================

for i, row in df.iloc[start_index:].iterrows():

    place_id = row["place_id"]
    name = row.get("name", "")

    progress = (i + 1) / len(df) * 100
    log(f"🔎 [{progress:.2f}%] {name}")

    url = "https://maps.googleapis.com/maps/api/place/details/json"

    params = {
        "place_id": place_id,
        "fields": ",".join([
            "name",
            "website",
            "formatted_phone_number",
            "formatted_address",
            "business_status",
            "types",
            "rating",
            "user_ratings_total",
            "opening_hours",
            "price_level",
            "url"
        ]),
        "key": API_KEY
    }

    try:
        r = requests.get(url, params=params)
        data = r.json()

        status = data.get("status", "UNKNOWN")
        result = data.get("result", {})

        website = result.get("website")

        log(f"   🌐 {status} | website: {'YES' if website else 'NO'}")

        enriched = row.to_dict()

        enriched.update({
            "website": website,
            "phone": result.get("formatted_phone_number"),
            "address": result.get("formatted_address"),
            "business_status": result.get("business_status"),
            "types": ",".join(result.get("types", [])) if result.get("types") else None,
            "rating_details": result.get("rating"),
            "reviews_count_details": result.get("user_ratings_total"),
            "price_level": result.get("price_level"),
            "google_maps_url": result.get("url"),
            "open_now": result.get("opening_hours", {}).get("open_now")
        })

        results.append(enriched)

        # =========================
        # AUTOSAVE
        # =========================

        if (len(results) % SAVE_EVERY) == 0:
            pd.DataFrame(results).to_csv(OUTPUT_FILE, index=False)
            log(f"💾 Autosave ({len(results)} total guardados)")

        time.sleep(SLEEP)

    except Exception as e:
        log(f"❌ ERRO: {e}")

# =========================
# FINAL SAVE
# =========================

df_out = pd.DataFrame(results)
df_out.to_csv(OUTPUT_FILE, index=False)

log("\n=========================")
log("✅ ENRICHMENT COMPLETO")
log(f"📦 Total final: {len(df_out)}")
log(f"💾 Guardado em: {OUTPUT_FILE}")
log("=========================")