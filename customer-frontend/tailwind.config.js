/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grocer: {
          primary: '#218838',
          dark: '#14532D',
          light: '#28a745',
          bg: '#F7FAF5',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          accent: '#D97706',
          border: '#E2E8F0',
          textDark: '#1F2937',
          textMuted: '#6B7280'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
