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
        coverground: "var(--coverground)",
        hoverground: "var(--hoverground)",
        topcovercolor: "var(--topcovercolor)",
      },
      keyframes: {
        moving: {
          "0%": { transform: "translate(-50%, -50%)" },
          "50%": { transform: "translate(-50%, -60%)" },
          "100%": { transform: "translate(-50%, -50%)" },
        },
        expand: {
          "0%": { top: "-50%" },
          "100%": { top: "0" },
        },
      },
      animation: {
        moving: "moving 5s ease-in-out infinite",
        expand: "expand .8s ease-in-out",
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
