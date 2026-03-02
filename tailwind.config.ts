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
        sm: "640px",
        md: "760px",
        lg: "980px",
        xl: "1120px",
        "2xl": "1160px"
      }
    },
    extend: {
      colors: {
        graphite: "#0d0d0f",
        ivory: "#f2f0eb",
        accentA: "#00a3ff",
        accentB: "#0052cc",
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)"
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(90deg, #00a3ff 0%, #0052cc 100%)"
      },
      borderRadius: {
        xl: "1rem",
        lg: "0.8rem",
        md: "0.55rem"
      },
      boxShadow: {
        card: "0 18px 40px rgba(0, 0, 0, 0.18)",
        glow: "0 0 28px rgba(0, 163, 255, 0.2)",
        float: "0 22px 48px rgba(0, 0, 0, 0.24)"
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
          "100%": { transform: "translate3d(-50%,0,0)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.22s ease-out",
        "accordion-up": "accordion-up 0.22s ease-out",
        marquee: "marquee 20s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
