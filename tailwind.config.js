/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#121212",
        foreground: "#f7eedc",
        primary: "#d4af37",
        "primary-foreground": "#121212",

        secondary: "#262626",
        "secondary-foreground": "#f7eedc",

        accent: "#ffd700",
        "accent-foreground": "#121212",

        muted: "#1f1f1f",
        "muted-foreground": "#bdbdbd",

        border: "#333333",
        input: "#2e2e2e",
        ring: "#d4af37",

        gold: "#d8ad4f",
        card: "#1a1a1a",
        "card-foreground": "#f7eedc"
      },

      fontFamily: {
        sans: ["Inter", ...fontFamily.sans]
      }
    }
  },
  plugins: []
}
