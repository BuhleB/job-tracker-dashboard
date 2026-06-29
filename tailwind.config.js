/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0B0B10",
        surface: "#15151D",
        surfaceHover: "#1B1B26",
        border: "#24242E",
        ink: "#F2F2F5",
        muted: "#9090A0",
        accent: {
          DEFAULT: "#6D5EF5",
          soft: "#8B7CF6",
        },
        status: {
          applied: "#6B7280",
          interviewing: "#6D5EF5",
          offer: "#8B5CF6",
          accepted: "#10B981",
          rejected: "#F43F5E",
          withdrawn: "#52525B",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
