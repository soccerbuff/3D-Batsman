/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dashboard-bg": "#FFFFFF",
        "panel": "#FFFFFF",
        "card": "#FFFFFF",
        "border-dim": "#E0E0E0",
        accent: "#FF6C3D",
        "accent-warning": "#FFB84C",
      },
    },
  },
  plugins: [],
}
