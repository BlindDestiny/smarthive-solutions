"""
Google Places scraper v2 — mainland Portugal + 50 verticals + resume support.

Reads existing (lat, lon, keyword) tuples already scanned via the Backoffice
API (/api/scrape/done-combos) and skips them on this run — so successive
scrapes only burn API credit on new ground.

USAGE
-----
    # Standalone CLI (no UI):
    python scraper.py --preset quick

    # From the UI runner (Next.js spawns this):
    python scraper.py --job-id <id>

ENV VARS (read from .env in this directory)
-------------------------------------------
    GOOGLE_PLACES_API_KEY  — Google Cloud Places API key
    INGEST_TOKEN           — shared secret for posting to Backoffice
    BACKOFFICE_URL         — default http://localhost:3010

PRESETS
-------
    quick     — top 30 cidades · 25 keywords (~5 250 calls · 155€)
    standard  — top 100 localidades · 35 keywords (~24 500 calls · 720€)
    full      — hex grid mainland PT · 50 keywords (~25 000 calls · 730€)
    custom    — pass --keywords and --cities explicitly
"""

from __future__ import annotations

import argparse
import math
import os
import sys
import time
from dataclasses import dataclass, field
from typing import Iterator

import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY        = os.environ.get("GOOGLE_PLACES_API_KEY", "").strip()
INGEST_TOKEN   = os.environ.get("INGEST_TOKEN", "").strip()
BACKOFFICE_URL = os.environ.get("BACKOFFICE_URL", "http://localhost:3010").rstrip("/")

NEARBY_URL     = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
COST_PER_CALL  = 0.032   # USD, Google Nearby Search legacy pricing
EUR_PER_USD    = 0.93
SLEEP_S        = 1.2
PAGE_SLEEP_S   = 2.0     # next_page_token needs ~2s to activate
DEFAULT_BUDGET_EUR = 260.0  # Google Cloud free credits cap by default

# ─────────────────────────────────────────────────────────────────
# KEYWORDS — comprehensive PT business taxonomy
# ─────────────────────────────────────────────────────────────────

KEYWORDS_FULL = [
    # ── Restauração & comida (24) ─────────────────────────────
    "restaurante", "café", "bar", "pastelaria", "pizzaria", "padaria",
    "snack-bar", "churrasqueira", "marisqueira", "tasca", "hamburgueria",
    "gelataria", "doceria", "confeitaria", "cervejaria", "esplanada",
    "wine bar", "sushi", "kebab", "comida vegana", "comida vegetariana",
    "takeaway", "brasserie", "cocktail bar",
    # ── Comércio alimentar (7) ────────────────────────────────
    "talho", "peixaria", "frutaria", "mercearia", "garrafeira",
    "queijaria", "supermercado",
    # ── Beleza & bem-estar (10) ───────────────────────────────
    "cabeleireiro", "barbearia", "estética", "spa", "manicure",
    "podologia", "depilação", "massagens", "solário", "centro estético",
    # ── Saúde (15) ────────────────────────────────────────────
    "clínica dentária", "clínica médica", "clínica veterinária",
    "fisioterapia", "osteopatia", "psicólogo", "nutricionista",
    "farmácia", "parafarmácia", "ótica", "centro auditivo",
    "ginecologia", "pediatria", "terapeuta", "acupuntura",
    # ── Profissionais B2B (10) ────────────────────────────────
    "advogado", "contabilista", "notário", "solicitador",
    "arquiteto", "engenheiro civil", "imobiliária", "agência de viagens",
    "seguros", "consultoria",
    # ── Serviços de casa (15) ─────────────────────────────────
    "canalizador", "eletricista", "carpintaria", "marcenaria",
    "pintor", "serralharia", "limpeza", "jardineiro", "paisagista",
    "climatização", "ar condicionado", "alarmes", "automação",
    "vidraçaria", "desentupimentos",
    # ── Mudanças & logística (3) ──────────────────────────────
    "mudanças", "transporte de mercadorias", "estafetas",
    # ── Construção & obras (5) ────────────────────────────────
    "construção civil", "remodelações", "reabilitação",
    "empreiteiro", "pavimentos",
    # ── Auto (8) ──────────────────────────────────────────────
    "oficina auto", "stand de carros", "mecânico", "lavagem auto",
    "pneus", "pintura auto", "rent-a-car", "inspeções auto",
    # ── Comércio especializado (15) ───────────────────────────
    "loja de roupa", "loja de móveis", "ourivesaria", "sapataria",
    "joalharia", "florista", "petshop", "eletrodomésticos",
    "loja de informática", "telemóveis", "livraria", "papelaria",
    "brinquedos", "bricolage", "ferragens",
    # ── Fitness & desporto (7) ────────────────────────────────
    "ginásio", "pilates", "yoga", "crossfit", "studio de dança",
    "escola de surf", "padel",
    # ── Hospitalidade (5) ─────────────────────────────────────
    "hotel", "hostel", "alojamento local", "guesthouse", "pousada",
    # ── Educação & formação (7) ───────────────────────────────
    "creche", "infantário", "colégio", "escola de música",
    "autoescola", "explicações", "formação profissional",
    # ── Eventos & criativo (8) ────────────────────────────────
    "fotógrafo", "fotógrafo de casamentos", "videografia", "drone",
    "catering", "dj", "agência publicidade", "design gráfico",
    # ── Animais (3) ───────────────────────────────────────────
    "veterinário", "groomer", "hotel canino",
    # ── Funerários & outros (2) ───────────────────────────────
    "agência funerária", "copyshop",
]

