import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-emerald-950 text-emerald-200/80 border-t border-emerald-800/60 py-8 px-4 md:px-8 mt-auto print:hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
          <div className="flex items-center gap-2 font-bold text-white text-lg">
            <span className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center text-xs">🪵</span>
            Timber<span className="text-emerald-400">Calc</span>-Pro
          </div>
          <p className="text-xs text-emerald-300/70 max-w-sm">
            Professional Forestry & Sawmill Timber Calculator with Hoppus, Cylinder, Milling Yield, and Universal Unit Conversion.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-6 text-xs font-medium text-emerald-200/90">
          <Link to="/" className="hover:text-white transition">{t('navCalculator')}</Link>
          <Link to="/milling" className="hover:text-white transition">{t('navMilling')}</Link>
          <Link to="/convert" className="hover:text-white transition">{t('navConverter')}</Link>
          <Link to="/history" className="hover:text-white transition">{t('navHistory')}</Link>
        </div>

        {/* Version & PWA Indicator */}
        <div className="flex flex-col items-center md:items-end text-xs space-y-1">
          <span className="bg-emerald-900/80 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-700/60 font-mono text-[11px]">
            v2.0 PWA Offline-Ready ⚡
          </span>
          <span className="text-[10px] text-emerald-400/60">
            © {new Date().getFullYear()} TimberCalc-Pro. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}
