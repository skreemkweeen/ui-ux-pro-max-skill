/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Satoshi',       'system-ui', 'sans-serif'],
        body:    ['General Sans',  'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#D4A96A',
          light:   '#E2BF8A',
          dim:     'rgba(212,169,106,0.15)',
        },
        depth: {
          0: '#080809',
          1: '#0D0D0F',
          2: '#111113',
          3: '#18181B',
          4: '#1F1F23',
          5: '#27272A',
        },
      },
      spacing: {
        section: 'clamp(5rem, 12vw, 9rem)',
      },
      maxWidth: {
        page: '1440px',
        text: '68ch',
      },
      borderRadius: {
        sm:   '6px',
        md:   '10px',
        lg:   '14px',
        xl:   '20px',
        '2xl': '28px',
      },
      transitionTimingFunction: {
        ui:    'cubic-bezier(0.16, 1, 0.3, 1)',
        enter: 'cubic-bezier(0.0,  0, 0.2, 1)',
        exit:  'cubic-bezier(0.4,  0, 1,   1)',
      },
    },
  },
  plugins: [],
}
