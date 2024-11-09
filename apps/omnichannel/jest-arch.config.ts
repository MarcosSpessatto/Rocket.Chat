export default {
	preset: 'ts-jest',
	errorOnDeprecated: true,
	modulePathIgnorePatterns: ['<rootDir>/dist/'],
	testMatch: ['<rootDir>/tests/architecture/**/*.spec.ts'],
	transform: {
		'^.+\\.(t|j)s?$': '@swc/jest',
	},
};
