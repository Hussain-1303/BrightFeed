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
        // Secondary Accent Colors - Professional green accent
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Professional green for actions
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
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
        // Category-specific colors (enhanced with better accessibility)
        category: {
          art: {
            light: '#8b5cf6',    // violet-500 - more vibrant
            dark: '#a78bfa',     // violet-400
            border: '#7c3aed',   // violet-600
            bg: '#f3f4f6',       // neutral background
            'bg-dark': '#374151', // dark background
          },
          tech: {
            light: '#0ea5e9',    // sky-500 - matches brand
            dark: '#38bdf8',     // sky-400
            border: '#0284c7',   // sky-600
            bg: '#f0f9ff',       // brand-50
            'bg-dark': '#0c4a6e', // brand-900
          },
          science: {
            light: '#059669',    // emerald-600 - deeper for better contrast
            dark: '#10b981',     // emerald-500
            border: '#047857',   // emerald-700
            bg: '#ecfdf5',       // emerald-50
            'bg-dark': '#064e3b', // emerald-900
          },
          world: {
            light: '#d97706',    // amber-600 - better contrast
            dark: '#f59e0b',     // amber-500
            border: '#b45309',   // amber-700
            bg: '#fffbeb',       // amber-50
            'bg-dark': '#78350f', // amber-900
          },
          gaming: {
            light: '#dc2626',    // red-600 - better contrast
            dark: '#ef4444',     // red-500
            border: '#b91c1c',   // red-700
            bg: '#fef2f2',       // red-50
            'bg-dark': '#7f1d1d', // red-900
          },
          sport: {
            light: '#ea580c',    // orange-600 - better contrast
            dark: '#f97316',     // orange-500
            border: '#c2410c',   // orange-700
            bg: '#fff7ed',       // orange-50
            'bg-dark': '#9a3412', // orange-900
          },
          business: {
            light: '#4f46e5',    // indigo-600 - better contrast
            dark: '#6366f1',     // indigo-500
            border: '#4338ca',   // indigo-700
            bg: '#eef2ff',       // indigo-50
            'bg-dark': '#312e81', // indigo-900
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
