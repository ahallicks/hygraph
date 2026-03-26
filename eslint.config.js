import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import { configs as tsLintConfigs } from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const config = [
	{
		ignores: [
			'node_modules/*',
			'.next/*',
			'out/**',
			'build/**',
			'.husky/*',
			'generators/*',
			'**/infrastructure',
			'**/public',
			'!**/.prettierrc.js',
			'src/stories/**/*',
			'**/coverage/**/*',
			'.react-router/*',
		],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
	},
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
	},
	{
		plugins: {
			js: pluginJs,
			react: pluginReact,
		},
	},
	...tsLintConfigs.recommended,
	...compat.extends(
		'plugin:jsx-a11y/recommended',
		'plugin:react-hooks/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
	),
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
				...globals.google,
			},

			ecmaVersion: 8,
			sourceType: 'module',
		},

		settings: {
			'react': {
				version: 'detect',
			},
			'import/resolver': {
				typescript: {
					project: './tsconfig.json',
				},
			},
		},

		rules: {
			'react/no-unescaped-entities': 0,
			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
			'jsx-a11y/no-onchange': 'off',
			'jsx-a11y/alt-text': 'off',
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/explicit-function-return-type': [
				'warn',
				{
					allowExpressions: true,
					allowConciseArrowFunctionExpressionsStartingWithVoid: true,
				},
			],

			'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
			'eqeqeq': ['error', 'always'],
			'import/extensions': [
				'error',
				'ignorePackages',
				{
					ts: 'always',
					tsx: 'always',
					checkTypeImports: true,
				},
			],
			'react-hooks/set-state-in-effect': 'off',
			'react-hooks/immutability': 'warn',
			'no-multiple-empty-lines': [
				'error',
				{ max: 1, maxBOF: 0, maxEOF: 1 },
			],
			'sort-imports': [
				'error',
				{
					ignoreCase: false,
					ignoreDeclarationSort: true,
					ignoreMemberSort: false,
					memberSyntaxSortOrder: [
						'none',
						'all',
						'multiple',
						'single',
					],
					allowSeparatedGroups: true,
				},
			],
			'import/no-unresolved': 'error',
		},
	},
];

export default config;
