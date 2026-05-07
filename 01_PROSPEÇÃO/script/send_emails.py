"""
Email sender — two modes:
  python send_emails.py              → sends to no-website leads
  python send_emails.py --website    → sends to bad-website leads
  python send_emails.py --test       → sends ONE email to TEST_EMAIL so you can preview it
"""

import smtplib
import ssl
import csv
import os
import sys
import time
import random
import pandas as pd
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# ======================================================
# CONFIG
# ======================================================

SMTP_HOST     = "smtp-relay.brevo.com"
SMTP_PORT     = 587
SMTP_USER     = "aa4f15001@smtp-brevo.com"
SMTP_PASSWORD = "FjP7GTxs60hBJybZ"

FROM_EMAIL    = "geral@smarthivesolutions.pt"
YOUR_NAME     = "Miguel"

TEST_EMAIL    = "geral@smarthivesolutions.pt"   # where --test sends to

DAILY_LIMIT   = 50        # week 1: 50 | week 2: 100 | week 3+: 200
DELAY_MIN     = 40
DELAY_MAX     = 90

# ======================================================
# FILES
# ======================================================

MASTER_FILE  = "leads_master.csv"
SCORED_FILE  = "leads_scored.csv"
CRM_FILE     = "crm_data.csv"
LOG_FILE     = "sends_log.csv"

# ======================================================
# TEMPLATES — no website
# ======================================================

SUBJECT_NO_WEB = "Vi o {name} no Google"

BODY_NO_WEB = """\
Olá,

Vi o {name} no Google Maps em {city} — {reviews} avaliações, muito bom para um negócio local!

Reparei que ainda não têm website. A maioria dos clientes hoje pesquisa no Google antes \
de contactar qualquer negócio — sem presença online, perdem clientes para concorrentes \
que já aparecem nas pesquisas.

Faço websites para negócios locais em Portugal. Posso mostrar alguns exemplos do que já fiz?

{name_sender}
"""

# ======================================================
# TEMPLATES — bad website
# ======================================================

SUBJECT_WEBSITE = "Encontrei um problema no site do {name}"

BODY_WEBSITE = """\
Olá,

Analisei o site do {name} e encontrei alguns problemas que estão a prejudicar \
a vossa visibilidade no Google:

{issues_list}

Estes problemas fazem com que o Google penalize o site nas pesquisas — \
ou seja, clientes que procuram por {keyword} em {city} podem não vos encontrar.

Faço websites e optimizações para negócios locais. Posso enviar-vos um \
diagnóstico mais completo, sem compromisso?

{name_sender}
"""

# ======================================================
# ISSUE → PORTUGUÊS
# ======================================================

ISSUE_LABELS = {
    "no_https":                  "Sem HTTPS — o site não tem cadeado de segurança (os navegadores avisam os visitantes)",
    "no_title":                  "Sem título definido — o Google não sabe como apresentar o vosso site",
    "no_meta_description":       "Sem descrição — o vosso site não aparece bem descrito nos resultados Google",
    "not_mobile_friendly":       "Não é compatível com telemóvel — mais de 70% das pesquisas são feitas no móvel",
    "very_low_content":          "Muito pouco conteúdo — o Google prefere sites com informação detalhada",
    "thin_content":              "Pouco conteúdo — o site precisa de mais texto para o Google o valorizar",
    "few_images":                "Poucas imagens — sites sem fotos têm menor taxa de conversão",
    "no_contact_info_visible":   "Contacto não visível — os visitantes não encontram facilmente como contactar",
    "timeout":                   "Site lento — demora demasiado a carregar e os utilizadores saem",
    "ssl_error":                 "Erro de certificado de segurança — o browser pode bloquear o acesso",
    "connection_error":          "Site com falhas de acesso — às vezes não abre correctamente",
    "page_too_large":            "Site demasiado pesado — carrega devagar, especialmente no móvel",
}


def format_issues(issues_str):
    if not issues_str or not isinstance(issues_str, str):
        return "— problemas técnicos de SEO e performance"
    raw = [i.strip() for i in issues_str.split(",") if i.strip()]
    lines = []
    for r in raw:
        label = ISSUE_LABELS.get(r)
        if label:
            lines.append(f"• {label}")
    return "\n".join(lines) if lines else "— problemas técnicos de SEO e performance"

