import streamlit as st
import pandas as pd

# =========================
# CONFIG
# =========================

FILE = "leads_no_website_scored.csv"  # ou leads_scored.csv

st.set_page_config(
    page_title="Lead Intelligence Dashboard",
    layout="wide"
)

# =========================
# LOAD DATA
# =========================

@st.cache_data
def load_data():
    return pd.read_csv(FILE)

df = load_data()

# =========================
# TITLE
# =========================

st.title("📊 Lead Intelligence Dashboard")
st.markdown("Filtra e analisa leads automaticamente (Google Places + scoring)")

# =========================
# SIDEBAR FILTERS
# =========================

st.sidebar.header("🔎 Filtros")

min_score, max_score = st.sidebar.slider(
    "Lead Score",
    0, 100,
    (0, 100)
)

city_filter = st.sidebar.text_input("Cidade contém")
keyword_filter = st.sidebar.text_input("Keyword contém")

# =========================
# FILTER LOGIC
# =========================

filtered = df.copy()

if "lead_score" in filtered.columns:
    filtered = filtered[
        (filtered["lead_score"] >= min_score) &
        (filtered["lead_score"] <= max_score)
    ]

if city_filter:
    filtered = filtered[filtered["city"].str.contains(city_filter, case=False, na=False)]

if keyword_filter:
    filtered = filtered[filtered["keyword"].str.contains(keyword_filter, case=False, na=False)]

# =========================
# SEGMENTS
# =========================

def segment(score):
    if score >= 80:
        return "🟢 HOT"
    elif score >= 50:
        return "🟡 WARM"
    else:
        return "🔴 COLD"

if "lead_score" in filtered.columns:
    filtered["segment"] = filtered["lead_score"].apply(segment)

# =========================
# STATS
# =========================

col1, col2, col3 = st.columns(3)

col1.metric("Total Leads", len(filtered))
col2.metric("HOT", len(filtered[filtered["segment"] == "🟢 HOT"]) if "segment" in filtered else 0)
col3.metric("WARM", len(filtered[filtered["segment"] == "🟡 WARM"]) if "segment" in filtered else 0)

st.divider()

# =========================
# TABLE
# =========================

st.subheader("📋 Leads")

show_cols = [
    "name",
    "city",
    "keyword",
    "rating",
    "reviews",
    "website",
    "lead_score",
    "segment",
    "lead_reasons"
]

show_cols = [c for c in show_cols if c in filtered.columns]

st.dataframe(
    filtered[show_cols].sort_values("lead_score", ascending=False)
    if "lead_score" in filtered.columns else filtered,
    use_container_width=True,
    height=600
)

# =========================
# LEAD DETAILS
# =========================

st.divider()
st.subheader("🔍 Lead Explorer")

if len(filtered) > 0:

    selected = st.selectbox(
        "Escolhe um lead",
        filtered["name"].astype(str).tolist()
    )

    lead = filtered[filtered["name"] == selected].iloc[0]

    st.write("### 🏢 Detalhes")

    st.write("**Nome:**", lead.get("name"))
    st.write("**Cidade:**", lead.get("city"))
    st.write("**Keyword:**", lead.get("keyword"))
    st.write("**Score:**", lead.get("lead_score", "N/A"))
    st.write("**Motivos:**", lead.get("lead_reasons", ""))

    if pd.notna(lead.get("website")):
        st.markdown(f"🌐 [Abrir Website]({lead['website']})")

# =========================
# EXPORT
# =========================

st.divider()

csv = filtered.to_csv(index=False).encode("utf-8")

st.download_button(
    "⬇️ Exportar CSV filtrado",
    csv,
    "filtered_leads.csv",
    "text/csv"
)