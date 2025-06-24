import path from "path"
// import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import {defineConfig} from "vite"
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// ESM-compatible imports
// const tailwindcss = (await import('tailwindcss')).default
const tailwindcss = (await import('@tailwindcss/postcss')).default
const autoprefixer = (await import('autoprefixer')).default
const cssnano = (await import('cssnano')).default

export default defineConfig({

    plugins: [cssInjectedByJsPlugin(), react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        host: "0.0.0.0",
        port: 8080,
    },

    css: {
        postcss: {
            plugins: [
                tailwindcss,
                autoprefixer,
                cssnano({
                    preset: ['default', {
                        discardComments: { removeAll: true },
                    }],
                }),
            ],
        }
    },

    define: {
        'process.env.NODE_ENV': JSON.stringify('production')
    },

    build: {
        target: "es2015",
        minify: 'terser',
        cssCodeSplit: false,
        terserOptions: {
            format: {
                comments: false,
            },
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },
        lib: {
            entry: 'src/main.tsx',
            name: 'GRLWidget',
            formats: ['iife'],
            fileName: 'my-widget'
        },
        rollupOptions: {
            output: {
                entryFileNames: 'grl-panel.js',
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM'
                }
            }
        }
    }
})


// output: {
//     filename: "grl-1.0.8.min.js",
//         // filename: "grl-beta.min.js",
//         // filename: "grl.min.js",
//         publicPath: "https://cdn.generalresearch.com/",
//
// plugins: [
//     new BundleTracker({
//         path: ".",
//         filename: "webpack-stats.prod.json",
//     }),
//     new webpack.DefinePlugin({
//         PRODUCTION: JSON.stringify(true),
//     }),

// module.exports = {
//     entry: {
//         "generalresearch": SRC_DIR + "/offerwalls/default.ts",
//     },
//     output: {
//         filename: "grl-1.0.8.min.js",
//         path: DIST_DIR,
//         assetModuleFilename: 'assets/[hash][ext][query]'
//     },
//     resolve: {
//         extensions: [".ts", ".js", ".scss", ".jst", ".html", ".svg"],
//         preferRelative: true,
//         alias: {
//             "Offerwalls": path.join(SRC_DIR, "offerwalls"),
//         }
//     },