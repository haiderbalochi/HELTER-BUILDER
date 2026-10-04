/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#040405',
          950: '#030304',
          900: '#060608',
          880: '#0A0A0C',
          850: '#0D0D10',
          800: '#111115',
          750: '#16161B',
          700: '#1B1B21',
          600: '#26262E',
        },
        bone: {
          DEFAULT: '#F0EEE7',
          soft: '#CBC8BF',
          mute: '#918F88',
          faint: '#5F5D58',
        },
        accent: {
          DEFAULT: '#C8FF4D',
          bright: '#DAFF7A',
          dim: '#9BD42F',
          deep: '#6E9B17',
        },
      },
      fontFamily: {
        display: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        tighter2: '-0.03em',
        wider2: '0.16em',
        widest2: '0.3em',
        wide3: '0.42em',
      },
      lineHeight: {
        tightest: '0.82',
        tightest2: '0.88',
        display2: '0.9',
      },
      maxWidth: {
        shell: '96rem',
        prose2: '46ch',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-rev': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        caret: {
          '0%,45%': { opacity: '1' },
          '50%,100%': { opacity: '0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.9' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'infinite-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
      animation: {
        marquee: 'marquee 34s linear infinite',
        'marquee-fast': 'marquee 22s linear infinite',
        'marquee-rev': 'marquee-rev 40s linear infinite',
        caret: 'caret 1s steps(1) infinite',
        'pulse-soft': 'pulse-soft 3.4s ease-in-out infinite',
        'spin-slow': 'spin-slow 22s linear infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        'infinite-y': 'infinite-y 6s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quint': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
