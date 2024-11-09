export default {
	preset: 'ts-jest',
	errorOnDeprecated: true,
	modulePathIgnorePatterns: ['<rootDir>/dist/'],
	collectCoverage: true,
	testEnvironment: 'node',
	transform: {
		'^.+\\.(t|j)s?$': ['ts-jest', { isolatedModules: true }],
	},
	setupFilesAfterEnv: ['<rootDir>/jest-server.setup.ts'],
};
