import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0B1F3B",
          foreground: "#F5F5F7",
          light: "#1a3a5c",
          dark: "#061428",
        },
        accent: {
          DEFAULT: "#D4A853",
          light: "#E8C47D",
          dark: "#B08930",
          muted: "#D4A85320",
        },
        muted: {
          DEFAULT: "#64748B",
          foreground: "#94A3B8",
        },
        background: {
          DEFAULT: "#FAFBFC",
          secondary: "#F1F5F9",
          dark: "#0F172A",
        },
        card: {
          DEFAULT: "#FFFFFF",
          border: "#E2E8F0",
        },
        navy: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#102a43",
          950: "#0B1F3B",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(11, 31, 59, 0.07), 0 10px 20px -2px rgba(11, 31, 59, 0.04)",
        card: "0 4px 6px -1px rgba(11, 31, 59, 0.05), 0 2px 4px -1px rgba(11, 31, 59, 0.03)",
        elevated: "0 20px 25px -5px rgba(11, 31, 59, 0.1), 0 10px 10px -5px rgba(11, 31, 59, 0.04)",
        glow: "0 0 40px rgba(212, 168, 83, 0.15)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #FAFBFC 0%, #E8F4FD 50%, #F1F5F9 100%)",
        "card-gradient": "linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)",
        "navy-gradient": "linear-gradient(135deg, #0B1F3B 0%, #1a3a5c 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;





