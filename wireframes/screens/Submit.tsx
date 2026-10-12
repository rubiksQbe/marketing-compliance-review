export default function Submit() {
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
      <button data-df-navigate="queue" style={{ background: "none", border: 0, color: "var(--df-primary)", cursor: "pointer", marginBottom: 12 }}>
        ← Back to queue
      </button>
      <h1 style={{ fontSize: "var(--df-heading-h2)", margin: "0 0 8px" }}>Structured intake</h1>
      <p style={{ color: "var(--df-text-muted)", marginTop: 0 }}>
        Required fields block incomplete submissions — the main driver of rework.
      </p>

      <form
        style={{
          display: "grid",
          gap: "var(--df-spacing-md)",
          background: "var(--df-surface)",
          border: "1px solid var(--df-border)",
          borderRadius: "var(--df-radius-md)",
          padding: "var(--df-spacing-lg)",
        }}
      >
        {["Title", "Product", "Channel", "Asset type", "Copy / creative", "Disclosures"].map((label) => (
          <label key={label} style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: "var(--df-body-sm)", fontWeight: 600 }}>{label} *</span>
            <div
              style={{
                height: label.includes("Copy") || label === "Disclosures" ? 72 : 40,
                border: "1px solid var(--df-border)",
                borderRadius: "var(--df-radius-sm)",
                background: "var(--df-surface-alt)",
              }}
            />
          </label>
        ))}
        <div style={{ padding: "10px 12px", background: "var(--df-surface-alt)", borderRadius: "var(--df-radius-sm)" }}>
          Suggested risk: <strong style={{ color: "var(--df-error)" }}>High</strong> (APR claim + affiliate channel)
        </div>
        <button
          type="button"
          data-df-navigate="queue"
          style={{
            background: "var(--df-primary)",
            color: "var(--df-text-invert)",
            border: 0,
            borderRadius: "var(--df-radius-md)",
            padding: "12px 16px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Submit for review
        </button>
      </form>
    </div>
  )
}
