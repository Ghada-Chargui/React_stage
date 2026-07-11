/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          soft: '#fdf2f8',
          warm: '#fde68a',
          main: '#0ea5e9',
          calm: '#bae6fd',
          deep: '#0f172a',
          glow: '#f97316',
        },
      },
      boxShadow: {
        soft: '0 20px 40px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
