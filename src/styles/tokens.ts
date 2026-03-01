export const tokens = {
  colors: {
    background: "#0d0d0f",
    text: "#f2f0eb",
    accentA: "#00a3ff",
    accentB: "#0052cc"
  },
  gradient: "linear-gradient(90deg, #00a3ff 0%, #0052cc 100%)",
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    x2: "3rem",
    x3: "4rem"
  },
  containerWidth: {
    min: "1200px",
    max: "1280px"
  },
  radii: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    pill: "999px"
  },
  shadows: {
    soft: "0 8px 24px rgba(0, 163, 255, 0.12)",
    glow: "0 0 24px rgba(0, 163, 255, 0.22)"
  },
  borderOpacity: {
    low: 0.1,
    mid: 0.18,
    high: 0.25
  },
  animationDurations: {
    fast: "200ms",
    normal: "350ms",
    slow: "600ms"
  }
} as const;

export type DesignTokens = typeof tokens;
