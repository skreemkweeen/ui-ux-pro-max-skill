import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: '#ef4444',
      },
      keyframes: {
        'scroll-line': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
        grain: {
          '0%':  { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
      },
      animation: {
        'scroll-line': 'scroll-line 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        grain: 'grain 0.35s steps(1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
