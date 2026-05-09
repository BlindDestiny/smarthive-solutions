import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: { DEFAULT:'#d4af37', light:'#e8c84a', dark:'#b8960a' },
      },
      animation: {
        marquee:  'marquee 30s linear infinite',
        marquee2: 'marquee2 30s linear infinite',
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
