/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'primary-dull': '#1f58db',
        light: '#f1f5f9',
        borderColor: '#c4c7d2',
      }
    },
  },
  plugins: [],
}