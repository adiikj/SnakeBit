/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        arcade: ["Arcade", "sans-serif"],
      },
    },
  },
  plugins: [],
};
