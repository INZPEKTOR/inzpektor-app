/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/**/*.ejs",
    "./src/public/**/*.html",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#8bfec3',
        'dark-bg': '#000000',
        'card-bg': '#1a1a1a',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(139, 254, 195, 0.3)',
        'neon-lg': '0 0 30px rgba(139, 254, 195, 0.5)',
      },
    },
  },
  plugins: [],
}

