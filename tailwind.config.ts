import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pine: {
          50: "#f4f7fb",
          100: "#e8eef8",
          800: "#1b2a4f",
          900: "#111c34"
        }
      },
      boxShadow: {
        card: "0 12px 28px -14px rgba(17,28,52,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