KEYWORDS_QUICK = [
    "restaurante", "café", "pastelaria", "pizzaria",
    "cabeleireiro", "estética", "ginásio",
    "clínica dentária", "fisioterapia", "advogado", "contabilista",
    "imobiliária", "canalizador", "eletricista", "carpintaria",
    "marcenaria", "pintor", "mudanças", "oficina auto",
    "loja de roupa", "loja de móveis", "florista",
    "petshop", "construção civil", "remodelações",
]

KEYWORDS_STANDARD = KEYWORDS_QUICK + [
    "barbearia", "spa", "snack-bar", "churrasqueira",
    "clínica veterinária", "farmácia", "notário", "seguros",
    "serralharia", "limpeza",
]

# ─────────────────────────────────────────────────────────────────
# CITIES — used by quick / standard presets
# ─────────────────────────────────────────────────────────────────

CITIES_TOP30 = [
    # name, lat, lon
    ("Lisboa", 38.7223, -9.1393), ("Porto", 41.1579, -8.6291),
    ("Vila Nova de Gaia", 41.1239, -8.6118), ("Amadora", 38.7575, -9.2400),
    ("Braga", 41.5454, -8.4265), ("Almada", 38.6796, -9.1583),
    ("Coimbra", 40.2033, -8.4103), ("Funchal", 32.6669, -16.9241),
    ("Setúbal", 38.5244, -8.8882), ("Agualva-Cacém", 38.7670, -9.2998),
    ("Queluz", 38.7551, -9.2553), ("Aveiro", 40.6405, -8.6538),
    ("Faro", 37.0194, -7.9304), ("Viseu", 40.6566, -7.9125),
    ("Leiria", 39.7436, -8.8071), ("Évora", 38.5717, -7.9135),
    ("Guimarães", 41.4435, -8.2918), ("Cascais", 38.6979, -9.4215),
    ("Loulé", 37.1378, -8.0218), ("Portimão", 37.1369, -8.5377),
    ("Caldas da Rainha", 39.4036, -9.1356), ("Viana do Castelo", 41.6918, -8.8344),
    ("Castelo Branco", 39.8222, -7.4912), ("Beja", 38.0151, -7.8627),
    ("Bragança", 41.8061, -6.7567), ("Vila Real", 41.3006, -7.7441),
    ("Guarda", 40.5364, -7.2683), ("Portalegre", 39.2967, -7.4280),
    ("Santarém", 39.2363, -8.6859), ("Loures", 38.8326, -9.1683),
]

