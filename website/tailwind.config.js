/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        'display': ['"DM Sans"', 'sans-serif'],
        'body': ['"IBM Plex Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}