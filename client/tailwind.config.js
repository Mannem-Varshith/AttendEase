/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Primary Colors
        'modern-indigo': {
          DEFAULT: '#6366F1',
          50: '#EBEFFE',
          100: '#D7DFFD',
          200: '#AFBFF B',
          300: '#879FFA',
          400: '#6366F1',
          500: '#4338CA',
          600: '#3730A3',
          700: '#2B287B',
          800: '#1F2054',
          900: '#13182C',
        },
        'bright-blue': {
          DEFAULT: '#3B82F6',
          50: '#EBF5FF',
          100: '#D6EBFF',
          200: '#ADD7FF',
          300: '#85C3FF',
          400: '#5CAFFF',
          500: '#3B82F6',
          600: '#1D6BD9',
          700: '#1556B8',
          800: '#0E4197',
          900: '#082C76',
        },
        'cyan-highlight': {
          DEFAULT: '#0EA5E9',
          50: '#E6F7FD',
          100: '#CCEFFA',
          200: '#99DFF6',
          300: '#66CEF1',
          400: '#33BEED',
          500: '#0EA5E9',
          600: '#0B8AC5',
          700: '#086FA1',
          800: '#05547D',
          900: '#023959',
        },
        // Secondary Colors
        emerald: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        'vibrant-orange': {
          DEFAULT: '#F97316',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        // Premium Neutrals
        'snow-white': '#F8FAFC',
        'cloud-gray': '#F1F5F9',
        'light-gray': '#E2E8F0',
        'slate-gray': '#94A3B8',
        'slate': '#64748B',
        'dark-slate': '#1E293B',
        'deep-slate': '#0F172A',
        // Status Colors (Premium)
        status: {
          present: '#10B981',
          late: '#F97316',
          halfday: '#F59E0B',
          leave: '#EF4444',
          absent: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display': '4rem',      // 64px
        '5xl': '3rem',         // 48px
        '4xl': '2.5rem',       // 40px
        '3xl': '2rem',         // 32px
        '2xl': '1.75rem',      // 28px
        'xl': '1.5rem',        // 24px
        'lg': '1.25rem',       // 20px
        'base': '1rem',        // 16px
        'sm': '0.875rem',      // 14px
        'xs': '0.75rem',       // 12px
        '2xs': '0.625rem',     // 10px
      },
      borderRadius: {
        'xl': '1rem',          // 16px
        '2xl': '1.5rem',       // 24px
        '3xl': '2rem',         // 32px
        '4xl': '2.5rem',       // 40px
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)',
        'colored-indigo': '0 8px 16px rgba(99, 102, 241, 0.15), 0 4px 6px rgba(99, 102, 241, 0.08)',
        'colored-blue': '0 8px 16px rgba(59, 130, 246, 0.15), 0 4px 6px rgba(59, 130, 246, 0.08)',
        'colored-cyan': '0 8px 16px rgba(14, 165, 233, 0.15), 0 4px 6px rgba(14, 165, 233, 0.08)',
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.3), 0 0 40px rgba(59, 130, 246, 0.2)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(14, 165, 233, 0.2)',
        'strong': '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
        'gradient-accent': 'linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%)',
        'gradient-purple-blue': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
        'gradient-cyan-blue': 'linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'gradient-orange': 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        'gradient-mesh': 'radial-gradient(at 0% 0%, #6366F1 0%, transparent 50%), radial-gradient(at 100% 100%, #0EA5E9 0%, transparent 50%)',
      },
      backdropBlur: {
        'xs': '2px',
        DEFAULT: '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '40px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'bounce-soft': ' bounceSoft 0.5s ease-in-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3), 0 0 40px rgba(59, 130, 246, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      transitionDuration: {
        '0': '0ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
}
