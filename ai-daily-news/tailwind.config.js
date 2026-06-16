/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Poppins"', "ui-sans-serif", "system-ui", "sans-serif"],
        body: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eafaf7",
          100: "#cdf2ea",
          200: "#9ee5d6",
          300: "#66d2bd",
          400: "#33bfa3",
          500: "#14a589",
          600: "#0c856f",
          700: "#0d6a5a",
          800: "#0f5449",
          900: "#0f463d",
        },
        coral: {
          400: "#ff7a6b",
          500: "#ff5a47",
          600: "#ec3b27",
        },
        ink: "#172321",
      },
      boxShadow: {
        card: "0 6px 24px -8px rgba(15, 70, 61, 0.18)",
        cardHover: "0 16px 40px -12px rgba(15, 70, 61, 0.30)",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
      },
      animation: {
        floaty: "floaty 5s ease-in-out infinite",
        pulseRing: "pulseRing 1.4s ease-out infinite",
      },
    },
  },
  plugins: [],
};
