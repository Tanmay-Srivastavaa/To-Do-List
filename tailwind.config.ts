import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#424530',
          dark: '#353825',
          light: '#53573D',
        },
        sidebar: {
          DEFAULT: '#F1F3EB',
          hover: '#E5E8DD',
          active: '#E1E7D6',
        },
        card: {
          DEFAULT: '#FFFFFF',
        },
        border: {
          subtle: '#E3E6DC',
          sidebar: '#E2E6D8',
        },
        folio: {
          primary: '#1C1F16',
          secondary: '#6B705C',
          muted: '#8E9480',
          canvasLight: '#FAFDF5',
          bannerTaupe: '#5A5E47',
          badgeLabel: '#E8E4DC',
          badgeLabelText: '#4A4D3B',
          greenPrimary: '#3D5A40',
          greenHover: '#2F4732',
          greenSoft: '#4E7D65',
          greenLight: '#E8F1EC',
          coral: '#C9705E',
          coralLight: '#FBECE8',
          lavender: '#8B8A9F',
          lavenderLight: '#EFEFF5',
          flagPriority: '#DC5B43',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

