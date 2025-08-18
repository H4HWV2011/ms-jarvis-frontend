/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mountain-green': '#2d5a27',
        'appalachian-blue': '#4a7c8c',
        'mountain-gold': '#d4a574'
      }
    },
  },
  plugins: [],
}
