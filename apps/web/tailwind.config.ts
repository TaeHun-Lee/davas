import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        davas: {
          background: '#EEF1F5',
          surface: '#F5F7FA',
          text: '#252B33',
          muted: '#6E7681',
          primary: '#5B6C89',
          accent: '#8C6A5D',
          gold: '#C6A15B',
        },
      },
      boxShadow: {
        neu: '10px 10px 24px rgba(163,177,198,0.45), -10px -10px 24px rgba(255,255,255,0.9)',
        'neu-inset': 'inset 6px 6px 12px rgba(163,177,198,0.38), inset -6px -6px 12px rgba(255,255,255,0.85)',
      },
    },
  },
  plugins: [],
};

export default config;
