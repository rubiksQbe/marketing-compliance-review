export default function Audit() {
  const events = [
    { at: "Today 09:12", actor: "Jordan Lee", action: "Approved", detail: "All checklist items satisfied" },
    { at: "Today 09:08", actor: "Jordan Lee", action: "Opened review", detail: "High-risk affiliate APR claim" },
    { at: "Yesterday 16:40", actor: "Sam Ortiz", action: "Submitted", detail: "Structured intake complete" },
  ]

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--df-background)",
        color: "var(--df-text)",
        fontFamily: "var(--df-font-family)",
        padding: "var(--df-spacing-lg)",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <button data-df-navigate="queue" style={{ background: "none", border: 0, color: "var(--df-primary)", cursor: "pointer" }}>
        ← Queue
      </button>
      <h1 style={{ fontSize: "var(--df-heading-h2)" }}>Audit trail</h1>
      <p style={{ color: "var(--df-text-muted)" }}>CP-1042 · Timestamped decisions replace Excel archaeology.</p>

      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
        {events.map((e) => (
          <li
            key={e.at + e.action}
            style={{
              background: "var(--df-surface)",
              border: "1px solid var(--df-border)",
              borderRadius: "var(--df-radius-md)",
              padding: "var(--df-spacing-md)",
            }}
          >
            <div style={{ fontWeight: 600 }}>{e.action}</div>
            <div style={{ color: "var(--df-text-muted)", fontSize: "var(--df-body-sm)" }}>
              {e.at} · {e.actor}
            </div>
            <div style={{ marginTop: 6 }}>{e.detail}</div>
          </li>
        ))}
      </ol>
    </div>
  )
}
