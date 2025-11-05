import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FiltersBar } from "@/components/leads/FiltersBar";

// Mock next/navigation
const mockReplace = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => mockSearchParams,
}));

describe("FiltersBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call router.replace on search", async () => {
    render(<FiltersBar />);

    // Wait for client-side hydration
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
    });

    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled();
    });
  });

  it("should call router.replace on clear", async () => {
    render(<FiltersBar />);

    // Wait for client-side hydration
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
    });

    const clearButton = screen.getByRole("button", { name: /clear/i });
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
  });
});
