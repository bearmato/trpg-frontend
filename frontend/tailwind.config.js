/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {}
      
  },
  daisyui: {
    themes: ["light", "dark", "cupcake", "synthwave", "autumn", "pastel", "dracula", "fantasy", "cmyk", "retro", "garden", "corporate", "acid"],
  },
  plugins: [require('daisyui'), require("@tailwindcss/typography")],
}
