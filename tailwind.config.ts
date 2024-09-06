import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      dodgerBlue: "#38B6FF",
      codGray: {
        500: "#121212",
        400: "#1A1A1A",
        300: "#212121",
        200: "#262626",
        100: "#2C2C2C",
      },
      white: "#FFFFFF",
      black: "#000000",
      transparent: "transparent",
    },
    extend: {
      keyframes: {
        wave: {
          "0%": { transform: "rotate( 0.0deg)" },
          "10%": { transform: "rotate(14.0deg)" },
          "20%": { transform: "rotate(-8.0deg)" },
          "30%": { transform: "rotate(14.0deg)" },
          "40%": { transform: "rotate(-4.0deg)" },
          "50%": { transform: "rotate(10.0deg)" },
          "60%": { transform: "rotate( 0.0deg)" },
          "100%": { transform: "rotate( 0.0deg)" },
        },
      },
      animation: {
        "waving-hand": "wave 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
