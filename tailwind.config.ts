import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-geist)', 'sans-serif'],
      },
      colors: {
        background: '#f8f7f5',
        foreground: '#2c2c2c',
        accent: '#d4a574',
        'accent-dark': '#b8935f',
        muted: '#e8e5dd',
      },
      spacing: {
        gutter: '2rem',
      },
    },
  },
  plugins: [],
}

export default config
