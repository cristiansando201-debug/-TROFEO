import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        outfit: ['var(--font-outfit)', 'Outfit', 'system-ui', 'sans-serif'],
        space: ['var(--font-space)', 'Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#f59e0b',
          light: '#fcd34d',
          deep: '#d97706',
        },
        surface: {
          0: '#020205',
          1: '#0a0a0f',
          2: '#111118',
          3: '#16161f',
          4: '#1c1c28',
        },
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 6s ease infinite',
        'orbit': 'orbit 20s linear infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 12px rgba(245,158,11,0.4)' },
          '50%': { boxShadow: '0 0 28px rgba(245,158,11,0.8), 0 0 60px rgba(245,158,11,0.2)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        orbit: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #fcd34d, #f59e0b, #d97706)',
        'hero-grid': `linear-gradient(rgba(245,158,11,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(245,158,11,0.04) 1px, transparent 1px)`,
      },
    },
  },
  plugins: [],
}

export default config
