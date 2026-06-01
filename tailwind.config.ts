// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F4',
        offwhite: '#F5F2EC',
        sand: '#E8E0D0',
        stone: '#C8BFB0',
        cement: '#9E9589',
        warm: '#6B5E4E',
        charcoal: '#3D3830',
        ink: '#1A1714',
        accent: '#8B7355',
        'accent-dark': '#6B5E4E',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 6vw, 6rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.05' }],
        'display-md': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.1' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.15' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
      },
      maxWidth: {
        '8xl': '90rem',
        '9xl': '100rem',
      },
      letterSpacing: {
        'widest-2': '0.3em',
        'widest-3': '0.4em',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'reveal': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      aspectRatio: {
        'product': '3 / 4',
        'hero': '16 / 9',
        'square': '1 / 1',
      },
      gridTemplateColumns: {
        'product-4': 'repeat(4, 1fr)',
        'product-3': 'repeat(3, 1fr)',
        'sidebar': '240px 1fr',
        'checkout': '1fr 380px',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%': { clipPath: 'inset(100% 0 0 0)' },
          '100%': { clipPath: 'inset(0% 0 0 0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        reveal: 'reveal 1s cubic-bezier(0.76, 0, 0.24, 1) forwards',
      },
    },
  },
  plugins: [],
}

export default config
