import streamlit as st
import pandas as pd
import os
import re
import time
import uuid
import urllib.parse
from datetime import datetime, timedelta, date, time as dt_time

try:
    from streamlit_calendar import calendar as _st_calendar
except Exception:
    _st_calendar = None

# xhtml2pdf é opcional — se faltar, o app cai para HTML-only no gerador de propostas
try:
    from xhtml2pdf import pisa as _pisa
    _PDF_AVAILABLE = True
except Exception:
    _pisa = None
    _PDF_AVAILABLE = False

st.set_page_config(page_title="Lead Machine", layout="wide", page_icon="🚀")

# =============================================================
# CONFIG
# =============================================================

_DIR = os.path.dirname(os.path.abspath(__file__))
MASTER_FILE   = os.path.join(_DIR, "leads_master.csv")
CRM_FILE      = os.path.join(_DIR, "crm_data.csv")
ACTIVITY_FILE  = os.path.join(_DIR, "crm_activity.csv")
SCORED_FILE    = os.path.join(_DIR, "leads_scored.csv")
EMAIL_LOG_FILE = os.path.join(_DIR, "email_log.csv")
MEETINGS_FILE  = os.path.join(_DIR, "meetings.csv")
BREVO_API_KEY  = os.environ.get("BREVO_API_KEY", "")
EMAIL_SENDER   = os.environ.get("EMAIL_SENDER",  "geral@smarthivesolutions.pt")
EMAIL_SENDER_NAME = "Miguel — SmartHive Solutions"

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
    "reunião_marcada":  "📌",
    "outro":            "🔔",
}

# ── Call outcome (resultado da chamada) ──
CALL_ANSWERED = ["—", "Sim", "Não atendeu", "Voicemail", "Número errado"]
OWNER_FLAGS   = ["—", "Sim, era o dono", "Não, era funcionário", "Sim, era sócio", "Não sei"]
NO_WEBSITE_REASONS = [
    "—",
    "Falta de tempo",
    "Falta de orçamento",
    "Não vê valor para o negócio",
    "Já tem alguém a tratar",
    "Vai pensar depois",
    "Outro",
]
BEST_CALL_TIMES = ["—", "Manhã (9h-12h)", "Tarde (14h-18h)", "Hora de almoço", "Indiferente"]

# ── Meeting stages (etapas do funil de vendas) ──
MEETING_STAGES = ["Discovery", "Demo", "Proposta", "Fecho", "Kickoff", "Follow-up"]
MEETING_STAGE_COLORS = {
    "Discovery": "#3b82f6",  # azul
    "Demo":      "#8b5cf6",  # roxo
    "Proposta":  "#f97316",  # laranja
    "Fecho":     "#22c55e",  # verde claro
    "Kickoff":   "#0d9488",  # verde escuro
    "Follow-up": "#6b7280",  # cinza
}
MEETING_STAGE_DESC = {
    "Discovery": "1ª conversa real — entender o negócio",
    "Demo":      "Apresentar exemplos/demo do trabalho",
    "Proposta":  "Apresentar preço e escopo formal",
    "Fecho":     "Negociação final e sign-off",
    "Kickoff":   "Arranque do projeto pós-fecho",
    "Follow-up": "Re-engagement sem objetivo específico",
}

MEETING_STATUSES = ["scheduled", "done", "no_show", "cancelled", "rescheduled"]
MEETING_STATUS_LABEL = {
    "scheduled":   "📅 Agendada",
    "done":        "✅ Realizada",
    "no_show":     "👻 Cliente faltou",
    "cancelled":   "❌ Cancelada",
    "rescheduled": "🔄 Reagendada",
}

# =============================================================
# PROPOSAL CATALOGS — building blocks for proposal generator
# =============================================================

BUSINESS_CHALLENGES = {
    "restaurant":   "Negócios como o vosso vivem das reservas, das visitas e dos pedidos de take-away. Uma presença digital fraca significa que clientes potenciais — que já estão a procurar onde comer — escolhem outros antes de chegarem até vocês.",
    "professional": "Os vossos potenciais clientes pesquisam serviços profissionais online antes de marcar a primeira consulta. Um site profissional, com áreas de prática claras, é o que separa quem é contactado de quem é ignorado.",
    "retail":       "Os clientes verificam a vossa presença online antes de visitar a loja física. Sem um site profissional, perdem-se vendas potenciais — tanto online como na rua.",
    "real_estate":  "O mercado imobiliário é dos mais competitivos online. Uma presença digital sofisticada é o que vos coloca à frente das outras imobiliárias quando o comprador procura no Google.",
    "beauty":       "Marcações de serviços de estética e cabeleireiro fazem-se cada vez mais online. Sem um sistema profissional, perdem-se clientes para concorrentes mais visíveis no digital.",
    "gym":          "Quem procura ginásio compara online antes de decidir. Uma presença digital fraca esconde tudo o que tornam o vosso espaço diferente.",
    "auto":         "Pedidos de orçamento e marcações de serviço automóvel começam quase sempre numa pesquisa Google. Quem não aparece bem, não recebe contacto.",
    "construction": "Empreitadas e remodelações começam com uma pesquisa Google. Sem portfólio digital claro, perdem-se obras para concorrentes mais visíveis.",
    "default":      "Hoje os vossos clientes pesquisam online antes de decidir. Uma presença digital profissional é o que vos coloca à frente da concorrência local.",
}

# Tier de preço base sugerido por tipo de projeto
DEFAULT_PRICES = {
    "rebuild":      799,
    "new":          1499,
}

# Funcionalidades — agrupadas por categoria. (label, default_selected)
FEATURES_CATALOG = {
    "Design & UX": [
        ("Design moderno e personalizado à vossa marca",          True),
        ("100% responsivo (mobile, tablet, desktop)",             True),
        ("Animações subtis e transições polidas",                 True),
        ("Fotografia profissional otimizada para web",            False),
        ("Modo claro / escuro automático",                        False),
    ],
    "Conteúdo": [
        ("Página inicial com hero impactante",                    True),
        ("Página \"Sobre\" com história do negócio",              True),
        ("Página de serviços/produtos detalhada",                 True),
        ("Página de contactos com formulário",                    True),
        ("Galeria de fotos com lightbox",                         False),
        ("Página de equipa com bios profissionais",               False),
        ("Blog / secção de notícias",                             False),
        ("FAQ por categoria/serviço",                             False),
    ],
    "Conversão": [
        ("Botão WhatsApp flutuante",                              True),
        ("Mapa Google embebido (com rota)",                       True),
        ("Sistema de reservas online (calendário)",               False),
        ("Formulário de pedido de orçamento",                     True),
        ("Pedido de take-away / encomenda online",                False),
        ("Integração com Cal.com / Calendly",                     False),
        ("Newsletter / captura de email",                         False),
        ("Testemunhos de clientes destacados",                    True),
    ],
    "SEO & Performance": [
        ("SEO técnico (schema.org, sitemap, robots)",             True),
        ("Otimização para Core Web Vitals (velocidade)",          True),
        ("Meta descriptions otimizadas por página",               True),
        ("Setup Google Business Profile",                         False),
        ("Integração Google Analytics + Search Console",          True),
        ("Configuração Google Tag Manager",                       False),
    ],
    "Multi-idioma": [
        ("Versão Português (PT-PT)",                              True),
        ("Versão Inglês (EN-GB)",                                 False),
        ("Outras línguas adicionais",                             False),
    ],
}

# Add-ons — extras com preço individual (one-time / recurring)
ADDON_CATALOG = [
    {"label": "Domínio + email profissional (1º ano)",            "price": 75,   "kind": "one-time"},
    {"label": "Setup do Google Business Profile",                  "price": 150,  "kind": "one-time"},
    {"label": "Copywriting profissional (até 5 páginas)",          "price": 350,  "kind": "one-time"},
    {"label": "Sessão fotográfica profissional",                   "price": 450,  "kind": "one-time"},
    {"label": "Integração com sistema de reservas externo",        "price": 250,  "kind": "one-time"},
    {"label": "Integração com pagamentos online (Stripe / MB Way)", "price": 350,  "kind": "one-time"},
    {"label": "Página de e-commerce (até 30 produtos)",            "price": 850,  "kind": "one-time"},
    {"label": "Tradução para inglês (EN-GB)",                      "price": 250,  "kind": "one-time"},
    {"label": "Manutenção mensal (backup, updates, alterações)",   "price": 49,   "kind": "/mês"},
    {"label": "SEO contínuo + reporting mensal",                   "price": 149,  "kind": "/mês"},
    {"label": "Gestão de Google Ads (com budget à parte)",         "price": 199,  "kind": "/mês"},
]

# Issues comuns em sites existentes (para o rebuild — caller seleciona quais aplicar)
CURRENT_ISSUES_CATALOG = [
    "Telefone do site é placeholder e não funciona",
    "Sem horários de funcionamento visíveis",
    "Sem mapa Google embebido",
    "Sem botão WhatsApp",
    "Site lento (Core Web Vitals baixos)",
    "Não é mobile-friendly",
    "Sem testemunhos de clientes",
    "Texto institucional fraco ou genérico",
    "Fotografias de baixa qualidade",
    "SEO básico ou inexistente",
    "Cookie banner mal configurado",
    "Conteúdo desatualizado / inconsistente",
    "Sem versão em inglês",
    "Aparece atribuição da agência criadora",
    "Sem páginas dedicadas por serviço",
]

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
    "Olá! Vi o {name} no Google Maps em {city} "
    "— {reviews} avaliações, excelente 👏\n\n"
    "Vi que têm uma presença forte no Google e pensei que ainda podiam "
    "aproveitar melhor isso online para captar mais contactos.\n\n"
    "Trabalho com negócios locais a transformar essa visibilidade em "
    "mais clientes através de websites simples e profissionais.\n\n"
    "Posso mostrar-vos uma ideia de como isso poderia funcionar no vosso caso?"
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
# EMAIL HELPERS
# =============================================================

_KEYWORD_CAT = {
    "dentist":"saude","clinic":"saude","physiotherapy":"saude","optician":"saude",
    "restaurant":"restauracao","bakery":"restauracao","cafe":"restauracao","bar":"restauracao",
    "spa":"beleza","gym":"beleza","barber":"beleza",
    "plumber":"servico","electrician":"servico","locksmith":"servico",
    "pest control":"servico","air conditioning repair":"servico",
    "painting service":"servico","carpet cleaning":"servico",
    "appliance repair":"servico","mechanic":"servico","cleaning service":"servico",
    "wedding photographer":"eventos","event planning":"eventos","party rental":"eventos",
    "real estate agency":"negocios","insurance agency":"negocios",
    "accountant":"negocios","lawyer":"negocios","construction":"negocios",
    "moving company":"negocios","transport service":"negocios","furniture delivery":"negocios",
}

_EMAIL_INTROS = {
    "saude": (
        "Vi o website do <strong>{name}</strong> e tenho algumas sugestões que poderiam aumentar "
        "o número de marcações online. A maioria das clínicas em {city} perde pacientes porque o "
        "site não aparece nas primeiras posições do Google — e quando aparece, não converte visitas "
        "em contactos."
    ),
    "restauracao": (
        "Passei pelo website do <strong>{name}</strong> em {city}. Com {reviews} avaliações no "
        "Google, têm claramente uma boa reputação — mas o vosso site pode estar a deixar escapar "
        "reservas. Um website optimizado com menu online, fotos e botão de reserva directa faz "
        "uma diferença enorme na conversão."
    ),
    "beleza": (
        "Vi o website do <strong>{name}</strong> em {city}. Com {reviews} avaliações, têm muito "
        "para mostrar — mas um site mais moderno com marcações online e galeria de trabalhos poderia "
        "trazer significativamente mais clientes novos sem esforço adicional da vossa parte."
    ),
    "servico": (
        "Vi o website do <strong>{name}</strong> em {city} — {reviews} avaliações é excelente! "
        "Muitos negócios de serviços perdem orçamentos porque o site não aparece quando alguém "
        "pesquisa no Google. Um redesign optimizado para SEO local pode mudar isso rapidamente."
    ),
    "eventos": (
        "Vi o website do <strong>{name}</strong> e o vosso trabalho parece muito bom. Com "
        "{reviews} avaliações em {city}, merecem um site que mostre o portfólio da melhor forma "
        "e converta visitantes em clientes — formulários de contacto rápidos, galeria optimizada "
        "e bom posicionamento no Google."
    ),
    "negocios": (
        "Vi o website do <strong>{name}</strong> em {city}. Com {reviews} avaliações no Google, "
        "têm claramente credibilidade no mercado — mas o site pode estar a perder potenciais "
        "clientes que pesquisam online e não encontram de imediato o que procuram."
    ),
    "default": (
        "Vi o website do <strong>{name}</strong> no Google Maps em {city} — {reviews} avaliações, "
        "muito bom! Trabalho com negócios locais a melhorar a sua presença online e notei algumas "
        "oportunidades para o vosso site aparecer melhor no Google e converter mais visitantes."
    ),
}

def build_email(name: str, city: str, reviews, keyword: str):
    cat   = _KEYWORD_CAT.get((keyword or "").lower(), "default")
    intro = _EMAIL_INTROS.get(cat, _EMAIL_INTROS["default"])
    try:
        intro = intro.format(name=name, city=city, reviews=int(reviews or 0), keyword=keyword or "negócio")
    except Exception:
        intro = intro.format(name=name, city=city, reviews=0, keyword="negócio")
    subject = f"Ideia rápida para o site do {name}"
    html = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;padding:24px;color:#1e293b;background:#ffffff;line-height:1.6;">
  <div style="border-bottom:3px solid #0284c7;padding-bottom:14px;margin-bottom:24px;">
    <span style="font-weight:700;font-size:17px;color:#0f172a;">SmartHive Solutions</span>
    <span style="font-size:12px;color:#94a3b8;margin-left:10px;">Websites para negócios locais</span>
  </div>
  <p style="font-size:15px;">Olá,</p>
  <p style="font-size:15px;">{intro}</p>
  <div style="background:#f0f9ff;border-left:4px solid #0284c7;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
    <p style="margin:0 0 8px;font-weight:700;font-size:14px;color:#0369a1;">O que podemos melhorar:</p>
    <ul style="margin:0;padding-left:18px;font-size:13px;color:#0f172a;">
      <li>SEO local — aparecer no topo do Google em {city}</li>
      <li>Design moderno e rápido, optimizado para telemóvel</li>
      <li>Botão WhatsApp, formulário e chamada para acção claros</li>
      <li>Entrega em 7–10 dias úteis, sem interromper o vosso negócio</li>
    </ul>
  </div>
  <p style="font-size:15px;">Posso fazer uma análise rápida do vosso site e mostrar exactamente o que mudaria? Sem compromisso nenhum.</p>
  <p style="font-size:15px;">Basta responder a este email ou contactar via WhatsApp.</p>
  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:13px;color:#64748b;">
    <strong style="color:#0f172a;">Miguel Lourenço</strong><br>
    SmartHive Solutions<br>
    <a href="mailto:geral@smarthivesolutions.pt" style="color:#0284c7;text-decoration:none;">geral@smarthivesolutions.pt</a>
  </div>
