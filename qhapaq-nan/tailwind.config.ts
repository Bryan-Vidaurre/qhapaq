import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        qn: {
          bg: "#F5EFE3",
          paper: "#FFFFFF",
          soft: "#FBF4E4",
          muted: "#ECE2CC",
          warm: "#FCF8EE",
          ink: "#1A1410",
          text: "#2A241B",
          "text-muted": "#6B5F4F",
          "text-subtle": "#9C8F7C",
          border: "#DDD0B5",
          "border-soft": "#E8DDC4",
          terracotta: "#B85820",
          "terracotta-dark": "#8E3F11",
          forest: "#2D5938",
          "forest-dark": "#1F3F26",
          gold: "#D9A02D",
          rust: "#8B2418",
          brown: "#6B3E1F",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        "qn-wide": "0.18em",
        "qn-extra": "0.22em",
      },
      animation: {
        "qn-fade-in": "qn-fade-in 280ms ease",
        "qn-slide-in-right": "qn-slide-in-right 320ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "qn-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "qn-slide-in-right": {
          from: { transform: "translateX(40px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
