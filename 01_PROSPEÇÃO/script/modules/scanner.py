import requests
import time
import pandas as pd
import numpy as np
from datetime import datetime

# =========================
# CONFIGURAÇÃO
# =========================

API_KEY = "AIzaSyBTL4TKMOVTe1h7b2C7ddAh7upXSg4S8hA"  # ⚠️ não deixes isto exposto publicamente

RADIUS = 5000
SLEEP_BETWEEN_REQUESTS = 1.2

KEYWORDS = [
    # limpeza
    "cleaning service",
    "house cleaning",
    "office cleaning",
    "deep cleaning",
    "carpet cleaning",

    # mudanças / logística
    "moving company",
    "movers",
    "furniture delivery",
    "transport service",

    # reparações
    "plumber",
    "emergency plumber",
    "electrician",
    "locksmith",
    "appliance repair",
    "air conditioning repair",
    "pest control",

    # construção leve
    "handyman",
    "painting service",
    "renovation company",
    "flooring installation",
    "roofing company",
    "carpentry services",

    # eventos pequenos
    "wedding photographer",
    "event planning",
    "party rental",
    "DJ services"
]

# 🇵🇹 TOP CITIES
CITIES = [
    ("Lisboa", 38.7223, -9.1393),
    ("Porto", 41.1579, -8.6291),
    ("Braga", 41.5454, -8.4265),
    ("Setúbal", 38.5244, -8.8882),
    ("Coimbra", 40.2033, -8.4103),
    ("Faro", 37.0194, -7.9304),
    ("Aveiro", 40.6405, -8.6538),
    ("Leiria", 39.7436, -8.8071),
    ("Viseu", 40.6566, -7.9125),
    ("Guimarães", 41.4435, -8.2918)
]

OFFSETS = [
    (0, 0),
    (0.05, 0),
    (-0.05, 0),
    (0, 0.05),
    (0, -0.05),
    (0.05, 0.05),
    (-0.05, -0.05)
]

# =========================
# LOG
# =========================

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

# =========================
# SCANNER
# =========================

url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

all_results = []
seen_place_ids = set()

total_requests = 0
start_time = time.time()

for city_name, base_lat, base_lon in CITIES:

    log(f"\n🏙️ CIDADE: {city_name}")

    for keyword in KEYWORDS:

        log(f"   🔎 Keyword: {keyword}")

        for dx, dy in OFFSETS:

            lat = base_lat + dx
            lon = base_lon + dy

            params = {
                "location": f"{lat},{lon}",
                "radius": RADIUS,
                "keyword": keyword,
                "key": API_KEY
            }

            try:
                response = requests.get(url, params=params)
                data = response.json()

                total_requests += 1

                status = data.get("status")
                results = data.get("results", [])

                log(f"      📍 {lat:.4f},{lon:.4f} | {status} | {len(results)} resultados")

                for place in results:
                    place_id = place.get("place_id")

                    if place_id in seen_place_ids:
                        continue

                    seen_place_ids.add(place_id)

                    all_results.append({
                        "city": city_name,
                        "place_id": place_id,
                        "name": place.get("name"),
                        "rating": place.get("rating"),
                        "reviews": place.get("user_ratings_total"),
                        "lat": lat,
                        "lon": lon,
                        "keyword": keyword
                    })

                time.sleep(SLEEP_BETWEEN_REQUESTS)

            except Exception as e:
                log(f"❌ ERRO: {e}")

# =========================
# FINAL
# =========================

df = pd.DataFrame(all_results)
df.to_csv("leads_raw_1.csv", index=False)

log("\n=========================")
log("✅ SCANNING COMPLETO")
log(f"📦 Leads únicas: {len(all_results)}")
log(f"🌐 Requests feitos: {total_requests}")
log("=========================")