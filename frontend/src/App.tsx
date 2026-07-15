import './App.css'
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { ModeToggle } from './components/mode-toggle'
import { ThemeProvider } from "./components/theme-provider"
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "./components/ui/sheet";

import { Menu, User } from "lucide-react";
export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <header className="bg-[var(--header)] text-white border-b border-border flex items-center px-6 py-4 overflow-x-auto">
          <div className="flex flex-1 items-center gap-15">
            <h1 className="text-xl font-bold">Cinephile</h1>

            {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-5 min-w-0">
                <NavLink to="/" className={({ isActive }) => 
                  `rounded-lg px-3 py-1 transition-colors duration-300
                  ${isActive 
                    ? "border border-primary bg-[var(--nav-active)] text-black hover:bg-[var(--nav-active)]"
                    : "border border-transparent text-[var(--nav-text)] hover:border-border hover:bg-[var(--nav-active)] hover:text-black"
                    }`}>
                  Home
                </NavLink>
                <NavLink to="/search" className={({ isActive }) => 
                  `rounded-lg px-3 py-1 transition-colors duration-300 
                  ${isActive 
                    ? "border border-primary bg-[var(--nav-active)] text-black hover:bg-[var(--nav-active)]" 
                    : "border border-transparent text-[var(--nav-text)] hover:border-border hover:bg-[var(--nav-active)] hover:text-black"}`}>
                  Search
                </NavLink>
                <NavLink to="/watchlist" className={({ isActive }) => 
                  `rounded-lg px-3 py-1 transition-colors duration-300 
                  ${isActive 
                    ? "border border-primary bg-[var(--nav-active)] text-black hover:bg-[var(--nav-active)]" 
                    : "border border-transparent text-[var(--nav-text)] hover:border-border hover:bg-[var(--nav-active)] hover:text-black"}`}>
                  Watchlist
                </NavLink>
              </nav>
          </div>

          <div className="flex items-center gap-3">
          <NavLink to="/profile" className="hidden md:flex items-center gap-2 rounded-lg px-3 py-1 border border-primary bg-[var(--nav-active)] text-black hover:bg-[var(--nav-active)] whitespace-nowrap">
            <User className="h-5 w-5 bg-gray-300 rounded-full" />
              Profile
          </NavLink>

           {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger>
                <button className="md:hidden rounded-md p-2">
                    <Menu className="h-6 w-6 text-white" />
                  </button>
                </SheetTrigger>

            <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Cinephile</SheetTitle>
                  </SheetHeader>

                  <nav className="mt-6 flex flex-col gap-2">
                    <SheetClose>
                      <NavLink to="/" className={({ isActive }) => 
                  isActive 
                    ? "text--[var(--foreground)] decoration-1 underline" 
                    : "text-[#726E69] hover:text-[var(--foreground)]"}>
                  Home
                </NavLink>
                    </SheetClose>

                    <SheetClose>
                      <NavLink to="/search" className={({ isActive }) => 
                  isActive 
                    ? "text-[var(--foreground)] decoration-1 underline" 
                    : "text-[#726E69] hover:text-[var(--foreground)]"}>
                  Search
                </NavLink>
                    </SheetClose>

                    <SheetClose>
                      <NavLink to="/watchlist" className={({ isActive }) => 
                      isActive 
                    ? "text-[var(--foreground)] decoration-1 underline" 
                    : "text-[#726E69] hover:text-[var(--foreground)]"}>
                  Watchlist
                </NavLink>
                    </SheetClose>

                    <SheetClose>
                      <NavLink
                        to="/profile" className={({ isActive }) => 
                      isActive 
                    ? "text-[var(--foreground)] decoration-1 underline" 
                    : "text-[#726E69] hover:text-[var(--foreground)]"}>
                        Profile
                      </NavLink>
                    </SheetClose>
                  </nav>
                </SheetContent>
              </Sheet>
            {/* Light Dark Mode Toggle */}
            <ModeToggle />
          </div>
        </header>

        <main>
            <Routes>
              <Route path = "/" element={<Dashboard />} />
              <Route path = "/search" element={<Search />} />
              <Route path = "/watchlist" element={<Watchlist />} />
              <Route path = "/profile" element={<Profile />} />
            </Routes>
        </main>
      </Router>
    </ThemeProvider>
  )
}
