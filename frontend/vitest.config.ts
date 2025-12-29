import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/setupTests.ts",
		coverage: {
			provider: "v8", // ✅ fastest
			reporter: ["text", "html", "lcov"],
			reportsDirectory: "./coverage",
			exclude: ["node_modules/", "src/main.tsx", "src/vite-env.d.ts"],
		},
	},
});
