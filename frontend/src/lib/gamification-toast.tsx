import { toast } from "sonner";
import { Trophy, Sparkles } from "lucide-react";

export type GamificationFeedback = {
  pointsAwarded: number;
  leveledUp: boolean;
  newLevelName: string | null;
  unlockedAchievements: { code: string; name: string; details: string | null; points: number }[];
};

export function showGamificationToasts(feedback: GamificationFeedback) {
  for (const achievement of feedback.unlockedAchievements) {
    toast(`Achievement unlocked: ${achievement.name}`, {
        description: achievement.details ?? undefined,
        duration: 3500,
        icon: (
          <Trophy className="size-4 text-[var(--streak)]" />
        ),
        style: {
          background: "var(--card)",
          color: "var(--card-foreground)",
          border: "1px solid var(--streak)",
          borderLeft: "5px solid var(--streak)",
          boxShadow: "0 10px 30px var(--poster-shadow)",
        },
        classNames: {
          title: "font-bold text-[var(--streak)]",
          description: "text-[var(--muted-foreground)]",
        },
    });
  }

  if (feedback.leveledUp && feedback.newLevelName) {
    toast(`Level up! You're now ${feedback.newLevelName}`, {
        duration: 3500,
        icon: (
          <Sparkles className="size-4 text-[var(--level)]" />
        ),
        style: {
          background: "var(--card)",
          color: "var(--card-foreground)",
          border: "1px solid var(--level)",
          borderLeft: "5px solid var(--level)",
          boxShadow: "0 10px 30px var(--poster-shadow)",
        },
        classNames: {
          title: "font-bold text-[var(--level)]",
        },
    });
  }

  if (feedback.pointsAwarded > 0) {
    toast(`+${feedback.pointsAwarded} XP`, {
        duration: 2200,
        style: {
            background: "var(--card)",
            color: "var(--card-foreground)",
            border: "1px solid var(--xp)",
            borderLeft: "5px solid var(--xp)",
            boxShadow: "0 10px 30px var(--poster-shadow)",
        },
        classNames: {
            title: "font-bold text-[var(--xp)]",
        },
    });
  }
}
