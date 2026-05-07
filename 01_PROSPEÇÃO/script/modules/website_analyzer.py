import pandas as pd
import requests
import time
import json
from bs4 import BeautifulSoup
from datetime import datetime

# =========================
# CONFIG
# =========================

INPUT = "leads_with_websites.csv"
OUTPUT = "leads_scored.csv"
PROGRESS_FILE = "progress.json"

SLEEP = 1.2
TIMEOUT = 10
SAVE_EVERY = 20

CLAUDE_API_KEY = "SUA_CLAUDE_API_KEY_AQUI"

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
        with open(PROGRESS_FILE, "r") as f:
            return json.load(f).get("last_index", 0)
    except:
        return 0

def save_progress(i):
    with open(PROGRESS_FILE, "w") as f:
        json.dump({"last_index": i}, f)

# =========================
# CLAUDE AI CALL
# =========================

def ai_analyze(text, url):

    prompt = f"""
És um consultor de marketing digital.

Analisa este website:

URL: {url}

Conteúdo:
{text[:4000]}

Responde de forma estruturada:

1. Problemas principais
2. Oportunidades de melhoria
3. Vendas perdidas
4. Nota de presença digital (0-10)
"""

    try:
        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": CLAUDE_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            },
            json={
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 800,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            },
            timeout=40
        )

        data = response.json()

        # segurança extra
        if "content" not in data:
            return f"CLAUDE_ERROR: {json.dumps(data)[:300]}"

        return data["content"][0]["text"]

    except Exception as e:
        return f"CLAUDE_ERROR: {str(e)}"

# =========================
# SCRAPER
# =========================

def analyze_website(url):

    score = 0
    issues = []

    try:
        headers = {"User-Agent": "Mozilla/5.0"}

        r = requests.get(url, timeout=TIMEOUT, headers=headers)
        html = r.text

        soup = BeautifulSoup(html, "html.parser")
        text = soup.get_text(" ", strip=True)

        # heurísticas simples
        if soup.title:
            score += 1
        else:
            issues.append("no title")

        if soup.find("meta", attrs={"name": "description"}):
            score += 1
        else:
            issues.append("no meta description")

        if url.startswith("https"):
            score += 1
        else:
            issues.append("no https")

        if len(soup.find_all("img")) > 3:
            score += 1
        else:
            issues.append("few images")

        if len(text) > 800:
            score += 1
        else:
            issues.append("low content")
        if score >= 2:
            ai_result = ai_analyze(text, url)
        else:
            ai_result = "HIGH_QUALITY_WEBSITE_SKIPPING"

        return score, issues, ai_result

    except Exception as e:
        return 0, [str(e)], "AI_ERROR"

# =========================
# LOAD DATA
# =========================

df = pd.read_csv(INPUT)

start_index = load_progress()

log(f"📥 Total leads: {len(df)}")
log(f"▶️ Resume at: {start_index}")

results = []

# =========================
# MAIN LOOP
# =========================

for i in range(start_index, len(df)):

    row = df.iloc[i]
    url = row.get("website")
    name = row.get("name")

    progress = (i / len(df)) * 100
    log(f"🔎 [{progress:.2f}%] {name}")

    if pd.isna(url):
        log("⏭️ sem website")
        continue

    score, issues, ai_result = analyze_website(url)

    enriched = row.to_dict()
    enriched.update({
        "website_score": score,
        "website_issues": ",".join(issues),
        "ai_insight": ai_result
    })

    results.append(enriched)

    # 💾 autosave
    if len(results) % SAVE_EVERY == 0:
        pd.DataFrame(results).to_csv(OUTPUT, index=False)
        save_progress(i)
        log(f"💾 saved {len(results)} rows")

    time.sleep(SLEEP)

# =========================
# FINAL SAVE
# =========================

pd.DataFrame(results).to_csv(OUTPUT, index=False)
save_progress(len(df))

log("✅ DONE")