CITIES_TOP100 = CITIES_TOP30 + [
    ("Olhão", 37.0290, -7.8408), ("Tavira", 37.1259, -7.6498),
    ("Lagos", 37.1028, -8.6730), ("Albufeira", 37.0894, -8.2476),
    ("Quarteira", 37.0691, -8.0985), ("Silves", 37.1899, -8.4378),
    ("Sines", 37.9550, -8.8696), ("Grândola", 38.1718, -8.5654),
    ("Alcácer do Sal", 38.3760, -8.5085), ("Montijo", 38.7068, -8.9750),
    ("Barreiro", 38.6608, -9.0735), ("Seixal", 38.6404, -9.0954),
    ("Sesimbra", 38.4441, -9.1010), ("Palmela", 38.5675, -8.9019),
    ("Sintra", 38.7973, -9.3895), ("Mafra", 38.9376, -9.3271),
    ("Torres Vedras", 39.0918, -9.2588), ("Rio Maior", 39.3393, -8.9362),
    ("Tomar", 39.6010, -8.4093), ("Abrantes", 39.4664, -8.1979),
    ("Entroncamento", 39.4674, -8.4716), ("Ourém", 39.6627, -8.5816),
    ("Fátima", 39.6168, -8.6539), ("Nazaré", 39.6014, -9.0707),
    ("Marinha Grande", 39.7507, -8.9292), ("Pombal", 39.9156, -8.6296),
    ("Cantanhede", 40.3494, -8.5949), ("Mealhada", 40.3781, -8.4498),
    ("Anadia", 40.4400, -8.4373), ("Águeda", 40.5760, -8.4488),
    ("Oliveira de Azeméis", 40.8400, -8.4756), ("Ovar", 40.8606, -8.6261),
    ("Espinho", 41.0073, -8.6411), ("Matosinhos", 41.1838, -8.6924),
    ("Maia", 41.2278, -8.6210), ("Valongo", 41.1881, -8.4954),
    ("Gondomar", 41.1428, -8.5325), ("Penafiel", 41.2074, -8.2841),
    ("Marco de Canaveses", 41.1814, -8.1532), ("Lousada", 41.2786, -8.2820),
    ("Felgueiras", 41.3705, -8.1929), ("Vizela", 41.3837, -8.2701),
    ("Famalicão", 41.4093, -8.5198), ("Barcelos", 41.5388, -8.6151),
    ("Esposende", 41.5363, -8.7795), ("Póvoa de Varzim", 41.3801, -8.7625),
    ("Vila do Conde", 41.3534, -8.7458), ("Vila Verde", 41.6406, -8.4376),
    ("Amares", 41.6309, -8.3534), ("Caldas de Vizela", 41.3837, -8.2701),
    ("Fafe", 41.4506, -8.1668), ("Chaves", 41.7406, -7.4717),
    ("Mirandela", 41.4845, -7.1855), ("Lamego", 41.0958, -7.8089),
    ("Régua", 41.1604, -7.7867), ("Peso da Régua", 41.1604, -7.7867),
    ("Vila Real de Santo António", 37.1947, -7.4156), ("Sagres", 37.0090, -8.9385),
    ("Monção", 42.0780, -8.4783), ("Valença", 42.0252, -8.6427),
    ("Caminha", 41.8744, -8.8388), ("Ponte de Lima", 41.7665, -8.5826),
    ("Penacova", 40.2700, -8.2820), ("Figueira da Foz", 40.1503, -8.8617),
    ("Mira", 40.4282, -8.7370), ("Vagos", 40.5575, -8.6818),
    ("Estarreja", 40.7572, -8.5733), ("Mealhada", 40.3781, -8.4498),
    ("Estremoz", 38.8431, -7.5876), ("Elvas", 38.8842, -7.1597),
    ("Vila Viçosa", 38.7791, -7.4181),
]

# 7-point offset pattern for fine coverage around each city
CITY_OFFSETS = [
    (0, 0),    (0.05, 0),  (-0.05, 0),
    (0, 0.05), (0, -0.05),
    (0.05, 0.05), (-0.05, -0.05),
]

