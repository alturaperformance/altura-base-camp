import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060D1A',
          900: '#0B1427',
          800: '#111E35',
          700: '#162338',
          600: '#1A2B42',
          500: '#203350',
        },
        brand: {
          blue: '#2563EB',
          teal: '#14B8A6',
          orange: '#F97316',
        },
        // Update 04 design system
        app: {
          bg: '#111328',
          card: '#181b30',
          inner: '#1e2240',
          nav: '#141628',
          border: '#2a2d45',
          blue: '#0F5AC2',
          teal: '#5DCAA5',
          'blue-light': '#378ADD',
          amber: '#EF9F27',
          red: '#E24B4A',
          orange: '#F1410B',
          purple: '#7F77DD',
          'text-primary': '#e8eaf6',
          'text-secondary': '#9ca0bc',
          'text-muted': '#5a5f80',
          'text-dim': '#3a3f60',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'header-gradient': 'linear-gradient(180deg, #1E3A5F 0%, #0B1427 100%)',
      },
    },
  },
  plugins: [],
}

export default config
