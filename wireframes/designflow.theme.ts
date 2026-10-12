import type { DesignFlowTheme } from "designflow"

const theme: DesignFlowTheme = {
  colors: {
    primary: "#0F766E",
    secondary: "#1E293B",
    accent: "#0D9488",
    background: "#F1F5F9",
    surface: "#FFFFFF",
    surfaceAlt: "#E2E8F0",
    border: "#CBD5E1",
    text: "#0F172A",
    textMuted: "#64748B",
    textInvert: "#F8FAFC",
    success: "#15803D",
    warning: "#B45309",
    error: "#B91C1C",
    info: "#0369A1",
  },
  darkColors: {
    background: "#0B1220",
    surface: "#111827",
    surfaceAlt: "#1E293B",
    border: "#334155",
    text: "#F1F5F9",
    textMuted: "#94A3B8",
    textInvert: "#0F172A",
  },
  radius: { sm: "4px", md: "8px", lg: "12px", xl: "16px", full: "9999px" },
  spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px", xxl: "48px" },
  typography: {
    fontFamily: '"Source Sans 3", "Segoe UI", sans-serif',
    heading: { weight: 600, sizes: { h1: "2rem", h2: "1.5rem", h3: "1.25rem", h4: "1.125rem" } },
    body: { weight: 400, sizes: { base: "1rem", sm: "0.875rem", xs: "0.75rem" } },
  },
  shadows: {
    sm: "0 1px 2px rgba(15,23,42,0.05)",
    md: "0 4px 6px rgba(15,23,42,0.07)",
    lg: "0 10px 15px rgba(15,23,42,0.1)",
  },
}

export default theme