# ─────────────────────────────────────────────────────────────────
# MAINLAND PT BOUNDING BOX HEX GRID
# ─────────────────────────────────────────────────────────────────

MAINLAND_PT_BBOX = {
    "south": 36.95,  # Sagres
    "north": 42.15,  # Caminha
    "west":  -9.55,  # Cabo da Roca
    "east":  -6.18,  # Bragança district
}

def generate_pt_hex_grid(spacing_lat: float = 0.18, spacing_lon: float = 0.22) -> list[tuple[float, float]]:
    """Hexagonal grid covering mainland PT bbox.
    spacing_lat / spacing_lon roughly equate to ~20km cells.
    Rough filter: discards points clearly in the Atlantic (west of inland)."""
    cells = []
    lat = MAINLAND_PT_BBOX["south"]
    row = 0
    while lat <= MAINLAND_PT_BBOX["north"]:
        offset = (spacing_lon / 2) if (row % 2) else 0
        lon = MAINLAND_PT_BBOX["west"] + offset
        while lon <= MAINLAND_PT_BBOX["east"]:
            # Crude land-only filter (rough mainland PT polygon corners)
            if is_in_mainland_pt(lat, lon):
                cells.append((round(lat, 4), round(lon, 4)))
            lon += spacing_lon
        lat += spacing_lat
        row += 1
    return cells

def is_in_mainland_pt(lat: float, lon: float) -> bool:
    """Rough polygon test: rejects ocean cells west of the coast and Spain cells east."""
    # Western coast as function of latitude (linear interp between key points)
    coast = [
        (42.15, -8.85), (41.50, -8.85), (41.15, -8.65),
        (40.20, -8.70), (39.40, -9.25), (38.70, -9.50),
        (38.05, -8.95), (37.00, -8.95),
    ]
    # Find the two coast points sandwiching this lat
    if lat < coast[-1][0] or lat > coast[0][0]:
        return False
    for i in range(len(coast) - 1):
        (lat_a, lon_a), (lat_b, lon_b) = coast[i], coast[i + 1]
        if lat_b <= lat <= lat_a:
            t = (lat - lat_b) / (lat_a - lat_b) if lat_a != lat_b else 0
            west = lon_b + t * (lon_a - lon_b)
            if lon < west: return False
            break
    # Eastern border (Spain) — roughly linear
    east_limit = -6.18 + (lat - 37) * 0.05  # widens slightly going north
    if lon > east_limit: return False
    return True

# ─────────────────────────────────────────────────────────────────
# PLAN BUILDER per preset
# ─────────────────────────────────────────────────────────────────

@dataclass
class Cell:
    lat: float
    lon: float
    source: str   # "Lisboa" | "Hex · Algarve" | etc.

@dataclass
class ScanPlan:
    label: str
    cells: list[Cell]
    keywords: list[str]
    radius: int                                # meters
    def total_combos(self) -> int:
        return len(self.cells) * len(self.keywords)
    def estimated_cost_usd(self, avg_pages_per_combo: float = 1.0) -> float:
        return self.total_combos() * avg_pages_per_combo * COST_PER_CALL

def expand_cities(cities: list[tuple[str, float, float]]) -> list[Cell]:
    out: list[Cell] = []
    for name, base_lat, base_lon in cities:
        for i, (dx, dy) in enumerate(CITY_OFFSETS):
            source = name if i == 0 else f"{name} +{i}"
            out.append(Cell(round(base_lat + dx, 4), round(base_lon + dy, 4), source))
    return out

def hex_region_label(lat: float) -> str:
    """Approximate PT region by latitude — just for friendlier UI labels."""
    if lat < 37.5:  return "Algarve"
    if lat < 38.7:  return "Alentejo Litoral"
    if lat < 39.2:  return "Alentejo / Lisboa Sul"
    if lat < 40.0:  return "Lisboa / Vale Tejo"
    if lat < 40.8:  return "Centro"
    if lat < 41.3:  return "Beira Litoral"
    if lat < 41.7:  return "Porto / Douro"
    return "Minho / Trás-os-Montes"

