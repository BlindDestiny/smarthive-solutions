import pandas as pd
import requests
import re
import json
import os
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

# =========================
# CONFIG
# =========================

INPUT = "leads_with_websites.csv"
OUTPUT = "leads_scored.csv"
PROGRESS_FILE = "progress_website_score.json"

TIMEOUT = 8
WORKERS = 12
SAVE_EVERY = 100

# =========================
# LOG
# =========================

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

# =========================
# PROGRESS
# =========================

def load_progress():
    try:
        with open(PROGRESS_FILE) as f:
            return set(json.load(f).get("processed_ids", []))
    except Exception:
        return set()

def save_progress(ids):
    with open(PROGRESS_FILE, "w") as f:
        json.dump({"processed_ids": list(ids)}, f)

# =========================
# HEURISTIC ANALYZER
# =========================

PHONE_RE = re.compile(r'(\+351|00351)?\s*[\d]{3}[\s\-]?[\d]{3}[\s\-]?[\d]{3}')
EMAIL_RE = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}')

def analyze_website(url):
    """
    Returns (website_score 0-10, opportunity_score 0-100, issues list, status string).
    website_score: higher = better quality site.
    opportunity_score: higher = more room for improvement = better lead.
    """
    score = 10
    issues = []

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept-Language": "pt-PT,pt;q=0.9,en;q=0.8",
            "Accept": "text/html,application/xhtml+xml"
        }
        r = requests.get(url, timeout=TIMEOUT, headers=headers, allow_redirects=True)

        # Bail on huge pages (>2MB)
        if len(r.content) > 2_000_000:
            return 5, 50, ["page_too_large"], "ok"

        html = r.text
        soup = BeautifulSoup(html, "html.parser")
        text = soup.get_text(" ", strip=True)

        # HTTPS
        if not url.startswith("https"):
            score -= 2
            issues.append("no_https")

        # Title
        title = soup.title
        if not title or not title.string or len(title.string.strip()) < 5:
            score -= 1
            issues.append("no_title")

        # Meta description
        meta_desc = soup.find("meta", attrs={"name": "description"})
        if not meta_desc or not meta_desc.get("content", "").strip():
            score -= 2
            issues.append("no_meta_description")

        # Mobile viewport
        viewport = soup.find("meta", attrs={"name": "viewport"})
        if not viewport:
            score -= 2
            issues.append("not_mobile_friendly")

        # Content richness
        if len(text) < 300:
            score -= 2
            issues.append("very_low_content")
        elif len(text) < 800:
            score -= 1
            issues.append("thin_content")

        # Images
        imgs = soup.find_all("img")
        if len(imgs) < 2:
            score -= 1
            issues.append("few_images")

        # Contact info visible on page
        has_phone = bool(PHONE_RE.search(text))
        has_email = bool(EMAIL_RE.search(text))
        if not has_phone and not has_email:
            score -= 1
            issues.append("no_contact_info_visible")

        score = max(0, score)
        opportunity = round((10 - score) * 10)

        return score, opportunity, issues, "ok"

    except requests.exceptions.Timeout:
        return 2, 80, ["timeout"], "timeout"
    except requests.exceptions.SSLError:
        return 1, 90, ["ssl_error"], "ssl_error"
    except requests.exceptions.ConnectionError:
        return 0, 60, ["connection_error"], "connection_error"
    except Exception as e:
        return 0, 50, [str(e)[:80]], "error"


def process_row(args):
    idx, row = args
    url = row.get("website")
    place_id = str(row.get("place_id", ""))

    if not url or not isinstance(url, str) or url.strip() == "":
        return place_id, idx, row, 0, 50, [], "no_url"

    score, opportunity, issues, status = analyze_website(url.strip())
    return place_id, idx, row, score, opportunity, issues, status


# =========================
# LOAD
# =========================

df = pd.read_csv(INPUT, dtype={"place_id": str})
df = df[df["website"].notna() & (df["website"].str.strip() != "")].copy()

log(f"Total website leads: {len(df)}")

processed_ids = load_progress()
log(f"Already processed: {len(processed_ids)}")

to_process = df[~df["place_id"].isin(processed_ids)]
log(f"Remaining to score: {len(to_process)}")

# Load existing results
if os.path.exists(OUTPUT):
    existing = pd.read_csv(OUTPUT, dtype={"place_id": str})
    results = existing.to_dict("records")
    log(f"Loaded {len(results)} existing results")
else:
    results = []

# =========================
# CONCURRENT SCORING
# =========================

rows = [(i, row) for i, row in to_process.iterrows()]
done_ids = set(processed_ids)

log(f"\nStarting with {WORKERS} parallel workers...")
log("(Ctrl+C to stop — progress is saved every 100 leads)\n")

total = len(rows)
completed = 0

with ThreadPoolExecutor(max_workers=WORKERS) as executor:
    futures = {executor.submit(process_row, args): args for args in rows}

    for future in as_completed(futures):
        try:
            place_id, idx, row, score, opportunity, issues, status = future.result()

            enriched = row.to_dict()
            enriched["website_score"] = score
            enriched["website_opportunity"] = opportunity
            enriched["website_issues"] = ", ".join(issues)
            enriched["website_status"] = status

            results.append(enriched)
            done_ids.add(place_id)
            completed += 1

            pct = (completed / total) * 100
            log(f"[{pct:5.1f}%] {row.get('name', '')[:40]:<40} score={score}/10  opp={opportunity}  [{status}]")

            if completed % SAVE_EVERY == 0:
                pd.DataFrame(results).to_csv(OUTPUT, index=False)
                save_progress(done_ids)
                log(f"💾 Autosave — {len(results)} rows written\n")

        except Exception as e:
            log(f"❌ Future error: {e}")

# =========================
# FINAL SAVE
# =========================

out_df = pd.DataFrame(results)
out_df.to_csv(OUTPUT, index=False)
save_progress(done_ids)

log("\n=========================")
log("✅ SCORING COMPLETE")
log(f"Total scored: {len(out_df)}")

if len(out_df) > 0 and "website_opportunity" in out_df.columns:
    high_opp = (out_df["website_opportunity"] >= 60).sum()
    log(f"High opportunity (score>=60): {high_opp}")
log("=========================")