# ======================================================
# HELPERS
# ======================================================

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")


def load_crm():
    if os.path.exists(CRM_FILE):
        return pd.read_csv(CRM_FILE, dtype={"place_id": str})
    return pd.DataFrame(columns=["place_id", "status", "contact_date",
                                  "follow_up_date", "notes", "channel"])


def mark_contacted(place_id, note="email sent"):
    crm = load_crm()
    today = datetime.now().strftime("%Y-%m-%d")
    row = {
        "place_id": str(place_id),
        "status": "contacted",
        "contact_date": today,
        "follow_up_date": "",
        "notes": note,
        "channel": "email",
    }
    if str(place_id) in crm["place_id"].values:
        for k, v in row.items():
            crm.loc[crm["place_id"] == str(place_id), k] = v
    else:
        crm = pd.concat([crm, pd.DataFrame([row])], ignore_index=True)
    crm.to_csv(CRM_FILE, index=False)


def log_send(name, city, email, status, error=""):
    exists = os.path.exists(LOG_FILE)
    with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not exists:
            writer.writerow(["timestamp", "name", "city", "email", "status", "error"])
        writer.writerow([datetime.now().isoformat(), name, city, email, status, error])


def build_no_web_email(name, city, reviews):
    reviews_str = str(int(reviews)) if pd.notna(reviews) else "várias"
    subject = SUBJECT_NO_WEB.format(name=name)
    body = BODY_NO_WEB.format(
        name=name, city=city, reviews=reviews_str, name_sender=YOUR_NAME,
    )
    return subject, body


def build_website_email(name, city, keyword, issues_str):
    subject = SUBJECT_WEBSITE.format(name=name)
    issues_list = format_issues(issues_str)
    body = BODY_WEBSITE.format(
        name=name, city=city, keyword=keyword,
        issues_list=issues_list, name_sender=YOUR_NAME,
    )
    return subject, body


def send_one(to_email, subject, body):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = f"{YOUR_NAME} <{FROM_EMAIL}>"
    msg["To"]      = to_email
    msg.attach(MIMEText(body, "plain", "utf-8"))
    ctx = ssl.create_default_context()
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.ehlo()
        server.starttls(context=ctx)
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(FROM_EMAIL, to_email, msg.as_string())

# ======================================================
# MODE
# ======================================================

mode = "no_website"
if "--website" in sys.argv:
    mode = "bad_website"
elif "--test" in sys.argv:
    mode = "test"

log(f"Mode: {mode}")

# ======================================================
# LOAD
# ======================================================

df_master = pd.read_csv(MASTER_FILE, dtype={"place_id": str})
crm = load_crm()
already_contacted = set(crm[crm["status"] != "new"]["place_id"].tolist())

# ======================================================
# TEST MODE — one email to yourself
# ======================================================

if mode == "test":
    # Find best bad-website lead to demo
    if not os.path.exists(SCORED_FILE):
        log("ERROR: leads_scored.csv not found. Run score_website_leads.py first.")
        sys.exit(1)

    scored = pd.read_csv(SCORED_FILE, dtype={"place_id": str})
    scored["website_opportunity"] = pd.to_numeric(scored["website_opportunity"], errors="coerce").fillna(0)
    scored["reviews"] = pd.to_numeric(scored["reviews"], errors="coerce").fillna(0)

    # Pick a real lead: Lisboa, high opportunity, enough reviews to feel credible
    sample = scored[
        (scored["city"] == "Lisboa") &
        (scored["website_opportunity"] >= 80) &
        (scored["reviews"] >= 30) &
        (scored["website_status"] == "ok")
    ].sort_values("reviews", ascending=False)

    if len(sample) == 0:
        sample = scored[scored["website_opportunity"] >= 80].sort_values("reviews", ascending=False)

    lead = sample.iloc[0]

    name     = str(lead["name"])
    city     = str(lead["city"])
    keyword  = str(lead["keyword"])
    issues   = str(lead.get("website_issues", ""))
    website  = str(lead.get("website", ""))
    reviews  = lead.get("reviews", 0)

    subject, body = build_website_email(name, city, keyword, issues)

    log(f"Test lead: {name} | {city} | {keyword}")
    log(f"Website:   {website}")
    log(f"Issues:    {issues}")
    log(f"Opp score: {lead['website_opportunity']}")
    log(f"Reviews:   {int(reviews)}")
    log("")
    log(f"Subject: {subject}")
    log("--- BODY ---")
    print(body)
    log("--- END ---")
    log(f"Sending to: {TEST_EMAIL}")

    try:
        send_one(TEST_EMAIL, subject, body)
        log("OK - Test email sent!")
    except Exception as e:
        log(f"FAILED: {e}")

    sys.exit(0)

