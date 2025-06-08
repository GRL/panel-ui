// tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    plugins: [],

    theme: {
        extend: {
            keyframes: {
                glow: {
                    '0%, 100%': { background: 'rgba(0, 255, 255, 0.0)' },
                    '50%': { background: 'rgba(0, 255, 255, 0.6)' },
                },
            },
            animation: {
                glow: 'glow 2s ease-in-out infinite',
            },
        },
    },
}
