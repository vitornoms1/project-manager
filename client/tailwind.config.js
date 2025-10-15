/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Adicionamos as animações aqui. Elas usarão os keyframes do nosso index.css
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-in-from-left': 'slide-in-from-left 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}