def hex_cells_with_labels() -> list[Cell]:
    return [Cell(lat, lon, f"Hex · {hex_region_label(lat)}")
            for lat, lon in generate_pt_hex_grid()]

def build_plan(preset: str, keywords_override: list[str] | None = None) -> ScanPlan:
    if preset == "quick":
        return ScanPlan(
            label="Quick · top 30 cidades · 25 keywords",
            cells=expand_cities(CITIES_TOP30),
            keywords=keywords_override or KEYWORDS_QUICK,
            radius=5000,
        )
    if preset == "standard":
        return ScanPlan(
            label="Standard · top 100 localidades · 35 keywords",
            cells=expand_cities(CITIES_TOP100),
            keywords=keywords_override or KEYWORDS_STANDARD,
            radius=5000,
        )
    if preset == "full":
        return ScanPlan(
            label="Full · hex grid mainland PT · 144 keywords",
            cells=hex_cells_with_labels(),
            keywords=keywords_override or KEYWORDS_FULL,
            radius=15000,
        )
    raise ValueError(f"Unknown preset: {preset}")

# ─────────────────────────────────────────────────────────────────
# DONE-COMBOS SKIP LOGIC
# ─────────────────────────────────────────────────────────────────

def fetch_done_combos() -> set[tuple[float, float, str]]:
    """Fetch already-scanned (lat, lon, keyword) tuples from Backoffice.
    Empty set if endpoint unavailable (e.g. cold-start)."""
    if not INGEST_TOKEN:
        print("⚠ INGEST_TOKEN missing — cannot fetch done-combos, skip-logic disabled")
        return set()
    try:
        r = requests.get(
            f"{BACKOFFICE_URL}/api/scrape/done-combos",
            headers={"Authorization": f"Bearer {INGEST_TOKEN}"},
            timeout=30,
        )
        if r.status_code != 200:
            print(f"⚠ done-combos {r.status_code} — skip-logic disabled")
            return set()
        data = r.json()
        return {(round(c["lat"], 4), round(c["lon"], 4), c["keyword"]) for c in data.get("combos", [])}
    except Exception as e:
        print(f"⚠ done-combos fetch failed ({e}) — skip-logic disabled")
        return set()

# ─────────────────────────────────────────────────────────────────
# JOB PROGRESS REPORTING
# ─────────────────────────────────────────────────────────────────

class ProgressReporter:
    def __init__(self, job_id: str | None):
        self.job_id = job_id
        self.last_post = 0

    def post(self, **fields):
        """POST partial progress to Backoffice. No-op if no job_id."""
        if not self.job_id or not INGEST_TOKEN: return
        try:
            requests.post(
                f"{BACKOFFICE_URL}/api/scrape/progress",
                headers={"Authorization": f"Bearer {INGEST_TOKEN}"},
                json={"jobId": self.job_id, **fields},
                timeout=10,
            )
        except Exception as e:
            print(f"⚠ progress post failed: {e}")

    def is_cancelled(self) -> bool:
        """Poll Backoffice to see if this job was cancelled mid-run."""
        if not self.job_id or not INGEST_TOKEN: return False
        try:
            r = requests.get(
                f"{BACKOFFICE_URL}/api/scrape/jobs/{self.job_id}",
                headers={"Authorization": f"Bearer {INGEST_TOKEN}"},
                timeout=5,
            )
            return r.status_code == 200 and r.json().get("status") == "CANCELLED"
        except Exception:
            return False

# ─────────────────────────────────────────────────────────────────
# CALL + INGEST
# ─────────────────────────────────────────────────────────────────

