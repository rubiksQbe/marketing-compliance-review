import type { DesignFlowConfig } from "designflow"

const config: DesignFlowConfig = {
  name: "clearpath-review",
  screens: {
    queue: {
      title: "Queue",
      file: "./screens/Queue.tsx",
      position: { x: -40, y: 40 },
      viewport: "desktop",
      color: "#0F766E",
    },
    submit: {
      title: "Submit",
      file: "./screens/Submit.tsx",
      position: { x: 520, y: -80 },
      viewport: "desktop",
      color: "#0369A1",
    },
    review: {
      title: "Review",
      file: "./screens/Review.tsx",
      position: { x: 520, y: 280 },
      viewport: "desktop",
      color: "#B45309",
    },
    audit: {
      title: "Audit",
      file: "./screens/Audit.tsx",
      position: { x: 1080, y: 280 },
      viewport: "desktop",
      color: "#15803D",
    },
  },
  edges: [
    { from: "queue", to: "submit", label: "New submission" },
    { from: "submit", to: "queue", label: "Submitted" },
    { from: "queue", to: "review", label: "Open item" },
    { from: "review", to: "audit", label: "Decision logged" },
    { from: "audit", to: "queue", label: "Back" },
    { from: "review", to: "queue", label: "Back" },
  ],
}

export default config
