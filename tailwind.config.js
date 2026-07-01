/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe3',
          200: '#c7d8c7',
          300: '#9fbf9f',
          400: '#729f72',
          500: '#4f7f4f',
          600: '#3e6440',
          700: '#325034',
          800: '#29402b',
          900: '#223524',
        },
        'blue-gray': {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5d9e3',
          300: '#b0baca',
          400: '#8595aa',
          500: '#647891',
          600: '#4f6077',
          700: '#404e61',
          800: '#374352',
          900: '#313a47',
        },
      },
    },
  },
  plugins: [],
};
