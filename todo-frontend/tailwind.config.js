/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#FFF8F3',
          200: '#F7E7DC',
          400: '#758694',
          500: '#405D72',
        },
        secondary: {
          500: '#921A40',
        },
      },
    },
  },
  plugins: [],
};
