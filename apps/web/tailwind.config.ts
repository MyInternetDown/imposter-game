import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0D1B1E",
        mist: "#E8F3F1",
        neon: "#A6FFCB",
        coral: "#FF8A5B",
        ocean: "#0C5C75",
      },
    },
  },
  plugins: [],
};

export default config;

