import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import { showGamificationToasts } from "../gamification-toast";

beforeEach(() => {
  vi.clearAllMocks();
});
vi.mock("sonner", () => ({ toast: vi.fn() }));
describe("showGamificationToasts", () => {
  it("shows achievement, level and XP notifications", () => {
    showGamificationToasts({
      pointsAwarded: 25,
      leveledUp: true,
      newLevelName: "Critic",
      unlockedAchievements: [
        {
          code: "FIRST",
          name: "First Film",
          details: "Logged one",
          points: 10,
        },
      ],
    });
    expect(toast).toHaveBeenCalledTimes(3);
    expect(toast).toHaveBeenCalledWith(
      "Achievement unlocked: First Film",
      expect.any(Object)
    );
    expect(toast).toHaveBeenCalledWith(
      "Level up! You're now Critic",
      expect.any(Object)
    );
    expect(toast).toHaveBeenCalledWith("+25 XP", expect.any(Object));
  });
  it("shows nothing when no feedback was earned", () => {
    showGamificationToasts({
      pointsAwarded: 0,
      leveledUp: false,
      newLevelName: null,
      unlockedAchievements: [],
    });
    expect(toast).not.toHaveBeenCalled();
  });
});
