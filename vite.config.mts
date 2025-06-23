import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import {defineConfig} from "vite"
import {viteSingleFile} from "vite-plugin-singlefile"

export default defineConfig({

    plugins: [react(), tailwindcss(), viteSingleFile()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        host: "0.0.0.0",
        port: 8080,
    },

    build: {
        target: "es2015",
        lib: {
            entry: 'src/main.tsx',
            name: 'GRLWidget',
            formats: ['iife'],
            fileName: 'my-widget.js'
        },
        rollupOptions: {
            output: {
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