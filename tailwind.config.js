

// tailwind.config.js
// Configures TailwindCSS.
// -- Sets content scanning paths, custom themes, plugins, etc.
// -- Tailwind uses this to tree-shake unused styles in Vite builds.
// -- Must align with where your components and templates are (e.g., src/**/*.{tsx,ts}).
// -- You may need to restart Vite when this changes.

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
