/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', "ui-rounded", "system-ui", "sans-serif"],
        body: ['"Nunito"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        fairy: {
          rose: "#ff9ec7",
          blush: "#ffd6e8",
          lilac: "#c9b6ff",
          sky: "#bfe3ff",
          gold: "#ffd76a",
          mint: "#bff0d8",
          ink: "#3b2a52",
          dark: "#1b1030",
        },
      },
      boxShadow: {
        glow: "0 0 24px rgba(255, 158, 199, 0.65)",
        rune: "0 0 18px rgba(201, 182, 255, 0.85)",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        sparkle: {
          "0%,100%": { opacity: "0.4", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        floaty: "floaty 4s ease-in-out infinite",
        sparkle: "sparkle 1.8s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};
