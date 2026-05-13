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
