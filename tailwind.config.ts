import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#e8f7f7",
          100: "#c5eaea",
          200: "#8dd4d3",
          300: "#55bfbd",
          400: "#2aada9",
          500: "#2A9D9A",
          600: "#228280",
          700: "#1a6866",
          800: "#124f4d",
          900: "#0a3534",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body:    ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;