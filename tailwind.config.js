/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBg: "#0D0D0D",
        lightBg: "#E9E9E9",
      },
      backgroundColor: {
        darkBg: "#0D0D0D",
        lightBg: "#E9E9E9",
      },
    },
  },
  darkMode: "selector",
  plugins: [],
};
