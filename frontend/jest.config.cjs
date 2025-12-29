module.exports = {
	testEnvironment: "jsdom",

	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.jest.json",
			},
		],
	},

	testMatch: ["<rootDir>/src/**/*.(test|spec).tsx"],

	moduleNameMapper: {
		"\\.(css|less|scss)$": "identity-obj-proxy",
	},

	collectCoverage: true,
	collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/main.tsx"],
};
