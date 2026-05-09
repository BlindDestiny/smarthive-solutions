import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          green:  '#00a651',
          yellow: '#FFD700',
          red:    '#cc0000',
        },
      },
      animation: {
        marquee:  'marquee 28s linear infinite',
        marquee2: 'marquee2 28s linear infinite',
      },
      keyframes: {
        marquee:  { '0%': { transform:'translateX(0%)' },   '100%': { transform:'translateX(-50%)' } },
        marquee2: { '0%': { transform:'translateX(-50%)' }, '100%': { transform:'translateX(0%)' } },
      },
    },
  },
  plugins: [],
}
export default config
