/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // League of Legends theme colors
        "lol-card-bg": "var(--lol-card-bg)",
        "lol-card-border": "var(--lol-card-border)",
        "lol-text-primary": "var(--lol-text-primary)",
        "lol-item-bg": "var(--lol-item-bg)",
        "lol-item-border-light": "var(--lol-item-border-light)",
        "lol-item-border": "var(--lol-item-border)",

        // Dank theme colors
        "dank-primary": "var(--dank-primary)",
        "dank-secondary": "var(--dank-secondary)",
        "dank-details": "var(--dank-details)",
        "dank-buttons": "var(--dank-buttons)",
      },
    },
  },
  plugins: [],
};
