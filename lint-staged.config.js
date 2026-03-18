const lintConfig = {
	'*.{js,jsx,ts,tsx,json,md,css,scss}': 'prettier --write',
	'*.{js,jsx,ts,tsx}': 'eslint --fix',
	'*.{css,scss}': 'stylelint --fix',
	'*.{ts,tsx}': () => 'tsc -p tsconfig.json --noEmit',
};

export default lintConfig;
