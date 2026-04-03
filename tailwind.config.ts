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
  50:  "#e8f6f7",
  100: "#c5e9ea",
  200: "#8dd4d3",
  300: "#55bfbd",
  400: "#16c6cc",
  500: "#11999e",   // primary brand
  600: "#0d7a7e",
  700: "#40514e",   // dark text color from logo
  800: "#293533",   // darkest from logo
  900: "#1a2422",
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