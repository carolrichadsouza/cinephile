import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CommunityReviews from "../CommunityReviews";
import { getMovieReviews } from "../../lib/reviews";

vi.mock("../../lib/reviews", () => ({
  getMovieReviews: vi.fn(),
}));

const reviews = [1, 2, 3].map((i) => ({
  username: `user${i}`,
  displayName: i === 1 ? "Testing" : null,
  rating: 4,
  review: `Review ${i}`,
  watchedDate: "2026-08-01",
}));

describe("CommunityReviews", () => {
  it("shows loading, preview reviews and all-reviews dialog", async () => {
    vi.mocked(getMovieReviews).mockResolvedValue(reviews);
    render(<CommunityReviews tmdbId={1} />);
    expect(screen.getByText("Loading reviews...")).toBeInTheDocument();
    await screen.findByText("3 reviews");
    expect(screen.getByText("Review 1")).toBeInTheDocument();
    expect(screen.getByText("Review 2")).toBeInTheDocument();
    expect(screen.queryByText("Review 3")).not.toBeInTheDocument();
    await userEvent.click(screen.getByText("See all"));
    expect(await screen.findByText("Community Reviews")).toBeInTheDocument();
    expect(screen.getByText("Review 3")).toBeInTheDocument();
  });
  
  it("shows an empty state on empty/error", async () => {
    vi.mocked(getMovieReviews).mockRejectedValue(new Error());
    render(<CommunityReviews tmdbId={2} />);
    await waitFor(() =>
      expect(screen.getByText("No reviews yet.")).toBeInTheDocument()
    );
  });
});
