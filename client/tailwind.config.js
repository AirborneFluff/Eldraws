/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '0.5rem',
        sm: '1rem',
        lg: '2rem',
        xl: '4rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        'blurple': '#5865F2',
        'dimgray': '#2c2f33',
      }
    },
  },
  plugins: [],
}

