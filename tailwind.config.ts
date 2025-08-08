import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        fadeLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'ping-card': {
          '75%, 100%': {
            transform: 'scaleX(1.04) scaleY(1.1)',
            opacity: '0'
          }
        },
      },
      animation: {
        'fade-left': 'fadeLeft var(--tw-animation-duration, 200ms) var(--tw-animation-timing-function, ease-in) forwards',
        'ping-card': 'ping-card 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;
