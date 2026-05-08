import streamlit as st
import pandas as pd
import os
import re
import urllib.parse
from datetime import datetime, timedelta

st.set_page_config(page_title="Lead Machine", layout="wide", page_icon="🚀")

# =============================================================
# CONFIG
# =============================================================

_DIR = os.path.dirname(os.path.abspath(__file__))
MASTER_FILE   = os.path.join(_DIR, "leads_master.csv")
CRM_FILE      = os.path.join(_DIR, "crm_data.csv")
ACTIVITY_FILE = os.path.join(_DIR, "crm_activity.csv")
SCORED_FILE   = os.path.join(_DIR, "leads_scored.csv")

CRM_STATUSES = ["new","contacted","replied","interested","meeting","proposal","closed_won","closed_lost"]

STATUS_EMOJI = {
    "new":         "🔵",
    "contacted":   "🟡",
    "replied":     "🟢",
    "interested":  "✨",
    "meeting":     "📅",
    "proposal":    "📄",
    "closed_won":  "🏆",
    "closed_lost": "❌",
}

STATUS_COLOR = {
    "new":         "#3b82f6",
    "contacted":   "#f59e0b",
    "replied":     "#10b981",
    "interested":  "#8b5cf6",
    "meeting":     "#06b6d4",
    "proposal":    "#f97316",
    "closed_won":  "#22c55e",
    "closed_lost": "#ef4444",
}

LOST_REASONS = [
    "—",
    "Muito caro",
    "Sem orçamento agora",
    "Foi para outro fornecedor",
    "Não viu valor no website",
    "Já tem alguém a tratar",
    "Não respondeu mais",
    "Não precisa agora",
    "Outro",
]

ACTIVITY_TYPES = ["nota","whatsapp","email","chamada","reunião","proposta enviada","outro"]
ACTIVITY_ICONS = {
    "nota":             "📝",
    "whatsapp":         "💬",
    "email":            "📧",
    "chamada":          "📞",
    "reunião":          "📅",
    "proposta enviada": "📄",
    "mudança_status":   "🔄",
    "outro":            "🔔",
}

FUNNEL_STAGES = [
    ("Contactados",  ["contacted","replied","interested","meeting","proposal","closed_won","closed_lost"]),
    ("Responderam",  ["replied","interested","meeting","proposal","closed_won","closed_lost"]),
    ("Interessados", ["interested","meeting","proposal","closed_won"]),
    ("Reunião",      ["meeting","proposal","closed_won"]),
    ("Proposta",     ["proposal","closed_won"]),
    ("Fechados 🏆",  ["closed_won"]),
]

# =============================================================
# PHONE HELPERS
# =============================================================

WA_TEMPLATE = (
    "Olá! Vi o negócio *{name}* no Google Maps em {city} "
    "— {reviews} avaliações, óptimo! 👏\n\n"
    "Reparei que ainda não têm website. Trabalho com negócios "
    "locais a aparecer no Google e conseguir mais clientes online.\n\n"
    "Posso mostrar exemplos do que faço? 🙂"
)

def _clean_digits(phone):
    if not phone or not isinstance(phone, str): return None
    d = re.sub(r"\D", "", phone)
    if d.startswith("00351") and len(d) == 14: d = d[5:]
    elif d.startswith("351") and len(d) == 12: d = d[3:]
    return d if len(d) == 9 else None

def classify_phone(phone):
    d = _clean_digits(phone)
    if not d: return "unknown"
    if d.startswith("9"): return "mobile"
    if d.startswith("2"): return "landline"
    return "unknown"

def make_wa_link(phone, name, city, reviews):
    d = _clean_digits(phone)
    if not d or not d.startswith("9"): return None
    try:
        msg = WA_TEMPLATE.format(name=str(name), city=str(city), reviews=int(reviews) if reviews == reviews else 0)
    except Exception:
        msg = WA_TEMPLATE.format(name=name, city=city, reviews=0)
    return f"https://wa.me/351{d}?text={urllib.parse.quote(msg)}"

# =============================================================
# CRM HELPERS
# =============================================================

def load_crm():
    if os.path.exists(CRM_FILE):
        crm = pd.read_csv(CRM_FILE, dtype={"place_id": str})
    else:
        crm = pd.DataFrame()
    defaults = {
        "place_id": "", "status": "new", "contact_date": "",
        "follow_up_date": "", "notes": "", "channel": "whatsapp",
        "deal_value": 0, "lost_reason": "", "next_action": ""
    }
    for col, val in defaults.items():
        if col not in crm.columns:
            crm[col] = val
    crm["deal_value"] = pd.to_numeric(crm["deal_value"], errors="coerce").fillna(0)
    return crm


def save_crm(crm):
    crm.to_csv(CRM_FILE, index=False)


def load_activity():
    if os.path.exists(ACTIVITY_FILE):
        return pd.read_csv(ACTIVITY_FILE, dtype={"place_id": str})
    return pd.DataFrame(columns=["timestamp","place_id","type","content","old_status","new_status","channel"])


def log_activity(place_id, act_type, content="", old_status="", new_status="", channel=""):
    activity = load_activity()
    new_row = pd.DataFrame([{
        "timestamp":  datetime.now().isoformat(),
        "place_id":   str(place_id),
        "type":       act_type,
        "content":    content,
        "old_status": old_status,
        "new_status": new_status,
        "channel":    channel,
    }])
    pd.concat([activity, new_row], ignore_index=True).to_csv(ACTIVITY_FILE, index=False)


def upsert_crm(place_id, status, contact_date, follow_up_date, notes,
               channel, deal_value=0, lost_reason="", next_action="",
               old_status="new", new_note=""):
    crm  = load_crm()
    today = datetime.now().strftime("%Y-%m-%d")
    row  = {
        "place_id":      str(place_id),
        "status":        status,
        "contact_date":  contact_date or (today if old_status == "new" and status != "new" else ""),
        "follow_up_date": follow_up_date,
        "notes":         notes,
        "channel":       channel,
        "deal_value":    float(deal_value or 0),
        "lost_reason":   lost_reason,
        "next_action":   next_action,
    }
    if str(place_id) in crm["place_id"].values:
        for k, v in row.items():
            crm.loc[crm["place_id"] == str(place_id), k] = v
    else:
        crm = pd.concat([crm, pd.DataFrame([row])], ignore_index=True)
    save_crm(crm)
    if old_status != status:
        log_activity(place_id, "mudança_status", f"{STATUS_EMOJI.get(old_status,'')} {old_status} → {STATUS_EMOJI.get(status,'')} {status}", old_status, status, channel)
    if new_note:
        log_activity(place_id, "nota", new_note, "", "", channel)


def quick_log(place_id, act_type, content, channel=""):
    log_activity(place_id, act_type, content, channel=channel)


def time_ago(ts_str):
    try:
        ts  = datetime.fromisoformat(str(ts_str))
        diff = datetime.now() - ts
        if diff.seconds < 3600:   return f"há {diff.seconds//60} min"
        if diff.days == 0:        return f"há {diff.seconds//3600}h"
        if diff.days == 1:        return "ontem"
        if diff.days < 7:         return f"há {diff.days} dias"
        if diff.days < 30:        return f"há {diff.days//7} sem."
        return ts.strftime("%d/%m/%Y")
    except Exception:
        return str(ts_str)[:10]

# =============================================================
# DATA LOAD
# =============================================================

@st.cache_data
def load_leads():
    if not os.path.exists(MASTER_FILE):
        return pd.DataFrame()
    df = pd.read_csv(MASTER_FILE, dtype={"place_id": str})
    for col in ["website","phone","email","address","lead_reasons","website_issues"]:
        if col not in df.columns: df[col] = None
        else: df[col] = df[col].replace("", None)
    df["reviews"]    = pd.to_numeric(df.get("reviews",    0), errors="coerce").fillna(0)
    df["rating"]     = pd.to_numeric(df.get("rating",     0), errors="coerce").fillna(0)
    df["lead_score"] = pd.to_numeric(df.get("lead_score", 0), errors="coerce").fillna(0)
    if os.path.exists(SCORED_FILE):
        scored = pd.read_csv(SCORED_FILE, dtype={"place_id": str})
        cols   = [c for c in ["place_id","website_score","website_opportunity","website_issues"] if c in scored.columns]
        df     = df.merge(scored[cols], on="place_id", how="left", suffixes=("","_s"))
        if "website_issues_s" in df.columns:
            df["website_issues"] = df["website_issues"].combine_first(df["website_issues_s"])
            df = df.drop(columns=["website_issues_s"])
    for col in ["website_score","website_opportunity"]:
        if col not in df.columns: df[col] = None
    return df


