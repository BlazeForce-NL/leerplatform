/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      fontSize: {
        'game-sm':  ['0.8125rem', { lineHeight: '1.25rem' }], // 13px — labels, hints
        'game-md':  ['1.0625rem', { lineHeight: '1.5rem'  }], // 17px — body, feedback
        'game-lg':  ['1.75rem',   { lineHeight: '2rem'    }], // 28px — antwoord-knoppen
        'game-xl':  ['2.625rem',  { lineHeight: '1'       }], // 42px — som-label
      },

      // ── Spacing scale (8px grid) ─────────────────────────────────────────────
      spacing: {
        '4.5': '1.125rem', // 18px — gap tussen antwoord-knoppen
        '13':  '3.25rem',  // 52px — hoogte grote knoppen
        '18':  '4.5rem',   // 72px — avatar-grootte
      },

      // ── Brand colours ────────────────────────────────────────────────────────
      colors: {
        brand: {
          blue:      '#4488FF', // optellen, primaire acties   — WCAG AA ✓ op wit
          red:       '#FF4040', // aftrekken                   — WCAG AA ✓ op wit
          orange:    '#FF9933', // tafels                      — gebruik enkel op donker bg
          yellow:    '#FFD700', // sterren / beloningen
          green:     '#44CC44', // mix
          darkgreen: '#228822', // "alles mix"                 — WCAG AA ✓ op wit
          purple:    '#9944CC', // plus/min mix                — WCAG AA ✓ op wit
          error:     '#CC0000', // foutmeldingen               — WCAG AA ✓ (6.2:1)
          // Level-status kleuren
          mastered:  '#16a34a', // groen — beheerst
          active:    '#2563eb', // blauw — actief niveau
        },
        answer: {
          correct:        '#d4f0c0',
          'correct-bd':   '#39a017',
          'correct-text': '#1a5c00',
          wrong:          '#fde0e0',
          'wrong-bd':     '#cc2222',
          'wrong-text':   '#8b0000',
        },
        // Level-kaart statussen
        level: {
          locked:   '#e5e7eb', // gray-200
          unlocked: '#dbeafe', // blue-100
          active:   '#bfdbfe', // blue-200
          mastered: '#bbf7d0', // green-200
        },
      },

      // ── Backgrounds ──────────────────────────────────────────────────────────
      backgroundImage: {
        'game-bg': 'linear-gradient(160deg, #fff8e1 0%, #e3f0ff 100%)',
        'level-bg': 'linear-gradient(160deg, #f0fdf4 0%, #eff6ff 100%)',
      },

      // ── Borders ──────────────────────────────────────────────────────────────
      borderWidth: {
        '3': '3px',
      },
      borderRadius: {
        'game': '20px', // kaarthoeken in het spel
      },

      // ── Touch targets (WCAG 2.5.5 — minimaal 44×44px) ───────────────────────
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },

      // ── Animaties ────────────────────────────────────────────────────────────
      keyframes: {
        'pop-in': {
          '0%':   { transform: 'scale(0.6)', opacity: '0' },
          '70%':  { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        'badge-shine': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
      },
      animation: {
        'pop-in':      'pop-in 0.35s cubic-bezier(.175,.885,.32,1.275) both',
        'badge-shine': 'badge-shine 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
