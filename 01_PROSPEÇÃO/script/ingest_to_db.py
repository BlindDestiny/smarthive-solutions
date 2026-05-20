"""
Backend bridge: post leads from any source (scraper, CSV, manual list) into the
Backoffice CRM via the POST /api/leads/ingest endpoint.

This replaces the old "write to leads_master.csv" pattern. The endpoint
upserts by place_id, so repeated runs are idempotent.

USAGE
-----

# 1) From a CSV (legacy format with the same columns as leads_master.csv):
    python ingest_to_db.py leads_master.csv

# 2) Manually from another Python script:
    from ingest_to_db import post_leads
    post_leads([
        {"placeId": "ChIJ...", "name": "Restaurante X", "city": "Faro", ...}
    ])

ENV VARS
--------
    INGEST_TOKEN   shared secret matching the one set on the Next.js server
    INGEST_URL     defaults to http://localhost:3010/api/leads/ingest
                   set to https://backoffice.smarthivesolutions.pt/api/leads/ingest
                   when calling production
"""

import csv
import os
import sys
from typing import Any, Dict, Iterable, List

import requests


INGEST_URL   = os.environ.get("INGEST_URL", "http://localhost:3010/api/leads/ingest")
INGEST_TOKEN = os.environ.get("INGEST_TOKEN", "")
BATCH        = 200  # endpoint accepts up to 1000 per call; smaller batches = better error isolation


def _normalize(row: Dict[str, Any]) -> Dict[str, Any]:
    """Map legacy CSV column names → endpoint field names."""
    def s(v: Any) -> str | None:
        if v is None: return None
        t = str(v).strip()
        if not t or t.lower() in ("nan", "none", "—", "null"): return None
        return t

    def i(v: Any) -> int | None:
        t = s(v)
        if t is None: return None
        try: return int(float(t))
        except (ValueError, TypeError): return None

    def f(v: Any) -> float | None:
        t = s(v)
        if t is None: return None
        try: return float(t)
        except (ValueError, TypeError): return None

    return {
        "placeId":   s(row.get("place_id")),
        "name":      s(row.get("name")),
        "category":  s(row.get("types") or row.get("category")),
        "keyword":   s(row.get("keyword")),
        "city":      s(row.get("city")),
        "address":   s(row.get("address")),
        "lat":       f(row.get("lat")),
        "lng":       f(row.get("lon") or row.get("lng")),
        "phone":     s(row.get("phone")),
        "email":     s(row.get("email")),
        "website":   s(row.get("website")),
        "rating":    f(row.get("rating")),
        "reviews":   i(row.get("reviews")),
        "googleUrl": s(row.get("google_maps_url")),
        "priority":  i(row.get("lead_score") or row.get("website_score") or 0) or 0,
        "source":    s(row.get("source")) or "scraper",
    }


def post_leads(rows: Iterable[Dict[str, Any]]) -> Dict[str, int]:
    """POST a batch (auto-chunks). Returns aggregated counts."""
    if not INGEST_TOKEN:
        raise RuntimeError("INGEST_TOKEN env var is not set")

    headers = {
        "Authorization": f"Bearer {INGEST_TOKEN}",
        "Content-Type":  "application/json",
    }

    rows = list(rows)
    rows = [r for r in (_normalize(r) for r in rows) if r["placeId"] and r["name"]]

    total = {"received": 0, "upserted": 0, "skipped": 0, "errors": 0}
    for i in range(0, len(rows), BATCH):
        chunk = rows[i:i + BATCH]
        resp = requests.post(INGEST_URL, headers=headers, json={"leads": chunk}, timeout=60)
        if resp.status_code != 200:
            print(f"  ✗ batch {i//BATCH + 1} failed: HTTP {resp.status_code} — {resp.text[:200]}")
            total["errors"] += len(chunk)
            continue
        out = resp.json()
        total["received"] += out.get("received", 0)
        total["upserted"] += out.get("upserted", 0)
        total["skipped"]  += out.get("skipped", 0)
        total["errors"]   += len(out.get("errors", []))
        print(f"  ✓ batch {i//BATCH + 1}: {out.get('upserted', 0)}/{len(chunk)} upserted")
    return total


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    csv_path = sys.argv[1]
    print(f"▶ Reading {csv_path}")
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    print(f"  {len(rows)} rows loaded")
    print(f"▶ Posting to {INGEST_URL}")
    total = post_leads(rows)
    print(f"\n✓ Done — {total['upserted']}/{total['received']} upserted, "
          f"{total['skipped']} skipped, {total['errors']} errors")


if __name__ == "__main__":
    main()
