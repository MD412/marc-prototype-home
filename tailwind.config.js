/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        googie: {
          teal: '#2CA69A',
          orange: '#F25C28',
          yellow: '#F8D34D',
          pink: '#FF8DA1',
          cream: '#FDF6E3',
          dark: '#0C1D25',
          metal: '#C1C1C1',
          glow: 'rgba(255,255,255,0.25)',
        },
      },
      boxShadow: {
        googie: '0 6px 12px rgba(255,255,255,0.25)',
        'googie-inner': 'inset 0 2px 4px rgba(0,0,0,0.25)',
        'googie-card': '0 8px 24px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.1)',
        'googie-button': '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 2px rgba(255,255,255,0.2)',
      },
      fontFamily: {
        retro: ['var(--font-orbitron)'],
      },
      borderRadius: {
        'googie': '999px',
        'googie-card': '24px',
      },
      keyframes: {
        'googie-glow': {
          '0%, 100%': { boxShadow: '0 0 12px rgba(248,211,77,0)' },
          '50%': { boxShadow: '0 0 12px rgba(248,211,77,0.5)' },
        },
        'googie-float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-4px) rotate(1deg)' },
        }
      },
      animation: {
        'googie-glow': 'googie-glow 2s ease-in-out infinite',
        'googie-float': 'googie-float 3s ease-in-out infinite',
      },
      backgroundImage: {
        'googie-gradient': 'linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))',
      }
    },
  },
  plugins: [],
} 