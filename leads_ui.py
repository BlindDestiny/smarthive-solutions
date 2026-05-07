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

tab_leads, tab_crm, tab_outreach, tab_templates, tab_demo = st.tabs(
    ["📋 Leads", "📊 CRM", "📞 Outreach", "✉️ Templates", "🍽️ Demo: Restaurant CRM"])


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
            for _, row in mob.head(50).iterrows():
                col_a, col_b, col_c = st.columns([3,2,1])
                col_a.write(f"**{row['name']}** — {row['city']} | {row['keyword']} | ⭐{row['rating']} ({int(row['reviews'])} reviews)")
                col_b.write(f"📞 `{row['phone']}` | priority: **{row['priority']}**")
                wa = row.get("wa_link")
                if wa: col_c.markdown(f"[💬 WhatsApp]({wa})")
                st.divider()

            if len(mob) > 50:
                st.caption(f"Showing top 50 of {len(mob)}.")

            csv_mob = mob[["name","city","keyword","phone","rating","reviews","priority","wa_link"]].to_csv(index=False).encode("utf-8")
            st.download_button("⬇️ Export mobile list", csv_mob, "outreach_mobile.csv", "text/csv")

    with oa_tab_landline:
        land = filter_oa(landline_leads)
        st.write(f"**{len(land)} landline leads** — no website, not yet contacted")

        if len(land) == 0:
            st.info("No landline leads match the filters.")
        else:
            st.caption("Call during business hours: 10h–12h30 or 15h–18h.")
            show_land = ["name","city","keyword","phone","rating","reviews","address","priority"]
            show_land = [c for c in show_land if c in land.columns]
            st.dataframe(land[show_land].head(200), use_container_width=True, height=500, hide_index=True)
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


# ═══════════════════════════════════════════════════════════════
# TAB 5 — DEMO: RESTAURANT / BAR / LOUNGE CRM
# ═══════════════════════════════════════════════════════════════

_DEMO_CUSTOMERS = [
    {"id":"C001","name":"Ana Ferreira","phone":"912345678","email":"ana@email.com","tier":"VIP","visits":24,"last_visit":"2026-05-05","total_spend":1840,"preferences":"Mesa junto à janela, vinho tinto","allergies":"Glúten","birthday":"1985-03-12","notes":"Vem sempre com o marido às sextas"},
    {"id":"C002","name":"João Silva","phone":"963456789","email":"joao@gmail.com","tier":"Regular","visits":11,"last_visit":"2026-04-28","total_spend":620,"preferences":"Zona de bar, cerveja artesanal","allergies":"—","birthday":"1990-07-22","notes":"Fã dos eventos de música ao vivo"},
    {"id":"C003","name":"TechStart Lda","phone":"211234567","email":"eventos@techstart.pt","tier":"Corporativo","visits":5,"last_visit":"2026-03-15","total_spend":3200,"preferences":"Sala privada, menu fixo","allergies":"Vários (confirmar)","birthday":"—","notes":"Jantares de equipa trimestrais"},
    {"id":"C004","name":"Marta Costa","phone":"936789012","email":"marta.costa@hotmail.com","tier":"VIP","visits":38,"last_visit":"2026-05-06","total_spend":2950,"preferences":"Mesa 4, Rosé e cocktails","allergies":"Marisco","birthday":"1978-11-30","notes":"Cliente mais antiga — aniversário em novembro, oferecer sobremesa"},
    {"id":"C005","name":"Pedro Mendes","phone":"916543210","email":"pedro.m@outlook.com","tier":"Regular","visits":6,"last_visit":"2026-04-10","total_spend":340,"preferences":"Terraço","allergies":"—","birthday":"1995-02-14","notes":""},
    {"id":"C006","name":"Sofia Lopes","phone":"926781234","email":"sofia@email.com","tier":"Regular","visits":9,"last_visit":"2026-05-01","total_spend":510,"preferences":"Bar, cocktails especiais","allergies":"Lactose","birthday":"1992-08-03","notes":"Segue no Instagram, partilha stories"},
    {"id":"C007","name":"Henrique & Amigos","phone":"918765432","email":"henrique@gmail.com","tier":"Ocasional","visits":2,"last_visit":"2026-02-14","total_spend":280,"preferences":"Mesa grande (8-10 pax)","allergies":"—","birthday":"—","notes":"Vêm em grupo para aniversários"},
    {"id":"C008","name":"NovoBanco RH","phone":"213456789","email":"rh@novobanco.pt","tier":"Corporativo","visits":8,"last_visit":"2026-04-22","total_spend":5600,"preferences":"Sala VIP, menu degustação","allergies":"Confirmar com antecedência","birthday":"—","notes":"Alto valor — sempre com reserva antecipada"},
    {"id":"C009","name":"Raquel Nunes","phone":"962345678","email":"raquel@gmail.com","tier":"Ocasional","visits":3,"last_visit":"2026-01-20","total_spend":150,"preferences":"—","allergies":"—","birthday":"1988-05-07","notes":"Aniversário hoje!"},
    {"id":"C010","name":"Bruno Alves","phone":"913456789","email":"bruno.alves@sapo.pt","tier":"VIP","visits":19,"last_visit":"2026-05-03","total_spend":1620,"preferences":"Lounge, whisky premium","allergies":"—","birthday":"1982-12-25","notes":"Traz frequentemente clientes de negócios"},
    {"id":"C011","name":"Carla Rodrigues","phone":"927890123","email":"carla.r@email.com","tier":"Regular","visits":7,"last_visit":"2026-04-15","total_spend":430,"preferences":"Interior, sítio tranquilo","allergies":"Frutos secos","birthday":"1994-06-18","notes":""},
    {"id":"C012","name":"StartupX Lda","phone":"210987654","email":"geral@startupx.pt","tier":"Corporativo","visits":3,"last_visit":"2026-03-28","total_spend":1800,"preferences":"Sala privada, projector","allergies":"—","birthday":"—","notes":"Lançamentos de produto — precisam de AV setup"},
]

