import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#090909',
        foreground: '#ffffff',
        card: {
          DEFAULT: '#141414',
          foreground: '#ffffff',
        },
        popover: {
          DEFAULT: '#141414',
          foreground: '#ffffff',
        },
        primary: {
          DEFAULT: '#ffb400',
          foreground: '#090909',
          50: '#fff7e0',
          100: '#ffefb3',
          200: '#ffe786',
          300: '#ffdf59',
          400: '#ffb400',
          500: '#e6a200',
          600: '#cc9000',
          700: '#b37e00',
          800: '#996c00',
          900: '#805a00',
        },
        secondary: {
          DEFAULT: '#ff6a00',
          foreground: '#090909',
          50: '#fff0e6',
          100: '#ffd9bf',
          200: '#ffc299',
          300: '#ffab73',
          400: '#ff6a00',
          500: '#e65f00',
          600: '#cc5500',
          700: '#b34a00',
          800: '#994000',
          900: '#803500',
        },
        muted: {
          DEFAULT: '#1a1a1a',
          foreground: '#bdbdbd',
        },
        accent: {
          DEFAULT: '#ffb400',
          foreground: '#090909',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#22c55e',
          foreground: '#090909',
        },
        warning: {
          DEFAULT: '#f59e0b',
          foreground: '#090909',
        },
        border: '#2a2a2a',
        input: '#1a1a1a',
        ring: '#ffb400',
        chart: {
          1: '#ffb400',
          2: '#ff6a00',
          3: '#ffdf59',
          4: '#ffab73',
          5: '#cc9000',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-display)'],
      },
      fontSize: {
        'display-xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-lg': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-md': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        glow: '0 0 40px rgba(255, 180, 0, 0.3)',
        'glow-sm': '0 0 20px rgba(255, 180, 0, 0.2)',
        'glow-lg': '0 0 60px rgba(255, 180, 0, 0.4)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-premium': 'linear-gradient(135deg, #ffb400 0%, #ff6a00 100%)',
        'gradient-dark': 'linear-gradient(180deg, #090909 0%, #141414 100%)',
        'gradient-card': 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(255, 180, 0, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'slide-left': 'slide-left 0.5s ease-out',
        'slide-right': 'slide-right 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 180, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 180, 0, 0.6)' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          from: { transform: 'translateY(-20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-left': {
          from: { transform: 'translateX(20px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-right': {
          from: { transform: 'translateX(-20px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
