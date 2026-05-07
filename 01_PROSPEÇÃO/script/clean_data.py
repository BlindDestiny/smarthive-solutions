import pandas as pd
import re
from datetime import datetime


def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")


VALID_EMAIL = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$')


def is_valid_email(email):
    if not email or not isinstance(email, str):
        return False
    e = email.strip()
    if not VALID_EMAIL.match(e):
        return False
    tld = e.rsplit('.', 1)[-1]
    return tld.isalpha() and len(tld) >= 2


log("=== LEAD DATA CLEANER ===")

# ---- Load sources ----
log("Loading leads_enriched.csv...")
base = pd.read_csv("leads_enriched.csv", dtype={"place_id": str})
log(f"  {len(base)} rows | cols: {list(base.columns)}")

log("Loading leads_with_emails.csv...")
emails_df = pd.read_csv("leads_with_emails.csv", dtype={"place_id": str})[["place_id", "email"]]
log(f"  {len(emails_df)} rows")

log("Loading leads_no_website_scored.csv...")
scored_df = pd.read_csv("leads_no_website_scored.csv", dtype={"place_id": str})[["place_id", "lead_score", "lead_reasons"]]
# already has dupes — keep highest score per place_id
scored_df = scored_df.sort_values("lead_score", ascending=False).drop_duplicates(subset=["place_id"], keep="first")
log(f"  {len(scored_df)} unique scored leads")

# ---- Merge ----
log("Merging...")
df = base.merge(emails_df, on="place_id", how="left")
df = df.merge(scored_df, on="place_id", how="left")

# ---- Deduplicate ----
before = len(df)
df = df.drop_duplicates(subset=["place_id"], keep="first")
log(f"Deduplication: {before} -> {len(df)} rows ({before - len(df)} duplicates removed)")

# ---- Email validation ----
raw_email_count = df["email"].notna().sum()
df["email"] = df["email"].apply(lambda e: e if is_valid_email(e) else None)
valid_count = df["email"].notna().sum()
log(f"Email validation: {raw_email_count} raw -> {valid_count} valid ({raw_email_count - valid_count} filtered out)")

# ---- Normalize ----
for col in ["website", "phone", "email", "address"]:
    if col in df.columns:
        df[col] = df[col].replace("", None)
        df[col] = df[col].where(df[col].notna(), None)

df["rating"] = pd.to_numeric(df["rating"], errors="coerce").fillna(0)
df["reviews"] = pd.to_numeric(df["reviews"], errors="coerce").fillna(0)
df["lead_score"] = pd.to_numeric(df.get("lead_score", 0), errors="coerce").fillna(0)

# Drop redundant detail columns (same data, different API call)
drop_cols = ["rating_details", "reviews_count_details", "lat", "lon", "open_now", "price_level"]
df = df.drop(columns=[c for c in drop_cols if c in df.columns])

# ---- Boolean flags ----
df["has_website"] = df["website"].notna()
df["has_email"] = df["email"].notna()
df["has_phone"] = df["phone"].notna()

# ---- Sort ----
df = df.sort_values("lead_score", ascending=False)

# ---- Save ----
df.to_csv("leads_master.csv", index=False)

log("\n=== DONE ===")
log(f"leads_master.csv: {len(df)} unique leads")
log(f"  With website : {df['has_website'].sum()}")
log(f"  No website   : {(~df['has_website']).sum()}")
log(f"  With email   : {df['has_email'].sum()}")
log(f"  With phone   : {df['has_phone'].sum()}")
log(f"  Scored leads : {(df['lead_score'] > 0).sum()}")
