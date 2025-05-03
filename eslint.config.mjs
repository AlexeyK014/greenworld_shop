import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
baseDirectory: __dirname,
})

const eslintConfig = [
...compat.config({
parser: '@typescript-eslint/parser',
plugins: ['@typescript-eslint/eslint-plugin'],
extends: [
'next/core-web-vitals',
'next/typescript',
'prettier',
'eslint:recommended',
],
rules: {
semi: ['error', 'never'],
indent: ['error', 2],
'max-len': ['error', { code: 120 }],
'padded-blocks': ['error', 'never'],
'arrow-body-style': ['error', 'as-needed'],
'keyword-spacing': [2, { before: true, after: true }],
'react/jsx-indent': [2, 2, { indentLogicalExpressions: true }],
'no-trailing-spaces': [2, { skipBlankLines: false }],
'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 1 }],
'object-curly-spacing': ['error', 'always'],
'comma-spacing': [2, { before: false, after: true }],
'arrow-spacing': ['error', { before: true, after: true }],
'space-infix-ops': ['error', { int32Hint: false }],
'space-after-keywords': 'off',
quotes: ['error', 'single'],
'@typescript-eslint/no-unused-vars': 'error',
'@typescript-eslint/no-explicit-any': 'error',
// "prettier/prettier": [
//   "error",
//   {
//     "endOfLine": "auto"
//   }
// ],
'react/self-closing-comp': [
'error',
{
component: true,
html: true,
},
],
'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
},
}),
{
languageOptions: {
globals: {
...globals.browser,
...globals.node,
},
},
},
]

export default eslintConfig
