import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import "@testing-library/jest-dom";

global.fetch = vi.fn(() =>
	Promise.resolve({
		ok: true,
		status: 200,
		json: async () => [],
	} as Response),
);
