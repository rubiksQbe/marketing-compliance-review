export default function Queue() {
  const rows = [
    { id: "CP-1042", title: "Affiliate APR banner — Personal Loans", risk: "High", sla: "2h left", status: "Pending" },
    { id: "CP-1041", title: "Mortgage prequal email — rate mention", risk: "High", sla: "4h left", status: "Pending" },
    { id: "CP-1038", title: "Credit card social — no claims", risk: "Low", sla: "18h left", status: "Pending" },
  ]

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--df-background)",
        color: "var(--df-text)",
        fontFamily: "var(--df-font-family)",
        padding: "var(--df-spacing-lg)",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--df-spacing-lg)" }}>
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "1.35rem", color: "var(--df-secondary)" }}>
            ClearPath <span style={{ color: "var(--df-primary)" }}>Review</span>
          </div>
          <p style={{ color: "var(--df-text-muted)", margin: "4px 0 0", fontSize: "var(--df-body-sm)" }}>
            Risk-tiered compliance queue
          </p>
        </div>
        <button
          data-df-navigate="submit"
          style={{
            background: "var(--df-primary)",
            color: "var(--df-text-invert)",
            border: 0,
            borderRadius: "var(--df-radius-md)",
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          New submission
        </button>
      </header>

      <div style={{ display: "flex", gap: "var(--df-spacing-md)", marginBottom: "var(--df-spacing-lg)" }}>
        {[
          ["12", "Pending"],
          ["3", "SLA at risk"],
          ["6.4h", "Median wait"],
        ].map(([value, label]) => (
          <div
            key={label}
            style={{
              flex: 1,
              background: "var(--df-surface)",
              border: "1px solid var(--df-border)",
              borderRadius: "var(--df-radius-md)",
              padding: "var(--df-spacing-md)",
            }}
          >
            <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>{value}</div>
            <div style={{ color: "var(--df-text-muted)", fontSize: "var(--df-body-sm)" }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--df-surface)", border: "1px solid var(--df-border)", borderRadius: "var(--df-radius-md)" }}>
        {rows.map((row, i) => (
          <button
            key={row.id}
            data-df-navigate="review"
            style={{
              width: "100%",
              textAlign: "left",
              background: "transparent",
              border: 0,
              borderTop: i ? "1px solid var(--df-border)" : 0,
              padding: "var(--df-spacing-md)",
              cursor: "pointer",
              color: "inherit",
              display: "grid",
              gridTemplateColumns: "1fr auto auto auto",
              gap: "var(--df-spacing-md)",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{row.title}</div>
              <div style={{ color: "var(--df-text-muted)", fontSize: "var(--df-body-sm)" }}>{row.id}</div>
            </div>
            <span style={{ color: row.risk === "High" ? "var(--df-error)" : "var(--df-success)" }}>{row.risk}</span>
            <span style={{ color: "var(--df-warning)" }}>{row.sla}</span>
            <span>{row.status}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
