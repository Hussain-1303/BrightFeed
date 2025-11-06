# Repository Rules

## Test Framework
targetFramework: Jest

## Build & Dependencies Resolution (Latest)
- **Build Status**: ✅ Successful
- **Tailwind CSS**: v3.4.17 (downgraded from v4 for stability and compatibility)
- **React Version**: 19.0.0
- **PostCSS**: 8.5.3 with autoprefixer 10.4.21
- **Browserslist**: Updated to latest caniuse-lite (v1.0.30001753)
- **Testing Library**: @testing-library/user-event ^14.5.1 (updated from 13.5.0)
- **Build Output**: 103.6 KB gzip (main.js), 6.53 KB (CSS)

## Recent Conflict Resolutions
- Resolved Tailwind v3/v4 incompatibility by reverting to v3.4.17
- Updated @testing-library/user-event for React 19 compatibility
- Cleaned npm cache and reinstalled dependencies
- Updated browserslist database
- All unused imports verified and cleaned

## Color Palette Changes
- Implemented comprehensive color system with brand, accent, success, warning, error, and neutral colors
- Updated all components to use consistent color tokens
- Enhanced accessibility with better contrast ratios
- Added semantic color meanings for better UX