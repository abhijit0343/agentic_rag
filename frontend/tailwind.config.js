/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F5F0",
        "paper-tint": "#F1EEE7",
        ink: "#0A0A0A",
        "ink-deep": "#050505",
        "ink-soft": "#1A1A1A",
        "gray-subtle": "#E5E1D8",
        "gray-mid": "#8A8782",
        "gray-dark": "#2B2927",
        "amber-accent": "#C8B27A",
      },
      fontFamily: {
        serif: ["Fraunces", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter Tight", "Geist", "Satoshi", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Geist Mono", "monospace"],
      },
      borderRadius: {
        'sharp': '2px',
        'subtle': '4px',
      },
      boxShadow: {
        'hairline': '0 0 0 1px rgba(10, 10, 10, 0.08)',
        'hairline-dark': '0 0 0 1px rgba(247, 245, 240, 0.12)',
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'editorial': '-0.03em',
        'loose-mono': '0.12em',
      }
    },
  },
  plugins: [],
}
