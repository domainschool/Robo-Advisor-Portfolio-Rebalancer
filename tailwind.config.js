/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'surface-base': '#FEFCE8',
        'surface-raised': '#FFFFFF',
        'surface-recessed': '#F4F0DA',
        'brand-pink': '#FF1493',
        'brand-violet': '#7B2CBF',
        'brand-cyan': '#00F0FF',
        'signal-safe': '#00FF66',
        'signal-warning': '#FFE600',
        'signal-breach': '#FF3333',
        'signal-info': '#D946EF',
        'text-primary': '#000000',
        'text-secondary': '#1E1E1E',
        'text-inverse': '#FFFFFF',
        'text-muted': '#4B5563',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'hard-sm': '2px 2px 0px 0px #000000',
        'hard': '4px 4px 0px 0px #000000',
        'hard-hover': '6px 6px 0px 0px #000000',
        'hard-lg': '8px 8px 0px 0px #000000',
        'hard-pink': '4px 4px 0px 0px #FF1493',
        'hard-lime': '4px 4px 0px 0px #00FF66',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
