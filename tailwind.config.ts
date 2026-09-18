import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/sanity/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        accent: "var(--accent)",
        soft: "var(--soft)",
        detail: "var(--detail)",
      },
      fontFamily: {
        headline: ["var(--font-headline)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        signature: ["var(--font-signature)", "cursive"],
      },
      maxWidth: {
        editorial: "1200px",
      },
      keyframes: {
        "slow-zoom": {
          "0%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -3%)" },
          "20%": { transform: "translate(3%, 2%)" },
          "30%": { transform: "translate(-1%, 3%)" },
          "40%": { transform: "translate(2%, -2%)" },
          "50%": { transform: "translate(-3%, 1%)" },
          "60%": { transform: "translate(2%, 2%)" },
          "70%": { transform: "translate(-2%, -1%)" },
          "80%": { transform: "translate(1%, -3%)" },
          "90%": { transform: "translate(-1%, 2%)" },
        },
      },
      animation: {
        "slow-zoom": "slow-zoom 6s ease-out forwards",
        "fade-up": "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        grain: "grain 8s steps(8) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
