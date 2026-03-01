export const tokens = {
  colors: {
    graphite: "#0d0d0f",
    ivory: "#f2f0eb",
    accentA: "#00a3ff",
    accentB: "#0052cc"
  },
  gradient: "linear-gradient(90deg, #00a3ff 0%, #0052cc 100%)",
  semantic: {
    dark: {
      bg: "13 13 15",
      fg: "242 240 235",
      muted: "242 240 235",
      card: "18 18 22",
      border: "242 240 235"
    },
    light: {
      bg: "242 240 235",
      fg: "13 13 15",
      muted: "13 13 15",
      card: "242 240 235",
      border: "13 13 15"
    }
  },
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
    soft: "0 8px 24px rgba(0, 0, 0, 0.16)",
    glow: "0 0 24px rgba(0, 163, 255, 0.22)",
    float: "0 18px 40px rgba(0, 0, 0, 0.2)"
  },
  borderOpacity: {
    low: 0.1,
    mid: 0.18,
    high: 0.25
  },
  animationDurations: {
    fast: "180ms",
    normal: "320ms",
    slow: "520ms"
  },
  motion: {
    revealDuration: 0.45,
    revealEase: [0.16, 1, 0.3, 1] as [number, number, number, number],
    revealY: 18,
    stagger: 0.08
  }
} as const;

export type DesignTokens = typeof tokens;
