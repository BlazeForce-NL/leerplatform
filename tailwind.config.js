/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      colors: {
        brand: {
          blue:      '#4488FF',
          red:       '#FF4040',
          orange:    '#FF9933',
          yellow:    '#FFD700',
          green:     '#44CC44',
          darkgreen: '#228822',
          purple:    '#9944CC',
          error:     '#CC0000', // WCAG AA: 6.2:1 on white
        },
        answer: {
          correct:    '#d4f0c0',
          'correct-bd':   '#39a017',
          'correct-text': '#1a5c00',
          wrong:      '#fde0e0',
          'wrong-bd':     '#cc2222',
          'wrong-text':   '#8b0000',
        },
      },
      backgroundImage: {
        'game-bg': 'linear-gradient(160deg, #fff8e1 0%, #e3f0ff 100%)',
      },
      borderWidth: {
        '3': '3px',
      },
      minHeight: {
        touch: '44px',
      },
    },
  },
  plugins: [],
}
