export default function Review() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--df-background)",
        color: "var(--df-text)",
        fontFamily: "var(--df-font-family)",
        display: "grid",
        gridTemplateRows: "auto 1fr",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "var(--df-spacing-md) var(--df-spacing-lg)",
          borderBottom: "1px solid var(--df-border)",
          background: "var(--df-surface)",
        }}
      >
        <div>
          <button data-df-navigate="queue" style={{ background: "none", border: 0, color: "var(--df-primary)", cursor: "pointer" }}>
            ← Queue
          </button>
          <h1 style={{ margin: "4px 0 0", fontSize: "var(--df-heading-h3)" }}>Affiliate APR banner — Personal Loans</h1>
        </div>
        <span style={{ color: "var(--df-error)", fontWeight: 600 }}>High risk · 2h SLA</span>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "var(--df-spacing-lg)",
          padding: "var(--df-spacing-lg)",
        }}
      >
        <section
          style={{
            background: "var(--df-surface)",
            border: "1px solid var(--df-border)",
            borderRadius: "var(--df-radius-md)",
            padding: "var(--df-spacing-lg)",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "var(--df-heading-h4)" }}>Asset preview</h2>
          <p style={{ lineHeight: 1.5 }}>
            “Get a personal loan from 7.99% APR — apply in minutes via our partner network.”
          </p>
          <p style={{ color: "var(--df-text-muted)", fontSize: "var(--df-body-sm)" }}>
            Channel: Affiliate · Product: Personal Loans · Audience: Consumers
          </p>
          <div style={{ marginTop: 16, padding: 12, background: "var(--df-surface-alt)", borderRadius: "var(--df-radius-sm)" }}>
            Disclosure draft: Rates from 7.99% APR. Actual rate depends on creditworthiness…
          </div>
        </section>

        <section style={{ display: "grid", gap: "var(--df-spacing-md)", alignContent: "start" }}>
          <div
            style={{
              background: "var(--df-surface)",
              border: "1px solid var(--df-border)",
              borderRadius: "var(--df-radius-md)",
              padding: "var(--df-spacing-md)",
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: "var(--df-heading-h4)" }}>Checklist</h2>
            {["APR claim substantiated", "Required disclosure present", "No misleading urgency", "Affiliate relationship clear"].map(
              (item) => (
                <label key={item} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: "var(--df-body-sm)" }}>
                  <input type="checkbox" defaultChecked={item.includes("disclosure")} />
                  {item}
                </label>
              ),
            )}
          </div>

          <div
            style={{
              background: "var(--df-surface)",
              border: "1px solid var(--df-border)",
              borderRadius: "var(--df-radius-md)",
              padding: "var(--df-spacing-md)",
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: "var(--df-heading-h4)" }}>Decision</h2>
            <p style={{ color: "var(--df-text-muted)", fontSize: "var(--df-body-sm)" }}>Reason codes required for non-approvals.</p>
            <div style={{ display: "grid", gap: 8 }}>
              <button data-df-navigate="audit" style={btn("var(--df-success)")}>
                Approve
              </button>
              <button data-df-navigate="audit" style={btn("var(--df-warning)")}>
                Request changes
              </button>
              <button data-df-navigate="audit" style={btn("var(--df-error)")}>
                Reject
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function btn(bg: string): React.CSSProperties {
  return {
    background: bg,
    color: "var(--df-text-invert)",
    border: 0,
    borderRadius: "var(--df-radius-md)",
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 600,
  }
}
