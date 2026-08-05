import { useState, useEffect, type ReactNode } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  LogOut,
  User as UserIcon,
  Award,
  Film,
  Bookmark,
  PenSquare,
  Clock,
  Clapperboard,
  Calendar,
  Flame,
  Star,
  Lock,
  Check,
} from "lucide-react";
import { useAuth } from "../lib/use-auth";
import { getMyProfile, getMyStats, getAchievements, type UserProfile, type ProfileStats, type Achievement } from "../lib/profile";
import { Button } from "../components/ui/button";

const GENRE_COLORS = ["bg-gold", "bg-sapphire", "bg-emerald", "bg-bronze", "bg-silver"];

function activityIcon(type: string) {
  if (type === "achievement") return <Award className="size-4" />;
  if (type === "reviewed") return <PenSquare className="size-4" />;
  return <Check className="size-4" />;
}

export default function Profile() {
  const { logout } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getMyProfile(), getMyStats(), getAchievements()])
      .then(([profileData, statsData, achievementsData]) => {
        setProfile(profileData);
        setStats(statsData);
        setAchievements(achievementsData);
      })
      .catch(() => setError("Couldn't load your profile."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="px-5 py-6 text-sm text-muted-foreground">Loading...</div>;
  }

  if (error || !profile || !stats) {
    return <div className="px-5 py-6 text-sm text-gold">{error ?? "Something went wrong."}</div>;
  }

  const pointsIntoLevel = profile.points - profile.pointsForCurrentLevel;
  const pointsSpanToNext = profile.pointsForNextLevel != null
    ? profile.pointsForNextLevel - profile.pointsForCurrentLevel
    : null;
  const levelProgressPct = pointsSpanToNext ? Math.min(100, (pointsIntoLevel / pointsSpanToNext) * 100) : 100;
  const pointsRemaining = profile.pointsForNextLevel != null ? profile.pointsForNextLevel - profile.points : null;

  const earnedCount = achievements.filter((a) => a.earned).length;
  const favoriteGenres = stats.genreBreakdown.slice(0, 3).map((g) => g.genre);

  return (
    <div className="mx-auto max-w-5xl px-5 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-full bg-muted">
            <UserIcon className="size-8 text-muted-foreground" />
          </span>
          <div>
            <h1 className="text-xl font-bold">{profile.displayName || profile.username}</h1>
            {favoriteGenres.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Favorite genres:</span>
                {favoriteGenres.map((g) => (
                  <span key={g} className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="size-4" /> Log out
          </Button>
        </div>
      </div>

      {/* Level progression */}
      <h2 className="mb-3 text-xl font-bold">Level Progression</h2>
      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex shrink-0 flex-col items-center justify-center rounded-lg border border-border px-4 py-2">
            <Award className="size-5 text-gold" />
            <span className="text-xs font-semibold">Level {profile.levelId}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{profile.levelName}</span>
              <span className="text-muted-foreground">
                {pointsRemaining != null ? `${pointsRemaining} XP to ${profile.nextLevelName}` : "Max level reached"}
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gold" style={{ width: `${levelProgressPct}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {profile.points} XP{profile.pointsForNextLevel != null ? ` / ${profile.pointsForNextLevel} XP` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <h2 className="mb-3 text-xl font-bold">Your Stats</h2>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<Film className="size-4" />} value={stats.filmsWatched} label="Films watched" />
        <StatCard icon={<Bookmark className="size-4" />} value={stats.inWatchlist} label="In watchlist" />
        <StatCard icon={<PenSquare className="size-4" />} value={stats.reviewsWritten} label="Reviews written" />
        <StatCard icon={<Clock className="size-4" />} value={`${stats.hoursWatched}h`} label="Hours watched" />
        <StatCard icon={<Clapperboard className="size-4" />} value={stats.favoriteGenre ?? "—"} label="Favorite genre" />
        <StatCard icon={<Calendar className="size-4" />} value={stats.watchedThisYear} label="Watched this year" />
        <StatCard icon={<Flame className="size-4" />} value={`${stats.currentStreak}d`} label="Current streak" />
        <StatCard
          icon={<Star className="size-4" />}
          value={stats.averageRating != null ? stats.averageRating.toFixed(1) : "—"}
          label="Average rating"
        />
      </div>

      {/* Achievements */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold">Achievements</h2>
        <span className="text-sm text-muted-foreground">{earnedCount} of {achievements.length} unlocked</span>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {achievements.map((a) => (
          <div key={a.code} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <span className={`flex size-8 items-center justify-center rounded-full ${a.earned ? "bg-gold/15 text-gold" : "bg-muted text-muted-foreground"}`}>
                {a.earned ? <Award className="size-4" /> : <Lock className="size-3.5" />}
              </span>
              {a.earned && <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold">UNLOCKED</span>}
            </div>
            <p className="text-sm font-semibold">{a.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{a.details}</p>
            {!a.earned && (
              <div className="mt-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${Math.min(100, (a.currentProgress / a.targetProgress) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{a.currentProgress} / {a.targetProgress}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <div>
          <h2 className="mb-3 text-xl font-bold">Recent Activity</h2>
          <div className="rounded-xl border border-border bg-card p-4">
            {stats.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {stats.recentActivity.map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        {activityIcon(item.type)}
                      </span>
                      <span className="text-sm">{item.description}</span>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Genre breakdown */}
        <div>
          <h2 className="mb-3 text-xl font-bold">Genre Breakdown</h2>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 text-xs text-muted-foreground">The genres you watch the most</p>
            {stats.genreBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">Log a few movies to see your breakdown.</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {stats.genreBreakdown.map((g, i) => (
                  <div key={g.genre} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-sm">{g.genre}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${GENRE_COLORS[i % GENRE_COLORS.length]}`}
                        style={{ width: `${g.percentage}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">{g.percentage}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: ReactNode; value: string | number; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3.5">
      <span className="mb-2 flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </span>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
