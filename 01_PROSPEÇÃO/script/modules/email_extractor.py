import pandas as pd
import requests
import re
import time
import os
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from concurrent.futures import ThreadPoolExecutor, TimeoutError

# =========================
# CONFIG
# =========================

INPUT = "leads_with_websites.csv"
OUTPUT = "leads_with_emails.csv"

SLEEP = 1
TIMEOUT = 10
HARD_TIMEOUT = 15
SAVE_EVERY = 50

EMAIL_REGEX = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"

# =========================
# HELPERS
# =========================

def log(msg):
    print(msg)

def find_emails(text):
    return list(set(re.findall(EMAIL_REGEX, text)))

def scrape_page(url):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0",
            "Accept-Language": "pt-PT,pt;q=0.9"
        }

        r = requests.get(
            url,
            timeout=TIMEOUT,
            headers=headers,
            allow_redirects=True
        )

        if len(r.text) > 2_000_000:
            return ""

        return r.text

    except:
        return ""

def extract_from_website(url):
    emails = set()

    html = scrape_page(url)
    emails.update(find_emails(html))

    if emails:
        return list(emails)[0]

    try:
        soup = BeautifulSoup(html, "html.parser")
        links = [a.get("href") for a in soup.find_all("a", href=True)]

        contact_keywords = ["contact", "contactos", "contato", "about"]

        for link in links:
            if any(k in link.lower() for k in contact_keywords):
                full_url = urljoin(url, link)

                html2 = scrape_page(full_url)
                emails.update(find_emails(html2))

                if emails:
                    return list(emails)[0]

    except:
        pass

    return None

# =========================
# TIMEOUT WRAPPER
# =========================

def run_with_timeout(func, args=(), timeout=15):
    with ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(func, *args)
        try:
            return future.result(timeout=timeout)
        except TimeoutError:
            return None

# =========================
# LOAD
# =========================

df = pd.read_csv(INPUT)

# =========================
# RESUME
# =========================

if os.path.exists(OUTPUT):
    df_existing = pd.read_csv(OUTPUT)

    if "place_id" in df_existing.columns:
        df_existing = df_existing.drop_duplicates(subset=["place_id"])

    processed = len(df_existing)
    results = df_existing.to_dict("records")

    print(f"▶️ Retomar de: {processed}/{len(df)}")

else:
    processed = 0
    results = []
    print("🆕 Novo run")

# =========================
# LOOP
# =========================

for i in range(processed, len(df)):

    row = df.iloc[i]
    url = row.get("website")
    name = row.get("name")

    print(f"[{i+1}/{len(df)}] {name}")

    email = None

    try:
        if pd.isna(url):
            email = None
        else:
            email = run_with_timeout(
                extract_from_website,
                args=(url,),
                timeout=HARD_TIMEOUT
            )

            if email is None:
                log("⏱ timeout / sem email")

    except Exception as e:
        log(f"❌ erro: {e}")
        email = None

    finally:
        enriched = row.to_dict()
        enriched["email"] = email
        results.append(enriched)

    # autosave
    if (i + 1) % SAVE_EVERY == 0:
        pd.DataFrame(results).to_csv(OUTPUT, index=False)
        print("💾 autosave")

    time.sleep(SLEEP)

# =========================
# FINAL SAVE
# =========================

pd.DataFrame(results).to_csv(OUTPUT, index=False)

print("✅ DONE")