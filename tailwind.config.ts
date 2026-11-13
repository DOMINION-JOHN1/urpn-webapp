import type { Config } from 'tailwindcss';

/**
 * URPN design tokens.
 *
 * Charcoal canvas, royal purple for actions and progress, gold for editorial
 * accents and achievements. Flat surfaces, one-pixel lines, no decorative
 * gradients. Legacy token names (ink/cream/gold/royal/bronze) remain aliases so
 * older components inherit the palette automatically.
 */
const token = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

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
        canvas: {
          DEFAULT: token('--canvas'),
          deep: token('--canvas-deep'),
          raised: token('--canvas-raised'),
        },
        surface: {
          DEFAULT: token('--surface'),
          raised: token('--surface-raised'),
          soft: token('--surface-soft'),
        },
        line: {
          DEFAULT: token('--line'),
          soft: token('--line-soft'),
          strong: token('--line-strong'),
        },
        accent: {
          DEFAULT: token('--accent'),
          hover: token('--accent-hover'),
          strong: token('--accent-strong'),
          'strong-hover': token('--accent-strong-hover'),
          soft: token('--accent-soft'),
          ink: token('--accent-ink'),
          50: '#FAF5EE',
          100: '#F5E9DC',
          200: '#EBCFB8',
          300: '#DFB091',
          400: '#D08F6B',
          500: '#BA6D47',
          600: '#9E5432',
          700: '#7E3E22',
          800: '#622E17',
          900: '#482010',
          950: '#260F06',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F5F0E8',
          200: '#EAE1D2',
          300: '#DBD0BD',
          400: '#C7B79E',
          500: '#AC9A7D',
          600: '#8C7B60',
          700: '#6C5E48',
          800: '#4D4233',
          900: '#322B21',
          950: '#1B1711',
        },
        gold: {
          50: '#FBF6E9',
          100: '#F5EACD',
          200: token('--gold-200'),
          300: token('--gold-300'),
          400: token('--gold-400'),
          500: token('--gold-500'),
          600: token('--gold-600'),
          700: '#7E5E2C',
          800: '#5E451F',
          900: '#3E2E14',
          950: '#22180A',
        },
        /* Legacy aliases */
        ink: {
          950: token('--ink-950'),
          900: token('--ink-900'),
          850: token('--ink-850'),
          800: token('--ink-800'),
          700: token('--ink-700'),
          600: token('--ink-600'),
        },
        cream: {
          50: token('--cream-50'),
          100: token('--cream-100'),
          200: token('--cream-200'),
          300: token('--cream-300'),
          400: token('--cream-400'),
          500: token('--cream-500'),
          600: token('--cream-600'),
        },
        royal: {
          950: '#140A2E',
          900: '#1B0E3D',
          800: '#261456',
          700: '#331B73',
          600: '#43259B',
          500: '#B05BA8',
          400: '#C894CB',
          300: '#DDB8DF',
          200: '#EEDBF0',
        },
        bronze: {
          950: '#0B0A0C',
          900: '#121013',
          800: '#171419',
          700: '#1D1921',
          600: '#2B2631',
          500: '#4E4653',
          400: '#7A727F',
          300: '#A79FA9',
          200: '#CFC8D1',
          100: '#E8E3E9',
        },
        church: {
          50: '#F6F3F0',
          100: '#EAE5E1',
          200: '#D3CCD4',
          300: '#A79FA9',
          400: '#807884',
          500: '#5E5762',
          600: '#3B3442',
          700: '#2B2631',
          800: '#161419',
          900: '#0D0C0F',
          950: '#09080B',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        cinzel: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        luxe: '0.2em',
        tightest: '-0.045em',
      },
      maxWidth: {
        page: '1120px',
        prose: '68ch',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-gold': '0 0 0 1px rgba(216,181,111,0.16)',
        'glow-gold-lg': '0 8px 30px -14px rgba(216,181,111,0.4)',
        'glow-royal': '0 0 0 1px rgba(176,91,168,0.22)',
        elevate: '0 18px 40px -28px rgba(0,0,0,0.9)',
        'ring-gold': '0 0 0 1px rgba(216,181,111,0.35)',
        card: '0 1px 0 rgba(255,255,255,0.03) inset',
      },
      backgroundImage: {
        'gold-sheen': 'linear-gradient(110deg, #D8B56F 0%, #D8B56F 100%)',
        'accent-sheen': 'linear-gradient(110deg, #6A1557 0%, #6A1557 100%)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        shimmer: 'shimmer 7s linear infinite',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [
    function ({ addVariant }: { addVariant: (name: string, definition: string) => void }) {
      addVariant('light', 'html.light &');
    },
  ],
};
export default config;
