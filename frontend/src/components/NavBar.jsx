import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import HelpModal from './HelpModal'

export default function NavBar() {
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const { lang, toggleLanguage, t } = useLanguage()

  const [isHelpOpen, setIsHelpOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <>
      <header className="bg-emerald-950/95 backdrop-blur border-b border-emerald-800/50 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg md:text-xl tracking-tight text-white group shrink-0">
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
              {t('navCalculator')}
            </Link>
            <Link
              to="/milling"
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                isActive('/milling')
                  ? 'bg-emerald-800/80 text-white font-semibold shadow-inner'
                  : 'text-emerald-200/90 hover:bg-emerald-900/60 hover:text-white'
              }`}
            >
              {t('navMilling')}
            </Link>
            <Link
              to="/convert"
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                isActive('/convert')
                  ? 'bg-emerald-800/80 text-white font-semibold shadow-inner'
                  : 'text-emerald-200/90 hover:bg-emerald-900/60 hover:text-white'
              }`}
            >
              {t('navConverter')}
            </Link>
            <Link
              to="/history"
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                isActive('/history')
                  ? 'bg-emerald-800/80 text-white font-semibold shadow-inner'
                  : 'text-emerald-200/90 hover:bg-emerald-900/60 hover:text-white'
              }`}
            >
              {t('navHistory')}
            </Link>
          </nav>

          {/* Right Section: Help Guide + Language Switcher + User Auth */}
          <div className="flex items-center gap-2">
            {/* Guide Button */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 shadow-sm"
              title="Open Formula Guide & Mixed Input Cheat-Sheet"
            >
              ❓ Guide
            </button>

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              title="Switch Language (English / සිංහල)"
              className="bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>{lang === 'en' ? '🇬🇧 EN' : '🇱🇰 SI'}</span>
            </button>

            {/* User Auth controls */}
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
                  {t('signOut')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-medium text-emerald-200 hover:text-white px-2.5 py-1.5 rounded-xl transition"
                >
                  {t('signIn')}
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-medium shadow-md transition"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  )
}
