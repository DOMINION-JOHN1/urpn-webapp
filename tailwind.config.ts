import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Warm near-black canvas — subtle purple/brown undertone */
        ink: {
          950: '#060309',
          900: '#0B0710',
          850: '#100A18',
          800: '#160D21',
          700: '#20142E',
          600: '#2C1C3D',
        },
        /* Deep royal / imperial purple */
        royal: {
          950: '#160727',
          900: '#200A38',
          800: '#2F1150',
          700: '#421A72',
          600: '#57259A',
          500: '#7C3AED',
          400: '#9F6BF0',
          300: '#C1A3F5',
          200: '#DCCBFA',
        },
        /* Warm brown / bronze */
        bronze: {
          950: '#1A0F08',
          900: '#28190E',
          800: '#3B2616',
          700: '#53361F',
          600: '#6E4A2B',
          500: '#8C5E3B',
          400: '#AC7A4F',
          300: '#C89B6F',
          200: '#E4C6A0',
          100: '#F2E2CD',
        },
        /* Refined gold — primary accent */
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FCE59B',
          300: '#FAD65F',
          400: '#F6C13B',
          500: '#EDA51E',
          600: '#D4870F',
          700: '#A9640C',
          800: '#834B10',
          900: '#6A3C12',
          950: '#3C2007',
        },
        /* Warm ivory / cream — text on dark */
        cream: {
          50: '#FFFFFF',
          100: '#FCF8F1',
          200: '#F4EADA',
          300: '#E6D6BF',
          400: '#C9B49A',
          500: '#A38F76',
          600: '#7E6B54',
        },
        /* Legacy neutral kept as a warm charcoal safety net */
        church: {
          50: '#F7F4F0',
          100: '#ECE6DE',
          200: '#D6CCBF',
          300: '#B3A692',
          400: '#8A7C68',
          500: '#5F5343',
          600: '#3F3529',
          700: '#2A2018',
          800: '#160D21',
          900: '#0B0710',
          950: '#060309',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        cinzel: ['var(--font-cinzel)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        luxe: '0.32em',
      },
      boxShadow: {
        'glow-gold': '0 0 30px -6px rgba(237, 165, 30, 0.35)',
        'glow-gold-lg': '0 0 55px -10px rgba(237, 165, 30, 0.45)',
        'glow-royal': '0 0 40px -8px rgba(124, 58, 237, 0.4)',
        elevate: '0 24px 60px -22px rgba(0, 0, 0, 0.8)',
        'ring-gold': '0 0 0 1px rgba(237, 165, 30, 0.25)',
      },
      backgroundImage: {
        'gold-sheen':
          'linear-gradient(110deg, #FDE9A8 0%, #F6C13B 28%, #EDA51E 52%, #D4870F 74%, #FDE9A8 100%)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        shimmer: 'shimmer 7s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
