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
    extend: {
      colors: {
        graphite: "#0d0d0f",
        ivory: "#f2f0eb",
        accentA: "#00a3ff",
        accentB: "#0052cc"
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(90deg, #00a3ff 0%, #0052cc 100%)"
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1280px"
        }
      },
      borderRadius: {
        xl: "1rem",
        lg: "0.75rem",
        md: "0.5rem"
      },
      boxShadow: {
        card: "0 16px 32px rgba(0, 163, 255, 0.08)",
        glow: "0 0 24px rgba(0, 163, 255, 0.22)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      },
      transitionDuration: {
        250: "250ms",
        450: "450ms"
      }
    }
  },
  plugins: []
};

export default config;
