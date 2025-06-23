import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'

//Configures ESLint, your linter.
// -- ESLint uses tsconfig.json to resolve types and paths.
// -- May lint test files (that relate to jest.config.ts).
// -- Often run via a lint script in package.json.

export default tseslint.config({
    ignores: ['dist', 'src/api']
}, {
    // extends: [js.configs.recommended], // Start with recommended rules
    extends: ["prettier"],
    files: ['**/*.{ts,tsx}'],
},)