</body></html>"""
    return subject, html


def send_brevo(api_key: str, to_email: str, to_name: str, subject: str, html: str) -> dict:
    import requests as _r
    try:
        resp = _r.post(
            "https://api.brevo.com/v3/smtp/email",
            headers={"api-key": api_key, "content-type": "application/json"},
            json={
                "sender": {"name": EMAIL_SENDER_NAME, "email": EMAIL_SENDER},
                "to": [{"email": to_email, "name": to_name}],
                "subject": subject,
                "htmlContent": html,
            },
            timeout=15,
        )
        if resp.status_code in (200, 201):
            return {"ok": True}
        return {"ok": False, "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def load_email_log():
    if os.path.exists(EMAIL_LOG_FILE):
        return pd.read_csv(EMAIL_LOG_FILE, dtype={"place_id": str})
    return pd.DataFrame(columns=["timestamp","place_id","email","subject","status","error"])


def log_email_sent(place_id: str, email: str, subject: str, status: str, error: str = ""):
    log = load_email_log()
    new_row = pd.DataFrame([{
        "timestamp": datetime.now().isoformat(),
        "place_id":  str(place_id),
        "email":     email,
        "subject":   subject,
        "status":    status,
        "error":     error,
    }])
    pd.concat([log, new_row], ignore_index=True).to_csv(EMAIL_LOG_FILE, index=False)


# =============================================================
# CRM HELPERS
# =============================================================

def load_crm():
    if os.path.exists(CRM_FILE):
        crm = pd.read_csv(CRM_FILE, dtype={"place_id": str})
    else:
        crm = pd.DataFrame()
    defaults = {
        # legacy columns
        "place_id": "", "status": "new", "contact_date": "",
        "follow_up_date": "", "notes": "", "channel": "whatsapp",
        "deal_value": 0, "lost_reason": "", "next_action": "",
        # call-state columns (new)
        "answered":          "—",
        "is_owner":          "—",
        "who_answered":      "",
        "no_website_reason": "—",
        "best_call_time":    "—",
        "voicemail_left":    False,
        "attempts":          0,
        "last_call_at":      "",
    }
    for col, val in defaults.items():
        if col not in crm.columns:
            crm[col] = val
    crm["deal_value"] = pd.to_numeric(crm["deal_value"], errors="coerce").fillna(0)
    crm["attempts"]   = pd.to_numeric(crm["attempts"],   errors="coerce").fillna(0).astype(int)
    # voicemail_left can come back as "True"/"False" strings from CSV
    crm["voicemail_left"] = crm["voicemail_left"].apply(
        lambda v: bool(v) if isinstance(v, bool) else str(v).strip().lower() in ("true", "1", "yes")
    )
    return crm


def save_crm(crm):
    crm.to_csv(CRM_FILE, index=False)


def update_call_state(place_id, answered=None, is_owner=None, who_answered=None,
                      no_website_reason=None, best_call_time=None,
                      voicemail_left=None, increment_attempt=False):
    """Atualiza os campos de estado da chamada para um lead.
    Cada parâmetro com valor None é ignorado (não sobrescreve)."""
    crm = load_crm()
    pid = str(place_id)
    existing = crm[crm["place_id"] == pid]
    base = existing.iloc[0].to_dict() if len(existing) else {
        "place_id": pid, "status": "new", "contact_date": "", "follow_up_date": "",
        "notes": "", "channel": "phone", "deal_value": 0, "lost_reason": "",
        "next_action": "", "answered": "—", "is_owner": "—", "who_answered": "",
        "no_website_reason": "—", "best_call_time": "—", "voicemail_left": False,
        "attempts": 0, "last_call_at": "",
    }
    if answered          is not None: base["answered"]          = answered
    if is_owner          is not None: base["is_owner"]          = is_owner
    if who_answered      is not None: base["who_answered"]      = who_answered
    if no_website_reason is not None: base["no_website_reason"] = no_website_reason
    if best_call_time    is not None: base["best_call_time"]    = best_call_time
    if voicemail_left    is not None: base["voicemail_left"]    = bool(voicemail_left)
    if increment_attempt:
        base["attempts"]      = int(base.get("attempts", 0) or 0) + 1
        base["last_call_at"]  = datetime.now().isoformat()
    crm = crm[crm["place_id"] != pid].reset_index(drop=True)
    crm = pd.concat([crm, pd.DataFrame([base])], ignore_index=True)
    save_crm(crm)


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
    """Upsert a CRM row preserving call-state columns (answered, attempts, etc.)
    that may have been written by update_call_state before/after this call."""
    crm   = load_crm()
    pid   = str(place_id)
    today = datetime.now().strftime("%Y-%m-%d")

    existing = crm[crm["place_id"] == pid]
    if len(existing):
        base = existing.iloc[0].to_dict()
    else:
        base = {
            "place_id": pid, "status": "new", "contact_date": "",
            "follow_up_date": "", "notes": "", "channel": channel or "whatsapp",
            "deal_value": 0, "lost_reason": "", "next_action": "",
            "answered": "—", "is_owner": "—", "who_answered": "",
            "no_website_reason": "—", "best_call_time": "—",
            "voicemail_left": False, "attempts": 0, "last_call_at": "",
        }

    # Only overwrite the fields this function manages — leave call-state alone.
    base["status"]         = status
    base["contact_date"]   = contact_date or (
        today if old_status == "new" and status != "new"
        else base.get("contact_date", "")
    )
    base["follow_up_date"] = follow_up_date
    base["notes"]          = notes
    base["channel"]        = channel
    base["deal_value"]     = float(deal_value or 0)
    base["lost_reason"]    = lost_reason
    base["next_action"]    = next_action

    crm = crm[crm["place_id"] != pid].reset_index(drop=True)
    crm = pd.concat([crm, pd.DataFrame([base])], ignore_index=True)
    save_crm(crm)

    if old_status != status:
        log_activity(place_id, "mudança_status", f"{STATUS_EMOJI.get(old_status,'')} {old_status} → {STATUS_EMOJI.get(status,'')} {status}", old_status, status, channel)
    if new_note:
        log_activity(place_id, "nota", new_note, "", "", channel)


def quick_log(place_id, act_type, content, channel=""):
    log_activity(place_id, act_type, content, channel=channel)


# =============================================================
# MEETINGS HELPERS
# =============================================================

MEETINGS_COLUMNS = [
    "id", "place_id", "lead_name", "lead_city",
    "start_dt", "end_dt", "duration_min",
    "stage", "status", "meet_link", "notes",
    "created_at", "updated_at",
]


def load_meetings():
    if os.path.exists(MEETINGS_FILE):
        df = pd.read_csv(MEETINGS_FILE, dtype={"place_id": str, "id": str})
    else:
        df = pd.DataFrame(columns=MEETINGS_COLUMNS)
    for col in MEETINGS_COLUMNS:
        if col not in df.columns:
            df[col] = ""
    return df[MEETINGS_COLUMNS]


def save_meetings(df):
    df[MEETINGS_COLUMNS].to_csv(MEETINGS_FILE, index=False)


def _gen_meet_link():
    """Gera um placeholder de Google Meet (não cria meeting real — só URL similar
    para o caller copiar/colar. Substituir por integração OAuth quando necessário)."""
    a = uuid.uuid4().hex[:3]
    b = uuid.uuid4().hex[:4]
    c = uuid.uuid4().hex[:3]
    return f"https://meet.google.com/{a}-{b}-{c}"


def add_meeting(place_id, lead_name, lead_city, start_dt, duration_min,
                stage, notes="", meet_link=""):
    """Cria uma nova reunião. start_dt é datetime ou ISO string."""
    df = load_meetings()
    if isinstance(start_dt, str):
        start_dt = datetime.fromisoformat(start_dt)
    end_dt = start_dt + timedelta(minutes=int(duration_min))
    row = {
        "id":           str(uuid.uuid4()),
        "place_id":     str(place_id),
        "lead_name":    lead_name or "",
        "lead_city":    lead_city or "",
        "start_dt":     start_dt.isoformat(timespec="minutes"),
        "end_dt":       end_dt.isoformat(timespec="minutes"),
        "duration_min": int(duration_min),
        "stage":        stage,
        "status":       "scheduled",
        "meet_link":    meet_link or "",
        "notes":        notes or "",
        "created_at":   datetime.now().isoformat(timespec="seconds"),
        "updated_at":   datetime.now().isoformat(timespec="seconds"),
    }
    df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    save_meetings(df)
    log_activity(place_id, "reunião_marcada",
                 f"📅 {stage} · {start_dt.strftime('%d/%m %H:%M')} ({duration_min}min)")
    return row


def update_meeting(meeting_id, status=None, notes=None, start_dt=None, duration_min=None, stage=None):
    df = load_meetings()
    mask = df["id"] == str(meeting_id)
    if not mask.any():
        return None
    if status       is not None: df.loc[mask, "status"]    = status
    if notes        is not None: df.loc[mask, "notes"]     = notes
    if stage        is not None: df.loc[mask, "stage"]     = stage
    if start_dt is not None:
        if isinstance(start_dt, str):
            start_dt = datetime.fromisoformat(start_dt)
        df.loc[mask, "start_dt"] = start_dt.isoformat(timespec="minutes")
        dur = int(duration_min or df.loc[mask, "duration_min"].iloc[0] or 15)
        df.loc[mask, "end_dt"]   = (start_dt + timedelta(minutes=dur)).isoformat(timespec="minutes")
        df.loc[mask, "duration_min"] = dur
    elif duration_min is not None:
        s = datetime.fromisoformat(df.loc[mask, "start_dt"].iloc[0])
        df.loc[mask, "end_dt"] = (s + timedelta(minutes=int(duration_min))).isoformat(timespec="minutes")
        df.loc[mask, "duration_min"] = int(duration_min)
    df.loc[mask, "updated_at"] = datetime.now().isoformat(timespec="seconds")
    save_meetings(df)
    return df[mask].iloc[0].to_dict()


def delete_meeting(meeting_id):
    df = load_meetings()
    df = df[df["id"] != str(meeting_id)].reset_index(drop=True)
    save_meetings(df)


# Working hours config (ajustar conforme necessário)
WORK_START_HOUR = 9
WORK_END_HOUR   = 18          # último slot acaba antes desta hora
EXCLUDE_WEEKDAYS = {6, 0}     # 0 = Segunda, 6 = Domingo  (datetime.weekday())
SLOT_DURATION_DEFAULT = 30    # minutos
SLOT_STEP_MIN = 30            # de quanto em quanto granularidade
PREFERRED_HOURS = [10, 11, 14, 15, 16]  # ordem de preferência das horas


def compute_free_slots(n_slots=5, duration_min=SLOT_DURATION_DEFAULT, lookahead_days=7):
    """Calcula os próximos `n_slots` slots livres na agenda.

    - Salta dias em EXCLUDE_WEEKDAYS (default: Segunda + Domingo)
    - Horário de trabalho WORK_START_HOUR–WORK_END_HOUR
    - Evita slots que sobrepõem reuniões já marcadas (status != cancelled)
    - Slots começam apenas nas PREFERRED_HOURS (10, 11, 14, 15, 16)
    - Hoje só sugere slots a partir de +2h
    """
    meetings = load_meetings()
    if len(meetings):
        # Mantém só reuniões ativas, parse start/end
        active = meetings[meetings["status"].isin(["scheduled", "done"])]
        def _to_dt(s):
            try: return datetime.fromisoformat(str(s))
            except Exception: return None
        busy = [
            (_to_dt(r["start_dt"]), _to_dt(r["end_dt"]))
            for _, r in active.iterrows()
        ]
        busy = [(s, e) for s, e in busy if s and e]
    else:
        busy = []

    now = datetime.now()
    cutoff = now + timedelta(hours=2)  # hoje só a partir de +2h
    slots = []
    day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    for d_offset in range(lookahead_days + 1):
        current_day = day + timedelta(days=d_offset)
        if current_day.weekday() in EXCLUDE_WEEKDAYS:
            continue
        for h in PREFERRED_HOURS:
            slot_start = current_day.replace(hour=h, minute=0)
            slot_end   = slot_start + timedelta(minutes=duration_min)
            if slot_start < cutoff:
                continue
            if slot_end.hour > WORK_END_HOUR or (slot_end.hour == WORK_END_HOUR and slot_end.minute > 0):
                continue
            # Verifica sobreposição com reuniões
            overlaps = any(
                not (slot_end <= bs or slot_start >= be)
                for bs, be in busy
            )
            if overlaps:
                continue
            slots.append(slot_start)
            if len(slots) >= n_slots:
                return slots
    return slots


def format_slot_label(dt):
    """Format datetime as compact label: '4ª 21/05 · 11h00'"""
    weekdays_pt = ["2ª", "3ª", "4ª", "5ª", "6ª", "Sáb", "Dom"]
    return f"{weekdays_pt[dt.weekday()]} {dt.strftime('%d/%m')} · {dt.strftime('%Hh%M')}"


GOAL_BY_TYPE = {
    "restaurant":   "mais reservas, pedidos de take-away e visitas",
    "professional": "mais marcações qualificadas e novos clientes",
    "retail":       "mais visitas à loja e vendas online",
    "real_estate":  "mais contactos de potenciais compradores e vendedores",
    "beauty":       "mais marcações de serviços e fidelização de clientes",
    "gym":          "mais inscrições e adesões a programas",
    "auto":         "mais pedidos de orçamento e marcações",
    "construction": "mais pedidos de orçamento qualificados",
    "carpentry":    "mais pedidos de orçamento de obras à medida",
    "moving":       "mais pedidos de orçamento de mudanças",
    "laundry":      "mais clientes recorrentes e novos contactos",
    "default":      "mais contactos qualificados e pedidos de orçamento",
}


# Labels human-readable para apresentar ao caller
VERTICAL_LABEL = {
    "restaurant":   "Restauração",
    "professional": "Serviços profissionais",
    "retail":       "Comércio / Loja",
    "real_estate":  "Imobiliária",
    "beauty":       "Beleza / Estética",
    "gym":          "Ginásio / Fitness",
    "auto":         "Automóvel",
    "construction": "Construção / Obras",
    "carpentry":    "Carpintaria / Marcenaria",
    "moving":       "Mudanças / Transportes",
    "laundry":      "Lavandaria",
    "default":      "Negócio local",
}


# Hooks específicos por vertical — usados nas 3 versões do pitch
VERTICAL_HOOKS = {
    "restaurant": {
        "gancho_v1": "Estava a ver quem aparece no Google quando alguém pesquisa onde jantar em {city}",
        "gancho_v3": "Tenho estado a olhar para a restauração em {city} numa análise que fazia",
        "insight":   "A concorrência com menos qualidade está a apanhar reservas que vos deviam chegar — porque aparece primeiro no Maps",
        "insight_v3": "Têm {presence} — no setor restauração em {city}, isso é top 5% em reputação. Mas no Maps quem aparece primeiro nas pesquisas \"jantar perto de mim\" são casas com metade das vossas reviews",
        "diag":      "Faz alguma ideia quantas reservas semanais vêm de quem vos encontrou no Google vs quem já vos conhecia?",
    },
    "professional": {
        "gancho_v1": "Estava a olhar para quem aparece quando alguém em {city} procura este serviço",
        "gancho_v3": "Tenho estado a analisar a presença online de serviços profissionais em {city}",
        "insight":   "Os clientes pré-qualificados procuram primeiro a área específica online. Quem aparece bem, fecha. Quem não aparece, perde antes da primeira marcação",
        "insight_v3": "Têm {presence} — mas a forma como aparecem para quem procura serviços do vosso tipo em {city} não reflete essa reputação. Há clientes que precisam dos vossos serviços a contratar outros porque vos encontram tarde",
        "diag":      "Dos clientes novos do último trimestre, sabe quantos vos descobriram através do Google?",
    },
    "real_estate": {
        "gancho_v1": "Andava a ver imobiliárias em {city} e a vossa apareceu logo",
        "gancho_v3": "Tenho estado a olhar para o mercado imobiliário em {city}",
        "insight":   "Compradores filtram 80% das opções online antes de visitar. Quem capta a atenção DURANTE essa pesquisa, ganha o cliente. Quem aparece DEPOIS, perde-o",
        "insight_v3": "Têm {presence}. Mas a captação imobiliária hoje decide-se nos primeiros 3 minutos da pesquisa online — e a vossa visibilidade nessa janela específica está atrás de imobiliárias com menos histórico",
        "diag":      "Quantos contactos novos chegam por semana de quem nunca tinha trabalhado convosco antes?",
    },
    "beauty": {
        "gancho_v1": "Hoje quem procura cabeleireiro ou estética em {city} pesquisa direto no Google Maps",
        "gancho_v3": "Tenho estado a olhar para o setor de beleza em {city}",
        "insight":   "Quem aparece nas primeiras 3 posições do Maps com fotos atualizadas tem 3x mais marcações — e fotos antigas custam clientes silenciosamente",
        "insight_v3": "Têm {presence}. Mas o ponto onde se ganha ou perde a marcação é a ficha do Google Maps — galeria, horários, resposta a reviews. Vejo aí espaço para 30-40% mais marcações sem mais investimento em marketing",
        "diag":      "Hoje as novas clientes vêm mais por recomendação ou por encontrarem-vos no Google?",
    },
    "gym": {
        "gancho_v1": "A captação online de novos sócios neste setor mudou muito nos últimos 12 meses",
        "gancho_v3": "Tenho estado a estudar a captação digital em ginásios em {city}",
        "insight":   "Os ginásios que estão a crescer agora são os que captam por Instagram + Google reviews — não por flyers nem ofertas de fim de ano",
        "insight_v3": "Têm {presence}. Mas a métrica que importa para um ginásio em 2026 é taxa de conversão da pesquisa \"ginásio em {city}\" para visita ao espaço. E aí, vejo gap claro entre o que vocês valem e o que captam",
        "diag":      "Os novos sócios que entram, vêm mais por amigos que já são sócios ou por procura direta no Google?",
    },
    "auto": {
        "gancho_v1": "Estive a ver oficinas em {city} e como aparecem para quem precisa de serviço urgente",
        "gancho_v3": "Tenho estado a analisar a captação de orçamentos no setor automóvel em {city}",
        "insight":   "Pedidos de orçamento começam quase sempre com pesquisa Google. Quem não tem ficha bem montada, não recebe a chamada — mesmo tendo melhor qualidade",
        "insight_v3": "Têm {presence}. Mas no momento de decisão — o cliente que rebenta uma peça à sexta — quem ganha o trabalho é quem aparece primeiro e responde em 30 minutos. Vejo aí onde estão a perder casos",
        "diag":      "Quantos pedidos de orçamento entram por semana só pelo telefone direto, sem terem visto o vosso site primeiro?",
    },
    "construction": {
        "gancho_v1": "Estive a olhar para empresas de obras na vossa zona",
        "gancho_v3": "Tenho estado a analisar empresas de construção/remodelação em {city}",
        "insight":   "Obras de €5k+ começam com 2-3 dias de research no Google. Sem portefólio digital claro, perde-se a obra antes do cliente saber que existem",
        "insight_v3": "Têm {presence}. Mas a obra adjudicada não decide-se na recomendação inicial — decide-se nos 2-3 dias em que o cliente verifica no Google quem é, o que fez, e se inspira confiança. Aí é onde têm gap",
        "diag":      "Dos orçamentos que enviam, faz ideia da percentagem que se converte em obra? E em quantos dias responde a maioria?",
    },
    "carpentry": {
        "gancho_v1": "Estava a olhar para a vossa carpintaria, especificamente as {revs} reviews",
        "gancho_v3": "Tenho estado a olhar para carpintarias e marcenarias em {city}",
        "insight":   "Quem procura carpintaria por medida hoje, encontra primeiro empresas mais novas com presença digital arrumada — não as que têm 20 anos de ofício",
        "insight_v3": "Têm {presence}. Mas o cliente que procura carpintaria por medida começa com pesquisa visual — \"ideias de cozinha em madeira\", \"roupeiros em carvalho\". Quem mostra trabalho real online ganha. Quem só tem reviews boas mas zero galeria, perde para empresas inferiores",
        "diag":      "Quanto da vossa carteira atual veio por recomendação direta vs quem vos encontrou online primeiro?",
    },
    "moving": {
        "gancho_v1": "Apanhei-vos numa pesquisa que estava a fazer — o setor de mudanças tem características muito particulares",
        "gancho_v3": "Tenho estado a estudar a captação digital em empresas de mudanças em {city}",
        "insight":   "Quem decide uma mudança decide num fim-de-semana — e pesquisa numa quinta à noite. Quem aparece bem no domingo de manhã, ganha o orçamento de segunda",
        "insight_v3": "Têm {presence}. Mas a janela de decisão de uma mudança são 48-72h — e o cliente vai pedir 3-4 orçamentos. Quem aparece primeiro com confiança visual ganha 2 dos 3 casos. Vejo aí espaço claro para mais agendamentos",
        "diag":      "Em média, quantos orçamentos pedem antes de fechar com vocês — e em quanto tempo decidem?",
    },
    "laundry": {
        "gancho_v1": "Vi que a vossa lavandaria tem clientes de longa data — mas a aquisição de novos mudou completamente",
        "gancho_v3": "Tenho estado a olhar para o modelo de captação em lavandarias em {city}",
        "insight":   "90% dos novos clientes hoje encontram-vos no Google Maps, não a passar à porta — e a forma como aparecem aí decide tudo",
        "insight_v3": "Têm {presence}. Mas a lavandaria moderna ganha clientes por dois canais: passantes do bairro (que diminui) e Google Maps + Instagram (que cresce). Vejo aí onde estão a perder o segundo canal",
        "diag":      "Dos clientes novos que apareceram este mês, quantos vieram porque vos encontraram no Google?",
    },
    "retail": {
        "gancho_v1": "Os clientes hoje verificam a vossa presença online ANTES de irem à loja",
        "gancho_v3": "Tenho estado a olhar para o comércio local em {city}",
        "insight":   "Quem aparece bem no Google decide se a loja física vale a deslocação — quem não aparece, perde a visita antes dela acontecer",
        "insight_v3": "Têm {presence}. Mas a visita à loja física hoje decide-se primeiro no telemóvel — quem não tem stock visível, horários claros e fotos atualizadas, perde o cliente antes de saber que existia",
        "diag":      "Os clientes que entram pela primeira vez, sabem dizer onde vos viram primeiro?",
    },
    "default": {
        "gancho_v1": "Estava aqui a olhar para alguns negócios em {city} e o vosso saltou-me à vista",
        "gancho_v3": "Tenho estado a olhar para empresas em {city}",
        "insight":   "A vossa concorrência mais visível tem MENOS reviews do que vocês — está-vos a passar à frente em visibilidade quando vocês têm mais autoridade",
        "insight_v3": "Têm {presence}. Mas a forma como aparecem para quem ainda não vos conhece está atrás de empresas com metade do vosso histórico. Há assimetria entre o que VALEM e o que MOSTRAM",
        "diag":      "Dos clientes novos que entraram este mês, faz ideia quantos vos descobriram primeiro online?",
    },
}


def detect_business_type(lead):
    """Classifica o lead num tipo de negócio para customizar o pitch."""
    kw = (str(lead.get("keyword", "")) + " " + str(lead.get("category", "")) + " " +
          str(lead.get("name", ""))).lower()
    # Ordem importa — verticais mais específicos vêm antes dos genéricos
    if any(t in kw for t in ["restaur", "café", "cafe", "bar ", "tasca", "snack",
                              "bistro", "pastelaria", "pizzaria", "churrasq", "hambúrg"]):
        return "restaurant"
    if any(t in kw for t in ["clínic", "clinic", "dent", "médic", "medic",
                              "advogad", "lawyer", "notár", "psicólog", "veterin"]):
        return "professional"
    if any(t in kw for t in ["imob", "real estate", "imobili"]):
        return "real_estate"
    if any(t in kw for t in ["cabeleireiro", "salão", "salao", "salon",
                              "estét", "barb", "spa", "unhas", "manicur"]):
        return "beauty"
    if any(t in kw for t in ["ginás", "ginas", "gym", "fitness", "pilates",
                              "yoga", "crossfit"]):
        return "gym"
    if any(t in kw for t in ["oficina", "auto", "stand", "mecân", "carros"]):
        return "auto"
    if any(t in kw for t in ["carpint", "marcen", "carpinteiro", "marceneiro",
                              "móveis por medida", "moveis por medida"]):
        return "carpentry"
    if any(t in kw for t in ["mudanç", "mudanc", "moving", "transport"]):
        return "moving"
    if any(t in kw for t in ["lavandari", "tinturari", "lavagem"]):
        return "laundry"
    if any(t in kw for t in ["construç", "construct", "obras", "reforma",
                              "remodela", "canaliz", "eletric"]):
        return "construction"
    if any(t in kw for t in ["loja", "store", "shop", "comércio", "comerc",
                              "boutique", "supermerc"]):
        return "retail"
    return "default"


def _presence_phrase(lead):
    """'X avaliações com 4.8★' ou similar."""
    revs   = int(lead.get("reviews", 0) or 0)
    rating = lead.get("rating", "")
    if revs > 0 and rating and pd.notna(rating):
        return f"{revs:,} avaliações com {rating}★"
    if revs > 0:
        return f"{revs:,} avaliações"
    return "uma presença forte no Google"


def cold_call_pitch(lead):
    """Pitch da cold call — 3 versões (natural/direta/consultiva) + objeções +
    coaching. Adaptado por vertical detetado e dados específicos do lead."""
    name     = lead.get("name", "[NOME]")
    city     = lead.get("city", "[CIDADE]") or "[CIDADE]"
    revs     = int(lead.get("reviews", 0) or 0)
    btype    = detect_business_type(lead)
    label    = VERTICAL_LABEL.get(btype, VERTICAL_LABEL["default"])
    goal     = GOAL_BY_TYPE.get(btype, GOAL_BY_TYPE["default"])
    presence = _presence_phrase(lead)
    h        = VERTICAL_HOOKS.get(btype, VERTICAL_HOOKS["default"])

    # Render hooks substituindo placeholders com dados reais do lead
    gancho_v1   = h["gancho_v1"].format(city=city, revs=f"{revs:,}", presence=presence)
    gancho_v3   = h["gancho_v3"].format(city=city, revs=f"{revs:,}", presence=presence)
    insight     = h["insight"].format(city=city, revs=f"{revs:,}", presence=presence)
    insight_v3  = h["insight_v3"].format(city=city, revs=f"{revs:,}", presence=presence)
    diag        = h["diag"].format(city=city, revs=f"{revs:,}", presence=presence)

    return f"""━━━ COLD CALL · {name} ━━━

