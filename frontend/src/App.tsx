import './App.css'
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { ModeToggle } from './components/mode-toggle'
import { ThemeProvider } from "./components/theme-provider"
import { AuthProvider, useAuth } from "./lib/auth-context"
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "./components/ui/sheet";

import { Clapperboard, Menu, User } from "lucide-react";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

function AppContent() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>

      {!isAuthPage && (
      <header className="relative z-10 mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-destructive text-destructive-foreground">
              <Clapperboard className="size-4.5" />
            </span>
            <span className="font-heading text-xl font-semibold">Cinephile</span>
          </div>





          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center gap-5 min-w-0 ml-12">
              <NavLink to="/" className={({ isActive }) =>
                `rounded-lg px-3 py-1 transition-colors duration-300
                ${isActive
                  ? "border bg-[var(--nav-active)] text-black hover:bg-[var(--nav-active)]"
                  : "border border-transparent text-[var(--nav-text)] hover:border-border hover:bg-[var(--nav-active)] hover:text-black"
                  }`}>
                Home
              </NavLink>
              <NavLink to="/search" className={({ isActive }) =>
                `rounded-lg px-3 py-1 transition-colors duration-300 
                ${isActive
                  ? "border bg-[var(--nav-active)] text-black hover:bg-[var(--nav-active)]"
                  : "border border-transparent text-[var(--nav-text)] hover:border-border hover:bg-[var(--nav-active)] hover:text-black"}`}>
                Search
              </NavLink>
              <NavLink to="/watchlist" className={({ isActive }) =>
                `rounded-lg px-3 py-1 transition-colors duration-300 
                ${isActive
                  ? "border bg-[var(--nav-active)] text-black hover:bg-[var(--nav-active)]"
                  : "border border-transparent text-[var(--nav-text)] hover:border-border hover:bg-[var(--nav-active)] hover:text-black"}`}>
                Watchlist
              </NavLink>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <NavLink to="/profile" className="hidden md:flex items-center gap-2 rounded-lg px-3 py-1 border bg-[var(--nav-active)] text-black hover:bg-[var(--nav-active)] whitespace-nowrap">
                <User className="h-5 w-5 bg-gray-300 rounded-full" />
                {user.displayName ?? user.username}
              </NavLink>
            </>
          ) }

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger>
              <button className="md:hidden rounded-md p-2">
                <Menu className="h-6 w-6 text-[var(--foreground)]" />
              </button>
            </SheetTrigger>

            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Cinephile</SheetTitle>
              </SheetHeader>

              <nav className="mt-6 flex flex-col gap-2">
                {user && (
                  <>
                    <SheetClose>
                      <NavLink to="/" className={({ isActive }) =>
                        isActive
                          ? "text--[var(--foreground)] decoration-1 underline"
                          : "text-[var(--nav-text)] hover:text-[var(--foreground)]"}>
                        Home
                      </NavLink>
                    </SheetClose>

                    <SheetClose>
                      <NavLink to="/search" className={({ isActive }) =>
                        isActive
                          ? "text-[var(--foreground)] decoration-1 underline"
                          : "text-[var(--nav-text)] hover:text-[var(--foreground)]"}>
                        Search
                      </NavLink>
                    </SheetClose>

                    <SheetClose>
                      <NavLink to="/watchlist" className={({ isActive }) =>
                        isActive
                          ? "text-[var(--foreground)] decoration-1 underline"
                          : "text-[var(--nav-text)] hover:text-[var(--foreground)]"}>
                        Watchlist
                      </NavLink>
                    </SheetClose>

                    <SheetClose>
                      <NavLink
                        to="/profile" className={({ isActive }) =>
                          isActive
                            ? "text-[var(--foreground)] decoration-1 underline"
                            : "text-[var(--nav-text)] hover:text-[var(--foreground)]"}>
                        Profile
                      </NavLink>
                    </SheetClose>
                  </>
                ) 
                }
              </nav>
            </SheetContent>
          </Sheet>
          {/* Light Dark Mode Toggle */}
          <ModeToggle />
        </div>
      </header>
      )}

      <main>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  )
}
