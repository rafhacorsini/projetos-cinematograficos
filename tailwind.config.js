/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#050508',
          800: '#0a0a0f',
          700: '#12121a',
          600: '#1a1a24',
        },
        luxury: {
          silver: '#e2e8f0',
          titanium: '#94a3b8',
          cyan: '#06b6d4',
          cyanGlow: 'rgba(6, 182, 212, 0.4)',
          gold: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Syne', 'Outfit', 'Inter', 'sans-serif'],
        /* Fonte de display do projeto 3. Entra como família nova em vez de
           substituir 'display', que os projetos 1 e 2 já usam — trocar aquela
           mudaria a cara deles junto. */
        clash: ['Clash Grotesk', 'Space Grotesk', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        montecarlo: ['MonteCarlo', 'cursive'],
        syne: ['Syne', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
