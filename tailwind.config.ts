import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/services/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.125rem",
        sm: "1.25rem",
        lg: "1.5rem"
      },
      screens: {
        "2xl": "1344px"
      }
    },
    extend: {
      // The codebase uses every integer opacity step (fg/62, border/14, ...), not just
      // Tailwind's default multiples of 5; without this those classes silently emit nothing.
      opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)])),
      colors: {
        graphite: "#0d0d0f",
        ivory: "#f2f0eb",
        accentA: "#00a3ff",
        accentB: "#0052cc",
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        surface: "rgb(var(--card) / <alpha-value>)",
        charcoal: "rgb(var(--charcoal) / <alpha-value>)",
        "charcoal-2": "rgb(var(--charcoal-2) / <alpha-value>)",
        green: "rgb(var(--green) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)"
      },
      backgroundImage: {
        // Deeper start than the logo's #00a3ff so white labels and gradient text pass WCAG AA on light surfaces.
        "accent-gradient": "linear-gradient(90deg, #0070dd 0%, #0052cc 100%)"
      },
      borderRadius: {
        xl: "1rem",
        lg: "0.8rem",
        md: "0.55rem"
      },
      boxShadow: {
        card: "0 1px 2px rgba(10, 10, 10, 0.04), 0 18px 40px -18px rgba(10, 10, 10, 0.12)",
        lift: "0 30px 60px -30px rgba(10, 10, 10, 0.28)",
        glow: "0 10px 30px -10px rgba(0, 82, 204, 0.35)",
        float: "0 2px 6px rgba(13, 13, 15, 0.05), 0 30px 60px -24px rgba(13, 13, 15, 0.2)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        marquee: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-33.333%,0,0)" }
        },
        "marquee-reverse": {
          "0%": { transform: "translate3d(-33.333%,0,0)" },
          "100%": { transform: "translate3d(0,0,0)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.22s ease-out",
        "accordion-up": "accordion-up 0.22s ease-out",
        marquee: "marquee 20s linear infinite",
        "marquee-reverse": "marquee-reverse 20s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
