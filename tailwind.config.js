/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oil: {
          dark: '#0E2F25',
          forest: '#153E32',
          green: '#1B4D3E',
          light: '#2A6B57',
          mint: '#E8F5E9',
          gold: '#E5A93C',
          goldLight: '#FEF9E7',
          surface: '#F4F7F5',
          card: '#FFFFFF'
        },
        dueRed: '#D32F2F',
        paidGreen: '#2E7D32'
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'system-ui',
          'Roboto',
          'sans-serif'
        ]
      },
      boxShadow: {
        'ios': '0 2px 10px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
        'ios-lg': '0 10px 25px rgba(14, 47, 37, 0.12), 0 4px 10px rgba(0, 0, 0, 0.06)',
        'ios-sheet': '0 -8px 30px rgba(0, 0, 0, 0.15)'
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top, 47px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 34px)',
        'safe-left': 'env(safe-area-inset-left, 0px)',
        'safe-right': 'env(safe-area-inset-right, 0px)',
      }
    },
  },
  plugins: [],
}
