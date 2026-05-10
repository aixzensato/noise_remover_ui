import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DMSans", "sans-serif"],
        display: ["Chillax", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
