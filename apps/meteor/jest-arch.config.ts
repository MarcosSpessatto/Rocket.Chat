export default {
	preset: 'ts-jest',
	errorOnDeprecated: true,
	modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/tests/shared'],
	testMatch: ['<rootDir>/tests/architecture/**/*.spec.ts'],
	transform: {
		'^.+\\.(t|j)s?$': '@swc/jest',
	},
	setupFilesAfterEnv: ['<rootDir>/jest-server.setup.ts'],
};