📊 CONTEXTO
   Cidade: {city}   ·   Presença: {presence}
   Vertical: {label}   ·   Goal: {goal}

⚡ ESCOLHE A VERSÃO PELO PERFIL DO INTERLOCUTOR
   V1 NATURAL    → -40 anos / gestão pelos filhos / casual
   V2 DIRETA     → quando não sabes a idade / aposta segura
   V3 CONSULTIVA → +45 anos / empresa tradicional 10+ anos

🚫 PROIBIDO na abertura:
   "website" · "serviços digitais" · "oferta" ·
   "quero vender" · "tenho uma solução"


╔═════════════════════════════════════════════════════╗
║  🟢 VERSÃO 1 — NATURAL · calmo, pausado, conversa   ║
╚═════════════════════════════════════════════════════╝

[01] ABERTURA — permission-based
  Tu: "Boa tarde... fala o Pedro da Smart Hive.
       Apanhei-o em má altura?"

  ⏸  PAUSA 2-3s. Não preencher o silêncio.

[02] DESARMAR — declarar que NÃO é venda
  Tu: "Vou ser claro consigo logo à partida — não estou
       a ligar para vender nada hoje.
       {gancho_v1} e a {name} saltou-me à vista.
       Posso fazer 30 segundos do seu tempo?"

[03] GANCHO DE CURIOSIDADE
  Tu: "Reparei numa coisa específica no caso da vossa
       empresa — {presence} é raro neste setor. Mas há
       um detalhe que provavelmente está a fazer-vos
       perder pedidos sem se dar conta."

[04] INSIGHT
  Tu: "{insight}. Faz sentido o que estou a dizer?"

[05] PERGUNTA DIAGNÓSTICA — deixa-o falar
  Tu: "{diag}"

  ⏸  PAUSA — deixa-o pensar. Não cortes.

[06] FECHO — escolha A/B, nunca aberta
  Tu: "Olhe, não lhe quero tomar mais tempo agora. Faço
       uma proposta — eu já analisei a vossa presença
       online e tenho aqui duas ou três coisas concretas
       que vocês podiam ajustar sem gastar muito. Vale
       a pena 15 minutos numa conversa?
       Quinta de manhã ou sexta à tarde?"


╔═════════════════════════════════════════════════════╗
║  🟡 VERSÃO 2 — DIRETA · firme, profissional, segura ║
╚═════════════════════════════════════════════════════╝

[01] ABERTURA
  Tu: "Sr./Sra. [APELIDO]? Daqui Pedro Bicas, Smart Hive
       Solutions. Vou ser direto consigo — apanhei-o em
       má altura?"

[02] RISK REVERSAL
  Tu: "Compreendo. Peço-lhe 90 segundos — se no fim não
       fizer sentido, desligo eu próprio. Pode ser?"

[03] CONTEXTO + LOSS AVERSION
  Tu: "Trabalho com empresas locais em {city} a melhorar
       a forma como aparecem para potenciais clientes.
       Vi o caso da vossa empresa, vi {presence}, e ficou
       claro: têm uma reputação que a maioria do setor
       mata para ter. Mas há um problema específico, e
       quero gastar 15 minutos a explicar-lhe qual é."

[04] INSIGHT DURO
  Tu: "{insight}. Está-me a seguir?"

[05] DIAGNÓSTICA RÁPIDA
  Tu: "{diag}"

[06] FECHO
  Tu: "15 minutos esta semana. Apresento-vos um
       diagnóstico CONCRETO da vossa presença — feito a
       olhar para a vossa empresa, não genérico — e dou
       3 ações específicas que podem aplicar mesmo que
       não trabalhem comigo. Quinta às 10h ou sexta às
       14h30?"


╔═════════════════════════════════════════════════════╗
║  🔵 VERSÃO 3 — CONSULTIVA · autoridade, técnica     ║
╚═════════════════════════════════════════════════════╝

