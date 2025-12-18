/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Professional dark theme
        background: '#0B0F14',
        surface: '#111827',
        'surface-hover': '#1a2332',
        border: '#1F2937',
        'border-hover': '#374151',
        'text-primary': '#E5E7EB',
        'text-secondary': '#9CA3AF',
        accent: '#3B82F6',
        'accent-hover': '#2563EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
