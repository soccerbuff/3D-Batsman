/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dashboard-bg": "#0B0C15",
        "panel": "#0E0F19",
        "card": "#1A1C26",
        "border-dim": "#ffffff10",
      },
    },
  },
  plugins: [],
}
