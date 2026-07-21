import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-emerald-950/95 backdrop-blur border-b border-emerald-800/50 text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-white group">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:bg-emerald-500 transition">
            🪵
          </div>
          <span>Timber<span className="text-emerald-400">Calc</span>-Pro</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              isActive('/')
                ? 'bg-emerald-800/80 text-white font-semibold shadow-inner'
                : 'text-emerald-200/90 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            Calculator
          </Link>
          <Link
            to="/convert"
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              isActive('/convert')
                ? 'bg-emerald-800/80 text-white font-semibold shadow-inner'
                : 'text-emerald-200/90 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            Converter
          </Link>
          <Link
            to="/history"
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              isActive('/history')
                ? 'bg-emerald-800/80 text-white font-semibold shadow-inner'
                : 'text-emerald-200/90 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            History
          </Link>
        </nav>

        {/* User Status / Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-white">{user?.name}</span>
                <span className="text-[10px] text-emerald-300 capitalize">{user?.role || 'Customer'}</span>
              </div>
              <button
                onClick={logout}
                className="bg-emerald-900/80 hover:bg-rose-900/80 text-emerald-200 hover:text-white border border-emerald-700/60 hover:border-rose-700/60 px-3 py-1.5 rounded-xl text-xs font-medium transition shadow-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-medium text-emerald-200 hover:text-white px-2.5 py-1.5 rounded-xl transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-medium shadow-md transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