# ======================================================
# NO-WEBSITE MODE
# ======================================================

if mode == "no_website":
    targets = df_master[
        df_master["has_email"].fillna(False).astype(bool) &
        df_master["website"].isna() &
        ~df_master["place_id"].isin(already_contacted)
    ].copy()
    targets["reviews"] = pd.to_numeric(targets["reviews"], errors="coerce").fillna(0)
    targets = targets.sort_values("lead_score", ascending=False)
    log(f"No-website targets: {len(targets)} | sending max {DAILY_LIMIT}\n")

    sent = failed = 0
    for _, row in targets.iterrows():
        if sent >= DAILY_LIMIT:
            log(f"Daily limit reached ({DAILY_LIMIT}).")
            break
        name, city = str(row["name"]), str(row["city"])
        email, place_id = str(row["email"]), str(row["place_id"])
        subject, body = build_no_web_email(name, city, row["reviews"])
        log(f"→ {name} ({city}) <{email}>")
        try:
            send_one(email, subject, body)
            mark_contacted(place_id, "no-website email sent")
            log_send(name, city, email, "sent")
            sent += 1
            log(f"  ✓ {sent}/{DAILY_LIMIT}\n")
        except Exception as e:
            log(f"  ✗ {e}\n")
            log_send(name, city, email, "failed", str(e))
            failed += 1
        if sent < DAILY_LIMIT:
            time.sleep(random.randint(DELAY_MIN, DELAY_MAX))

# ======================================================
# BAD-WEBSITE MODE
# ======================================================

elif mode == "bad_website":
    if not os.path.exists(SCORED_FILE):
        log("ERROR: leads_scored.csv not found.")
        sys.exit(1)

    scored = pd.read_csv(SCORED_FILE, dtype={"place_id": str})
    scored["website_opportunity"] = pd.to_numeric(scored["website_opportunity"], errors="coerce").fillna(0)
    scored["reviews"] = pd.to_numeric(scored["reviews"], errors="coerce").fillna(0)

    targets = scored[
        scored["email"].notna() &
        (scored["email"] != "") &
        (scored["website_opportunity"] >= 60) &
        ~scored["place_id"].isin(already_contacted)
    ].copy()
    targets = targets.sort_values("website_opportunity", ascending=False)
    log(f"Bad-website targets: {len(targets)} | sending max {DAILY_LIMIT}\n")

    sent = failed = 0
    for _, row in targets.iterrows():
        if sent >= DAILY_LIMIT:
            log(f"Daily limit reached ({DAILY_LIMIT}).")
            break
        name     = str(row["name"])
        city     = str(row["city"])
        keyword  = str(row.get("keyword", ""))
        email    = str(row["email"])
        place_id = str(row["place_id"])
        issues   = str(row.get("website_issues", ""))
        subject, body = build_website_email(name, city, keyword, issues)
        log(f"→ {name} ({city}) <{email}> | opp={int(row['website_opportunity'])}")
        try:
            send_one(email, subject, body)
            mark_contacted(place_id, f"bad-website email sent | opp={int(row['website_opportunity'])}")
            log_send(name, city, email, "sent")
            sent += 1
            log(f"  ✓ {sent}/{DAILY_LIMIT}\n")
        except Exception as e:
            log(f"  ✗ {e}\n")
            log_send(name, city, email, "failed", str(e))
            failed += 1
        if sent < DAILY_LIMIT:
            time.sleep(random.randint(DELAY_MIN, DELAY_MAX))

log(f"\n=== DONE · sent={sent} failed={failed} ===")