[01] ABERTURA — posicionar como analista, não vendedor
  Tu: "Boa tarde. Daqui Pedro Bicas. {gancho_v3} e a
       vossa empresa apareceu numa análise que estava a
       fazer. Não é uma chamada comercial standard — é
       mais um briefing técnico curto. Apanhei-o numa
       altura possível?"

[02] FRAMING
  Tu: "Posso explicar-lhe em duas frases do que se
       trata?"

[03] INSIGHT COM DADOS
  Tu: "{insight_v3}. Essa assimetria entre reputação e
       visibilidade é dinheiro a ficar em cima da mesa
       para quem souber procurar."

[04] DIAGNÓSTICA TÉCNICA — duas perguntas
  Tu: "Posso fazer-lhe duas perguntas?
       1) {diag}
       2) E que percentagem desses pedidos converte
          em cliente?"

  ⏸  PAUSA longa — espera ele dar um número.

[05] AUTORIDADE
  Tu: "Boa. Com base nisso, já consigo afirmar que com
       2-3 ajustes específicos podem aumentar essa
       conversão em 20-30 pontos percentuais sem mais
       investimento em marketing. Não invento o número
       — vejo-o repetidamente nesta operação."

[06] FECHO
  Tu: "Proposta concreta: 15 minutos esta semana. Mostro
       o diagnóstico já feito — quantos pedidos estão a
       perder semanalmente, onde, e porquê. Sem
       compromisso. Quinta às 10h ou sexta às 15h?"


╔═════════════════════════════════════════════════════╗
║  🛡️  OBJEÇÕES — RESPOSTAS PRONTAS                   ║
╚═════════════════════════════════════════════════════╝

[NÃO TEMOS INTERESSE]
  "Compreendo — seria estranho ter interesse antes de
   saber do que se trata. Não estou a vender nada hoje.
   15 minutos para mostrar 3 coisas concretas sobre o
   vosso próprio negócio. Decide depois."

[NÃO TEMOS TEMPO]
  "Sem ironia, também não teria. É exatamente por isso
   que NÃO estou a marcar AGORA — para a próxima semana.
   Quarta, quinta ou sexta — qual é menos mau?"

[JÁ TEMOS ALGUÉM]
  "Boa — é o que esperaria de uma empresa séria. Não
   venho substituir ninguém. O que faço é auditar a
   presença atual: aponto onde está bem, e onde está a
   deixar dinheiro em cima da mesa. Se a pessoa atual
   fez tudo certo, sai daqui só com relatório a
   confirmar. Vale 15 min?"

[MANDE POR EMAIL]
  "Posso mandar — mas o que quero mostrar precisa 5
   minutos a explicar e 10 para as suas perguntas. Por
   escrito vira folheto comercial e fica em modo \"leio
   depois\" que nunca chega. Faço isto: mando AGORA
   uma frase com o diagnóstico inicial, e se for
   relevante voltamos a falar. Qual é o seu email
   direto?"

[NÃO PRECISAMOS]
  "Pode ser que não precisem mesmo — e se for esse o
   caso, melhor para vocês. Só peço uma coisa: 30
   segundos do que vi, para o caso do \"não precisamos\"
   estar baseado em informação que ainda não têm.
   Decide depois."

[LIGUE MAIS TARDE]
  "Combinado — mas para não ligar ao calhas, meto-lhe
   uma data na agenda agora. Quinta às 14h00 ou sexta
   às 10h00? Assim quando eu ligar já sabe quem é e
   nenhum de nós perde tempo a apresentar-se outra vez."


╔═════════════════════════════════════════════════════╗
║  🎯 COACHING DE EXECUÇÃO                            ║
╚═════════════════════════════════════════════════════╝

VOZ
  Abertura → 20% mais lenta, mais grave, sem pressa
  Gancho   → ligeiramente mais rápido, ênfase nas
             palavras-chave ("{presence}", "raro",
             "específico")
  Insight  → firme, sem hesitação, volume estável
  Fecho    → neutra, prática (como marcar dentista)

3 PAUSAS CRÍTICAS — não as cortes
  1. Após "apanhei-o em má altura?"  → 2-3s silêncio
  2. Após "faz sentido?"               → deixar processar
  3. Após data do fecho               → SILÊNCIO total;
                                        quem fala primeiro
                                        depois disto, perde

INSISTIR quando
  ✓ Objeção genérica sem motivo concreto (modo defesa)
  ✓ Faz perguntas sobre o que fazes (defesa caiu)
  ✓ Silêncio após o insight (está a pensar — não cortes)

RECUAR quando
  ✗ Ruído de fundo (mesmo ocupado, marca call-back FIRME)
  ✗ Repete a mesma objeção 2x
  ✗ Tom dele fica mais frio ao longo da chamada
  ✗ Diz "talvez no futuro" com sinceridade

REGRA DE OURO
  O objetivo é dar-lhe permissão para NÃO interagir.
  Quem se sente livre de desligar, não desliga.
  Pressão = perde. Curiosidade + autoridade = ganha.
"""


def meeting_pitch(lead):
    """Pitch para abertura da meeting — pré-preenchido com dados do lead.
    Usado como conteúdo inicial das notas da reunião."""
    name = lead.get("name", "[NOME]")
    revs = int(lead.get("reviews", 0) or 0)
    rating = lead.get("rating", "")
    city = lead.get("city", "")
    phone = lead.get("phone", "")
    site = lead.get("website", "")
    btype = detect_business_type(lead)
    goal = GOAL_BY_TYPE.get(btype, GOAL_BY_TYPE["default"])
    site_state = "Tem website" if (site and pd.notna(site)) else "SEM website"

    return f"""━━━━━━ MEETING · {name} ━━━━━━

▎ ABERTURA (2 min) — posicionamento como CONSULTOR

  "Antes de falarmos de soluções, o meu objetivo hoje é perceber
   melhor o negócio, os vossos objetivos e identificar onde pode
   existir oportunidade digital real.

   Se no final concluir que não existe valor claro, digo-lhe isso
   com transparência.

   Se existir, mostro-lhe exatamente onde está."


▎ PARTE 1 — DIAGNÓSTICO DE NEGÓCIO (10-15 min)

  Perguntas (descobrir DOR):
  ▢ Hoje, de onde vêm a maioria dos clientes?
  ▢ Quanto vem por recomendação vs pesquisa online?
  ▢ Há zonas geográficas onde querem crescer mais?
  ▢ Que serviços/produtos gostariam de vender mais?
  ▢ Sentem que estão a aproveitar todo o potencial digital?

  [NOTAS:]




▎ PARTE 2 — IMPACTO (3-5 min)

  Pergunta-chave (ouro — cliente verbaliza valor):

  "Se conseguíssemos aumentar consistentemente {goal}
   através da presença digital, que impacto teria no negócio?"

  [NOTAS / valor verbalizado pelo cliente:]




▎ PARTE 3 — REENQUADRAMENTO

  "Pelo que me está a dizer, o desafio não é simplesmente
   ter um website. O desafio é construir uma presença digital
   que funcione como ativo comercial e canal consistente de
   aquisição."


▎ PARTE 4 — APRESENTAÇÃO DA VISÃO

  "Com base no que analisámos, eu estruturaria isto em 4 fases…"

  [Apresentar proposta preparada — demo / âmbito / fases]


▎ FECHO — assumir continuidade

  ✅ "Faz sentido para si avançarmos para a fase de definição
      técnica detalhada e alinharmos o kickoff?"

  ❌ Nunca: "Então, quer avançar?"


━━━ DADOS DO CLIENTE ━━━
  Negócio:   {name}
  Cidade:    {city}
  Tipo:      {btype}  →  goal: {goal}
  Google:    {revs:,} avaliações{f' · {rating}★' if rating and pd.notna(rating) else ''}
  Website:   {site_state}
  Telefone:  {phone if phone and pd.notna(phone) else '—'}
"""


# =============================================================
# PROPOSAL GENERATOR — HTML, print-friendly, self-contained
# =============================================================

def build_proposal_html(data):
    """Gera HTML standalone (print-friendly) da proposta para o cliente.

    `data` é um dict com:
      - company, city, business_type, project_type ('new'/'rebuild')
      - current_url, current_issues (list of str)
      - features (list of str — labels selecionados)
      - addons (list of {label, price, kind})
      - base_price (€)
      - validity_days, custom_intro
    """
    import html as _html
    e = _html.escape  # shorthand

    company        = data.get("company", "—") or "—"
    city           = data.get("city", "") or ""
    btype          = data.get("business_type", "default") or "default"
    project_type   = data.get("project_type", "new")
    current_url    = (data.get("current_url") or "").strip()
    current_issues = data.get("current_issues", []) or []
    features       = data.get("features", []) or []
    addons         = data.get("addons", []) or []
    base_price     = int(data.get("base_price", 0) or 0)
    validity_days  = int(data.get("validity_days", 30) or 30)
    custom_intro   = (data.get("custom_intro") or "").strip()

    challenge_text = BUSINESS_CHALLENGES.get(btype, BUSINESS_CHALLENGES["default"])
    today_str      = datetime.now().strftime("%d de %B de %Y")
    pt_months = {"January":"janeiro","February":"fevereiro","March":"março","April":"abril",
                 "May":"maio","June":"junho","July":"julho","August":"agosto","September":"setembro",
                 "October":"outubro","November":"novembro","December":"dezembro"}
    for en, pt in pt_months.items():
        today_str = today_str.replace(en, pt)

    project_label  = "Reconstrução do site existente" if project_type == "rebuild" else "Website novo, construído de raiz"

    # Current issues (só se rebuild) — table-based two-column layout for clean PDF
    issues_section = ""
    if project_type == "rebuild" and current_issues:
        url_line = f'<div class="site-url">Site atual: <a href="{e(current_url)}">{e(current_url)}</a></div>' if current_url else ""
        mid = (len(current_issues) + 1) // 2
        left_issues = current_issues[:mid]
        right_issues = current_issues[mid:]
        issue_rows = ""
        for i in range(max(len(left_issues), len(right_issues))):
            l = left_issues[i] if i < len(left_issues) else ""
            r = right_issues[i] if i < len(right_issues) else ""
            issue_rows += f"""
                <tr>
                  <td class="issue-cell">{f'<span class="x-mark">✗</span> {e(l)}' if l else ''}</td>
                  <td class="issue-cell">{f'<span class="x-mark">✗</span> {e(r)}' if r else ''}</td>
                </tr>"""
        issues_section = f"""
<div class="issues-section">
  <h2>O que muda</h2>
  {url_line}
  <p class="lead">Identificámos no site atual os seguintes pontos a corrigir:</p>
  <table class="issue-table">{issue_rows}</table>
  <div class="vs-callout">→ <strong>O novo site corrige todos estes pontos e adiciona o conjunto de funcionalidades acima.</strong></div>
</div>"""

    # Add-ons table
    addons_section = ""
    if addons:
        rows = ""
        for ao in addons:
            label = ao.get("label", "")
            price = int(ao.get("price", 0) or 0)
            kind = ao.get("kind", "one-time")
            kind_label = "uma vez" if kind == "one-time" else kind
            rows += f"""
                <tr>
                  <td>{e(label)}</td>
                  <td class="price-cell">{price} €<span class="kind">{e(kind_label)}</span></td>
                </tr>"""
        addons_section = f"""
        <section class="section addons-section">
          <h2>Add-ons opcionais</h2>
          <p class="lead">Extras que pode adicionar consoante as vossas prioridades, separadamente do investimento base.</p>
          <table class="addons-table">
            <thead><tr><th>Add-on</th><th class="price-col">Investimento</th></tr></thead>
            <tbody>{rows}</tbody>
          </table>
        </section>
        """

    # Intro custom
    intro_section = ""
    if custom_intro:
        intro_section = f'<div class="custom-intro"><p>{e(custom_intro)}</p></div>'

    # Counts
    n_features = len(features)
    n_addons   = len(addons)

    # Build features as table-based two-column layout (xhtml2pdf doesn't do CSS columns)
    def _features_html(features_section_data):
        out = ""
        for category, items in FEATURES_CATALOG.items():
            cat_features = [label for label, _ in items if label in features]
            if not cat_features:
                continue
            # Split into two columns via table
            mid = (len(cat_features) + 1) // 2
            left = cat_features[:mid]
            right = cat_features[mid:]
            rows_html = ""
            for i in range(max(len(left), len(right))):
                l = left[i] if i < len(left) else ""
                r = right[i] if i < len(right) else ""
                rows_html += f"""
                <tr>
                  <td class="feat-cell">{f'<span class="check">✓</span> {e(l)}' if l else ''}</td>
                  <td class="feat-cell">{f'<span class="check">✓</span> {e(r)}' if r else ''}</td>
                </tr>"""
            out += f'<div class="feature-group"><h3>{e(category)}</h3><table class="feat-table">{rows_html}</table></div>'
        return out

    features_section = _features_html(features) if features else '<p class="lead"><em>Sem funcionalidades selecionadas.</em></p>'

    html_doc = f"""<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<title>Proposta · {e(company)} · Smart Hive Solutions</title>
<style>
@page {{
  size: A4;
  margin: 22mm 18mm;
  @frame footer_frame {{
    -pdf-frame-content: page_footer;
    bottom: 8mm; margin-left: 18mm; margin-right: 18mm; height: 8mm;
  }}
}}

