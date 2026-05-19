export default function DraftBanner() {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: "#f59e0b",
      color: "#000",
      textAlign: "center",
      padding: "8px 16px",
      fontSize: "13px",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
    }}>
      <span>⚡ DRAFT MODE — A ver conteúdo não publicado</span>
      <a href="/api/disable-draft"
        style={{ textDecoration: "underline", opacity: 0.7, fontSize: "12px" }}>
        Sair do preview
      </a>
    </div>
  )
}
