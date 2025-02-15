/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFFAF0',
          100: '#FAEBD7',
          200: '#FFD700',
          300: '#DAA520',
          400: '#D4AF37',
          500: '#B8860B',
          600: '#996515',
          700: '#8B4513',
          800: '#8B0000',
          900: '#800000',
        },
      },
      fontFamily: {
        'futura': ['Futura', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

