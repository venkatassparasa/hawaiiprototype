/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7', // Primary Blue
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                hawaii: {
                    ocean: '#345B7E', // New Sidebar Blue
                    sand: '#f5f5f5',  // Beige
                    highlight: '#F2E7A1', // Brand Highlight
                    coral: '#ff7f50', // Accent
                    forest: '#228b22', // Green
                    darkascent: '#345B7E', // Dark Ascent
                    secondarybadge: '#6b6faf', // Secondary Badge
                    warmascent: '#e59a7a', // Warm Accent
                },
                status: {
                    success: '#10b981',
                    error: '#ef4444',
                    warning: '#f59e0b',
                    info: '#3b82f6',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
