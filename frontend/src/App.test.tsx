import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

beforeEach(() => {
	const mockFetch = vi.fn(() =>
		Promise.resolve({
			ok: true,
			json: async () => [],
		} as Response),
	);

	vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe("App", () => {
	it("renders Get Started button", async () => {
		render(<App />);

		await waitFor(() => {
			expect(
				screen.getByRole("button", { name: /get started/i }),
			).toBeInTheDocument();
		});
	});

	it("handles API failure gracefully", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		// Override ONLY this test
		const mockedFetch = global.fetch as vi.MockedFunction<typeof fetch>;
		mockedFetch.mockRejectedValueOnce(new Error("API down"));

		render(<App />);

		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalled();
		});

		consoleSpy.mockRestore();
	});
});
