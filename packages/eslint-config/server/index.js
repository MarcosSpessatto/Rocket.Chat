module.exports = {
	plugins: ['@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	env: {
		node: true,
	},
	parserOptions: {
		project: true,
	},
	ignorePatterns: ['**/dist', '**/coverage'],
	rules: {
		'new-cap': 'off',
		'@typescript-eslint/explicit-function-return-type': 'warn',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'no-useless-constructor': 'off',
		'@typescript-eslint/no-useless-constructor': 'error',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
			},
		],
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'variableLike',
				format: ['camelCase'],

				leadingUnderscore: 'allow',
			},
			{
				selector: 'variable',
				types: ['boolean'],
				format: ['PascalCase'],
				prefix: ['is', 'should', 'has', 'can', 'did', 'will', 'are'],
			},
			{
				selector: 'variable',
				format: ['camelCase', 'UPPER_CASE'],

				leadingUnderscore: 'allow',
			},
			{
				selector: ['interface'],
				format: ['PascalCase'],
				custom: {
					regex: '^I[A-Z]',
					match: true,
				},
			},
		],
	},
};
