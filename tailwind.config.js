/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFB6C1',
          rose: '#FF69B4',
          deepPink: '#FF1493',
          yellow: '#FFF3B0',
          gold: '#FFD700',
          blue: '#A0E7E5',
          sky: '#B4E4FF',
          lavender: '#E8D5C4',
          cream: '#FFFDF9',
          mint: '#D8F3DC',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        handwritten: ['Caveat', 'Dancing Script', 'cursive'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
