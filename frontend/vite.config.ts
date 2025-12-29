import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],

	optimizeDeps: {
		exclude: ["lucide-react"],
	},

	// ✅ Vitest + CI Quality Gate
	test: {
		environment: "jsdom",
		setupFiles: "./src/setupTests.ts",
		globals: true,

		coverage: {
			provider: "v8",
			reporter: ["text", "html", "lcov"],

			// 🎯 CI QUALITY BAR (FAIL BUILD IF BELOW)
			statements: 55,
			branches: 55,
			lines: 55,
			functions: 30,
		},
	},
});
