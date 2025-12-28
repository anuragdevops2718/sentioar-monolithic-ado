import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response)
  ));
});

describe("App", () => {
  it("renders Get Started button", async () => {
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /get started/i })
      ).toBeInTheDocument();
    });
  });
});