/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          500: '#1d9bf0', // Twitter/X blue
          600: '#1a8cd8', // Darker shade for hover
        },
        black: '#000000',
        white: '#ffffff',
        gray: {
          800: '#2f3336', // Twitter dark gray for borders
          900: '#16181c', // Twitter background for widgets
          500: '#71767b', // Twitter secondary text
          400: '#8899a6', // Twitter muted text
          300: '#aab8c2', // Twitter light text
        }
      }
    },
  },
  plugins: [],
}