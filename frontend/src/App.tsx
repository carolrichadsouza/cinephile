import './App.css'
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { ModeToggle } from './components/mode-toggle'
import { ThemeProvider } from "./components/theme-provider"
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import { User } from 'lucide-react';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <header className="bg-[var(--header)] text-white border-b border-border flex items-center px-6 py-4 overflow-x-auto">
          <div className="flex flex-1 items-center gap-15">
            <h1 className="text-xl font-bold">Cinephile</h1>
              <nav className="flex flex-1 items-center min-w-0">
                <NavLink to="/" >Home</NavLink>
                <NavLink to="/search" >Search</NavLink>
                <NavLink to="/watchlist" >Watchlist</NavLink>
              </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="justify-center items-center">
              <NavLink className="flex items-center gap-2 rounded-lg px-3 py-1 border border-primary bg-white text-black hover:bg-white whitespace-nowrap" to="/profile" >
              <User className="h-5 w-5 bg-gray-300 rounded-full" />
              Profile
              </NavLink>
            </div>
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
