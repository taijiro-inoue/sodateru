import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF6B6B",
          light: "#FFE8E8",
          dark: "#e55a5a",
        },
        secondary: {
          DEFAULT: "#4ECDC4",
          light: "#E0F7F5",
        },
        accent: {
          DEFAULT: "#FFD93D",
          light: "#FFF8D6",
        },
        brand: {
          purple: "#A78BFA",
          "purple-light": "#EDE9FE",
          green: "#6BCB77",
          "green-light": "#E8F8EA",
        },
      },
      fontFamily: {
        sans: [
          "Hiragino Kaku Gothic ProN",
          "Hiragino Sans",
          "Noto Sans JP",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
      },
      boxShadow: {
        card: "0 4px 16px rgba(0,0,0,0.10)",
        "card-hover": "0 10px 40px rgba(0,0,0,0.13)",
      },
    },
  },
  plugins: [],
};

export default config;
