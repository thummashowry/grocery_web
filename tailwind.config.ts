import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        spruce: {
          50: "#f2fbf5",
          100: "#d9f5df",
          200: "#b4e8c1",
          300: "#84d89a",
          400: "#58c479",
          500: "#36ac5e",
          600: "#25894a",
          700: "#1f6d3f",
          800: "#1d5634",
          900: "#19472d"
        },
        ink: "#101815"
      },
      boxShadow: {
        soft: "0 12px 30px -18px rgba(16, 24, 21, 0.35)",
        card: "0 20px 40px -28px rgba(16, 24, 21, 0.45)"
      },
      borderRadius: {
        panel: "1.25rem"
      },
      fontFamily: {
        sans: ["\"Avenir Next\"", "\"SF Pro Display\"", "system-ui", "sans-serif"]
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" }
        }
      },
      animation: {
        rise: "rise 500ms ease-out both",
        pulseSoft: "pulseSoft 1.4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
