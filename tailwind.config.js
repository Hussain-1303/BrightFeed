module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Make sure this is correct for your file paths
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Primary brand blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Secondary Accent Colors
        accent: {
          50: '#fef7f7',
          100: '#fef2f2',
          200: '#fde8e8',
          300: '#fbd5d5',
          400: '#f8b4b4',
          500: '#ef4444', // Changed from pink to a more sophisticated red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Semantic Colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Category-specific colors (improved)
        category: {
          art: {
            light: '#a855f7',    // purple-500
            dark: '#c084fc',     // purple-400
            border: '#7c3aed',   // purple-600
          },
          tech: {
            light: '#3b82f6',    // blue-500
            dark: '#60a5fa',     // blue-400
            border: '#2563eb',   // blue-600
          },
          science: {
            light: '#10b981',    // emerald-500
            dark: '#34d399',     // emerald-400
            border: '#059669',   // emerald-600
          },
          world: {
            light: '#f59e0b',    // amber-500
            dark: '#fbbf24',     // amber-400
            border: '#d97706',   // amber-600
          },
          gaming: {
            light: '#ef4444',    // red-500
            dark: '#f87171',     // red-400
            border: '#dc2626',   // red-600
          },
          sport: {
            light: '#f97316',    // orange-500
            dark: '#fb923c',     // orange-400
            border: '#ea580c',   // orange-600
          },
          business: {
            light: '#6366f1',    // indigo-500
            dark: '#818cf8',     // indigo-400
            border: '#4f46e5',   // indigo-600
          },
        },
        // Enhanced neutrals for better contrast
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
    },
  },
  plugins: [],
};