def compute_priority(row):
    score = 0
    if pd.isna(row.get("website")):          score += 40
    if pd.notna(row.get("email")):           score += 15
    elif pd.notna(row.get("phone")):         score += 8
    rev = float(row.get("reviews",0) or 0)
    if rev > 200: score += 25
    elif rev > 50: score += 15
    elif rev > 10: score += 5
    rat = float(row.get("rating",0) or 0)
    if rat >= 4.5: score += 10
    elif rat >= 4.0: score += 5
    score += float(row.get("lead_score",0) or 0) * 0.3
    opp = row.get("website_opportunity")
    if opp is not None and not pd.isna(opp): score += float(opp) * 0.2
    return int(min(round(score), 200))

# =============================================================
# BUILD WORKING DATAFRAME
# =============================================================

_LEADS_AVAILABLE = os.path.exists(MASTER_FILE)

if _LEADS_AVAILABLE:
    df_base = load_leads()
    crm     = load_crm()
    crm_cols = ["place_id","status","contact_date","follow_up_date","notes",
                "channel","deal_value","lost_reason","next_action"]
    df = df_base.merge(crm[crm_cols], on="place_id", how="left")
    df["status"]     = df["status"].fillna("new")
    df["deal_value"] = pd.to_numeric(df.get("deal_value",0), errors="coerce").fillna(0)
    df["priority"]   = df.apply(compute_priority, axis=1)
    df["_icon"]      = df["status"].map(STATUS_EMOJI).fillna("🔵")
    df["phone_type"] = df["phone"].apply(classify_phone)
    df["wa_link"]    = df.apply(
        lambda r: make_wa_link(r["phone"], r.get("name",""), r.get("city",""), r.get("reviews",0))
        if r["phone_type"] == "mobile" else None, axis=1)
else:
    df = pd.DataFrame()

# =============================================================
# SIDEBAR FILTERS
# =============================================================

if _LEADS_AVAILABLE:
    st.sidebar.title("🎯 Filters")
    status_filter  = st.sidebar.multiselect("Status", CRM_STATUSES,
        default=["new","contacted","replied","interested","meeting","proposal"],
        format_func=lambda s: f"{STATUS_EMOJI.get(s,'')} {s.replace('_',' ').title()}")
    website_filter = st.sidebar.selectbox("Website", ["All","No Website","Has Website"])
    email_filter   = st.sidebar.selectbox("Email",   ["All","Has Email","No Email"])
    phone_filter   = st.sidebar.selectbox("Phone",   ["All","Has Phone","Mobile only","Landline only","No Phone"])
    city_filter    = st.sidebar.text_input("City contains")
    keyword_filter = st.sidebar.text_input("Keyword contains")
    min_priority   = st.sidebar.slider("Min Priority", 0, 200, 30)
    min_reviews    = st.sidebar.slider("Min Reviews",  0, 500,  0)

    # =============================================================
    # FILTER
    # =============================================================

    filtered = df.copy()
    if status_filter:                  filtered = filtered[filtered["status"].isin(status_filter)]
    if website_filter == "No Website": filtered = filtered[filtered["website"].isna()]
    elif website_filter == "Has Website": filtered = filtered[filtered["website"].notna()]
    if email_filter == "Has Email":    filtered = filtered[filtered["email"].notna()]
    elif email_filter == "No Email":   filtered = filtered[filtered["email"].isna()]
    if phone_filter == "Has Phone":     filtered = filtered[filtered["phone"].notna()]
    elif phone_filter == "Mobile only":  filtered = filtered[filtered["phone_type"]=="mobile"]
    elif phone_filter == "Landline only": filtered = filtered[filtered["phone_type"]=="landline"]
    elif phone_filter == "No Phone":     filtered = filtered[filtered["phone"].isna()]
    if city_filter:    filtered = filtered[filtered["city"].astype(str).str.contains(city_filter, case=False, na=False)]
    if keyword_filter: filtered = filtered[filtered["keyword"].astype(str).str.contains(keyword_filter, case=False, na=False)]
    filtered = filtered[filtered["priority"] >= min_priority]
    filtered = filtered[filtered["reviews"]  >= min_reviews]
    filtered = filtered.sort_values("priority", ascending=False).reset_index(drop=True)
else:
    filtered = pd.DataFrame()
    status_filter = website_filter = email_filter = phone_filter = city_filter = keyword_filter = None
    min_priority = min_reviews = 0

# =============================================================
# TABS
# =============================================================

tab_leads, tab_crm, tab_outreach, tab_templates = st.tabs(
    ["📋 Leads", "📊 CRM", "📞 Outreach", "✉️ Templates"])


# ═══════════════════════════════════════════════════════════════
# TAB 1 — LEADS
# ═══════════════════════════════════════════════════════════════

