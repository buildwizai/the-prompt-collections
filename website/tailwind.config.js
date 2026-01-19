/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'display': ['"DM Sans"', 'sans-serif'],
        'body': ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        'cyber-black': '#0a0a0f',
        'cyber-white': '#f0f2f5',
        'cyber-gray': {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        'cyber-green': '#00ff41',
        'cyber-green-light': '#33ff66',
        'cyber-green-dark': '#00cc34',
      },
      backgroundColor: {
        'glass': 'rgba(15, 17, 21, 0.8)',
        'glass-light': 'rgba(52, 58, 64, 0.5)',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 255, 65, 0.4)',
        'glow-green-lg': '0 0 40px rgba(0, 255, 65, 0.6)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'conic-spin': 'conic-spin 3s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'parallax': 'parallax 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 65, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 65, 0.8)' },
        },
        'conic-spin': {
          '0%': { '--tw-rotate': '0deg' },
          '100%': { '--tw-rotate': '360deg' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        parallax: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(20px)' },
        },
      },
      borderRadius: {
        'glass': '16px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}