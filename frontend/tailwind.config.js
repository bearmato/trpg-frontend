/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  
  daisyui: {
    themes: ["light", "dark", "cupcake","synthwave","autumn","pastel","dracula","fantasy","cmyk","retro","garden","corporate"],
  },
  plugins: [require('daisyui'),],
}

