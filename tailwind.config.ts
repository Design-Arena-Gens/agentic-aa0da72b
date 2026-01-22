import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./styles/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "./*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f3f3ff",
          100: "#d9daff",
          200: "#b5b6ff",
          300: "#8d8fff",
          400: "#6a6bff",
          500: "#4444ff",
          600: "#2b2be6",
          700: "#1f21b4",
          800: "#16187f",
          900: "#0c0d4d"
        }
      }
    }
  },
  plugins: []
};

export default config;