with tab_leads:
    st.title("🚀 Lead Machine")
    if not _LEADS_AVAILABLE:
        st.info("📂 `leads_master.csv` not found. This tab requires the local data file. The **Demo: Restaurant CRM** tab works without it.")
        st.stop()

    c1,c2,c3,c4,c5 = st.columns(5)
    c1.metric("Filtered",     len(filtered))
    c2.metric("No Website",   int(filtered["website"].isna().sum()))
    c3.metric("Has Email",    int(filtered["email"].notna().sum()))
    c4.metric("Has Phone",    int(filtered["phone"].notna().sum()))
    c5.metric("Priority >80", int((filtered["priority"]>80).sum()))

    st.divider()

    show_cols = ["_icon","name","city","keyword","rating","reviews",
                 "website","email","phone","priority","status"]
    show_cols = [c for c in show_cols if c in filtered.columns]

    st.dataframe(
        filtered[show_cols].rename(columns={"_icon":""}),
        use_container_width=True, height=420, hide_index=True)

    st.divider()

    # ── Lead Detail & CRM ──
    st.subheader("🔍 Lead Detail & CRM Update")

    if len(filtered) == 0:
        st.info("No leads match current filters.")
    else:
        lead_opts = [f"{r['name']} — {r['city']}" for _,r in filtered.iterrows()]
        sel_label = st.selectbox("Select a lead", lead_opts)
        sel_idx   = lead_opts.index(sel_label)
        lead      = filtered.iloc[sel_idx]
        place_id  = str(lead["place_id"])

        cur = crm[crm["place_id"] == place_id]
        cur_status     = cur.iloc[0]["status"]      if len(cur) > 0 else "new"
        cur_notes      = cur.iloc[0]["notes"]       if len(cur) > 0 else ""
        cur_channel    = cur.iloc[0]["channel"]     if len(cur) > 0 else "whatsapp"
        cur_follow_up  = cur.iloc[0]["follow_up_date"] if len(cur) > 0 else ""
        cur_contact_d  = cur.iloc[0]["contact_date"]   if len(cur) > 0 else ""
        cur_deal       = cur.iloc[0]["deal_value"]  if len(cur) > 0 else 0
        cur_lost       = cur.iloc[0]["lost_reason"] if len(cur) > 0 else ""
        cur_next       = cur.iloc[0]["next_action"] if len(cur) > 0 else ""

        for v in [cur_notes, cur_channel, cur_follow_up, cur_contact_d, cur_lost, cur_next]:
            if pd.isna(v): v = ""

        col_info, col_crm = st.columns(2)

        # Business info
        with col_info:
            st.markdown("**Business Info**")
            st.write(f"**Name:** {lead.get('name','')}")
            st.write(f"**City:** {lead.get('city','')}")
            st.write(f"**Keyword:** {lead.get('keyword','')}")
            st.write(f"**Rating:** {lead.get('rating','')} ⭐ ({int(lead.get('reviews',0))} reviews)")
            st.write(f"**Priority:** {lead.get('priority',0)}")

            phone_val = lead.get("phone")
            if pd.notna(phone_val):
                wa = lead.get("wa_link")
                wa_txt = f" · [💬 WhatsApp]({wa})" if wa else ""
                st.markdown(f"**Phone:** {phone_val}{wa_txt}")
            else:
                st.write("**Phone:** —")

            email_val = lead.get("email")
            st.write(f"**Email:** {email_val if pd.notna(email_val) else '—'}")

            website_val = lead.get("website")
            if pd.notna(website_val):
                st.markdown(f"**Website:** [{website_val}]({website_val})")
            else:
                st.write("**Website:** ❌ None")

            if pd.notna(lead.get("address")):
                st.write(f"**Address:** {lead['address']}")
            if pd.notna(lead.get("google_maps_url")):
                st.markdown(f"[📍 Google Maps]({lead['google_maps_url']})")
            if pd.notna(lead.get("lead_reasons")):
                st.caption(f"Lead reasons: {lead['lead_reasons']}")

        # CRM Update form
        with col_crm:
            st.markdown("**CRM Update**")
            with st.form(key=f"crm_{place_id}"):
                new_status  = st.selectbox("Status", CRM_STATUSES,
                    index=CRM_STATUSES.index(cur_status) if cur_status in CRM_STATUSES else 0,
                    format_func=lambda s: f"{STATUS_EMOJI.get(s,'')} {s.replace('_',' ').title()}")
                new_channel = st.selectbox("Channel", ["whatsapp","email","phone","in_person","other"],
                    index=["whatsapp","email","phone","in_person","other"].index(cur_channel)
                    if cur_channel in ["whatsapp","email","phone","in_person","other"] else 0)

                col_deal, col_fu = st.columns(2)
                new_deal = col_deal.number_input("Deal value (€)", min_value=0, value=int(cur_deal or 0), step=50)
                new_fu   = col_fu.text_input("Follow-up date (YYYY-MM-DD)", value=str(cur_follow_up or ""))

                new_next = st.text_input("Next action", value=str(cur_next or ""),
                    placeholder="Ex: Enviar proposta, Ligar, Marcar reunião...")

                if new_status == "closed_lost":
                    new_lost = st.selectbox("Lost reason", LOST_REASONS,
                        index=LOST_REASONS.index(cur_lost) if cur_lost in LOST_REASONS else 0)
                else:
                    new_lost = ""

                new_notes = st.text_area("Notes (current)", value=str(cur_notes or ""), height=80)
                new_note_log = st.text_input("➕ Add note to timeline", placeholder="O que aconteceu agora...")

                if st.form_submit_button("💾 Save"):
                    new_cd = cur_contact_d or (datetime.now().strftime("%Y-%m-%d")
                             if cur_status == "new" and new_status != "new" else "")
                    upsert_crm(place_id, new_status, new_cd, new_fu, new_notes,
                               new_channel, new_deal, new_lost, new_next,
                               cur_status, new_note_log)
                    st.success("✅ Saved!")
                    st.cache_data.clear()
                    st.rerun()

        # ── Activity Timeline ──
        st.markdown("---")
        st.markdown("**🕐 Activity Timeline**")

        activity = load_activity()
        lead_acts = activity[activity["place_id"] == place_id].sort_values("timestamp", ascending=False)

        if len(lead_acts) == 0:
            st.caption("No activity recorded yet. Updates via the form above are automatically logged.")
        else:
            for _, act in lead_acts.iterrows():
                icon    = ACTIVITY_ICONS.get(str(act.get("type","")), "🔔")
                content = str(act.get("content",""))
                ts      = time_ago(act.get("timestamp",""))
                ch      = str(act.get("channel",""))

                cols_act = st.columns([0.05, 0.95])
                cols_act[0].write(icon)
                with cols_act[1]:
                    label = str(act.get("type","")).replace("_"," ").title()
                    if content:
                        st.markdown(f"**{label}** · {ts}{' · ' + ch if ch else ''}")
                        st.caption(content)
                    else:
                        st.markdown(f"**{label}** · {ts}{' · ' + ch if ch else ''}")

        # ── Quick Log Activity ──
        with st.expander("➕ Quick log activity"):
            with st.form(key=f"log_{place_id}"):
                qcols = st.columns([1,2,1])
                q_type    = qcols[0].selectbox("Type", ACTIVITY_TYPES, key=f"qt_{place_id}")
                q_content = qcols[1].text_input("What happened", key=f"qc_{place_id}")
                q_channel = qcols[2].text_input("Channel", value="whatsapp", key=f"qch_{place_id}")
                if st.form_submit_button("Log"):
                    quick_log(place_id, q_type, q_content, q_channel)
                    st.success("Logged!")
                    st.rerun()

    st.divider()
    csv_bytes = filtered.to_csv(index=False).encode("utf-8")
    st.download_button("⬇️ Export filtered CSV", csv_bytes, "filtered_leads.csv", "text/csv")


# ═══════════════════════════════════════════════════════════════
# TAB 2 — CRM
# ═══════════════════════════════════════════════════════════════