body {{ font-family: Helvetica, Arial, sans-serif; color: #2d2d33; line-height: 1.5; font-size: 11pt; }}
.serif {{ font-family: Times, "Times New Roman", Georgia, serif; }}

/* Cover */
.cover {{ padding-bottom: 16pt; border-bottom: 2pt solid #c5993b; margin-bottom: 28pt; }}
.cover .eyebrow {{ font-size: 8pt; letter-spacing: 3pt; color: #c5993b; text-transform: uppercase; font-weight: bold; }}
.cover h1 {{ font-family: Times, Georgia, serif; font-weight: normal; font-size: 32pt; line-height: 1.1; color: #1a1a1f; margin-top: 12pt; }}
.cover h1 .italic {{ font-style: italic; color: #8c7032; }}
.cover .subtitle {{ font-size: 11pt; color: #6b6b75; margin-top: 6pt; }}
.cover .meta {{ margin-top: 18pt; font-size: 9pt; color: #6b6b75; }}
.cover .meta strong {{ color: #2d2d33; }}

/* Sections */
h2 {{ font-family: Times, Georgia, serif; font-weight: normal; font-size: 18pt; color: #1a1a1f; margin-top: 22pt; margin-bottom: 10pt; padding-bottom: 4pt; border-bottom: 1pt solid #e8e5dc; }}
p.lead {{ font-size: 10.5pt; color: #4d4d56; margin-bottom: 12pt; }}

/* Custom intro */
.custom-intro {{ padding: 12pt 14pt; background-color: #f7f5f0; border-left: 3pt solid #c5993b; margin-bottom: 18pt; font-style: italic; color: #4d4d56; font-size: 10.5pt; }}

/* Challenge */
.challenge {{ padding: 14pt 16pt; background-color: #faf3e3; }}
.challenge p {{ font-size: 11pt; color: #3a3a42; }}

/* Features (table-based 2-col) */
.feature-group {{ margin-top: 12pt; margin-bottom: 12pt; }}
.feature-group h3 {{ font-size: 9pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5pt; color: #c5993b; margin-bottom: 6pt; }}
.feat-table {{ width: 100%; border: 0; border-collapse: collapse; }}
.feat-cell {{ width: 50%; padding: 4pt 6pt 4pt 0; font-size: 10pt; color: #2d2d33; vertical-align: top; }}
.check {{ color: #2f7a3a; font-weight: bold; margin-right: 4pt; }}

/* Issues */
.issues-section .site-url {{ font-size: 9pt; color: #6b6b75; margin-bottom: 8pt; }}
.issues-section .site-url a {{ color: #c5993b; }}
.issue-table {{ width: 100%; border: 0; border-collapse: collapse; }}
.issue-cell {{ padding: 4pt 6pt 4pt 0; font-size: 10pt; color: #2d2d33; }}
.x-mark {{ color: #b03a3a; font-weight: bold; margin-right: 4pt; }}
.vs-callout {{ margin-top: 12pt; padding: 10pt 12pt; background-color: #f7f5f0; border-left: 3pt solid #2f7a3a; font-size: 10pt; color: #3a3a42; }}

/* Add-ons table */
.addons-table {{ width: 100%; border-collapse: collapse; margin-top: 8pt; }}
.addons-table th {{ text-align: left; padding: 8pt 0; border-bottom: 1pt solid #c5993b; font-weight: bold; color: #6b6b75; text-transform: uppercase; font-size: 8pt; letter-spacing: 1pt; }}
.addons-table td {{ padding: 8pt 0; border-bottom: 1pt solid #e8e5dc; font-size: 10pt; color: #2d2d33; }}
.addons-table .price-col, .addons-table .price-cell {{ text-align: right; }}
.price-cell {{ font-weight: bold; color: #1a1a1f; }}
.price-cell .kind {{ display: block; font-size: 8pt; font-weight: normal; color: #8a8a92; }}

/* Investment block */
.investment-section {{ padding: 24pt 18pt; background-color: #1a1a1f; color: #ffffff; margin-top: 24pt; margin-bottom: 14pt; }}
.investment-section .eyebrow {{ font-size: 8pt; letter-spacing: 3pt; color: #dcb866; text-transform: uppercase; font-weight: bold; }}
.inv-price-table {{ width: 100%; border: 0; }}
.inv-price-table .from {{ font-size: 13pt; color: #dcb866; font-style: italic; vertical-align: top; padding-right: 8pt; }}
.inv-price-table .big {{ font-family: Times, Georgia, serif; font-size: 56pt; color: #ffffff; font-weight: normal; line-height: 1; }}
.inv-price-table .cur {{ font-size: 28pt; color: #dcb866; vertical-align: top; padding-left: 6pt; }}
.investment-section .scope {{ color: #d0d0d0; font-size: 10pt; margin-top: 8pt; }}
.breakdown-table {{ width: 100%; border: 0; margin-top: 14pt; }}
.breakdown-table td {{ text-align: center; padding: 6pt; color: #d0d0d0; font-size: 9pt; }}
.breakdown-table .big-num {{ color: #ffffff; font-size: 14pt; font-weight: bold; display: block; margin-bottom: 2pt; }}

.validity {{ text-align: center; font-size: 9pt; color: #6b6b75; margin-bottom: 24pt; }}

/* Steps */
.steps-table {{ width: 100%; border-collapse: separate; border-spacing: 6pt; margin-top: 10pt; }}
.steps-table td {{ width: 25%; padding: 14pt; background-color: #f7f5f0; vertical-align: top; }}
.steps-table .num {{ font-family: Times, Georgia, serif; font-size: 22pt; font-style: italic; color: #c5993b; }}
.steps-table h4 {{ font-size: 10pt; font-weight: bold; margin-top: 6pt; color: #1a1a1f; }}
.steps-table p {{ font-size: 9pt; color: #6b6b75; margin-top: 4pt; }}

/* Footer (per-page) */
#page_footer {{ font-size: 8pt; color: #8a8a92; text-align: center; border-top: 1pt solid #e8e5dc; padding-top: 4pt; }}

/* Document footer (last page) */
.doc-footer {{ margin-top: 36pt; padding-top: 12pt; border-top: 1pt solid #e8e5dc; }}
.doc-footer-table {{ width: 100%; border: 0; }}
.doc-footer .brand {{ font-family: Times, Georgia, serif; font-size: 18pt; color: #1a1a1f; }}
.doc-footer .brand .italic {{ font-style: italic; color: #8c7032; }}
.doc-footer .contact {{ font-size: 9pt; color: #6b6b75; text-align: right; }}
.doc-footer .contact strong {{ color: #1a1a1f; }}
.doc-footer .contact a {{ color: #c5993b; }}
</style>
</head>
<body>

<header class="cover">
  <div class="eyebrow">Proposta de Trabalho</div>
  <h1>{e(company)} <span class="italic">·</span><br><span class="italic">{e(project_label)}</span></h1>
  {f'<div class="subtitle">{e(city)}</div>' if city else ''}
  <div class="meta">
    <strong>Data:</strong> {e(today_str)}  &nbsp;·&nbsp;
    <strong>Validade:</strong> {validity_days} dias  &nbsp;·&nbsp;
    <strong>Preparado por:</strong> Smart Hive Solutions
  </div>
</header>

{intro_section}

<h2>O contexto</h2>
<div class="challenge"><p>{e(challenge_text)}</p></div>

<h2>O que está incluído</h2>
<p class="lead">{n_features} funcionalidades integradas no investimento base. Tudo pensado para transformar a presença online em contactos reais.</p>
{features_section}

{issues_section}

{addons_section}

<div class="investment-section">
  <div class="eyebrow">Investimento</div>
  <table class="inv-price-table"><tr>
    <td class="from">desde</td>
    <td class="big">{base_price:,}</td>
    <td class="cur">€</td>
    <td>&nbsp;</td>
  </tr></table>
  <p class="scope">Inclui as {n_features} funcionalidades acima listadas, design personalizado, hosting e suporte para arranque do site. Add-ons facturados separadamente conforme escolha.</p>
  <table class="breakdown-table"><tr>
    <td><span class="big-num">{n_features}</span>Funcionalidades incluídas</td>
    <td><span class="big-num">{n_addons}</span>Add-ons opcionais</td>
    <td><span class="big-num">6-8</span>Semanas até live</td>
  </tr></table>
</div>
<div class="validity">Esta proposta é válida durante {validity_days} dias a partir da data acima indicada.</div>

<h2>Próximos passos</h2>
<table class="steps-table"><tr>
  <td><div class="num">01</div><h4>Kickoff</h4><p>Reunião inicial para definir conteúdo, fotografias e marca.</p></td>
  <td><div class="num">02</div><h4>Design</h4><p>Apresentação visual com 2 rondas de revisão.</p></td>
  <td><div class="num">03</div><h4>Desenvolvimento</h4><p>Construção técnica e integração de funcionalidades.</p></td>
  <td><div class="num">04</div><h4>Lançamento</h4><p>Migração, testes finais e go-live com formação.</p></td>
</tr></table>

<div class="doc-footer">
  <table class="doc-footer-table"><tr>
    <td class="brand">Smart Hive <span class="italic">Solutions</span></td>
    <td class="contact">
      <strong>Miguel Lourenço</strong><br>
      <a href="mailto:geral@smarthivesolutions.pt">geral@smarthivesolutions.pt</a><br>
      <a href="https://smarthivesolutions.pt">smarthivesolutions.pt</a>
    </td>
  </tr></table>
</div>

<div id="page_footer">Smart Hive Solutions · Proposta para {e(company)} · {e(today_str)}</div>

</body>
</html>
"""
    return html_doc


def build_proposal_pdf(data):
    """Converte a proposta em bytes PDF usando xhtml2pdf (pure Python).
    Retorna `bytes` prontos a ser servidos via st.download_button.
    Levanta RuntimeError se xhtml2pdf não estiver instalado."""
    if not _PDF_AVAILABLE:
        raise RuntimeError(
            "Geração de PDF não disponível neste ambiente. "
            "Instale com: pip install xhtml2pdf"
        )
    import io
    html_str = build_proposal_html(data)
    buf = io.BytesIO()
    result = _pisa.CreatePDF(html_str, dest=buf, encoding="utf-8")
    if result.err:
        raise RuntimeError(f"xhtml2pdf falhou com {result.err} erros.")
    return buf.getvalue()


def wa_confirmation_link(lead_name, phone, meeting_dt, meet_link=""):
    """Gera URL wa.me com mensagem de confirmação de reunião pré-preenchida."""
    d = _clean_digits(phone) if phone else None
    if not d:
        return None
    when = meeting_dt.strftime("%A, %d de %B às %H:%M")
    # Tradução básica dos dias/meses para português
    pt_map = {
        "Monday": "Segunda-feira", "Tuesday": "Terça-feira", "Wednesday": "Quarta-feira",
        "Thursday": "Quinta-feira", "Friday": "Sexta-feira", "Saturday": "Sábado", "Sunday": "Domingo",
        "January": "janeiro", "February": "fevereiro", "March": "março", "April": "abril",
        "May": "maio", "June": "junho", "July": "julho", "August": "agosto",
        "September": "setembro", "October": "outubro", "November": "novembro", "December": "dezembro",
    }
    for en, pt in pt_map.items():
        when = when.replace(en, pt)
    msg = (
        f"Olá! Aqui o Pedro Bicas da Smart Hive Solutions 🙂\n\n"
        f"Confirmo a sua reunião com o Miguel para {when}."
    )
    if meet_link and meet_link.strip():
        msg += f"\n\nLink para a videochamada: {meet_link}"
    msg += "\n\nAté lá!"
    return f"https://wa.me/351{d}?text={urllib.parse.quote(msg)}"


# =============================================================
# LEAD DIALOG (popup) — Speed-call workspace
# =============================================================

OUTCOMES = [
    ("interested",   "🟢 Interessado",     "primary"),
    ("callback",     "🟡 Voltar a ligar",  "secondary"),
    ("not_int",      "🔴 Não interessado", "secondary"),
    ("no_answer",    "📵 Não atendeu",     "secondary"),
    ("voicemail",    "💬 Voicemail",       "secondary"),
    ("wrong_number", "❌ Número errado",   "secondary"),
]


def _outcome_from_answered(answered, status, lost_reason):
    """Map the saved call-state back to the most recent outcome key.
    Used to pre-highlight the relevant button when the dialog reopens."""
    a = str(answered or "").strip()
    if a == "Não atendeu":   return "no_answer"
    if a == "Voicemail":     return "voicemail"
    if a == "Número errado": return "wrong_number"
    if a == "Sim":
        if status in ("meeting", "interested"):
            return "interested"
        if status == "closed_lost" and lost_reason and lost_reason != "Número errado":
            return "not_int"
        return "callback"
    return None
CALLBACK_DELAYS = [
    ("hoje +2h",   timedelta(hours=2)),
    ("amanhã",     timedelta(days=1)),
    ("3 dias",     timedelta(days=3)),
    ("1 semana",   timedelta(days=7)),
]


@st.dialog("Lead", width="large")
def lead_dialog(place_id, lead, cur_crm):
    """Speed-call dialog — outcome bar + campos condicionais + slot booking."""
    cur = cur_crm if cur_crm is not None and len(cur_crm) else None
    pid = str(place_id)

    def cur_val(col, default=""):
        if cur is None or col not in cur: return default
        v = cur.iloc[0][col] if hasattr(cur, "iloc") else cur.get(col, default)
        if pd.isna(v): return default
        return v

    cur_status   = cur_val("status", "new")
    cur_notes    = cur_val("notes", "")
    cur_att      = int(cur_val("attempts", 0) or 0)
    cur_who      = cur_val("who_answered", "")
    cur_answered = cur_val("answered", "—")
    cur_lost     = cur_val("lost_reason", "")
    last_outcome = _outcome_from_answered(cur_answered, cur_status, cur_lost)
    last_label   = next((lbl for k, lbl, _ in OUTCOMES if k == last_outcome), None)

    name  = lead.get("name", "—")
    city  = lead.get("city", "—")
    kw    = lead.get("keyword", "")
    rate  = lead.get("rating", "")
    revs  = int(lead.get("reviews", 0) or 0)
    prio  = int(lead.get("priority", 0) or 0)
    phone = lead.get("phone", "")
    wa_link = lead.get("wa_link", "")
    email = lead.get("email", "")
    site  = lead.get("website", "")

    # ── Header compacto ──
    badge = f"{STATUS_EMOJI.get(cur_status,'')} {cur_status.replace('_',' ').title()}"
    st.markdown(f"### {name}")
    caption_bits = [
        badge,
        f"📍 {city}",
        f"⭐ {rate} ({revs:,})",
        f"🎯 prio {prio}",
        f"📞 tentativas: **{cur_att}**",
    ]
    if last_label and cur_att > 0:
        caption_bits.append(f"última: **{last_label}**")
    caption_bits.append(kw)
    st.caption("  ·  ".join(caption_bits))

    # Contact strip (uma linha só)
    bits = []
    if phone and pd.notna(phone):
        bits.append(f"📞 [`{phone}`](tel:{re.sub(chr(91)+'^0-9+'+chr(93),'',str(phone))})")
    if wa_link and pd.notna(wa_link):
        bits.append(f"[💬 WhatsApp]({wa_link})")
    if email and pd.notna(email):
        bits.append(f"✉️ [`{email}`](mailto:{email})")
    bits.append("🌐 sem website" if not (site and pd.notna(site)) else f"[🌐 website]({site})")
    st.markdown("  ·  ".join(bits))

    # ── Script colapsível (variável por tipo de negócio) ──
    btype_for_lead = detect_business_type(lead)
    with st.expander(f"📜 Pitch da chamada (auto · {btype_for_lead})", expanded=False):
        st.text(cold_call_pitch(lead))

    st.divider()

    # ── 🎯 OUTCOME BAR (6 botões enormes) ──
    st.markdown("##### Como correu a chamada?")
    out_key = f"outcome_{pid}"
    current_outcome = st.session_state.get(out_key)
    # Fallback to last saved outcome so the button stays highlighted on reopen.
    # Display-only: doesn't trigger conditional fields below (those still read session_state).
    display_outcome = current_outcome or last_outcome

    ob_cols = st.columns(6, gap="small")
    for i, (oc, label, _) in enumerate(OUTCOMES):
        is_active = display_outcome == oc
        btype = "primary" if is_active else "secondary"
        if ob_cols[i].button(label, key=f"out_{oc}_{pid}", type=btype, use_container_width=True):
            st.session_state[out_key] = oc
            # Reset auxiliary state when changing outcome
            for k in ("scheduled_for", "callback_delay", "ni_reason", "best_time"):
                st.session_state.pop(f"{k}_{pid}", None)
            st.rerun()

    # ── Conditional fields per outcome ──
    notes_default = str(cur_notes or "")
    chosen_outcome = st.session_state.get(out_key)

    if chosen_outcome is None:
        st.info("👆 Escolhe acima como correu a chamada para continuar.")
        st.divider()
        _render_history(pid, lead)
        return

    # ─── 🟢 INTERESSADO ──────────────────────────────────────
    if chosen_outcome == "interested":
        owner_col, who_col = st.columns([1, 2])
        with owner_col:
            is_owner = st.radio("Era o dono?",
                ["Sim", "Não", "N/A"], horizontal=True, key=f"own_{pid}")
        with who_col:
            who_answered = st.text_input(
                "Quem atendeu (se não dono)",
                value=str(cur_who),
                placeholder="Ex: Sra. Maria, gerente",
                key=f"who_{pid}",
                disabled=(is_owner == "Sim"),
            )

        st.markdown("##### 📅 Próximos slots disponíveis na sua agenda")
        slots = compute_free_slots(n_slots=6, duration_min=30, lookahead_days=7)
        if not slots:
            st.warning("Não há slots disponíveis nos próximos 7 dias.")
        else:
            # 3 cols × 2 rows
            slot_cols = st.columns(3)
            for i, s in enumerate(slots):
                col = slot_cols[i % 3]
                if col.button(format_slot_label(s), key=f"slot_{pid}_{s.isoformat()}",
                              use_container_width=True):
                    # 1-click: book Discovery 30min + auto-gen Meet link + auto-status meeting
                    # + auto-fill notes with the meeting pitch + queue WhatsApp auto-open
                    link = _gen_meet_link()
                    pitch_notes = meeting_pitch(lead)
                    add_meeting(pid, name, city, s, 30, "Discovery", pitch_notes, link)
                    if cur_status in ("new","contacted","replied","interested"):
                        upsert_crm(pid, "meeting", cur_val("contact_date",""), "",
                                   cur_val("notes",""), "phone",
                                   float(cur_val("deal_value",0) or 0),
                                   "", cur_val("next_action",""), cur_status, "")
                    update_call_state(pid, answered="Sim",
                        is_owner={"Sim":"Sim, era o dono","Não":"Não, era funcionário","N/A":"Não sei"}[is_owner],
                        who_answered=who_answered, increment_attempt=True)
                    st.session_state[f"scheduled_for_{pid}"] = s.isoformat()
                    st.session_state[f"scheduled_link_{pid}"] = link
                    # Queue WhatsApp auto-open on next render
                    wa_url = wa_confirmation_link(name, phone, s, link)
                    if wa_url:
                        st.session_state[f"wa_auto_open_{pid}"] = wa_url
                    st.rerun()

        # Custom slot fallback
        with st.expander("🕓 Outro horário"):
            cc1, cc2, cc3 = st.columns(3)
            with cc1:
                custom_date = st.date_input("Data", value=date.today() + timedelta(days=1),
                    min_value=date.today(), key=f"cd_{pid}")
            with cc2:
                custom_time_slots = [dt_time(h, m) for h in range(9, 18) for m in (0, 15, 30, 45)]
                custom_time = st.selectbox("Hora", custom_time_slots,
                    format_func=lambda t: t.strftime("%H:%M"), key=f"ct_{pid}")
            with cc3:
                custom_dur = st.selectbox("Duração", [15, 30, 45, 60], index=1, key=f"cdur_{pid}")
            custom_stage = st.selectbox("Etapa", MEETING_STAGES, key=f"cst_{pid}")
            if st.button("📅 Marcar este horário", key=f"cbk_{pid}", use_container_width=True):
                start_dt = datetime.combine(custom_date, custom_time)
                link = _gen_meet_link()
                pitch_notes = meeting_pitch(lead)
                add_meeting(pid, name, city, start_dt, int(custom_dur), custom_stage, pitch_notes, link)
                if cur_status in ("new","contacted","replied","interested"):
                    upsert_crm(pid, "meeting", cur_val("contact_date",""), "",
                               cur_val("notes",""), "phone",
                               float(cur_val("deal_value",0) or 0),
                               "", cur_val("next_action",""), cur_status, "")
                update_call_state(pid, answered="Sim",
                    is_owner={"Sim":"Sim, era o dono","Não":"Não, era funcionário","N/A":"Não sei"}[is_owner],
                    who_answered=who_answered, increment_attempt=True)
                st.session_state[f"scheduled_for_{pid}"] = start_dt.isoformat()
                st.session_state[f"scheduled_link_{pid}"] = link
                wa_url = wa_confirmation_link(name, phone, start_dt, link)
                if wa_url:
                    st.session_state[f"wa_auto_open_{pid}"] = wa_url
                st.rerun()

        # If meeting just scheduled, show confirmation panel
        if st.session_state.get(f"scheduled_for_{pid}"):
            sched_dt = datetime.fromisoformat(st.session_state[f"scheduled_for_{pid}"])
            sched_link = st.session_state.get(f"scheduled_link_{pid}", "")

            # Auto-open WhatsApp tab — fires once after meeting booking
            wa_auto = st.session_state.pop(f"wa_auto_open_{pid}", None)
            if wa_auto:
                import streamlit.components.v1 as components
                # Try to auto-open in new tab; if popup blocker fires, the button below still works
                components.html(
                    f"<script>window.open({wa_auto!r}, '_blank');</script>",
                    height=0,
                )

            st.success(f"✅ Reunião marcada para **{format_slot_label(sched_dt)}** ({sched_dt.year}) · 30 min · Discovery")
            cc1, cc2 = st.columns([1.2, 1])
            with cc1:
                if sched_link:
                    st.markdown(f"🔗 **Meet:** [`{sched_link}`]({sched_link})")
                st.caption("📝 Agenda da reunião auto-preenchida nas notas")
            with cc2:
                wa_url = wa_confirmation_link(name, phone, sched_dt, sched_link)
                if wa_url:
                    st.link_button("📱 Confirmar por WhatsApp", wa_url, use_container_width=True, type="primary")
                else:
                    st.caption("📞 Sem telemóvel — confirmar por telefone")

    # ─── 🟡 VOLTAR A LIGAR ─────────────────────────────────────
    elif chosen_outcome == "callback":
        st.markdown("##### Re-ligar em…")
        cb_cols = st.columns(len(CALLBACK_DELAYS))
        for i, (lbl, delta) in enumerate(CALLBACK_DELAYS):
            if cb_cols[i].button(lbl, key=f"cb_{pid}_{i}", use_container_width=True):
                st.session_state[f"callback_delay_{pid}"] = delta.total_seconds()
                st.rerun()
        chosen_delay = st.session_state.get(f"callback_delay_{pid}")
        if chosen_delay:
            target = datetime.now() + timedelta(seconds=chosen_delay)
            st.info(f"📌 Re-ligar agendado para **{target.strftime('%a, %d/%m às %H:%M')}**")

        st.markdown("##### Melhor altura para ligar")
        bt_cols = st.columns(len(BEST_CALL_TIMES) - 1)
        for i, bt in enumerate(BEST_CALL_TIMES[1:]):
            if bt_cols[i].button(bt, key=f"bt_{pid}_{i}", use_container_width=True):
                st.session_state[f"best_time_{pid}"] = bt
                st.rerun()
        if st.session_state.get(f"best_time_{pid}"):
            st.caption(f"⏰ Melhor altura: **{st.session_state[f'best_time_{pid}']}**")

    # ─── 🔴 NÃO INTERESSADO ────────────────────────────────────
    elif chosen_outcome == "not_int":
        st.markdown("##### Porquê?")
        reasons = NO_WEBSITE_REASONS[1:]
        r_cols = st.columns(3)
        for i, r in enumerate(reasons):
            col = r_cols[i % 3]
            if col.button(r, key=f"r_{pid}_{i}", use_container_width=True):
                st.session_state[f"ni_reason_{pid}"] = r
                st.rerun()
        if st.session_state.get(f"ni_reason_{pid}"):
            st.caption(f"❌ Razão: **{st.session_state[f'ni_reason_{pid}']}**")

    # ─── 📵 NÃO ATENDEU ────────────────────────────────────────
    elif chosen_outcome == "no_answer":
        st.markdown("##### Re-ligar em…")
        cb_cols = st.columns(len(CALLBACK_DELAYS))
        for i, (lbl, delta) in enumerate(CALLBACK_DELAYS):
            if cb_cols[i].button(lbl, key=f"na_{pid}_{i}", use_container_width=True):
                st.session_state[f"callback_delay_{pid}"] = delta.total_seconds()
                st.rerun()
        chosen_delay = st.session_state.get(f"callback_delay_{pid}")
        if chosen_delay:
            target = datetime.now() + timedelta(seconds=chosen_delay)
            st.info(f"📌 Re-ligar agendado para **{target.strftime('%a, %d/%m às %H:%M')}**")

    # ─── 💬 VOICEMAIL ──────────────────────────────────────────
    elif chosen_outcome == "voicemail":
        st.caption("📌 Será registado: voicemail deixado + 1 tentativa.")

    # ─── ❌ NÚMERO ERRADO ──────────────────────────────────────
    elif chosen_outcome == "wrong_number":
        st.caption("📌 Será registado como **closed_lost** com razão 'Número errado'. Não aparecerá em campanhas futuras.")

    # ── Notas compactas ──
    st.markdown("##### 📝 Notas (auto-vão para a timeline)")
    new_note = st.text_area("Notas", value="", height=70,
        placeholder="O que aconteceu nesta chamada... (ex: pediram para ligar 5ª de manhã)",
        key=f"note_{pid}", label_visibility="collapsed")

    # ── Save & next ──
    save_cols = st.columns([2, 1])
    save_clicked = save_cols[0].button("💾 Guardar e ir para o próximo lead",
        type="primary", use_container_width=True, key=f"save_{pid}")
    skip_clicked = save_cols[1].button("✕ Fechar sem guardar",
        use_container_width=True, key=f"skip_{pid}")

    if skip_clicked:
        # Clean outcome state for this lead
        for k in ("outcome", "scheduled_for", "scheduled_link",
                  "callback_delay", "ni_reason", "best_time"):
            st.session_state.pop(f"{k}_{pid}", None)
        st.session_state.pop(f"open_lead_pid", None)
        st.rerun()

    if save_clicked:
        # Materialise outcome → state
        oc = chosen_outcome
        new_status = cur_status
        new_fu     = cur_val("follow_up_date", "")
        new_next   = cur_val("next_action", "")
        new_lost   = ""
        increment  = True
        answered_val  = None
        vm_val        = None
        owner_val     = None
        who_val       = None
        reason_val    = None
        btime_val     = None

        if oc == "interested":
            new_status   = "interested" if cur_status in ("new","contacted","replied") else cur_status
            answered_val = "Sim"
            owner_val    = {"Sim":"Sim, era o dono","Não":"Não, era funcionário","N/A":"Não sei"}.get(
                st.session_state.get(f"own_{pid}", "Sim"), "Sim, era o dono")
            who_val      = st.session_state.get(f"who_{pid}", "")
            # If meeting was scheduled, status was already bumped to "meeting" inside slot click
            if st.session_state.get(f"scheduled_for_{pid}"):
                new_status = "meeting"

        elif oc == "callback":
            new_status   = "contacted" if cur_status == "new" else cur_status
            answered_val = "Sim"
            delay        = st.session_state.get(f"callback_delay_{pid}")
            if delay:
                target = datetime.now() + timedelta(seconds=delay)
                new_fu = target.strftime("%Y-%m-%d")
                new_next = f"Re-ligar {target.strftime('%a %d/%m %H:%M')}"
            btime_val = st.session_state.get(f"best_time_{pid}")

        elif oc == "not_int":
            new_status   = "closed_lost"
            answered_val = "Sim"
            reason_val   = st.session_state.get(f"ni_reason_{pid}", "Outro")
            new_lost     = reason_val

        elif oc == "no_answer":
            answered_val = "Não atendeu"
            delay = st.session_state.get(f"callback_delay_{pid}")
            if delay:
                target = datetime.now() + timedelta(seconds=delay)
                new_fu = target.strftime("%Y-%m-%d")
                new_next = f"Re-ligar {target.strftime('%a %d/%m %H:%M')}"
            new_status = "contacted" if cur_status == "new" else cur_status

        elif oc == "voicemail":
            answered_val = "Voicemail"
            vm_val       = True
            new_status   = "contacted" if cur_status == "new" else cur_status

        elif oc == "wrong_number":
            answered_val = "Número errado"
            new_status   = "closed_lost"
            new_lost     = "Número errado"

        # Persist call state + crm
        update_call_state(pid,
            answered=answered_val, is_owner=owner_val, who_answered=who_val,
            no_website_reason=reason_val, best_call_time=btime_val,
            voicemail_left=vm_val, increment_attempt=increment)
        upsert_crm(pid, new_status, cur_val("contact_date",""), new_fu,
                   cur_val("notes",""), "phone",
                   float(cur_val("deal_value",0) or 0), new_lost, new_next,
                   cur_status, new_note)

        # Cleanup per-lead session state
        for k in ("outcome", "scheduled_for", "scheduled_link",
                  "callback_delay", "ni_reason", "best_time"):
            st.session_state.pop(f"{k}_{pid}", None)

        # Auto-advance: ask tab_leads to open the next lead
        st.session_state["auto_advance_from"] = pid
        st.cache_data.clear()
        st.rerun()

    # ── Histórico / detalhes (collapsed, no fim) ──
    st.divider()
    _render_history(pid, lead)


def _render_history(pid, lead):
    """Reuniões deste lead + timeline + detalhes (todos colapsados por defeito)."""
    meetings = load_meetings()
    lead_meetings = meetings[meetings["place_id"] == pid].sort_values("start_dt")
    if len(lead_meetings):
        with st.expander(f"🗓️ Reuniões deste lead ({len(lead_meetings)})", expanded=False):
            for _, mt in lead_meetings.iterrows():
                mcols = st.columns([2.5, 1.4, 1.4, 1.4, 0.8])
                try:
                    sdt = datetime.fromisoformat(str(mt["start_dt"]))
                    date_str = sdt.strftime("%d/%m/%Y %H:%M")
                except Exception:
                    date_str = str(mt.get("start_dt",""))
                mcols[0].markdown(f"**{mt.get('stage','')}** · {date_str}")
                mcols[1].markdown(MEETING_STATUS_LABEL.get(str(mt.get("status","scheduled")), mt.get("status","")))
                link = str(mt.get("meet_link",""))
                if link and link != "nan":
                    mcols[2].markdown(f"[🔗 Meet]({link})")
                new_st = mcols[3].selectbox(
                    "Estado", MEETING_STATUSES,
                    index=MEETING_STATUSES.index(str(mt["status"])) if str(mt["status"]) in MEETING_STATUSES else 0,
                    format_func=lambda s: MEETING_STATUS_LABEL[s],
                    key=f"mst_{mt['id']}",
                    label_visibility="collapsed",
                )
                if new_st != str(mt["status"]):
                    update_meeting(mt["id"], status=new_st)
                    st.rerun()
                if mcols[4].button("🗑️", key=f"mdel_{mt['id']}", help="Apagar reunião"):
                    delete_meeting(mt["id"])
                    st.rerun()

    with st.expander("🕐 Histórico de atividade", expanded=False):
        activity = load_activity()
        lead_acts = activity[activity["place_id"] == pid].sort_values("timestamp", ascending=False).head(20)
        if not len(lead_acts):
            st.caption("Sem atividade registada.")
        else:
            for _, act in lead_acts.iterrows():
                icon = ACTIVITY_ICONS.get(str(act.get("type","")), "🔔")
                content = str(act.get("content",""))
                ts      = time_ago(act.get("timestamp",""))
                label   = str(act.get("type","")).replace("_"," ").title()
                st.markdown(f"{icon} **{label}** · {ts}")
                if content:
                    st.caption(content)

    with st.expander("📍 Mais detalhes", expanded=False):
        if pd.notna(lead.get("address")):
            st.write(f"**Morada:** {lead['address']}")
        if pd.notna(lead.get("google_maps_url")):
            st.markdown(f"[📍 Abrir no Google Maps]({lead['google_maps_url']})")
        if pd.notna(lead.get("lead_reasons")):
            st.caption(f"Lead reasons: {lead['lead_reasons']}")
        st.caption(f"place_id: `{pid}`")


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

tab_leads, tab_crm, tab_agenda, tab_proposal, tab_outreach, tab_templates = st.tabs(
    ["📋 Leads", "📊 CRM", "📅 Agenda", "📝 Proposta", "📞 Outreach", "✉️ Templates"])


# ═══════════════════════════════════════════════════════════════
# TAB 1 — LEADS
# ═══════════════════════════════════════════════════════════════

with tab_leads:
    st.title("🚀 Lead Machine")
    if not _LEADS_AVAILABLE:
        st.info("📂 `leads_master.csv` not found. This tab requires the local data file. The **Demo: Restaurant CRM** tab works without it.")
        st.stop()

    # ── Daily counter (mini-stats do dia para o caller) ──
    activity_today = load_activity()
    today_iso = datetime.now().strftime("%Y-%m-%d")
    if len(activity_today):
        activity_today["_d"] = activity_today["timestamp"].astype(str).str[:10]
        today_acts = activity_today[activity_today["_d"] == today_iso]
    else:
        today_acts = pd.DataFrame()

    if len(today_acts):
        calls_today  = int((today_acts["type"] == "chamada").sum())
        emails_today = int((today_acts["channel"].astype(str) == "email").sum() / 2)  # ÷2 porque cada envio cria status+nota
        meets_today  = int((today_acts["type"] == "reunião_marcada").sum())
        wa_today     = int((today_acts["channel"].astype(str) == "whatsapp").sum() / 2)
    else:
        calls_today = emails_today = meets_today = wa_today = 0

    meetings_all = load_meetings()
    if len(meetings_all):
        m_upcoming = meetings_all[
            (meetings_all["start_dt"].astype(str) >= datetime.now().isoformat(timespec="minutes"))
            & (meetings_all["status"] == "scheduled")
        ]
    else:
        m_upcoming = pd.DataFrame()

    st.markdown("##### 📊 Hoje")
    d1, d2, d3, d4, d5 = st.columns(5)
    d1.metric("📞 Chamadas",          calls_today)
    d2.metric("💬 WhatsApps",         wa_today)
    d3.metric("📨 Emails enviados",   emails_today)
    d4.metric("📅 Reuniões marcadas", meets_today)
    d5.metric("➡️ Próximas reuniões", len(m_upcoming))

    st.divider()

    # ── Search by name ──
    search_term = st.text_input(
        "🔍 Pesquisar por nome",
        value=st.session_state.get("leads_name_search", ""),
        placeholder="Ex: Rogério Custódio, Cave Lounge…",
        key="leads_name_search",
        label_visibility="collapsed",
    ).strip()
    if search_term and "name" in filtered.columns:
        name_mask = filtered["name"].astype(str).str.contains(
            search_term, case=False, na=False, regex=False
        )
        filtered = filtered[name_mask].reset_index(drop=True)

    # ── Pipeline metrics ──
    c1,c2,c3,c4,c5 = st.columns(5)
    c1.metric("Filtered",     len(filtered))
    c2.metric("No Website",   int(filtered["website"].isna().sum()))
    c3.metric("Has Email",    int(filtered["email"].notna().sum()))
    c4.metric("Has Phone",    int(filtered["phone"].notna().sum()))
    c5.metric("Priority >80", int((filtered["priority"]>80).sum()))

    st.divider()

    # ── Selectable dataframe — click a row to open the lead dialog ──
    st.caption("👇 Clique numa linha para abrir o lead em popup.")
    show_cols = ["_icon","name","city","keyword","rating","reviews",
                 "website","email","phone","priority","status"]
    show_cols = [c for c in show_cols if c in filtered.columns]

    # Auto-advance: if last save set this, open the dialog for the next row
    auto_pid = st.session_state.pop("auto_advance_from", None)
    forced_open_idx = None
    if auto_pid:
        # Positional index of the just-saved lead in the current filtered view
        mask = filtered["place_id"].astype(str).values == str(auto_pid)
        if mask.any():
            current_pos = int(mask.argmax())  # primeira ocorrência
            next_pos = current_pos + 1
            if 0 <= next_pos < len(filtered):
                forced_open_idx = next_pos
                # Update the dataframe's selection so the UI also reflects the new row
                st.session_state["leads_table"] = {"selection": {"rows": [next_pos], "columns": []}}

    table = st.dataframe(
        filtered[show_cols].rename(columns={"_icon":""}),
        use_container_width=True, height=500, hide_index=True,
        on_select="rerun", selection_mode="single-row",
        key="leads_table",
    )

    selection = getattr(table, "selection", None) or (table.get("selection") if isinstance(table, dict) else None)
    sel_rows = []
    if selection:
        sel_rows = selection.get("rows", []) if isinstance(selection, dict) else getattr(selection, "rows", [])

    # Force-open the next lead from auto-advance, else respect the click
    target_idx = forced_open_idx if forced_open_idx is not None else (int(sel_rows[0]) if sel_rows else None)

    if target_idx is not None and 0 <= target_idx < len(filtered):
        lead = filtered.iloc[target_idx]
        place_id = str(lead["place_id"])
        cur = crm[crm["place_id"] == place_id]
        lead_dialog(place_id, lead, cur)

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
# TAB AGENDA — Calendar view of meetings
# ═══════════════════════════════════════════════════════════════

with tab_agenda:
    st.title("📅 Agenda")

    if _st_calendar is None:
        st.error("📦 streamlit-calendar não instalado. Corre: `pip install streamlit-calendar`")
        st.stop()

    meetings = load_meetings()

    # Top metrics
    today_iso = datetime.now().strftime("%Y-%m-%d")
    if len(meetings):
        m_today    = meetings[meetings["start_dt"].astype(str).str[:10] == today_iso]
        m_week     = meetings[
            (meetings["start_dt"].astype(str) >= today_iso) &
            (meetings["start_dt"].astype(str) <= (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d"))
        ]
        m_pending  = meetings[meetings["status"] == "scheduled"]
        m_done     = meetings[meetings["status"] == "done"]
    else:
        m_today = m_week = m_pending = m_done = pd.DataFrame()

    a1, a2, a3, a4 = st.columns(4)
    a1.metric("📅 Hoje",            len(m_today))
    a2.metric("📆 Próx. 7 dias",    len(m_week))
    a3.metric("⏳ Agendadas",        len(m_pending))
    a4.metric("✅ Realizadas",       len(m_done))

    st.divider()

    # ── Legend (meeting stages) ──
    leg_cols = st.columns(len(MEETING_STAGES))
    for i, stage in enumerate(MEETING_STAGES):
        with leg_cols[i]:
            color = MEETING_STAGE_COLORS[stage]
            st.markdown(
                f"<div style='display:flex;align-items:center;gap:6px;'>"
                f"<div style='width:12px;height:12px;background:{color};border-radius:2px;'></div>"
                f"<span style='font-size:12px;'>{stage}</span></div>",
                unsafe_allow_html=True,
            )

    st.divider()

    # ── Build events list for fullcalendar (vazio se ainda não há reuniões) ──
    events = []
    for _, m in meetings.iterrows():
        try:
            start = str(m["start_dt"])
            end   = str(m["end_dt"])
            stage = str(m.get("stage","Discovery"))
            status = str(m.get("status","scheduled"))
            color  = MEETING_STAGE_COLORS.get(stage, "#3b82f6")
            if status == "done":        color = "#94a3b8"
            if status == "no_show":     color = "#dc2626"
            if status == "cancelled":   color = "#9ca3af"
            title = f"{stage} · {m.get('lead_name','')}"
            events.append({
                "id":         str(m["id"]),
                "title":      title,
                "start":      start,
                "end":        end,
                "backgroundColor": color,
                "borderColor":     color,
                "extendedProps": {
                    "place_id":  str(m.get("place_id","")),
                    "stage":     stage,
                    "status":    status,
                    "meet_link": str(m.get("meet_link","")),
                    "notes":     str(m.get("notes","")),
                    "city":      str(m.get("lead_city","")),
                },
            })
        except Exception:
            continue

    if not events:
        st.caption("📅 Calendário vazio — vá à tab **📋 Leads**, clique num lead e use o botão **📅 Agendar reunião** para preencher esta agenda.")

    if True:
        calendar_options = {
            "headerToolbar": {
                "left":   "prev,next today",
                "center": "title",
                "right":  "timeGridWeek,timeGridDay,listWeek",
            },
            "initialView": "timeGridWeek",
            "slotMinTime": "09:00:00",
            "slotMaxTime": "18:00:00",
            "slotDuration": "00:15:00",
            "snapDuration": "00:15:00",
            "allDaySlot": False,
            "weekends": True,
            "firstDay": 1,
            "locale": "pt",
            "height": 720,
            "nowIndicator": True,
            "businessHours": {
                "daysOfWeek": [1, 2, 3, 4, 5, 6],
                "startTime": "09:00",
                "endTime":   "18:00",
            },
            "editable": True,           # drag to reschedule
            "eventStartEditable": True,
            "eventDurationEditable": True,
            "dayMaxEvents": True,
        }

        custom_css = """
            .fc-event-title { font-weight: 500; font-size: 12px; }
            .fc .fc-toolbar-title { font-size: 18px; }
            .fc-timegrid-event { padding: 2px 4px; }
        """

        cal_state = _st_calendar(events=events, options=calendar_options, custom_css=custom_css, key="agenda_cal")

        # Handle drag-and-drop reschedule (eventChange)
        if cal_state and isinstance(cal_state, dict):
            ev_change = cal_state.get("eventChange")
            ev_clicked = cal_state.get("eventClick")
            if ev_change and isinstance(ev_change, dict) and ev_change.get("event"):
                ev = ev_change["event"]
                try:
                    new_start = datetime.fromisoformat(str(ev["start"]).replace("Z","+00:00"))
                    new_end   = datetime.fromisoformat(str(ev["end"]).replace("Z","+00:00"))
                    new_dur   = int((new_end - new_start).total_seconds() // 60)
                    update_meeting(ev["id"], start_dt=new_start, duration_min=new_dur)
                    st.success(f"🔄 Reunião reagendada para {new_start.strftime('%d/%m %H:%M')}")
                    time.sleep(0.3)
                    st.rerun()
                except Exception as e:
                    st.error(f"Erro ao reagendar: {e}")

            if ev_clicked and isinstance(ev_clicked, dict) and ev_clicked.get("event"):
                ev = ev_clicked["event"]
                ext = ev.get("extendedProps", {}) or {}
                with st.container(border=True):
                    st.markdown(f"### 📌 {ev.get('title','')}")
                    cinfo1, cinfo2 = st.columns(2)
                    with cinfo1:
                        try:
                            sdt = datetime.fromisoformat(str(ev["start"]).replace("Z","+00:00"))
                            st.write(f"**Quando:** {sdt.strftime('%d/%m/%Y · %H:%M')}")
                        except Exception:
                            st.write(f"**Quando:** {ev.get('start','')}")
                        st.write(f"**Cidade:** {ext.get('city','')}")
                        st.write(f"**Estado:** {MEETING_STATUS_LABEL.get(ext.get('status','scheduled'), ext.get('status',''))}")
                    with cinfo2:
                        link = ext.get("meet_link","")
                        if link and link != "nan":
                            st.markdown(f"🔗 [Abrir Google Meet]({link})")
                        notes = ext.get("notes","")
                        if notes and notes != "nan":
                            st.caption(f"📝 {notes}")
                    bcols = st.columns(4)
                    if bcols[0].button("✅ Realizada", key=f"cal_done_{ev['id']}"):
                        update_meeting(ev["id"], status="done")
                        st.rerun()
                    if bcols[1].button("👻 No-show", key=f"cal_ns_{ev['id']}"):
                        update_meeting(ev["id"], status="no_show")
                        st.rerun()
                    if bcols[2].button("❌ Cancelar", key=f"cal_cn_{ev['id']}"):
                        update_meeting(ev["id"], status="cancelled")
                        st.rerun()
                    if bcols[3].button("🗑️ Apagar", key=f"cal_rm_{ev['id']}"):
                        delete_meeting(ev["id"])
                        st.rerun()

    st.divider()

    # ── Quick list of upcoming meetings ──
    if len(meetings):
        upcoming = meetings[
            (meetings["start_dt"].astype(str) >= datetime.now().isoformat(timespec="minutes")) &
            (meetings["status"] == "scheduled")
        ].sort_values("start_dt").head(10)
        if len(upcoming):
            st.markdown("##### ⏭️ Próximas reuniões")
            for _, m in upcoming.iterrows():
                try:
                    sdt = datetime.fromisoformat(str(m["start_dt"]))
                    when = sdt.strftime("%a, %d/%m · %H:%M")
                except Exception:
                    when = str(m["start_dt"])
                stage = str(m.get("stage","Discovery"))
                color = MEETING_STAGE_COLORS.get(stage, "#3b82f6")
                row_cols = st.columns([2, 2, 1.4, 1.4, 1])
                row_cols[0].markdown(
                    f"<span style='display:inline-block;width:10px;height:10px;background:{color};"
                    f"border-radius:2px;margin-right:6px;'></span>"
                    f"**{m.get('lead_name','')}**",
                    unsafe_allow_html=True,
                )
                row_cols[1].caption(f"📍 {m.get('lead_city','')} · {stage}")
                row_cols[2].caption(when)
                link = str(m.get("meet_link",""))
                if link and link != "nan":
                    row_cols[3].markdown(f"[🔗 Meet]({link})")
                if row_cols[4].button("✅", key=f"up_done_{m['id']}", help="Marcar realizada"):
                    update_meeting(m["id"], status="done")
                    st.rerun()


# ═══════════════════════════════════════════════════════════════
# TAB PROPOSTA — geração de apresentação + proposta para cliente
# ═══════════════════════════════════════════════════════════════

with tab_proposal:
    st.title("📝 Gerador de Proposta")
    st.caption("Preenche os campos abaixo. A proposta é gerada em tempo real e pode ser descarregada como HTML (abre no browser → Ctrl+P → Guardar como PDF).")

    # ── Auto-fill a partir de lead (opcional) ──
    form_cols = st.columns([1, 1])
    with form_cols[0]:
        if _LEADS_AVAILABLE and len(filtered) > 0:
            lead_options = ["— (não auto-preencher)"] + [
                f"{r['name']} · {r.get('city','')}"
                for _, r in filtered.head(200).iterrows()
            ]
            picked = st.selectbox("📋 Auto-preencher a partir de lead", lead_options, key="prop_lead_pick")
            picked_lead = None
            if picked != lead_options[0]:
                idx = lead_options.index(picked) - 1
                picked_lead = filtered.head(200).iloc[idx]
        else:
            picked_lead = None
    with form_cols[1]:
        validity_days = st.number_input("Validade (dias)", min_value=7, max_value=180, value=30, step=7, key="prop_validity")

    st.divider()

    # ── Campos do formulário ──
    base_cols = st.columns([1.5, 1, 1])
    with base_cols[0]:
        default_company = str(picked_lead.get("name","")) if picked_lead is not None else ""
        company = st.text_input("Nome da empresa *", value=default_company, key="prop_company")
    with base_cols[1]:
        default_city = str(picked_lead.get("city","")) if picked_lead is not None else ""
        city = st.text_input("Cidade", value=default_city, key="prop_city")
    with base_cols[2]:
        detected = detect_business_type(picked_lead.to_dict()) if picked_lead is not None else "default"
        btype_options = list(BUSINESS_CHALLENGES.keys())
        business_type = st.selectbox("Tipo de negócio",
            btype_options,
            index=btype_options.index(detected) if detected in btype_options else btype_options.index("default"),
            key="prop_btype")

    type_cols = st.columns([1, 2])
    with type_cols[0]:
        default_project = "rebuild" if (picked_lead is not None
                                        and pd.notna(picked_lead.get("website"))
                                        and picked_lead.get("website")) else "new"
        project_type = st.radio("Tipo de projeto",
            ["new", "rebuild"],
            format_func=lambda x: "🆕 Website novo (de raiz)" if x == "new" else "🔄 Reconstruir site existente",
            index=["new","rebuild"].index(default_project),
            horizontal=True,
            key="prop_project_type")
    with type_cols[1]:
        if project_type == "rebuild":
            default_url = str(picked_lead.get("website","")) if (picked_lead is not None and pd.notna(picked_lead.get("website"))) else ""
            current_url = st.text_input("URL do site atual", value=default_url,
                placeholder="https://www.exemplo.pt", key="prop_url")
        else:
            current_url = ""

    # ── Issues do site atual (só rebuild) ──
    current_issues = []
    if project_type == "rebuild":
        st.markdown("##### 🚨 Problemas identificados no site atual")
        current_issues = st.multiselect(
            "Seleciona os pontos a corrigir (aparecerão na secção 'O que muda' da proposta)",
            CURRENT_ISSUES_CATALOG,
            default=CURRENT_ISSUES_CATALOG[:3] if picked_lead is None else [],
            key="prop_issues",
        )

    # ── Funcionalidades ──
    st.markdown("##### ✨ Funcionalidades incluídas no investimento base")
    feat_cols = st.columns(len(FEATURES_CATALOG))
    selected_features = []
    for i, (category, items) in enumerate(FEATURES_CATALOG.items()):
        with feat_cols[i]:
            st.markdown(f"**{category}**")
            for label, default in items:
                key = f"prop_feat_{category}_{label[:30]}"
                if st.checkbox(label, value=default, key=key):
                    selected_features.append(label)

    # ── Add-ons ──
    st.markdown("##### ➕ Add-ons opcionais (facturados separadamente)")
    addon_cols = st.columns(2)
    selected_addons = []
    for i, addon in enumerate(ADDON_CATALOG):
        col = addon_cols[i % 2]
        label_with_price = f"{addon['label']}  ·  **{addon['price']}€{addon['kind'] if addon['kind'] != 'one-time' else ''}**"
        key = f"prop_addon_{i}"
        if col.checkbox(label_with_price, value=False, key=key):
            selected_addons.append(addon)

    # ── Preço e intro custom ──
    price_cols = st.columns([1, 2])
    with price_cols[0]:
        default_price = DEFAULT_PRICES["rebuild"] if project_type == "rebuild" else DEFAULT_PRICES["new"]
        base_price = st.number_input("💰 Preço base 'desde X' (€) *",
            min_value=0, value=default_price, step=50, key="prop_base_price")
    with price_cols[1]:
        custom_intro = st.text_area(
            "Mensagem de abertura personalizada (opcional)",
            placeholder="Ex: 'Esta proposta é o resultado da nossa conversa de 22/05, em que identificámos as oportunidades para...'",
            height=80,
            key="prop_intro",
        )

    st.divider()

    # ── Validation ──
    can_generate = bool(company.strip()) and base_price > 0 and len(selected_features) > 0
    if not can_generate:
        missing = []
        if not company.strip():     missing.append("nome da empresa")
        if base_price <= 0:         missing.append("preço base")
        if not selected_features:   missing.append("pelo menos uma funcionalidade")
        st.warning(f"⚠️ Falta preencher: {', '.join(missing)}")

    # ── Preview + Download ──
    if can_generate:
        proposal_data = {
            "company":        company.strip(),
            "city":           city.strip(),
            "business_type":  business_type,
            "project_type":   project_type,
            "current_url":    current_url.strip(),
            "current_issues": current_issues,
            "features":       selected_features,
            "addons":         selected_addons,
            "base_price":     int(base_price),
            "validity_days":  int(validity_days),
            "custom_intro":   custom_intro.strip(),
        }
        html_str = build_proposal_html(proposal_data)

        # Safe filename base
        safe_name = re.sub(r"[^a-zA-Z0-9\-_]+", "_", company.strip().lower())[:40].strip("_") or "cliente"
        date_suffix = datetime.now().strftime('%Y-%m-%d')

        # Generate PDF on demand (cached in session)
        if st.session_state.get("prop_last_html") != html_str:
            st.session_state.pop("prop_last_pdf", None)
            st.session_state["prop_last_html"] = html_str

        # Action buttons row
        act_cols = st.columns([1.5, 1, 1.5])

        # PDF button (só se a lib estiver disponível) — caso contrário, HTML é primário
        if _PDF_AVAILABLE:
            with act_cols[0]:
                if "prop_last_pdf" not in st.session_state:
                    if st.button("🛠️ Gerar PDF", type="primary", use_container_width=True):
                        try:
                            with st.spinner("A gerar PDF..."):
                                st.session_state["prop_last_pdf"] = build_proposal_pdf(proposal_data)
                            st.rerun()
                        except Exception as ex:
                            st.error(f"Erro a gerar PDF: {ex}")
                else:
                    st.download_button(
                        "📥 Descarregar PDF",
                        data=st.session_state["prop_last_pdf"],
                        file_name=f"proposta_{safe_name}_{date_suffix}.pdf",
                        mime="application/pdf",
                        type="primary",
                        use_container_width=True,
                    )
            with act_cols[1]:
                st.download_button(
                    "💾 HTML",
                    data=html_str.encode("utf-8"),
                    file_name=f"proposta_{safe_name}_{date_suffix}.html",
                    mime="text/html",
                    use_container_width=True,
                    help="Versão HTML — para edição manual ou backup",
                )
        else:
            # Sem xhtml2pdf (ex: deploy no Streamlit Cloud) — HTML como primário
            with act_cols[0]:
                st.download_button(
                    "📥 Descarregar HTML",
                    data=html_str.encode("utf-8"),
                    file_name=f"proposta_{safe_name}_{date_suffix}.html",
                    mime="text/html",
                    type="primary",
                    use_container_width=True,
                    help="Abre no browser e usa Ctrl+P → Guardar como PDF para enviar ao cliente",
                )
            with act_cols[1]:
                st.caption("ℹ️ Para PDF nativo, corre o app localmente com xhtml2pdf instalado")

        act_cols[2].caption(f"{len(selected_features)} funcionalidades · {len(selected_addons)} add-ons · desde {base_price}€")

        # Always show preview
        st.markdown("---")
        st.markdown("##### 👁️ Preview")
        st.components.v1.html(html_str, height=1200, scrolling=True)


# ═══════════════════════════════════════════════════════════════
# TAB 3 — OUTREACH
# ═══════════════════════════════════════════════════════════════

with tab_outreach:
    st.title("📞 Outreach")
    if not _LEADS_AVAILABLE:
        st.info("📂 `leads_master.csv` not found. This tab requires the local data file.")
        st.stop()

    no_web      = df[df["website"].isna() & (df["status"] == "new")].drop_duplicates(subset=["place_id"], keep="first")
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

    oa_tab_mobile, oa_tab_landline, oa_tab_email = st.tabs(["📱 WhatsApp / Mobile", "☎️ Call list / Landline", "📧 Email"])

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


    with oa_tab_email:
        st.subheader("📧 Email Outreach")

        # ── Settings ──
        _bkey = st.session_state.get("brevo_key", BREVO_API_KEY)
        _bsender = st.session_state.get("brevo_sender", EMAIL_SENDER)
        with st.expander("⚙️ Configuração Brevo", expanded=not _bkey):
            col_k, col_s = st.columns(2)
            _bkey   = col_k.text_input("API Key Brevo", value=_bkey, type="password", key="brevo_key")
            _bsender = col_s.text_input("Email remetente (verificado no Brevo)", value=_bsender, key="brevo_sender")
            if not _bkey:
                st.warning("Vai a **app.brevo.com → Settings → API Keys** e cola a chave aqui.  \n"
                           "Conta gratuita: 300 emails/dia.")

        st.divider()

        # ── Build email leads list ──
        email_log = load_email_log()
        today_str = datetime.now().strftime("%Y-%m-%d")
        sent_pids  = set(email_log[email_log["status"] == "sent"]["place_id"].astype(str).tolist()) if len(email_log) else set()
        sent_today = len(email_log[email_log["timestamp"].str.startswith(today_str) & (email_log["status"] == "sent")]) if len(email_log) else 0

        em_leads = df[
            df["email"].notna() &
            (df["email"] != "") &
            ~df["place_id"].astype(str).isin(sent_pids)
        ].copy()
        em_leads = em_leads.drop_duplicates(subset=["place_id"], keep="first")

        # ── Filters ──
        col_f1, col_f2, col_f3 = st.columns(3)
        em_city   = col_f1.selectbox("City",    ["All"] + sorted(em_leads["city"].dropna().unique().tolist()),    key="em_city")
        em_kw     = col_f2.selectbox("Keyword", ["All"] + sorted(em_leads["keyword"].dropna().unique().tolist()), key="em_kw")
        em_minrev = col_f3.slider("Min reviews", 0, 500, 0, key="em_rev")

        if em_city != "All": em_leads = em_leads[em_leads["city"] == em_city]
        if em_kw   != "All": em_leads = em_leads[em_leads["keyword"] == em_kw]
        em_leads = em_leads[em_leads["reviews"] >= em_minrev]
        em_leads = em_leads.sort_values("priority", ascending=False).reset_index(drop=True)

        mc1, mc2, mc3 = st.columns(3)
        mc1.metric("Leads por contactar", len(em_leads))
        mc2.metric("Enviados hoje", sent_today)
        mc3.metric("Total enviados", len(email_log[email_log["status"] == "sent"]) if len(email_log) else 0)

        if len(em_leads) == 0:
            st.info("Sem leads com email por contactar. Ajusta os filtros ou todos já foram enviados.")
        else:
            # ── Preview ──
            with st.expander("👁️ Preview do email (primeiro lead)"):
                sample = em_leads.iloc[0]
                s_subj, s_html = build_email(sample["name"], sample["city"], sample.get("reviews", 0), sample.get("keyword", ""))
                st.write(f"**Para:** {sample['email']}")
                st.write(f"**Assunto:** {s_subj}")
                st.components.v1.html(s_html, height=420, scrolling=True)

            st.divider()

            # ── Batch send ──
            st.subheader("🚀 Envio em batch")
            batch_n = st.slider("Quantos emails enviar agora", 5, 100, 20, key="em_batch_n")
            batch   = em_leads.head(batch_n)

            with st.expander(f"Ver os {len(batch)} leads do batch"):
                for _, r in batch.iterrows():
                    st.write(f"• **{r['name']}** ({r['city']}) · `{r['email']}` · {r['keyword']}")

            if st.button(f"📤 Enviar {len(batch)} emails agora", type="primary", key="em_send_batch"):
                if not _bkey:
                    st.error("Adiciona a API Key do Brevo primeiro.")
                else:
                    prog      = st.progress(0, text="A enviar...")
                    stat_area = st.empty()
                    ok_n, fail_n = 0, 0
                    today_s  = datetime.now().strftime("%Y-%m-%d")
                    fu_s     = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
                    for i, (_, r) in enumerate(batch.iterrows()):
                        pid   = str(r["place_id"])
                        subj, html_body = build_email(r["name"], r["city"], r.get("reviews", 0), r.get("keyword", ""))
                        result = send_brevo(_bkey, r["email"], r["name"], subj, html_body)
                        if result["ok"]:
                            ok_n += 1
                            log_email_sent(pid, r["email"], subj, "sent")
                            upsert_crm(pid, "contacted", today_s, fu_s, "", "email",
                                       0, "", "Follow-up em 3 dias", "new",
                                       f"Email enviado: {subj}")
                        else:
                            fail_n += 1
                            log_email_sent(pid, r["email"], subj, "error", result.get("error", ""))
                        prog.progress((i + 1) / len(batch), text=f"✅ {ok_n} enviados · ❌ {fail_n} erros")
                        time.sleep(0.25)
                    st.success(f"Batch concluído: **{ok_n} emails enviados** com sucesso!" +
                               (f" ({fail_n} erros)" if fail_n else ""))
                    st.cache_data.clear()
                    st.rerun()

            st.divider()

            # ── Individual send ──
            st.subheader("📬 Envio individual")
            for _, r in em_leads.head(30).iterrows():
                pid = str(r["place_id"])
                ca, cb, cc, cd = st.columns([2.5, 2.2, 1.8, 1])
                ca.write(f"**{r['name']}** · {r['city']}")
                cb.write(f"📧 `{r['email']}`")
                cc.write(r.get("keyword", ""))
                if cd.button("Enviar", key=f"em_ind_{pid}"):
                    if not _bkey:
                        st.error("API Key em falta.")
                    else:
                        subj, html_body = build_email(r["name"], r["city"], r.get("reviews", 0), r.get("keyword", ""))
                        res = send_brevo(_bkey, r["email"], r["name"], subj, html_body)
                        if res["ok"]:
                            log_email_sent(pid, r["email"], subj, "sent")
                            upsert_crm(pid, "contacted", datetime.now().strftime("%Y-%m-%d"),
                                       (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d"),
                                       "", "email", 0, "", "Follow-up em 3 dias", "new",
                                       f"Email enviado: {subj}")
                            st.success(f"Enviado para {r['email']}")
                            st.cache_data.clear()
                            st.rerun()
                        else:
                            st.error(f"Erro: {res['error']}")
                st.divider()

            # ── Email log ──
            if len(email_log) > 0:
                with st.expander(f"📋 Histórico de emails enviados ({len(email_log[email_log['status']=='sent'])} enviados)"):
                    st.dataframe(
                        email_log.sort_values("timestamp", ascending=False).head(100),
                        use_container_width=True
                    )


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
    st.text_area("", """Olá! Vi o {name} no Google Maps em {city} — {reviews} avaliações, excelente 👏

Vi que têm uma presença forte no Google e pensei que ainda podiam aproveitar melhor isso online para captar mais contactos.

Trabalho com negócios locais a transformar essa visibilidade em mais clientes através de websites simples e profissionais.

Posso mostrar-vos uma ideia de como isso poderia funcionar no vosso caso?""", height=180, key="t2")

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