def nearby_search(lat: float, lon: float, keyword: str, radius: int) -> tuple[list[dict], int]:
    """Returns (places, calls_made). Follows up to 2 next_page_tokens."""
    all_places: list[dict] = []
    calls = 0
    params = {"location": f"{lat},{lon}", "radius": radius, "keyword": keyword, "key": API_KEY}
    try:
        r = requests.get(NEARBY_URL, params=params, timeout=15)
        calls += 1
        data = r.json()
        all_places.extend(data.get("results", []))
        token = data.get("next_page_token")
        pages = 0
        while token and pages < 2:
            time.sleep(PAGE_SLEEP_S)
            r = requests.get(NEARBY_URL, params={"pagetoken": token, "key": API_KEY}, timeout=15)
            calls += 1
            data = r.json()
            all_places.extend(data.get("results", []))
            token = data.get("next_page_token")
            pages += 1
    except Exception as e:
        print(f"  ✗ {lat},{lon} '{keyword}': {e}")
    return all_places, calls

def post_ingest(rows: list[dict]) -> int:
    """POST batched leads to Backoffice. Returns upserted count."""
    if not rows or not INGEST_TOKEN: return 0
    try:
        r = requests.post(
            f"{BACKOFFICE_URL}/api/leads/ingest",
            headers={"Authorization": f"Bearer {INGEST_TOKEN}"},
            json={"leads": rows},
            timeout=60,
        )
        if r.status_code != 200:
            print(f"  ✗ ingest HTTP {r.status_code}: {r.text[:150]}")
            return 0
        return r.json().get("upserted", 0)
    except Exception as e:
        print(f"  ✗ ingest exception: {e}")
        return 0

def lead_payload(place: dict, search_lat: float, search_lon: float, keyword: str) -> dict | None:
    pid = place.get("place_id")
    name = place.get("name")
    if not pid or not name: return None
    return {
        "placeId":   pid,
        "name":      name,
        "category":  ",".join(place.get("types", [])[:3]) if place.get("types") else None,
        "keyword":   keyword,
        "address":   place.get("vicinity"),
        "lat":       search_lat,
        "lng":       search_lon,
        "rating":    place.get("rating"),
        "reviews":   place.get("user_ratings_total") or 0,
        "googleUrl": f"https://maps.google.com/?cid={pid}",
        "source":    "scraper",
    }

# ─────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────

