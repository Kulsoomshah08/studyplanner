/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        ink: {
          950: '#070b16',
          900: '#0c1224',
          850: '#111831',
          800: '#161e3a',
          750: '#1c2542',
          700: '#232d52',
        },
      },
      boxShadow: {
        soft: '0 2px 12px rgba(59, 130, 246, 0.12)',
        card: '0 4px 24px rgba(0, 0, 0, 0.25)',
        glow: '0 8px 40px rgba(99, 102, 241, 0.18)',
      },
    },
  },
  plugins: [],
};
