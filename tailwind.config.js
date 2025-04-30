/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'info': '#17a2b8',
        'success': '#28a745',
        'warning': '#ffc107',
        'danger': '#dc3545',
        'primary': '#007bff',
        'secondary': '#6c757d',
      }
    },
  },
  plugins: [],
}