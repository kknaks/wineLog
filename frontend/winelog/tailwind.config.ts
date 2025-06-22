import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
        coustard: ['var(--font-coustard)'],
        roboto: ['var(--font-roboto)'],
        'rhodium-libre': ['var(--font-rhodium-libre)'],
      },
    },
  },
  plugins: [],
}

export default config 