import type { Config } from "tailwindcss";
import aspect from '@tailwindcss/aspect-ratio';

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        moving: {
          "0%": { transform: "translate(-50%, -50%)" },
          "50%": { transform: "translate(-50%, -60%)" },
          "100%": { transform: "translate(-50%, -50%)" },
        },
      },
      animation: {
        moving: "moving 5s ease-in-out infinite",
      },
    },
    screens: {
      'pc': '980px',
      'mobile': { max: '979px' },
    }
  },
  plugins: [
    aspect,
  ],
} satisfies Config;