with tab_crm:
    st.title("📊 CRM Pipeline")
    if not _LEADS_AVAILABLE:
        st.info("📂 `leads_master.csv` not found. This tab requires the local data file.")
        st.stop()

    today_str = datetime.now().strftime("%Y-%m-%d")

    # ── Revenue Dashboard ──
    won   = df[df["status"] == "closed_won"]
    lost  = df[df["status"] == "closed_lost"]
    pipe  = df[df["status"].isin(["interested","meeting","proposal"])]
    this_month = won[won["contact_date"].astype(str).str.startswith(datetime.now().strftime("%Y-%m"))]

    total_won     = won["deal_value"].sum()
    pipeline_val  = pipe["deal_value"].sum()
    month_won     = this_month["deal_value"].sum()
    win_rate      = len(won) / max(len(won)+len(lost), 1) * 100
    avg_deal      = total_won / max(len(won), 1)

    st.subheader("💰 Revenue Dashboard")
    m1,m2,m3,m4,m5 = st.columns(5)
    m1.metric("Pipeline (€)",     f"€{pipeline_val:,.0f}",  help="Valor total em interested+meeting+proposal")
    m2.metric("Won total (€)",    f"€{total_won:,.0f}")
    m3.metric("Este mês (€)",     f"€{month_won:,.0f}")
    m4.metric("Win rate",         f"{win_rate:.0f}%",        help="Won / (Won + Lost)")
    m5.metric("Avg deal (€)",     f"€{avg_deal:,.0f}" if len(won) > 0 else "—")

    st.divider()

    # ── Conversion Funnel ──
    st.subheader("🔻 Conversion Funnel")

    funnel_counts = [(label, len(df[df["status"].isin(statuses)])) for label, statuses in FUNNEL_STAGES]
    first_count   = funnel_counts[0][1] if funnel_counts[0][1] > 0 else 1

    fcols = st.columns(len(funnel_counts))
    prev  = None
    for i, (label, count) in enumerate(funnel_counts):
        pct_from_top  = f"{count/first_count*100:.0f}% do total"
        pct_from_prev = f"↓ {count/prev*100:.0f}%" if prev and prev > 0 else ""
        with fcols[i]:
            st.metric(label, count, pct_from_prev if pct_from_prev else None)
            st.caption(pct_from_top)
            if count > 0:
                st.progress(count / first_count)
        prev = count if count > 0 else prev

    st.divider()

    # ── Follow-ups ──
    st.subheader("⏰ Follow-ups")

    fu_df = df[df["follow_up_date"].notna() & (df["follow_up_date"].astype(str).str.strip() != "")].copy()

    if len(fu_df) == 0:
        st.info("No follow-ups scheduled. Set follow-up dates in the Leads tab.")
    else:
        overdue    = fu_df[fu_df["follow_up_date"].astype(str) < today_str].sort_values("follow_up_date")
        due_today  = fu_df[fu_df["follow_up_date"].astype(str) == today_str]
        next7      = fu_df[(fu_df["follow_up_date"].astype(str) > today_str) &
                           (fu_df["follow_up_date"].astype(str) <= (datetime.now()+timedelta(days=7)).strftime("%Y-%m-%d"))].sort_values("follow_up_date")

        if len(overdue) > 0:
            st.error(f"⚠️ {len(overdue)} overdue follow-up(s)")
            show_fu = ["_icon","name","city","phone","email","status","follow_up_date","next_action","notes"]
            show_fu = [c for c in show_fu if c in overdue.columns]
            st.dataframe(overdue[show_fu].rename(columns={"_icon":""}), use_container_width=True, hide_index=True)

        if len(due_today) > 0:
            st.warning(f"📅 {len(due_today)} follow-up(s) due today")
            show_fu = ["_icon","name","city","phone","email","status","next_action","notes"]
            show_fu = [c for c in show_fu if c in due_today.columns]
            st.dataframe(due_today[show_fu].rename(columns={"_icon":""}), use_container_width=True, hide_index=True)

        if len(next7) > 0:
            with st.expander(f"🗓️ {len(next7)} upcoming (next 7 days)"):
                show_fu = ["_icon","name","city","status","follow_up_date","next_action"]
                show_fu = [c for c in show_fu if c in next7.columns]
                st.dataframe(next7[show_fu].rename(columns={"_icon":""}), use_container_width=True, hide_index=True)

    st.divider()

    # ── Active Pipeline ──
    st.subheader("📋 Active Pipeline")

    active_statuses = ["contacted","replied","interested","meeting","proposal"]
    active = df[df["status"].isin(active_statuses)].sort_values(
        ["status","priority"], ascending=[True,False])

    if len(active) == 0:
        st.info("No active leads yet. Start outreach!")
    else:
        for status in active_statuses:
            bucket = active[active["status"] == status]
            if len(bucket) == 0:
                continue

            status_val = bucket["deal_value"].sum()
            header = f"{STATUS_EMOJI.get(status,'')} **{status.replace('_',' ').title()}** — {len(bucket)} leads"
            if status_val > 0:
                header += f" · pipeline **€{status_val:,.0f}**"

            with st.expander(header, expanded=(status in ["interested","meeting","proposal"])):
                show_p = ["name","city","keyword","phone","email","deal_value","follow_up_date","next_action","notes"]
                show_p = [c for c in show_p if c in bucket.columns]
                st.dataframe(bucket[show_p].head(50), use_container_width=True, hide_index=True)

                csv_b = bucket.to_csv(index=False).encode("utf-8")
                st.download_button(f"⬇️ Export {status}", csv_b, f"leads_{status}.csv", "text/csv", key=f"dl_{status}")

    st.divider()

    # ── Lost Reasons Analysis ──
    if len(lost) > 0:
        st.subheader("❌ Lost Reasons")
        lost_reasons = lost["lost_reason"].fillna("Não especificado").value_counts().reset_index()
        lost_reasons.columns = ["Motivo","Count"]
        st.dataframe(lost_reasons, use_container_width=True, hide_index=True)

    st.divider()

    # ── Activity Feed ──
    st.subheader("📡 Recent Activity")

    activity = load_activity()

    if len(activity) == 0:
        st.info("No activity yet. Activity is recorded automatically when you update leads.")
    else:
        # Merge with lead names
        activity_named = activity.merge(
            df_base[["place_id","name","city"]].drop_duplicates("place_id"),
            on="place_id", how="left")
        activity_named = activity_named.sort_values("timestamp", ascending=False).head(50)

        for _, act in activity_named.iterrows():
            icon    = ACTIVITY_ICONS.get(str(act.get("type","")), "🔔")
            name    = str(act.get("name","")) or act.get("place_id","")
            city    = str(act.get("city",""))
            content = str(act.get("content",""))
            ts      = time_ago(act.get("timestamp",""))
            act_type = str(act.get("type","")).replace("_"," ").title()

            acols = st.columns([0.04, 0.96])
            acols[0].write(icon)
            with acols[1]:
                st.markdown(f"**{name}** ({city}) · {act_type} · {ts}")
                if content:
                    st.caption(content)
            st.divider()

    st.divider()

    # ── Pricing Reference ──
    st.subheader("💼 Planos & Preços — Smart Hive Solutions")
    st.caption("Referência rápida para usar em propostas e chamadas.")

    st.markdown("#### 🌐 Websites")
    wc1, wc2, wc3 = st.columns(3)
    with wc1:
        st.markdown("""
<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;">
<p style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin-bottom:4px;">BÁSICO</p>
<p style="font-size:1.8rem;font-weight:700;color:#1e293b;margin:0;">€399</p>
<p style="font-size:12px;color:#64748b;margin-bottom:12px;">+ €29/mês manutenção</p>
<hr style="border-color:#e2e8f0;margin:12px 0;">
<ul style="font-size:13px;color:#475569;padding-left:18px;line-height:1.9;">
<li>Até 5 páginas</li>
<li>Design mobile-first</li>
<li>Formulário de contacto</li>
<li>Botão WhatsApp</li>
<li>Google Maps embed</li>
<li>Domínio + alojamento incluídos</li>
<li>Prazo: 5–7 dias úteis</li>
</ul>
</div>""", unsafe_allow_html=True)

    with wc2:
        st.markdown("""
<div style="background:#fff7ed;border:2px solid #f97316;border-radius:12px;padding:20px;position:relative;">
<span style="position:absolute;top:-10px;right:16px;background:#f97316;color:white;font-size:10px;font-weight:700;padding:3px 10px;border-radius:50px;letter-spacing:.06em;">MAIS VENDIDO</span>
<p style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#ea580c;margin-bottom:4px;">STANDARD</p>
<p style="font-size:1.8rem;font-weight:700;color:#1e293b;margin:0;">€599</p>
<p style="font-size:12px;color:#64748b;margin-bottom:12px;">+ €49/mês manutenção</p>
<hr style="border-color:#fed7aa;margin:12px 0;">
<ul style="font-size:13px;color:#475569;padding-left:18px;line-height:1.9;">
<li>Até 10 páginas</li>
<li>Design premium animado</li>
<li>Formulário + WhatsApp + CTA</li>
<li>SEO básico (meta, título, mapa)</li>
<li>Galeria de fotos/vídeos</li>
<li>Google Analytics</li>
<li>3 meses de suporte incluídos</li>
<li>Prazo: 7–10 dias úteis</li>
</ul>
</div>""", unsafe_allow_html=True)

    with wc3:
        st.markdown("""
<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;">
<p style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin-bottom:4px;">PREMIUM</p>
<p style="font-size:1.8rem;font-weight:700;color:#1e293b;margin:0;">€899</p>
<p style="font-size:12px;color:#64748b;margin-bottom:12px;">+ €79/mês manutenção</p>
<hr style="border-color:#e2e8f0;margin:12px 0;">
<ul style="font-size:13px;color:#475569;padding-left:18px;line-height:1.9;">
<li>Até 20 páginas</li>
<li>Design topo de gama + GSAP</li>
<li>Blog / Notícias</li>
<li>SEO avançado + sitemap XML</li>
<li>Loja online simples (até 30 produtos)</li>
<li>Reservas / Formulários avançados</li>
<li>Google Ads landing page</li>
<li>6 meses de suporte incluídos</li>
<li>Prazo: 14–18 dias úteis</li>
</ul>
</div>""", unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("#### 📱 Social Media & Marketing")
    sm1, sm2, sm3, sm4 = st.columns(4)

    with sm1:
        st.markdown("""
<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px;">
<p style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin-bottom:4px;">SOCIAL STARTER</p>
<p style="font-size:1.5rem;font-weight:700;color:#1e293b;margin:0;">€199<span style="font-size:13px;font-weight:400;color:#64748b;">/mês</span></p>
<hr style="border-color:#e2e8f0;margin:10px 0;">
<ul style="font-size:12px;color:#475569;padding-left:16px;line-height:1.8;">
<li>1 rede social (Instagram ou Facebook)</li>
<li>8 posts por mês</li>
<li>Copywriting em português</li>
<li>Design de imagens</li>
<li>Relatório mensal</li>
</ul>
</div>""", unsafe_allow_html=True)

    with sm2:
        st.markdown("""
<div style="background:#fdf4ff;border:1px solid #e879f9;border-radius:12px;padding:18px;">
<p style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#a21caf;margin-bottom:4px;">SOCIAL PRO</p>
<p style="font-size:1.5rem;font-weight:700;color:#1e293b;margin:0;">€349<span style="font-size:13px;font-weight:400;color:#64748b;">/mês</span></p>
<hr style="border-color:#f0abfc;margin:10px 0;">
<ul style="font-size:12px;color:#475569;padding-left:16px;line-height:1.8;">
<li>2 redes (Instagram + Facebook)</li>
<li>16 posts por mês</li>
<li>Stories / Reels (4/mês)</li>
<li>Gestão de comentários</li>
<li>Relatório + estratégia mensal</li>
</ul>
</div>""", unsafe_allow_html=True)

    with sm3:
        st.markdown("""
<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px;">
<p style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin-bottom:4px;">SEO LOCAL</p>
<p style="font-size:1.5rem;font-weight:700;color:#1e293b;margin:0;">€199<span style="font-size:13px;font-weight:400;color:#64748b;">/mês</span></p>
<hr style="border-color:#e2e8f0;margin:10px 0;">
<ul style="font-size:12px;color:#475569;padding-left:16px;line-height:1.8;">
<li>Google My Business otimizado</li>
<li>Palavras-chave locais</li>
<li>2 artigos de blog/mês</li>
<li>Link building local</li>
<li>Relatório de posições</li>
</ul>
</div>""", unsafe_allow_html=True)

    with sm4:
        st.markdown("""
<div style="background:#f0fdf4;border:1px solid #4ade80;border-radius:12px;padding:18px;">
<p style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#16a34a;margin-bottom:4px;">GOOGLE / META ADS</p>
<p style="font-size:1.5rem;font-weight:700;color:#1e293b;margin:0;">€149<span style="font-size:13px;font-weight:400;color:#64748b;">/mês gestão</span></p>
<hr style="border-color:#bbf7d0;margin:10px 0;">
<ul style="font-size:12px;color:#475569;padding-left:16px;line-height:1.8;">
<li>Setup de campanha incluído</li>
<li>Budget do cliente à parte</li>
<li>Min. recomendado: €200/mês</li>
<li>Relatório semanal</li>
<li>A/B testes de anúncios</li>
</ul>
</div>""", unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("#### 🎁 Packs combinados")
    pk1, pk2, pk3 = st.columns(3)

    with pk1:
        st.markdown("""
<div style="background:#eff6ff;border:1px solid #3b82f6;border-radius:12px;padding:18px;">
<p style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#2563eb;margin-bottom:4px;">PACK PRESENÇA</p>
<p style="font-size:1.5rem;font-weight:700;color:#1e293b;margin:0;">€549<span style="font-size:13px;font-weight:400;color:#64748b;">/mês</span></p>
<p style="font-size:11px;color:#2563eb;margin-bottom:8px;">Website Standard + Social Starter + SEO Local</p>
<hr style="border-color:#bfdbfe;margin:10px 0;">
<ul style="font-size:12px;color:#475569;padding-left:16px;line-height:1.8;">
<li>Website Standard (€599 setup)</li>
<li>Social Media 1 rede, 8 posts</li>
<li>SEO local Google Maps</li>
<li>Suporte prioritário</li>
<li><strong>Poupa ~€78/mês vs. separado</strong></li>
</ul>
</div>""", unsafe_allow_html=True)

    with pk2:
        st.markdown("""
<div style="background:#fefce8;border:2px solid #eab308;border-radius:12px;padding:18px;position:relative;">
<span style="position:absolute;top:-10px;right:16px;background:#eab308;color:white;font-size:10px;font-weight:700;padding:3px 10px;border-radius:50px;letter-spacing:.06em;">MELHOR VALOR</span>
<p style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#ca8a04;margin-bottom:4px;">PACK CRESCIMENTO</p>
<p style="font-size:1.5rem;font-weight:700;color:#1e293b;margin:0;">€749<span style="font-size:13px;font-weight:400;color:#64748b;">/mês</span></p>
<p style="font-size:11px;color:#ca8a04;margin-bottom:8px;">Website + Social Pro + SEO + Ads</p>
<hr style="border-color:#fde68a;margin:10px 0;">
<ul style="font-size:12px;color:#475569;padding-left:16px;line-height:1.8;">
<li>Website Premium (€899 setup)</li>
<li>Social Media 2 redes, 16 posts + Reels</li>
<li>SEO local + artigos de blog</li>
<li>Google Ads gestão (budget à parte)</li>
<li>Reunião mensal de estratégia</li>
<li><strong>Poupa ~€127/mês vs. separado</strong></li>
</ul>
</div>""", unsafe_allow_html=True)

    with pk3:
        st.markdown("""
<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px;">
<p style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin-bottom:4px;">PACK PERSONALIZADO</p>
<p style="font-size:1.5rem;font-weight:700;color:#1e293b;margin:0;">Sob consulta</p>
<p style="font-size:11px;color:#64748b;margin-bottom:8px;">Para negócios com necessidades específicas</p>
<hr style="border-color:#e2e8f0;margin:10px 0;">
<ul style="font-size:12px;color:#475569;padding-left:16px;line-height:1.8;">
<li>Loja online completa (e-commerce)</li>
<li>Sistema de reservas avançado</li>
<li>Integração CRM / WhatsApp Business</li>
<li>Múltiplas redes + Meta Ads + Google Ads</li>
<li>SLA de suporte dedicado</li>
</ul>
</div>""", unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    with st.expander("📋 Notas rápidas para proposta"):
        st.markdown("""
**Setup único** → cobrado uma vez, inclui design + desenvolvimento + publicação
**Mensalidade** → alojamento + domínio + SSL + backups + atualizações de segurança + 1h suporte/mês
**Prazo de pagamento** → 50% na aprovação, 50% na entrega
**Contrato mínimo social media** → 3 meses
**Presença prioritária** → Adicionar empresa no Google My Business (gratuito, feito no onboarding)
**Demos disponíveis** → bar, barbearia, serralharia, limpeza, construção, mudanças, eventos, loja online
""")


# ═══════════════════════════════════════════════════════════════
# TAB 3 — OUTREACH
# ═══════════════════════════════════════════════════════════════

with tab_outreach:
    st.title("📞 Outreach")
    if not _LEADS_AVAILABLE:
        st.info("📂 `leads_master.csv` not found. This tab requires the local data file.")
        st.stop()

    no_web      = df[df["website"].isna() & (df["status"] == "new")]
    mobile_leads   = no_web[no_web["phone_type"] == "mobile"]
    landline_leads = no_web[no_web["phone_type"] == "landline"]

    c1,c2,c3 = st.columns(3)
    c1.metric("No-website leads (new)", len(no_web))
    c2.metric("📱 Mobile (WhatsApp/call)", len(mobile_leads))
    c3.metric("☎️ Landline (call only)",   len(landline_leads))

    st.info(
        "**Mobile (starts with 9):** click the WhatsApp link → message opens pre-filled → review → send. "
        "Max 20–30/day on a personal number.  \n"
        "**Landline (starts with 2):** call only. No WhatsApp possible.")

    st.divider()

    col_f1, col_f2, col_f3 = st.columns(3)

    avail_cities = sorted(no_web["city"].dropna().unique().tolist())
    avail_kws    = sorted(no_web["keyword"].dropna().unique().tolist())

    oa_city        = col_f1.selectbox("City", ["All"] + avail_cities, key="oa_city")
    oa_kw          = col_f2.selectbox("Keyword", ["All"] + avail_kws, key="oa_kw")
    oa_min_reviews = col_f3.slider("Min reviews", 0, 500, 0, key="oa_rev")

    oa_tab_mobile, oa_tab_landline = st.tabs(["📱 WhatsApp / Mobile", "☎️ Call list / Landline"])

    def filter_oa(base_df):
        out = base_df.copy()
        if oa_city != "All": out = out[out["city"] == oa_city]
        if oa_kw   != "All": out = out[out["keyword"] == oa_kw]
        out = out[out["reviews"] >= oa_min_reviews]
        return out.sort_values("priority", ascending=False)

    with oa_tab_mobile:
        mob = filter_oa(mobile_leads)
        st.write(f"**{len(mob)} mobile leads** — no website, not yet contacted")

        if len(mob) == 0:
            st.info("No mobile leads match the filters.")
        else:
            mob_pids = mob["place_id"].astype(str).tolist()

            # ── Batch panel (reads state from previous render) ──
            selected_pids = [p for p in mob_pids if st.session_state.get(f"oa_cb_{p}", False)]

            if selected_pids:
                sel_rows = mob[mob["place_id"].astype(str).isin(selected_pids)]
                st.info(
                    f"**{len(selected_pids)} leads selecionados** — clica em cada link para abrir o WhatsApp, "
                    "depois carrega em **✅ Marcar todos como contactado**."
                )

                # Big clickable WA buttons for each selected lead
                wa_cols = st.columns(min(len(sel_rows), 4))
                for i, (_, srow) in enumerate(sel_rows.iterrows()):
                    wa = srow.get("wa_link")
                    label = f"💬 {srow['name']}"
                    if wa:
                        wa_cols[i % 4].markdown(
                            f'<a href="{wa}" target="_blank" style="'
                            'display:block;background:#25d366;color:white;font-weight:700;'
                            'text-align:center;padding:10px 8px;border-radius:10px;'
                            'text-decoration:none;font-size:13px;margin-bottom:6px;">'
                            f'{label}</a>',
                            unsafe_allow_html=True
                        )
                    else:
                        wa_cols[i % 4].write(f"☎️ {srow['name']} (fixo)")

                st.markdown("<br>", unsafe_allow_html=True)
                bcol1, bcol2 = st.columns([1.8, 4])
                if bcol1.button("✅ Marcar todos como contactado", type="primary", key="oa_batch_done"):
                    today_s = datetime.now().strftime("%Y-%m-%d")
                    fu_s    = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")
                    for pid in selected_pids:
                        upsert_crm(pid, "contacted", today_s, fu_s, "", "whatsapp",
                                   0, "", "Follow-up em 2 dias", "new",
                                   "WhatsApp enviado via Outreach (batch)")
                        st.session_state.pop(f"oa_cb_{pid}", None)
                    st.cache_data.clear()
                    st.rerun()
                if bcol2.button("✕ Limpar seleção", key="oa_clear_sel"):
                    for pid in mob_pids:
                        st.session_state.pop(f"oa_cb_{pid}", None)
                    st.rerun()

                st.divider()

            # ── Select-all / deselect-all ──
            sc1, sc2, sc3 = st.columns([1, 1, 4])
            if sc1.button("☑ Todos (50)", key="oa_sel_all"):
                for pid in mob_pids[:50]:
                    st.session_state[f"oa_cb_{pid}"] = True
                st.rerun()
            if sc2.button("✕ Nenhum", key="oa_desel_all"):
                for pid in mob_pids:
                    st.session_state.pop(f"oa_cb_{pid}", None)
                st.rerun()

            st.caption("Seleciona os leads, abre cada 💬 WA (cmd+clique abre em nova aba), depois marca todos de uma vez.")

            # ── Lead rows with checkbox ──
            for _, row in mob.head(50).iterrows():
                pid = str(row["place_id"])
                col_cb, col_a, col_b, col_c, col_d = st.columns([0.4, 3.2, 2, 0.7, 1.4])
                col_cb.checkbox("", key=f"oa_cb_{pid}")
                col_a.write(f"**{row['name']}** — {row['city']} | {row['keyword']} | ⭐{row['rating']} ({int(row['reviews'])} reviews)")
                col_b.write(f"📞 `{row['phone']}` · prioridade **{row['priority']}**")
                wa = row.get("wa_link")
                if wa:
                    col_c.markdown(f'<a href="{wa}" target="_blank">💬</a>', unsafe_allow_html=True)
                if col_d.button("✅ Contactado", key=f"oa_done_{pid}"):
                    today_s = datetime.now().strftime("%Y-%m-%d")
                    upsert_crm(
                        pid, "contacted", today_s,
                        (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
                        "", "whatsapp", 0, "", "Follow-up em 2 dias", "new",
                        "WhatsApp enviado via Outreach tab"
                    )
                    st.session_state.pop(f"oa_cb_{pid}", None)
                    st.cache_data.clear()
                    st.rerun()
                st.divider()

            if len(mob) > 50:
                st.caption(f"A mostrar top 50 de {len(mob)}.")

            csv_mob = mob[["name","city","keyword","phone","rating","reviews","priority","wa_link"]].to_csv(index=False).encode("utf-8")
            st.download_button("⬇️ Export mobile list", csv_mob, "outreach_mobile.csv", "text/csv")

    with oa_tab_landline:
        land = filter_oa(landline_leads)
        st.write(f"**{len(land)} landline leads** — no website, not yet contacted")

        if len(land) == 0:
            st.info("No landline leads match the filters.")
        else:
            st.caption("Ligar entre 10h–12h30 ou 15h–18h.")
            for _, row in land.head(100).iterrows():
                pid = str(row["place_id"])
                col_a, col_b, col_c = st.columns([3, 2, 1.4])
                col_a.write(f"**{row['name']}** — {row['city']} | {row['keyword']} | ⭐{row['rating']} ({int(row['reviews'])} reviews)")
                col_b.write(f"☎️ `{row['phone']}` · prioridade **{row['priority']}**")
                if col_c.button("📞 Chamei", key=f"oa_call_{pid}"):
                    today_s = datetime.now().strftime("%Y-%m-%d")
                    upsert_crm(
                        pid, "contacted", today_s,
                        (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d"),
                        "", "phone", 0, "", "Follow-up em 3 dias", "new",
                        "Chamada efectuada via Outreach tab"
                    )
                    st.cache_data.clear()
                    st.rerun()
                st.divider()

            show_land = ["name","city","keyword","phone","rating","reviews","address","priority"]
            show_land = [c for c in show_land if c in land.columns]
            csv_land = land[show_land].to_csv(index=False).encode("utf-8")
            st.download_button("⬇️ Export call list", csv_land, "outreach_calls.csv", "text/csv")


# ═══════════════════════════════════════════════════════════════
# TAB 4 — TEMPLATES
# ═══════════════════════════════════════════════════════════════

with tab_templates:
    st.title("✉️ Outreach Templates")
    st.caption("Use {name}, {city}, {reviews}, {keyword} as placeholders.")

    st.subheader("📧 Email — No Website")
    st.text_area("", """Assunto: Vi o {name} no Google

Olá,

Vi o {name} no Google Maps em {city} — {reviews} avaliações, muito bom para um negócio local!

Reparei que ainda não têm website. A maioria dos clientes hoje pesquisa no Google antes de contactar qualquer negócio — sem presença online, perdem clientes para concorrentes que já aparecem nas pesquisas.

Faço websites para negócios locais em Portugal. Posso mostrar alguns exemplos do que já fiz?

Miguel
Smart Hive Solutions""", height=200, key="t1")

    st.divider()
    st.subheader("💬 WhatsApp — No Website")
    st.text_area("", """Olá! Vi o negócio *{name}* no Google Maps em {city} — {reviews} avaliações, óptimo! 👏

Reparei que ainda não têm website. Trabalho com negócios locais a aparecer no Google e conseguir mais clientes online.

Posso mostrar exemplos do que faço? 🙂""", height=130, key="t2")

    st.divider()
    st.subheader("💬 WhatsApp — Follow-up (sem resposta)")
    st.text_area("", """Olá! Só a confirmar que recebeu a minha mensagem anterior 🙂

Caso tenha interesse em saber mais sobre como posso ajudar o *{name}* a aparecer no Google, estou disponível para uma conversa rápida.

Sem compromisso nenhum!""", height=120, key="t3")

    st.divider()
    st.subheader("📧 Email — Proposta (após interesse)")
    st.text_area("", """Assunto: Proposta para o {name}

Olá,

Conforme combinámos, segue a proposta para o website do {name}.

**Plano Standard — €599 (+ €49/mês)**
- Website profissional com até 10 páginas
- Optimizado para mobile e para o Google
- Botão WhatsApp e formulário de contacto
- 3 meses de suporte incluídos
- Hospedagem e domínio tratados por nós

Posso ter o site online em 7–10 dias úteis após aprovação.

Fico aguardar a vossa resposta para avançarmos.

Miguel
geral@smarthivesolutions.pt""", height=240, key="t4")

    st.divider()
    st.subheader("📞 Phone Script")
    st.text_area("", """Bom dia / Boa tarde, estou a falar com {name}?

Olá, o meu nome é Miguel. Encontrei o vosso negócio no Google Maps — {reviews} avaliações, muito bom!

Estou a contactar porque vi que ainda não têm website. A maior parte dos clientes hoje pesquisa no Google antes de contactar — sem website, podem estar a perder clientes.

Trabalho com negócios locais em {city} a criar websites profissionais. Teria 2 minutinhos?

[Se sim] → Explica brevemente: "Crio websites a partir de €399, num estilo profissional adaptado ao vosso negócio. Posso enviar exemplos agora mesmo por WhatsApp ou email — qual prefere?"
[Se não]  → "Sem problema, posso enviar apenas um exemplo do que faço? Não compromete a nada." """, height=220, key="t5")

    st.divider()

    # ── CONTRACT GENERATOR ──
    st.subheader("📄 Contrato de Prestação de Serviços")
    st.caption("Preencha os campos abaixo e o contrato é gerado automaticamente.")

    with st.expander("✏️ Preencher dados do contrato", expanded=True):
        cc1, cc2 = st.columns(2)
        with cc1:
            st.markdown("**Dados do Cliente**")
            ct_nome     = st.text_input("Nome completo / Empresa", placeholder="João Silva / Restaurante O Garfo, Lda.", key="ct_nome")
            ct_nif      = st.text_input("NIF", placeholder="123456789", key="ct_nif")
            ct_morada   = st.text_input("Morada", placeholder="Rua das Flores, nº 12, 1100-001 Lisboa", key="ct_morada")
            ct_email    = st.text_input("Email do cliente", placeholder="cliente@email.com", key="ct_email")
        with cc2:
            st.markdown("**Detalhes do Serviço**")
            ct_servico  = st.selectbox("Serviço principal", [
                "Criação de Website (Plano Básico — €399)",
                "Criação de Website (Plano Standard — €599)",
                "Criação de Website (Plano Premium — €899)",
                "Website + Gestão de Redes Sociais",
                "Website + SEO Local",
                "Pack Presença Completo",
                "Pack Crescimento",
                "Outro (descrever em observações)",
            ], key="ct_servico")
            ct_valor    = st.number_input("Valor total do projeto (€)", min_value=0, value=599, step=50, key="ct_valor")
            ct_mensal   = st.number_input("Mensalidade após entrega (€)", min_value=0, value=49, step=10, key="ct_mensal")
            ct_prazo    = st.number_input("Prazo de entrega (dias úteis)", min_value=1, value=10, step=1, key="ct_prazo")
            ct_data     = st.text_input("Data do contrato", value=datetime.now().strftime("%d de %B de %Y"), key="ct_data")
            ct_obs      = st.text_area("Observações / âmbito adicional", placeholder="Ex: inclui loja online com até 20 produtos, integração de reservas...", height=80, key="ct_obs")

    CONTRACT_TEMPLATE = """
CONTRATO DE PRESTAÇÃO DE SERVIÇOS DIGITAIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


PRIMEIRA PARTE — IDENTIFICAÇÃO DAS PARTES


PRESTADOR DE SERVIÇOS:
  Denominação:   Smart Hive Solutions
  NIF:           [NIF da Smart Hive Solutions]
  Morada:        [Morada da Smart Hive Solutions]
  Email:         geral@smarthivesolutions.pt
  Representado por: Miguel Lourenço

CLIENTE:
  Denominação:   {NOME_CLIENTE}
  NIF:           {NIF_CLIENTE}
  Morada:        {MORADA_CLIENTE}
  Email:         {EMAIL_CLIENTE}


SEGUNDA PARTE — OBJETO DO CONTRATO


Entre as partes identificadas acima, é celebrado o presente Contrato de Prestação
de Serviços Digitais, que se rege pelas cláusulas seguintes:


CLÁUSULA 1.ª — OBJETO

1.1. O presente contrato tem por objeto a prestação dos seguintes serviços pelo
Prestador ao Cliente:

     {SERVICO_DESCRICAO}

1.2. O âmbito detalhado do serviço, incluindo funcionalidades, páginas e conteúdos
     a desenvolver, consta do briefing aprovado por ambas as partes e que constitui
     o Anexo I ao presente contrato.

{OBS_CLAUSE}

CLÁUSULA 2.ª — PRAZO DE EXECUÇÃO

2.1. O Prestador compromete-se a entregar o trabalho contratado no prazo de
     {PRAZO} dias úteis contados a partir:
       (a) da receção do pagamento da primeira prestação (sinal); E
       (b) da entrega pelo Cliente de todos os conteúdos necessários (textos,
           imagens, logótipos, credenciais de acesso, etc.).

2.2. O prazo referido na cláusula anterior fica automaticamente suspenso por cada
     dia de atraso do Cliente na entrega de conteúdos ou aprovações solicitadas.

2.3. A entrega é considerada concluída no momento em que o website/serviço for
     colocado em ambiente de produção (online) ou disponibilizado para revisão final.


CLÁUSULA 3.ª — PREÇO E CONDIÇÕES DE PAGAMENTO

3.1. O valor total acordado para o serviço é de:

           €{VALOR_TOTAL},00 (valor sem IVA)
           IVA à taxa legal em vigor (23%) calculado sobre o total

3.2. O pagamento é efetuado em duas prestações:
       • 1.ª prestação (sinal):   50% do valor total — no momento da assinatura
                                  do presente contrato
       • 2.ª prestação (restante): 50% do valor total — na data de entrega/
                                  publicação do trabalho

3.3. Os pagamentos são efetuados por transferência bancária para o IBAN indicado
     pelo Prestador em fatura, ou via MB Way para o número indicado pelo Prestador.

3.4. Em caso de atraso no pagamento superior a 15 dias, o Prestador reserva-se o
     direito de suspender o acesso ao website/serviço até regularização da situação,
     sem que tal configure incumprimento da sua parte.

3.5. Após a conclusão do serviço, e caso o Cliente opte por manutenção mensal,
     será devida uma mensalidade de:

           €{VALOR_MENSAL},00/mês

     que inclui: alojamento, domínio, certificado SSL, backups automáticos,
     atualizações de segurança e 1 hora de suporte técnico por mês.
     O primeiro pagamento mensal é devido 30 dias após a entrega do projeto.


CLÁUSULA 4.ª — OBRIGAÇÕES DO PRESTADOR

O Prestador obriga-se a:

4.1. Executar os serviços contratados com diligência, competência técnica e
     qualidade adequadas à natureza do trabalho.

4.2. Manter o Cliente informado do progresso do trabalho mediante comunicações
     periódicas, com pelo menos uma atualização semanal.

4.3. Apresentar uma versão para revisão antes da publicação definitiva, permitindo
     ao Cliente solicitar ajustes razoáveis dentro do âmbito contratado.

4.4. Manter a confidencialidade de todas as informações do Cliente a que tenha
     acesso no âmbito deste contrato.

4.5. Garantir que os serviços entregues são tecnicamente funcionais e compatíveis
     com os principais browsers (Chrome, Firefox, Safari, Edge) e dispositivos
     móveis (iOS e Android).


CLÁUSULA 5.ª — OBRIGAÇÕES DO CLIENTE

O Cliente obriga-se a:

5.1. Fornecer ao Prestador, atempadamente e em formato digital adequado, todos os
     conteúdos necessários à execução do trabalho: textos, imagens, logótipos,
     vídeos, credenciais de acesso e demais elementos necessários.

5.2. Garantir que todos os conteúdos fornecidos são da sua propriedade ou que
     dispõe das licenças necessárias para a sua utilização, isentando o Prestador
     de qualquer responsabilidade por violação de direitos de terceiros.

5.3. Responder às solicitações de aprovação e revisão do Prestador no prazo máximo
     de 5 dias úteis. Ultrapassado este prazo sem resposta, o trabalho é considerado
     aprovado para efeitos de faturação e prazo.

5.4. Efetuar os pagamentos nos prazos e condições acordados.

5.5. Não partilhar, vender ou licenciar o trabalho produzido pelo Prestador a
     terceiros sem autorização expressa e por escrito.


CLÁUSULA 6.ª — REVISÕES E ALTERAÇÕES

6.1. O presente contrato inclui até 2 (duas) rondas de revisões ao trabalho
     desenvolvido, dentro do âmbito acordado no Anexo I.

6.2. Alterações ao âmbito original do trabalho (novas funcionalidades, páginas
     adicionais, conteúdos não previstos) serão objeto de orçamentação adicional,
     a acordar por escrito entre as partes.

6.3. Pedidos de revisão que impliquem refazer trabalho já aprovado pelo Cliente
     serão igualmente objeto de orçamentação adicional.


CLÁUSULA 7.ª — PROPRIEDADE INTELECTUAL

7.1. Após o pagamento integral do valor contratado, todos os direitos de
     utilização sobre o website e os materiais produzidos são transferidos para
     o Cliente.

7.2. Até ao pagamento integral, o Prestador mantém todos os direitos sobre o
     trabalho produzido.

7.3. O Prestador reserva o direito de incluir o projeto no seu portefólio e
     materiais de apresentação comercial, salvo indicação em contrário expressa
     pelo Cliente.

7.4. Ferramentas, frameworks, bibliotecas ou componentes de terceiros utilizados
     na produção (ex.: WordPress, fontes Google, plugins open-source) estão sujeitos
     às respetivas licenças próprias.


CLÁUSULA 8.ª — GARANTIA E SUPORTE PÓS-ENTREGA

8.1. O Prestador garante o correto funcionamento do trabalho entregue por um
     período de 30 (trinta) dias a contar da data de entrega/publicação.

8.2. Durante o período de garantia, o Prestador compromete-se a corrigir, sem
     custo adicional, eventuais erros ou defeitos técnicos imputáveis ao trabalho
     desenvolvido, desde que comunicados por escrito pelo Cliente.

8.3. A garantia não cobre: danos causados por intervenção de terceiros no website,
     incompatibilidades resultantes de atualizações de plugins ou sistemas efetuadas
     pelo Cliente sem supervisão do Prestador, ou conteúdos introduzidos pelo
     Cliente após a entrega.


CLÁUSULA 9.ª — CONFIDENCIALIDADE E PROTEÇÃO DE DADOS

9.1. Ambas as partes comprometem-se a manter estrita confidencialidade sobre
     todas as informações comerciais, financeiras e técnicas a que tenham acesso
     no âmbito deste contrato.

9.2. O Prestador compromete-se a tratar os dados pessoais do Cliente e dos seus
     utilizadores em estrita conformidade com o Regulamento Geral de Proteção de
     Dados (RGPD — Regulamento UE 2016/679) e demais legislação aplicável.

9.3. O Prestador não partilhará dados pessoais do Cliente com terceiros, salvo
     quando exigido por obrigação legal ou para prestação dos serviços contratados
     (ex.: alojamento web).


CLÁUSULA 10.ª — LIMITAÇÃO DE RESPONSABILIDADE

10.1. O Prestador não se responsabiliza por perdas de negócio, lucros cessantes
      ou danos indiretos resultantes de eventuais falhas técnicas, interrupções
      de serviço ou ataques informáticos sobre infraestrutura de terceiros
      (servidores, DNS, etc.).

10.2. A responsabilidade máxima do Prestador, em qualquer circunstância, fica
      limitada ao valor total pago pelo Cliente ao abrigo do presente contrato.

10.3. O Prestador não garante posicionamento específico em motores de busca
      (SEO), nem resultados de negócio específicos decorrentes dos serviços
      prestados.


CLÁUSULA 11.ª — RESCISÃO

11.1. O presente contrato pode ser rescindido por qualquer das partes mediante
      comunicação escrita com 30 (trinta) dias de antecedência.

11.2. Em caso de rescisão por iniciativa do Cliente:
        (a) Se o trabalho já tiver sido iniciado, o sinal pago (50%) não é
            reembolsável, a título de compensação pelos recursos alocados.
        (b) Se o trabalho estiver concluído ou em fase final de revisão, o valor
            total do projeto é devido.

11.3. Em caso de rescisão por incumprimento grave do Prestador, o Cliente tem
      direito ao reembolso do sinal pago, sem prejuízo de outros direitos legais.

11.4. Para contratos com mensalidade, a rescisão do serviço mensal requer
      comunicação escrita com 30 dias de antecedência. Mensalidades já vencidas
      não são reembolsáveis.


CLÁUSULA 12.ª — RESOLUÇÃO DE LITÍGIOS

12.1. Qualquer litígio emergente do presente contrato será, em primeira instância,
      objeto de tentativa de resolução amigável entre as partes.

12.2. Na impossibilidade de resolução amigável, as partes acordam submeter o
      litígio à jurisdição dos Tribunais Judiciais da comarca de Lisboa, com
      expressa renúncia a qualquer outro foro.

12.3. O presente contrato é regulado pela lei portuguesa.


CLÁUSULA 13.ª — DISPOSIÇÕES GERAIS

13.1. Qualquer alteração ao presente contrato carece de acordo escrito e assinado
      por ambas as partes.

13.2. A eventual nulidade de uma ou mais cláusulas do presente contrato não
      prejudica a validade das restantes.

13.3. As comunicações entre as partes podem ser efetuadas por email, considerando-
      se válidas e eficazes para todos os efeitos legais, desde que enviadas para
      os endereços indicados na cláusula de identificação.

13.4. Este contrato, incluindo os seus Anexos, constitui o acordo integral entre
      as partes e substitui quaisquer entendimentos ou acordos anteriores, verbais
      ou escritos, sobre o mesmo objeto.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ASSINATURAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feito em duplicado, em Lisboa, em {DATA_CONTRATO}.


PELO PRESTADOR DE SERVIÇOS:
Smart Hive Solutions


Assinatura: ___________________________________

Nome:          Miguel Lourenço
Data:          {DATA_CONTRATO}


PELO CLIENTE:
{NOME_CLIENTE}


Assinatura: ___________________________________

Nome:          {NOME_CLIENTE}
NIF:           {NIF_CLIENTE}
Data:          _____ / _____ / ___________


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANEXO I — ÂMBITO DETALHADO DO PROJETO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Serviço:   {SERVICO_DESCRICAO}
Prazo:     {PRAZO} dias úteis após sinal + conteúdos
Valor:     €{VALOR_TOTAL},00 + IVA
Mensal:    €{VALOR_MENSAL},00/mês (após entrega)

Inclui:
  - Desenvolvimento e design do website conforme briefing aprovado
  - Alojamento web configurado e ativo
  - Domínio .pt ou .com registado em nome do cliente (1.º ano incluído)
  - Certificado SSL (HTTPS) ativo
  - Formulário de contacto funcional
  - Botão de chamada/WhatsApp
  - Google Maps integrado
  - Otimização básica para mobile e SEO on-page
  - Entrega de credenciais de acesso ao painel de gestão
  - 30 dias de suporte pós-entrega

{OBS_DETALHES}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Smart Hive Solutions · geral@smarthivesolutions.pt
"""

    # Build the contract with user inputs
    obs_clause   = f"1.3. Especificações adicionais acordadas entre as partes:\n\n     {ct_obs}\n" if ct_obs.strip() else ""
    obs_detalhes = f"Especificações adicionais:\n  {ct_obs}" if ct_obs.strip() else ""

    filled = CONTRACT_TEMPLATE.format(
        NOME_CLIENTE      = ct_nome      or "[NOME DO CLIENTE]",
        NIF_CLIENTE       = ct_nif       or "[NIF]",
        MORADA_CLIENTE    = ct_morada    or "[MORADA]",
        EMAIL_CLIENTE     = ct_email     or "[EMAIL]",
        SERVICO_DESCRICAO = ct_servico,
        VALOR_TOTAL       = f"{ct_valor:,.0f}".replace(",", "."),
        VALOR_MENSAL      = f"{ct_mensal:,.0f}".replace(",", "."),
        PRAZO             = ct_prazo,
        DATA_CONTRATO     = ct_data      or datetime.now().strftime("%d de %B de %Y"),
        OBS_CLAUSE        = obs_clause,
        OBS_DETALHES      = obs_detalhes,
    )

    st.divider()
    st.markdown("**📋 Pré-visualização do contrato**")
    st.text_area("", filled, height=500, key="contract_preview")

    col_dl1, col_dl2 = st.columns([1, 3])
    col_dl1.download_button(
        "⬇️ Download .txt",
        filled.encode("utf-8"),
        file_name=f"contrato_{(ct_nome or 'cliente').replace(' ','_')}.txt",
        mime="text/plain",
    )
    col_dl2.info("Guarde como .txt, abra no Word/Google Docs e formate antes de imprimir.")


