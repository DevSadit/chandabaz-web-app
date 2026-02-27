/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edf7f1',
          100: '#d0eedc',
          200: '#a1ddbf',
          300: '#6cc99f',
          400: '#38b47e',
          500: '#099e5e',
          600: '#016738',
          700: '#015530',
          800: '#014124',
          900: '#022f1a',
          950: '#011a0d',
        },
      },
      fontFamily: {
        sans: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0,0,0,0.05), 0 2px 8px -2px rgba(0,0,0,0.02)',
        'card-hover': '0 20px 40px -8px rgba(1,103,56,0.12), 0 10px 20px -4px rgba(1,103,56,0.06)',
        'glass': '0 8px 32px 0 rgba(0,0,0,0.04)',
        'glow': '0 0 0 4px rgba(1,103,56,0.15)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255,255,255,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-left': 'slideLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { transform: 'translateY(30px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        slideLeft: { from: { transform: 'translateX(30px)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-15px)' } },
        blob: { '0%': { transform: 'translate(0px, 0px) scale(1)' }, '33%': { transform: 'translate(30px, -50px) scale(1.1)' }, '66%': { transform: 'translate(-20px, 20px) scale(0.9)' }, '100%': { transform: 'translate(0px, 0px) scale(1)' } },
      },
    },
  },
  plugins: [],
};