_DEMO_RESERVATIONS = [
    {"id":"R001","customer":"Marta Costa","date":"2026-05-07","time":"20:00","pax":2,"table":"Mesa 4","occasion":"Jantar normal","status":"Confirmada","notes":"Alergia marisco — avisar cozinha"},
    {"id":"R002","customer":"João Silva","date":"2026-05-07","time":"21:30","pax":4,"table":"Bar","occasion":"","status":"Confirmada","notes":""},
    {"id":"R003","customer":"TechStart Lda","date":"2026-05-07","time":"19:30","pax":12,"table":"Sala Privada","occasion":"Jantar de equipa","status":"Confirmada","notes":"Menu fixo acordado — 35€/pax"},
    {"id":"R004","customer":"Raquel Nunes","date":"2026-05-07","time":"20:30","pax":6,"table":"Mesa 8","occasion":"Aniversário","status":"Confirmada","notes":"Aniversário da Raquel — preparar bolo surpresa"},
    {"id":"R005","customer":"Bruno Alves","date":"2026-05-08","time":"21:00","pax":3,"table":"Lounge VIP","occasion":"Reunião negócios","status":"Confirmada","notes":"Whisky Macallan 18 na mesa"},
    {"id":"R006","customer":"Ana Ferreira","date":"2026-05-09","time":"20:00","pax":2,"table":"Mesa 2","occasion":"Aniversário marido","status":"Pendente","notes":"Decorar a mesa com flores"},
    {"id":"R007","customer":"Henrique & Amigos","date":"2026-05-10","time":"21:00","pax":10,"table":"Mesa Grande","occasion":"Aniversário","status":"Pendente","notes":"Confirmar menu até dia 9"},
    {"id":"R008","customer":"NovoBanco RH","date":"2026-05-15","time":"19:00","pax":20,"table":"Sala VIP","occasion":"Jantar corporativo","status":"Confirmada","notes":"Menu degustação 65€/pax — vinho incluído"},
]

_DEMO_PIPELINE = [
    {"id":"P001","client":"StartupX Lda","event":"Lançamento de Produto","date":"2026-05-20","pax":40,"value":3200,"status":"Proposta Enviada","prob":70,"notes":"Aguardar aprovação orçamento — follow up dia 10"},
    {"id":"P002","client":"Associação AICEP","event":"Cocktail Networking","date":"2026-06-05","pax":80,"value":6000,"status":"Reunião Marcada","prob":50,"notes":"Reunião dia 12 maio para visitar espaço"},
    {"id":"P003","client":"Deloitte Portugal","event":"Jantar Anual","date":"2026-06-20","pax":60,"value":8500,"status":"Contactado","prob":30,"notes":"Primeiro contacto positivo — enviar proposta esta semana"},
    {"id":"P004","client":"Casamento Ferreira & Costa","event":"Cocktail Pré-casamento","date":"2026-07-01","pax":30,"value":2100,"status":"Fechado","prob":100,"notes":"Depósito recebido — confirmar menu final"},
    {"id":"P005","client":"Microsoft Portugal","event":"Team Building","date":"2026-07-15","pax":25,"value":3500,"status":"Novo Lead","prob":20,"notes":"Contacto via LinkedIn — marcar reunião"},
]

_DEMO_UPCOMING_EVENTS = [
    {"id":"E001","name":"Jazz Night","date":"2026-05-15","time":"21:00",
     "description":"Uma noite de jazz ao vivo com o quarteto Pedro Santos. Entrada inclui welcome drink.",
     "price":15,"capacity":60,"booked":42,"image_bytes":None},
    {"id":"E002","name":"Jantar Degustação","date":"2026-05-22","time":"20:00",
     "description":"Menu degustação de 7 pratos com harmonização de vinhos selecionados pelo nosso sommelier.",
     "price":85,"capacity":30,"booked":18,"image_bytes":None},
    {"id":"E003","name":"Cocktail Masterclass","date":"2026-06-05","time":"18:00",
     "description":"Aprenda a criar cocktails clássicos e modernos com o nosso barman chefe.",
     "price":35,"capacity":20,"booked":8,"image_bytes":None},
]

