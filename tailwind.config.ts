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
        300: '#212121',
        200: '#262626',
        100: '#2C2C2C',
      },
      white: '#FFFFFF',
    },
  },
  plugins: [],
}

export default config
