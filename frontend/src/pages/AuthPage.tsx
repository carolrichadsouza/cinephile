import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ModeToggle } from "../components/mode-toggle";
import { Mail, Lock, User, ArrowRight, Flame, Trophy, Star, type LucideIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../lib/use-auth";
import { ApiError } from "../lib/api";
import { cn } from "../lib/utils";

type Mode = "login" | "register";

const FEATURES: { icon: LucideIcon; label: string; sub: string }[] = [
  { icon: Flame, label: "Streaks", sub: "Stay consistent" },
  { icon: Trophy, label: "Achievements", sub: "Earn badges" },
  { icon: Star, label: "Ratings", sub: "Build your taste" },
];

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<Mode>(location.pathname === "/register" ? "register" : "login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    navigate(next === "login" ? "/login" : "/register", { replace: true });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "register") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.");
        return;
        }
    }

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
        <div className="absolute right-6 top-6 z-20">
            <ModeToggle />
        </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/3 right-0 h-[60rem] w-[60rem] rounded-full bg-primary/25 blur-3xl dark:bg-primary/20" />
        <div className="absolute bottom-0 left-0 h-[40rem] w-[40rem] rounded-full bg-destructive/15 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
      </div>
      

      <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2">
        {/* Marketing copy */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium backdrop-blur">
            <Star className="size-3.5 fill-destructive text-destructive" />
            Your personal film journal
          </span>
          <h1 className="mt-5 text-balance font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Every film you love, beautifully remembered.
          </h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Track what you watch, rate and review films, build watchlists, and
            level up with XP, badges, and viewing streaks.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
                  <f.icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auth card */}
        <div className="w-full max-w-md justify-self-end">
          <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={cn(
                    "rounded-md py-2 text-sm font-medium capitalize transition-colors",
                    mode === m
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {m === "login" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <Field
                  icon={User}
                  label="Username"
                  type="text"
                  placeholder="username"
                  required
                  minLength={3}
                  maxLength={30}
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              )}
              <Field
                icon={Mail}
                label="Email"
                type="email"
                placeholder="name@example.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Field
                icon={Lock}
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                minLength={mode === "register" ? 8 : undefined}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$"
                title="Password must contain uppercase, lowercase, number, special character, and be at least 8 characters"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="mt-2 h-11 w-full bg-destructive text-base text-destructive-foreground hover:bg-destructive/90"
              >
                {isSubmitting
                  ? (mode === "login" ? "Signing in..." : "Creating account...")
                  : (mode === "login" ? "Sign in" : "Create account")}
                <ArrowRight className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  ...props
}: {
  icon: LucideIcon;
  label: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          {...props}
          className="h-11 w-full rounded-lg border border-input bg-background/60 pl-9 pr-3 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/30"
        />
      </div>
    </label>
  );
}
