/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#004A8E',
        secondary: '#F98D50',
      },
      padding: {
        page: '0 2rem',
      },
      margin: {
        'page-vertical': '64px 0'
      },
      boxShadow: {
        login: '0px 0px 10px #DDDDDD'
      }
    },
  },
  plugins: [],
}