_DEMO_PAST_EVENTS = [
    {"id":"PE001","name":"Noite de Fados","date":"2026-04-20",
     "description":"Uma noite inesquecível com fado ao vivo e petiscos tradicionais portugueses.","photos":[]},
    {"id":"PE002","name":"Festa de Primavera","date":"2026-03-21",
     "description":"Celebrámos a chegada da primavera com música, jardim aberto e boa comida.","photos":[]},
]

_TIER_ICON = {"VIP":"🥇","Regular":"🥈","Corporativo":"🏢","Ocasional":"👤"}
_PIPE_STATUS_COLOR = {
    "Novo Lead":"#3b82f6","Contactado":"#f59e0b",
    "Reunião Marcada":"#8b5cf6","Proposta Enviada":"#f97316",
    "Fechado":"#22c55e","Perdido":"#ef4444",
}
_PIPE_ORDER = ["Novo Lead","Contactado","Reunião Marcada","Proposta Enviada","Fechado","Perdido"]

with tab_demo:
    _TODAY = datetime.today().strftime("%Y-%m-%d")

    # ── init session state ─────────────────────────────────────
    if "demo_customers"       not in st.session_state: st.session_state.demo_customers       = pd.DataFrame(_DEMO_CUSTOMERS)
    if "demo_reservations"    not in st.session_state: st.session_state.demo_reservations    = pd.DataFrame(_DEMO_RESERVATIONS)
    if "demo_pipeline"        not in st.session_state: st.session_state.demo_pipeline        = pd.DataFrame(_DEMO_PIPELINE)
    if "demo_upcoming_events" not in st.session_state: st.session_state.demo_upcoming_events = list(_DEMO_UPCOMING_EVENTS)
    if "demo_past_events"     not in st.session_state: st.session_state.demo_past_events     = list(_DEMO_PAST_EVENTS)
    if "demo_booking_step"    not in st.session_state: st.session_state.demo_booking_step    = 0
    if "demo_booking_data"    not in st.session_state: st.session_state.demo_booking_data    = {}
    if "demo_booking_ref"     not in st.session_state: st.session_state.demo_booking_ref     = ""

    # ── top navigation ─────────────────────────────────────────
    st.markdown("""
    <div style='display:flex;align-items:center;gap:12px;margin-bottom:4px'>
      <span style='font-size:28px'>🍽️</span>
      <div>
        <div style='font-size:22px;font-weight:700'>The Venue</div>
        <div style='font-size:13px;color:#888'>Restaurant CRM — Demo Interativo</div>
      </div>
    </div>
    """, unsafe_allow_html=True)

    demo_nav = st.radio("Vista", ["🌐 Página Pública", "🔧 Backoffice"], horizontal=True, label_visibility="collapsed")
    st.divider()

    # ═══════════════════════════════════════════════════════════
    # PUBLIC SIDE
    # ═══════════════════════════════════════════════════════════
    if demo_nav == "🌐 Página Pública":
        step = st.session_state.demo_booking_step

        # ── STEP 0: Landing Page ──────────────────────────────
        if step == 0:

            # Hero banner
            st.markdown("""
            <div style='background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);
                        border-radius:16px;padding:52px 40px;text-align:center;margin-bottom:24px'>
              <div style='color:#d4af37;font-size:12px;letter-spacing:4px;text-transform:uppercase;margin-bottom:10px'>
                Lisboa · Est. 2018
              </div>
              <div style='color:white;font-size:46px;font-weight:800;letter-spacing:-1px;margin-bottom:8px'>
                The Venue
              </div>
              <div style='color:#ccc;font-size:17px;margin-bottom:30px'>
                Fine dining &nbsp;·&nbsp; Craft cocktails &nbsp;·&nbsp; Live music
              </div>
              <div style='color:#999;font-size:13px'>
                Rua Augusta 142, Lisboa &nbsp;·&nbsp; +351 21 123 4567 &nbsp;·&nbsp; Ter–Dom · 18h–02h
              </div>
            </div>
            """, unsafe_allow_html=True)

            # CTA buttons
            btn1, btn2, btn3 = st.columns([2, 2, 3])
            if btn1.button("🍽️ Reservar Mesa", use_container_width=True, type="primary"):
                st.session_state.demo_booking_step = 1
                st.rerun()
            btn2.button("📅 Ver Eventos", use_container_width=True)
            btn3.markdown(
                "<div style='color:#888;font-size:12px;padding-top:10px'>"
                "Taxa de reserva: €5/pessoa · Devolvida no jantar</div>",
                unsafe_allow_html=True
            )

            st.divider()

            # ── Upcoming Events ───────────────────────────────
            st.markdown("## 📅 Próximos Eventos")
            evs = st.session_state.demo_upcoming_events
            if evs:
                cols = st.columns(min(len(evs), 3))
                for i, ev in enumerate(evs):
                    with cols[i % 3]:
                        spots = ev["capacity"] - ev["booked"]
                        pct   = ev["booked"] / ev["capacity"]
                        if ev.get("image_bytes"):
                            st.image(ev["image_bytes"], use_container_width=True)
                        else:
                            emoji = ["🎵","🍷","🍸"][i % 3]
                            st.markdown(
                                f"<div style='background:linear-gradient(135deg,#1a1a2e,#0f3460);"
                                f"border-radius:8px;height:110px;display:flex;align-items:center;"
                                f"justify-content:center;font-size:36px;margin-bottom:8px'>{emoji}</div>",
                                unsafe_allow_html=True
                            )
                        st.markdown(f"**{ev['name']}**")
                        st.caption(f"📅 {ev['date']} · {ev['time']} · 🎟️ €{ev['price']}/pessoa")
                        st.markdown(f"<div style='font-size:13px;color:#555;margin-bottom:8px'>{ev['description']}</div>", unsafe_allow_html=True)
                        st.progress(pct, text=f"{spots} lugares disponíveis")
                        if spots > 0:
                            st.button(f"Comprar bilhete — €{ev['price']}", key=f"ev_buy_{ev['id']}", use_container_width=True)
                        else:
                            st.error("Esgotado")
            else:
                st.info("Sem eventos próximos de momento.")

            st.divider()

            # ── Past Events Gallery ───────────────────────────
            st.markdown("## 🖼️ Momentos Passados")
            past_evs = st.session_state.demo_past_events
            if past_evs:
                for ev in past_evs:
                    with st.expander(f"**{ev['name']}** · {ev['date']}"):
                        st.markdown(f"*{ev['description']}*")
                        if ev["photos"]:
                            gc = st.columns(min(len(ev["photos"]), 3))
                            for j, pb in enumerate(ev["photos"]):
                                gc[j % 3].image(pb, use_container_width=True)
                        else:
                            st.caption("📷 Galeria de fotos disponível em breve.")
            else:
                st.info("Sem eventos passados registados.")

        # ── STEP 1: Booking Form ──────────────────────────────
        elif step == 1:
            st.markdown("### 🍽️ Reservar Mesa")
            st.progress(0.33, text="Passo 1 de 3 — Dados da Reserva")
            st.markdown("")

            with st.form("demo_booking_form"):
                st.markdown("**Dados pessoais**")
                bf1, bf2 = st.columns(2)
                b_name   = bf1.text_input("Nome completo *")
                b_email  = bf2.text_input("Email *")
                b_phone  = bf1.text_input("Telefone *")
                b_guests = bf2.number_input("Nº de pessoas *", min_value=1, max_value=20, value=2)

                st.markdown("**Detalhes da reserva**")
                bd1, bd2 = st.columns(2)
                b_date     = bd1.date_input("Data *", min_value=datetime.today())
                b_time     = bd2.selectbox("Hora", ["19:00","19:30","20:00","20:30","21:00","21:30","22:00"])
                b_zone     = bd1.selectbox("Zona preferida", ["Sem preferência","Interior","Terraço","Bar","Sala Privada (min. 8 pax)"])
                b_occasion = bd2.selectbox("Ocasião especial", ["—","Aniversário","Pedido de casamento","Jantar de negócios","Celebração","Outro"])
                b_notes    = st.text_area("Pedidos especiais / Alergias", height=80, label_visibility="visible")

                fee = int(b_guests) * 5
                st.markdown(f"**Taxa de reserva: €{fee}** &nbsp;({int(b_guests)} × €5 por pessoa · devolvida no jantar)")

                if st.form_submit_button("Continuar para Pagamento →", type="primary", use_container_width=True):
                    if b_name and b_email and b_phone:
                        st.session_state.demo_booking_data = {
                            "name": b_name, "email": b_email, "phone": b_phone,
                            "guests": int(b_guests), "date": b_date.strftime("%Y-%m-%d"),
                            "time": b_time, "zone": b_zone,
                            "occasion": b_occasion, "notes": b_notes, "fee": fee,
                        }
                        st.session_state.demo_booking_step = 2
                        st.rerun()
                    else:
                        st.error("Por favor preencha os campos obrigatórios (*)")

            if st.button("← Voltar à página inicial"):
                st.session_state.demo_booking_step = 0
                st.rerun()

        # ── STEP 2: Payment ───────────────────────────────────
        elif step == 2:
            bd = st.session_state.demo_booking_data
            st.markdown("### 💳 Pagamento da Taxa de Reserva")
            st.progress(0.66, text="Passo 2 de 3 — Pagamento")
            st.markdown("")

            # Summary card
            st.markdown("**Resumo da reserva**")
            s1, s2 = st.columns(2)
            s1.markdown(f"👤 **{bd['name']}**")
            s1.markdown(f"📅 {bd['date']} às {bd['time']}")
            s1.markdown(f"👥 {bd['guests']} pessoa(s) · {bd['zone']}")
            s2.markdown(f"📧 {bd['email']}")
            s2.markdown(f"📞 {bd['phone']}")
            if bd["occasion"] != "—":
                s2.markdown(f"🎉 {bd['occasion']}")
            st.markdown(f"#### 💰 Total: €{bd['fee']:.2f}")
            st.caption("A taxa será descontada na conta no final do jantar.")
            st.divider()

            with st.form("demo_payment_form"):
                st.markdown("**Dados do cartão**")
                pay_name = st.text_input("Nome no cartão")
                pc1, pc2 = st.columns([3, 1])
                pay_card = pc1.text_input("Número do cartão", placeholder="1234 5678 9012 3456", max_chars=19)
                pc3, pc4 = st.columns(2)
                pay_exp  = pc3.text_input("Validade (MM/AA)", placeholder="12/27", max_chars=5)
                pay_cvv  = pc4.text_input("CVV", placeholder="123", max_chars=3, type="password")
                st.markdown(
                    "<div style='color:#888;font-size:12px;margin-top:4px'>"
                    "🔒 Pagamento simulado · Use qualquer dado fictício</div>",
                    unsafe_allow_html=True
                )
                if st.form_submit_button("✅ Confirmar e Pagar →", type="primary", use_container_width=True):
                    if pay_card and pay_exp and pay_cvv:
                        import random, string as _string
                        ref = "RES-" + "".join(random.choices(_string.ascii_uppercase + _string.digits, k=6))
                        st.session_state.demo_booking_ref = ref
                        new_res = {
                            "id": ref, "customer": bd["name"],
                            "date": bd["date"], "time": bd["time"],
                            "pax": bd["guests"], "table": bd["zone"],
                            "occasion": bd["occasion"] if bd["occasion"] != "—" else "",
                            "status": "Confirmada",
                            "notes": (f"[Pago online €{bd['fee']}] " + bd.get("notes","")).strip(),
                        }
                        dres_cur = st.session_state.demo_reservations
                        dcust_cur = st.session_state.demo_customers
                        st.session_state.demo_reservations = pd.concat(
                            [dres_cur, pd.DataFrame([new_res])], ignore_index=True)
                        if dcust_cur[dcust_cur["email"] == bd["email"]].empty:
                            nc = {"id": f"C{len(dcust_cur)+1:03d}", "name": bd["name"],
                                  "phone": bd["phone"], "email": bd["email"], "tier": "Ocasional",
                                  "visits": 1, "last_visit": bd["date"], "total_spend": 0,
                                  "preferences": bd["zone"], "allergies": "—",
                                  "birthday": "—", "notes": bd.get("notes","")}
                            st.session_state.demo_customers = pd.concat(
                                [dcust_cur, pd.DataFrame([nc])], ignore_index=True)
                        st.session_state.demo_booking_step = 3
                        st.rerun()
                    else:
                        st.error("Por favor preencha todos os dados do cartão.")

            if st.button("← Voltar"):
                st.session_state.demo_booking_step = 1
                st.rerun()

        # ── STEP 3: Confirmation ──────────────────────────────
        else:
            bd  = st.session_state.demo_booking_data
            ref = st.session_state.demo_booking_ref
            st.progress(1.0, text="Passo 3 de 3 — Confirmação")
            st.markdown("")
            st.success(f"✅ Reserva confirmada! Referência: `{ref}`")
            st.markdown(f"""
            <div style='background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:28px;margin:16px 0'>
              <div style='font-size:22px;font-weight:700;margin-bottom:18px'>
                🎉 Até breve, {bd['name'].split()[0]}!
              </div>
              <table style='width:100%;border-collapse:collapse;font-size:14px'>
                <tr><td style='color:#555;padding:5px 0;width:130px'>📅 Data</td>
                    <td><b>{bd['date']} às {bd['time']}</b></td></tr>
                <tr><td style='color:#555;padding:5px 0'>👥 Pessoas</td>
                    <td><b>{bd['guests']}</b></td></tr>
                <tr><td style='color:#555;padding:5px 0'>🪑 Zona</td>
                    <td><b>{bd['zone']}</b></td></tr>
                <tr><td style='color:#555;padding:5px 0'>💳 Pago</td>
                    <td><b>€{bd['fee']:.2f}</b> (taxa de reserva)</td></tr>
                <tr><td style='color:#555;padding:5px 0'>📧 Email</td>
                    <td>{bd['email']}</td></tr>
                <tr><td style='color:#555;padding:5px 0'>🔖 Referência</td>
                    <td><code style='background:#e5e7eb;padding:2px 6px;border-radius:4px'>{ref}</code></td></tr>
              </table>
              <div style='margin-top:18px;color:#555;font-size:13px'>
                Uma confirmação foi enviada para {bd['email']}.
                A taxa de €{bd['fee']:.2f} será descontada na conta.
              </div>
            </div>
            """, unsafe_allow_html=True)

            if st.button("← Voltar à página inicial"):
                st.session_state.demo_booking_step = 0
                st.session_state.demo_booking_data = {}
                st.rerun()

    # ═══════════════════════════════════════════════════════════
    # BACKOFFICE
    # ═══════════════════════════════════════════════════════════
    else:
        st.markdown("### 🔧 Backoffice — The Venue")

        bo_res, bo_cust, bo_events, bo_pipe, bo_loyal = st.tabs([
            "📅 Reservas", "👥 Clientes", "🎪 Eventos", "🎯 Pipeline", "⭐ Fidelização"
        ])

        # ── RESERVAS ──────────────────────────────────────────
        with bo_res:
            dres_cur = st.session_state.demo_reservations
            today_r  = dres_cur[dres_cur["date"] == _TODAY]
            future_r = dres_cur[dres_cur["date"] > _TODAY].sort_values(["date","time"])
            past_r   = dres_cur[dres_cur["date"] < _TODAY].sort_values("date", ascending=False)

            st.subheader("📅 Reservas")

            brt1, brt2, brt3 = st.tabs([
                f"Hoje ({len(today_r)})", f"Futuras ({len(future_r)})", f"Histórico ({len(past_r)})"
            ])

            with brt1:
                if len(today_r):
                    m1, m2, m3 = st.columns(3)
                    m1.metric("Reservas", len(today_r))
                    m2.metric("Covers", int(today_r["pax"].sum()))
                    m3.metric("Confirmadas", int((today_r["status"] == "Confirmada").sum()))
                    st.dataframe(
                        today_r[["time","customer","pax","table","occasion","status","notes"]].sort_values("time"),
                        hide_index=True, use_container_width=True
                    )
                else:
                    st.info("Sem reservas para hoje.")

            with brt2:
                if len(future_r):
                    st.dataframe(
                        future_r[["date","time","customer","pax","table","occasion","status","notes"]],
                        hide_index=True, use_container_width=True
                    )
                else:
                    st.info("Sem reservas futuras.")

            with brt3:
                if len(past_r):
                    st.dataframe(
                        past_r[["date","time","customer","pax","table","occasion","status","notes"]],
                        hide_index=True, use_container_width=True
                    )
                else:
                    st.info("Sem histórico.")

            st.divider()
            with st.expander("➕ Criar reserva manual"):
                with st.form("bo_new_res"):
                    rf1, rf2 = st.columns(2)
                    nr_c = rf1.text_input("Cliente *")
                    nr_d = rf2.date_input("Data", value=datetime.today())
                    nr_t = rf1.text_input("Hora", value="20:00")
                    nr_p = rf2.number_input("Pax", 1, 300, 2)
                    nr_z = rf1.text_input("Mesa / Zona")
                    nr_o = rf2.text_input("Ocasião")
                    nr_n = st.text_area("Notas", height=60, label_visibility="visible")
                    nr_s = st.selectbox("Estado", ["Confirmada","Pendente","Cancelada"])
                    if st.form_submit_button("Criar"):
                        if nr_c:
                            new_r = {"id": f"R{len(dres_cur)+1:03d}", "customer": nr_c,
                                     "date": nr_d.strftime("%Y-%m-%d"), "time": nr_t,
                                     "pax": int(nr_p), "table": nr_z, "occasion": nr_o,
                                     "status": nr_s, "notes": nr_n}
                            st.session_state.demo_reservations = pd.concat(
                                [dres_cur, pd.DataFrame([new_r])], ignore_index=True)
                            st.success(f"✅ Reserva criada para {nr_c}!")
                            st.rerun()
                        else:
                            st.error("Cliente obrigatório.")

        # ── CLIENTES ──────────────────────────────────────────
        with bo_cust:
            dcust_cur = st.session_state.demo_customers
            st.subheader("👥 Clientes")
            cs1, cs2 = st.columns([3,2])
            search_c = cs1.text_input("Pesquisar", placeholder="Nome, email, telefone…")
            tier_f   = cs2.multiselect("Tier", ["VIP","Regular","Corporativo","Ocasional"])

            view = dcust_cur.copy()
            if search_c:
                mask = (view["name"].str.contains(search_c, case=False, na=False) |
                        view["email"].str.contains(search_c, case=False, na=False) |
                        view["phone"].str.contains(search_c, case=False, na=False))
                view = view[mask]
            if tier_f:
                view = view[view["tier"].isin(tier_f)]

            for _, c in view.iterrows():
                icon = _TIER_ICON.get(c["tier"],"👤")
                with st.expander(f"{icon} **{c['name']}** · {c['tier']} · {c['visits']} visitas · €{int(c['total_spend']):,}"):
                    ca, cb = st.columns(2)
                    ca.markdown(f"📞 {c['phone']}")
                    ca.markdown(f"📧 {c['email']}")
                    ca.markdown(f"🎂 {c['birthday']}")
                    ca.markdown(f"📅 Última visita: {c['last_visit']}")
                    cb.markdown(f"🪑 **Preferências:** {c['preferences']}")
                    cb.markdown(f"⚠️ **Alergias:** {c['allergies']}")
                    if c["notes"]:
                        st.info(f"📝 {c['notes']}")

            st.divider()
            with st.expander("➕ Adicionar cliente"):
                with st.form("bo_new_customer"):
                    fc1, fc2 = st.columns(2)
                    nc_name  = fc1.text_input("Nome *")
                    nc_phone = fc2.text_input("Telefone")
                    nc_email = fc1.text_input("Email")
                    nc_bday  = fc2.text_input("Aniversário (AAAA-MM-DD)")
                    nc_tier  = fc1.selectbox("Tier", ["Regular","VIP","Corporativo","Ocasional"])
                    nc_allg  = fc2.text_input("Alergias")
                    nc_pref  = st.text_input("Preferências")
                    nc_note  = st.text_area("Notas", height=60, label_visibility="visible")
                    if st.form_submit_button("Guardar"):
                        if nc_name:
                            new_row = {"id": f"C{len(dcust_cur)+1:03d}", "name": nc_name,
                                       "phone": nc_phone, "email": nc_email, "tier": nc_tier,
                                       "visits": 0, "last_visit": _TODAY, "total_spend": 0,
                                       "preferences": nc_pref, "allergies": nc_allg or "—",
                                       "birthday": nc_bday or "—", "notes": nc_note}
                            st.session_state.demo_customers = pd.concat(
                                [dcust_cur, pd.DataFrame([new_row])], ignore_index=True)
                            st.success(f"✅ {nc_name} adicionado!")
                            st.rerun()
                        else:
                            st.error("Nome obrigatório.")

        # ── EVENTOS ───────────────────────────────────────────
        with bo_events:
            st.subheader("🎪 Gestão de Eventos")
            ev_up_tab, ev_past_tab = st.tabs(["📅 Próximos", "🖼️ Passados & Galeria"])

            with ev_up_tab:
                st.markdown("**Eventos agendados**")
                for i, ev in enumerate(st.session_state.demo_upcoming_events):
                    spots = ev["capacity"] - ev["booked"]
                    with st.expander(f"**{ev['name']}** · {ev['date']} · {ev['time']} · €{ev['price']}/pax · {spots} lugares livres"):
                        eu1, eu2 = st.columns(2)
                        eu1.markdown(f"📅 {ev['date']} às {ev['time']}")
                        eu1.markdown(f"🎟️ €{ev['price']} por pessoa")
                        eu2.markdown(f"👥 Capacidade: {ev['capacity']}")
                        eu2.markdown(f"✅ Inscritos: {ev['booked']}")
                        st.markdown(ev["description"])
                        img_up = st.file_uploader("Imagem de capa", type=["jpg","jpeg","png"], key=f"ev_img_{i}")
                        if img_up:
                            st.session_state.demo_upcoming_events[i]["image_bytes"] = img_up.read()
                            st.success("Imagem guardada!")
                            st.rerun()

                st.divider()
                with st.expander("➕ Novo evento"):
                    with st.form("bo_new_event"):
                        nef1, nef2 = st.columns(2)
                        ne_name = nef1.text_input("Nome do evento *")
                        ne_date = nef2.date_input("Data", value=datetime.today() + timedelta(days=14))
                        ne_time = nef1.text_input("Hora", value="21:00")
                        ne_price = nef2.number_input("Preço (€/pessoa)", min_value=0, value=20)
                        ne_cap  = nef1.number_input("Capacidade", min_value=1, value=50)
                        ne_desc = st.text_area("Descrição", height=80, label_visibility="visible")
                        ne_img  = st.file_uploader("Imagem de capa", type=["jpg","jpeg","png"])
                        if st.form_submit_button("Criar evento"):
                            if ne_name:
                                new_ev = {"id": f"E{len(st.session_state.demo_upcoming_events)+1:03d}",
                                          "name": ne_name, "date": ne_date.strftime("%Y-%m-%d"),
                                          "time": ne_time, "price": int(ne_price),
                                          "capacity": int(ne_cap), "booked": 0,
                                          "description": ne_desc,
                                          "image_bytes": ne_img.read() if ne_img else None}
                                st.session_state.demo_upcoming_events.append(new_ev)
                                st.success(f"✅ Evento '{ne_name}' criado!")
                                st.rerun()
                            else:
                                st.error("Nome obrigatório.")

            with ev_past_tab:
                st.markdown("**Eventos passados com galeria de fotos**")
                for i, ev in enumerate(st.session_state.demo_past_events):
                    with st.expander(f"**{ev['name']}** · {ev['date']} · {len(ev['photos'])} foto(s)"):
                        st.markdown(f"*{ev['description']}*")
                        if ev["photos"]:
                            gc = st.columns(min(len(ev["photos"]), 3))
                            for j, pb in enumerate(ev["photos"]):
                                gc[j % 3].image(pb, use_container_width=True)
                        photos_up = st.file_uploader(
                            "Adicionar fotos", type=["jpg","jpeg","png"],
                            accept_multiple_files=True, key=f"past_ev_{i}"
                        )
                        if photos_up:
                            for p in photos_up:
                                st.session_state.demo_past_events[i]["photos"].append(p.read())
                            st.success(f"{len(photos_up)} foto(s) adicionada(s)!")
                            st.rerun()

                st.divider()
                with st.expander("➕ Adicionar evento passado"):
                    with st.form("bo_new_past_event"):
                        pe1, pe2 = st.columns(2)
                        pe_name = pe1.text_input("Nome do evento *")
                        pe_date = pe2.date_input("Data", value=datetime.today() - timedelta(days=14))
                        pe_desc = st.text_area("Descrição", height=80, label_visibility="visible")
                        if st.form_submit_button("Adicionar"):
                            if pe_name:
                                new_pe = {"id": f"PE{len(st.session_state.demo_past_events)+1:03d}",
                                          "name": pe_name, "date": pe_date.strftime("%Y-%m-%d"),
                                          "description": pe_desc, "photos": []}
                                st.session_state.demo_past_events.append(new_pe)
                                st.success(f"✅ '{pe_name}' adicionado!")
                                st.rerun()
                            else:
                                st.error("Nome obrigatório.")

        # ── PIPELINE ──────────────────────────────────────────
        with bo_pipe:
            dpipe_cur = st.session_state.demo_pipeline
            st.subheader("🎯 Pipeline de Eventos & Grupos")

            for status in _PIPE_ORDER:
                rows = dpipe_cur[dpipe_cur["status"] == status]
                if rows.empty:
                    continue
                color = _PIPE_STATUS_COLOR.get(status,"#888")
                total = int(rows["value"].sum())
                st.markdown(
                    f"<span style='color:{color};font-weight:bold;font-size:15px'>● {status}</span>"
                    f"&nbsp;— {len(rows)} · €{total:,}",
                    unsafe_allow_html=True
                )
                for _, p in rows.iterrows():
                    bar = "█" * (p["prob"] // 10) + "░" * (10 - p["prob"] // 10)
                    with st.expander(f"{p['client']} — {p['event']} · {p['date']} · {p['pax']} pax · **€{p['value']:,}**"):
                        pa, pb = st.columns(2)
                        pa.markdown(f"📅 {p['date']} · 👥 {p['pax']} pax · 💰 €{p['value']:,}")
                        pb.markdown(f"📊 {p['prob']}% &nbsp; `{bar}`")
                        if p["notes"]:
                            st.info(f"📝 {p['notes']}")

            st.divider()
            with st.expander("➕ Novo lead de evento"):
                with st.form("bo_new_pipeline"):
                    pf1, pf2 = st.columns(2)
                    np_client = pf1.text_input("Cliente *")
                    np_event  = pf2.text_input("Tipo de evento")
                    np_date   = pf1.date_input("Data", value=datetime.today() + timedelta(days=30))
                    np_pax    = pf2.number_input("Nº pessoas", 1, 1000, 20)
                    np_value  = pf1.number_input("Valor (€)", 0, 1000000, 1000)
                    np_prob   = pf2.slider("Probabilidade %", 0, 100, 50)
                    np_status = st.selectbox("Estado", _PIPE_ORDER)
                    np_notes  = st.text_area("Notas", height=60, label_visibility="visible")
                    if st.form_submit_button("Adicionar"):
                        if np_client:
                            new_pipe = {"id": f"P{len(dpipe_cur)+1:03d}", "client": np_client,
                                        "event": np_event, "date": np_date.strftime("%Y-%m-%d"),
                                        "pax": int(np_pax), "value": int(np_value),
                                        "status": np_status, "prob": int(np_prob), "notes": np_notes}
                            st.session_state.demo_pipeline = pd.concat(
                                [dpipe_cur, pd.DataFrame([new_pipe])], ignore_index=True)
                            st.success(f"✅ {np_client} adicionado!")
                            st.rerun()
                        else:
                            st.error("Cliente obrigatório.")

        # ── FIDELIZAÇÃO ───────────────────────────────────────
        with bo_loyal:
            dcust_cur = st.session_state.demo_customers
            st.subheader("⭐ Fidelização & VIP")

            _TIER_RULES = {
                "VIP":         (">20 visitas ou >€1 500", "🥇"),
                "Regular":     ("5–20 visitas",           "🥈"),
                "Corporativo": ("Empresa / grupo",         "🏢"),
                "Ocasional":   ("<5 visitas",              "👤"),
            }

            l1, l2 = st.columns([1,2])
            with l1:
                st.markdown("**Regras de Tier**")
                for tier, (rule, icon) in _TIER_RULES.items():
                    st.markdown(f"{icon} **{tier}:** {rule}")
                st.divider()
                for tier, (_, icon) in _TIER_RULES.items():
                    st.metric(f"{icon} {tier}", int((dcust_cur["tier"] == tier).sum()))
            with l2:
                st.markdown("**Top 10 por Gasto Total**")
                for i, (_, c) in enumerate(
                    dcust_cur.sort_values("total_spend", ascending=False).head(10).iterrows(), 1
                ):
                    icon = _TIER_ICON.get(c["tier"],"👤")
                    st.markdown(f"**{i}.** {icon} {c['name']} · {c['visits']} visitas · **€{int(c['total_spend']):,}**")

            st.divider()
            st.subheader("🎂 Aniversários Este Mês")
            cur_month = f"-{datetime.today().month:02d}-"
            bday_month = dcust_cur[dcust_cur["birthday"].str.contains(cur_month, na=False)]
            if len(bday_month):
                for _, c in bday_month.sort_values("birthday").iterrows():
                    day  = c["birthday"].split("-")[-1] if "-" in str(c["birthday"]) else "?"
                    icon = _TIER_ICON.get(c["tier"],"👤")
                    st.markdown(f"🎂 **Dia {day}** — {icon} {c['name']} ({c['tier']})")
            else:
                st.info("Nenhum aniversário este mês.")

