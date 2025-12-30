import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		reporters: ["default", "junit"],
		outputFile: {
			junit: "./test-results/junit.xml",
		},
		coverage: {
			provider: "v8", // ✅ fastest
			reporter: ["text", "html", "lcov", "cobertura"],
			reportsDirectory: "./coverage",
			exclude: ["node_modules/", "src/main.tsx", "src/vite-env.d.ts"],
		},
	},
});
