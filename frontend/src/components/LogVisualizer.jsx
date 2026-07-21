export default function LogVisualizer({ diameterInput, lengthInput, species, method, volumeCft }) {
  return (
    <div className="bg-gradient-to-br from-amber-950/80 via-emerald-950/90 to-gray-900 border border-amber-900/40 rounded-2xl p-6 text-white space-y-4 shadow-inner">
      <div className="flex items-center justify-between border-b border-amber-800/40 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-300/90 flex items-center gap-1.5">
          🪵 Live Timber Log Diagram
        </span>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
          {species || 'Timber Log'}
        </span>
      </div>

      {/* SVG Log Illustration */}
      <div className="relative w-full h-44 flex items-center justify-center overflow-hidden rounded-xl bg-gray-950/50 border border-amber-900/30 p-2">
        <svg viewBox="0 0 500 160" className="w-full h-full max-h-40 select-none">
          <defs>
            {/* Log Bark Gradient */}
            <linearGradient id="barkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="50%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#27272a" />
            </linearGradient>

            {/* End Grain Wood Gradient */}
            <radialGradient id="woodRing" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="30%" stopColor="#fde68a" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
          </defs>

          {/* Log Cylinder Body */}
          <path
            d="M 120,30 L 420,30 A 25,50 0 0,1 420,130 L 120,130 A 25,50 0 0,1 120,30 Z"
            fill="url(#barkGrad)"
            stroke="#92400e"
            strokeWidth="2"
          />

          {/* Cylinder Bark Lines / Texture */}
          <line x1="130" y1="50" x2="410" y2="50" stroke="#b45309" strokeWidth="1" strokeDasharray="12 8" opacity="0.4" />
          <line x1="125" y1="80" x2="415" y2="80" stroke="#d97706" strokeWidth="1.5" opacity="0.5" />
          <line x1="130" y1="110" x2="410" y2="110" stroke="#b45309" strokeWidth="1" strokeDasharray="16 6" opacity="0.4" />

          {/* Log Front End-Grain Ellipse */}
          <ellipse cx="120" cy="80" rx="25" ry="50" fill="url(#woodRing)" stroke="#78350f" strokeWidth="3" />
          {/* Annual Rings */}
          <ellipse cx="120" cy="80" rx="18" ry="36" fill="none" stroke="#b45309" strokeWidth="1.5" opacity="0.7" />
          <ellipse cx="120" cy="80" rx="11" ry="22" fill="none" stroke="#92400e" strokeWidth="1.5" opacity="0.8" />
          <ellipse cx="120" cy="80" rx="4" ry="8" fill="#451a03" />

          {/* Dimension Indicators */}
          {/* Length Dimension Line */}
          <line x1="120" y1="145" x2="420" y2="145" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 2" />
          <polygon points="120,145 126,142 126,148" fill="#34d399" />
          <polygon points="420,145 414,142 414,148" fill="#34d399" />
          <text x="270" y="157" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
            Length: {lengthInput || '—'}
          </text>

          {/* Diameter/Girth Dimension Indicator */}
          <line x1="85" y1="30" x2="85" y2="130" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 2" />
          <polygon points="85,30 82,36 88,36" fill="#fbbf24" />
          <polygon points="85,130 82,124 88,124" fill="#fbbf24" />
          <text x="75" y="84" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="end">
            D/G: {diameterInput || '—'}
          </text>

          {/* Method Badge on Log */}
          <rect x="230" y="65" width="120" height="30" rx="6" fill="#064e3b" opacity="0.85" stroke="#059669" strokeWidth="1" />
          <text x="290" y="84" fill="#a7f3d0" fontSize="10" fontWeight="bold" textAnchor="middle">
            {method === 'hoppus' ? 'Hoppus Formula' : 'Cylinder Formula'}
          </text>
        </svg>
      </div>

      <div className="flex items-center justify-between text-xs text-amber-200/80 pt-1">
        <span>Log cross-section & cylinder volume model</span>
        {volumeCft && (
          <span className="font-bold text-emerald-400">
            Calculated: {volumeCft} ft³
          </span>
        )}
      </div>
    </div>
  )
}
