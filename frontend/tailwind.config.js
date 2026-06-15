/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-green': '#00FF88',
        'cyber-bg': '#0A0E1A',
        'cyber-card': '#0F1629',
        'cyber-border': '#1E2D4D',
        'cyber-critical': '#FF4444',
        'cyber-high': '#FF8C00',
        'cyber-medium': '#FFD700',
        'cyber-low': '#00FF88',
        'cyber-blue': '#00BFFF',
        'cyber-purple': '#9B59B6',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0, 255, 136, 0.15)',
        'cyber-strong': '0 0 40px rgba(0, 255, 136, 0.3)',
        'critical': '0 0 20px rgba(255, 68, 68, 0.3)',
        'high': '0 0 20px rgba(255, 140, 0, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        glow: {
          'from': { boxShadow: '0 0 10px rgba(0, 255, 136, 0.2)' },
          'to': { boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)' },
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translateY(-10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
