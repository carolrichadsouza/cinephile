import { useState, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Award, Film, Bookmark, PenSquare, Clock, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { apiFetch } from "../lib/api";
import { getMyProfile, getMyStats, getAchievements, type UserProfile, type ProfileStats, type Achievement } from "../lib/profile";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../components/ui/carousel";

type MovieSearchResult = {
    tmdbId: number;
    title: string;
    posterUrl: string | null;
    releaseDate: string | null;
    genres: string[];
    overview: string | null;
};

function getTrending() {
    return apiFetch<MovieSearchResult[]>("/movies/trending", { auth: true });
}

function getRecommendations() {
    return apiFetch<MovieSearchResult[]>("/movies/recommended", { auth: true });
}

function greeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

export default function Dashboard() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<ProfileStats | null>(null);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [recommendations, setRecommendations] = useState<MovieSearchResult[]>([]);
    const [trending, setTrending] = useState<MovieSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([getMyProfile(), getMyStats(), getAchievements(), getTrending(), getRecommendations()])
        .then(([profileData, statsData, achievementsData, trendingData, recommendationsData]) => {
        setProfile(profileData);
        setStats(statsData);
        setAchievements(achievementsData);
        setTrending(trendingData);
        setRecommendations(recommendationsData);
    })
    .catch(() => {
        // Non-fatal per-section - page still renders with whatever loaded.
    })
    .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return <div className="px-5 py-6 text-sm text-muted-foreground">Loading...</div>;
    }

    if (!profile || !stats) {
        return <div className="px-5 py-6 text-sm text-destructive">Couldn't load your dashboard.</div>;
    }

    const pointsIntoLevel = profile.points - profile.pointsForCurrentLevel;
    const pointsSpanToNext = profile.pointsForNextLevel != null
        ? profile.pointsForNextLevel - profile.pointsForCurrentLevel
         : null;
    const levelProgressPct = pointsSpanToNext ? Math.min(100, (pointsIntoLevel / pointsSpanToNext) * 100) : 100;

    const latestBadge = achievements
        .filter((a) => a.earned && a.earnedAt)
        .sort((a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime())[0];

    return (
        <div className="mx-auto px-5 py-6">
            {/* Greeting + level + streak + latest badge */}
            <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
                <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-lg text-muted-foreground">{greeting()},</p>
                <h1 className="text-3xl font-bold">{profile.displayName || profile.username}</h1>
                <div className="mt-3 flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border font-bold">
                        {profile.levelId}
                    </span>
                    <div className="flex-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium">{profile.levelName}</span>
                            <span className="text-muted-foreground">
                                {profile.nextLevelName ? `Level ${profile.levelId + 1}` : "Max level"}
                            </span>
                        </div>
                        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-destructive" style={{ width: `${levelProgressPct}%` }} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {profile.points}
                            {profile.pointsForNextLevel != null && ` / ${profile.pointsForNextLevel}`} XP
                            {profile.pointsForNextLevel != null && ` · ${profile.pointsForNextLevel - profile.points} XP to next level`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex min-w-40 flex-col justify-center rounded-xl border border-border bg-card p-5">
                <span className="text-xs text-muted-foreground">Current streak</span>
                <span className="mt-1 flex items-center gap-1.5 text-2xl font-bold">
                    <Flame className="size-5 text-streak" /> {profile.currentStreak} days
                </span>
            </div>

            <div className="flex min-w-48 flex-col justify-center rounded-xl border border-border bg-card p-5">
                <span className="text-xs text-muted-foreground">Latest badge</span>
                {latestBadge ? (
                <>
                    <span className="mt-1 flex items-center gap-1.5 text-lg font-bold">
                        <Award className="size-5 text-gold" /> {latestBadge.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{latestBadge.details}</span>
                </>
                ) : (
                    <span className="mt-1 text-sm text-muted-foreground">None yet! Log a movie to start earning badges.</span>
                )}
            </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={<Film className="size-4" />} value={stats.filmsWatched} label="Films watched" />
            <StatCard icon={<Bookmark className="size-4" />} value={stats.inWatchlist} label="In watchlist" />
            <StatCard icon={<PenSquare className="size-4" />} value={stats.reviewsWritten} label="Reviews written" />
            <StatCard icon={<Clock className="size-4" />} value={`${stats.hoursWatched}h`} label="Hours watched" />
        </div>

        {/* Recommended for you */}
        <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">Recommended for you</h2>

            {recommendations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    Log a few movies and we'll start tailoring picks to you.
                </p>
            ) : (
            <Carousel
                opts={{align: "start",}}
                className="w-full"
            >
                <CarouselContent>
                    {recommendations.map((movie) => (
                        <CarouselItem
                            key={movie.tmdbId}
                            className="basis-[220px] sm:basis-[260px] lg:basis-[280px]">
                                <Link to={`/movies/${movie.tmdbId}`} className="block overflow-hidden rounded-lg border border-border bg-card">
                                    <div className="aspect-[2/3] bg-muted">
                                        {movie.posterUrl ? (
                                            <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" loading="lazy"/>
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <Film className="size-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3">
                                        <p className="line-clamp-1 font-semibold">
                                            {movie.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {movie.releaseDate ? movie.releaseDate.slice(0, 4) : "—"} 
                                            {movie.genres.length > 0 && ` · ${movie.genres[0]}`}
                                        </p>
                                    </div>
                                </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 h-10 w-10 rounded-full bg-background">
                    <ChevronLeft className="h-5 w-5" />
                </CarouselPrevious>

                <CarouselNext className="right-2 h-10 w-10 rounded-full bg-background">
                    <ChevronRight className="h-5 w-5" />
                </CarouselNext>
            </Carousel>
            )}
        </div>

        {/* Trending this week */}
        <div className="mb-3 flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold">Trending this week</h2>
                <p className="text-sm text-muted-foreground">What the community is loving right now</p>
            </div>
        </div>
        {trending.length === 0 ? (
            <p className="text-sm text-muted-foreground">Couldn't load trending movies right now.</p>
        ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {trending.slice(0, 12).map((movie) => (
                    <Link key={movie.tmdbId} to={`/movies/${movie.tmdbId}`} className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg">
                        <div className="aspect-[2/3] w-full bg-muted">
                            {movie.posterUrl ? (
                            <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" loading="lazy" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Film className="size-8 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="p-2">
                            <p className="line-clamp-1 text-sm font-medium">{movie.title}</p>
                            <p className="text-xs text-muted-foreground">
                                {movie.releaseDate ? movie.releaseDate.slice(0, 4) : "—"}
                                {movie.genres.length > 0 ? ` · ${movie.genres[0]}` : ""}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        )}
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