import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Rating } from "../ui/rating";
describe("Rating", () => {
  it("renders five stars and numeric value", () => {
    const { container } = render(<Rating rating={3.5} showValue />);
    expect(
      container.querySelectorAll('[data-slot="rating-star-empty"]')
    ).toHaveLength(5);
    expect(screen.getByText("3.5")).toBeInTheDocument();
  });
  it("reports full and half-star clicks when editable", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Rating rating={0} editable onRatingChange={onChange} />
    );
    const stars = container.querySelectorAll('[data-slot="rating-star-empty"]');
    const target = stars[2].parentElement!;
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
      left: 0,
      width: 100,
    } as DOMRect);
    fireEvent.click(target, { clientX: 75 });
    fireEvent.click(target, { clientX: 25 });
    expect(onChange).toHaveBeenNthCalledWith(1, 3);
    expect(onChange).toHaveBeenNthCalledWith(2, 2.5);
  });
});
