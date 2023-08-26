import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      dodgerBlue: '#38B6FF',
      codGray: {
        500: '#121212',
        400: '#1A1A1A',
      },
      white: '#FFFFFF',
    },
  },
  plugins: [],
}

export default config