def run(preset: str, job_id: str | None = None, dry_run: bool = False, budget_eur: float = DEFAULT_BUDGET_EUR):
    if not API_KEY:
        print("✗ GOOGLE_PLACES_API_KEY missing from .env")
        sys.exit(1)

    plan = build_plan(preset)
    reporter = ProgressReporter(job_id)
    budget_usd = budget_eur / EUR_PER_USD

    print(f"▶ {plan.label}")
    print(f"  Cells: {len(plan.cells):,}  ·  Keywords: {len(plan.keywords)}  ·  Combos: {plan.total_combos():,}")
    print(f"  Estimated max cost: ${plan.estimated_cost_usd(avg_pages_per_combo=2.0):.0f} (~{plan.estimated_cost_usd(2.0)*EUR_PER_USD:.0f}€)")
    print(f"  (1 page avg: ${plan.estimated_cost_usd():.0f})")
    print(f"  Budget cap: {budget_eur:.0f}€ (≈ ${budget_usd:.2f}) — will stop when reached")

    done = fetch_done_combos()
    pending = [
        (cell, kw) for cell in plan.cells for kw in plan.keywords
        if (cell.lat, cell.lon, kw) not in done
    ]
    skipped = plan.total_combos() - len(pending)
    print(f"  Skipping {skipped:,} already-done combos ({skipped/plan.total_combos()*100:.1f}%)")
    print(f"  Will execute: {len(pending):,} combos\n")

    reporter.post(
        status="RUNNING",
        cellsPlanned=len(plan.cells),
        combosPlanned=plan.total_combos(),
        combosSkipped=skipped,
    )

    if dry_run:
        print("(dry-run — exiting before any API calls)")
        return

    total_calls = 0
    total_leads_new = 0
    total_leads_seen = 0
    batch: list[dict] = []
    recent: list[dict] = []   # last 5 events for the live log
    BATCH_SIZE = 100
    RECENT_MAX = 5
    start = time.time()

    for idx, (cell, kw) in enumerate(pending):
        # Cancellation check every 25 combos
        if idx % 25 == 0 and reporter.is_cancelled():
            print(f"✗ Cancelled by user at combo {idx}/{len(pending)}")
            reporter.post(status="CANCELLED")
            return

        # Budget cap — stop before next call if we'd exceed
        current_cost_usd = total_calls * COST_PER_CALL
        if current_cost_usd >= budget_usd:
            print(f"⚠ Budget cap reached: ${current_cost_usd:.2f} ≥ ${budget_usd:.2f} ({budget_eur:.0f}€)")
            print(f"  Stopping cleanly at combo {idx}/{len(pending)}")
            if batch:
                up = post_ingest(batch)
                total_leads_new += up
                batch.clear()
            reporter.post(
                status="COMPLETED",
                callsMade=total_calls,
                leadsNew=total_leads_new,
                leadsTotal=total_leads_seen,
                costUsd=round(total_calls * COST_PER_CALL, 4),
                error=f"Budget cap {budget_eur:.0f}€ atingido — paragem limpa",
            )
            return

        places, calls = nearby_search(cell.lat, cell.lon, kw, plan.radius)
        total_calls += calls

        batch_before = len(batch)
        for p in places:
            payload = lead_payload(p, cell.lat, cell.lon, kw)
            if payload:
                batch.append(payload)
                total_leads_seen += 1
        batch_added = len(batch) - batch_before

        # Flush batch
        flushed = 0
        if len(batch) >= BATCH_SIZE:
            flushed = post_ingest(batch)
            total_leads_new += flushed
            batch.clear()

        # Append to recent activity (keep last 5)
        recent.insert(0, {
            "source":  cell.source,
            "keyword": kw,
            "found":   batch_added,
            "ts":      time.time(),
        })
        recent = recent[:RECENT_MAX]

        # Live progress — every combo
        elapsed = time.time() - start
        rate = (idx + 1) / max(elapsed, 1)
        eta_s = (len(pending) - idx) / max(rate, 0.1)

        if idx % 5 == 0:
            print(f"  [{idx+1:,}/{len(pending):,}] {cell.source} · '{kw[:30]}' → {batch_added} places · {total_calls} calls · {total_leads_new} new · ETA {eta_s/60:.1f}m")

        reporter.post(
            callsMade=total_calls,
            leadsNew=total_leads_new,
            leadsTotal=total_leads_seen,
            lastCell=f"{cell.lat:.4f},{cell.lon:.4f}",
            lastKeyword=kw,
            lastSource=cell.source,
            costUsd=round(total_calls * COST_PER_CALL, 4),
            recentActivity=recent,
        )

        time.sleep(SLEEP_S)

    # Final batch flush
    if batch:
        up = post_ingest(batch)
        total_leads_new += up

    elapsed = time.time() - start
    print(f"\n✓ Done in {elapsed/60:.1f} min")
    print(f"  {total_calls:,} calls  ·  ${total_calls*COST_PER_CALL:.2f} (~{total_calls*COST_PER_CALL*EUR_PER_USD:.0f}€)")
    print(f"  {total_leads_new:,} new leads upserted (from {total_leads_seen:,} returned)")

    reporter.post(
        status="COMPLETED",
        callsMade=total_calls,
        leadsNew=total_leads_new,
        leadsTotal=total_leads_seen,
        costUsd=round(total_calls * COST_PER_CALL, 4),
    )

# ─────────────────────────────────────────────────────────────────

def main():
    p = argparse.ArgumentParser(description="Google Places scraper v2 — mainland PT")
    p.add_argument("--preset", default="quick", choices=["quick", "standard", "full"])
    p.add_argument("--job-id", default=None, help="Backoffice ScrapeJob id for progress posting")
    p.add_argument("--budget-eur", type=float, default=float(os.environ.get("BUDGET_CAP_EUR", DEFAULT_BUDGET_EUR)),
                   help=f"Hard cap in EUR (default {DEFAULT_BUDGET_EUR:.0f}€ — Google free credits)")
    p.add_argument("--dry-run", action="store_true", help="Print plan + skip-set; don't call Google")
    args = p.parse_args()
    run(args.preset, args.job_id, args.dry_run, args.budget_eur)

if __name__ == "__main__":
    main()
