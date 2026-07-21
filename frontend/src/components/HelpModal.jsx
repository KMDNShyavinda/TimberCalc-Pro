export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 relative text-gray-900 dark:text-gray-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold p-1 rounded-lg transition"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            📖 Forestry Formulas & Input Guide
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Understanding timber calculation formulas and mixed unit inputs in TimberCalc-Pro.
          </p>
        </div>

        {/* Section 1: Standard Cylinder vs Hoppus */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
            📐 1. Calculation Formulas Explained
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4 space-y-2">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                Standard Cylinder Formula
              </span>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Computes exact geometric volume using:
              </p>
              <code className="block bg-emerald-100 dark:bg-emerald-900/60 p-2 rounded text-[11px] font-mono text-emerald-900 dark:text-emerald-200">
                Volume = π × (Diameter / 2)² × Length
              </code>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Best for precision engineering and exact log volume measurement.
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 space-y-2">
              <span className="font-bold text-amber-800 dark:text-amber-300 block">
                Hoppus (Quarter-Girth) Formula
              </span>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Traditional timber trade standard:
              </p>
              <code className="block bg-amber-100 dark:bg-amber-900/60 p-2 rounded text-[11px] font-mono text-amber-900 dark:text-amber-200">
                Volume = (Girth / 4)² × Length
              </code>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Allows ~21.5% deduction to account for square plank sawing waste in commercial forestry.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Smart Mixed Unit Inputs */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
            💡 2. Smart Mixed-Unit Input Cheat Sheet
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            You can type free-text measurements directly into input fields without manual conversions:
          </p>

          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 overflow-x-auto text-xs space-y-2 font-mono">
            <div className="grid grid-cols-2 gap-2 border-b border-gray-200 dark:border-gray-800 pb-1.5 font-bold text-gray-700 dark:text-gray-300">
              <span>Input Format Example</span>
              <span>Parsed Value</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-emerald-600 dark:text-emerald-400">
              <span>"5ft 8in" or "5' 8""</span>
              <span>5.67 Feet / 68 Inches</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-emerald-600 dark:text-emerald-400">
              <span>"3m 45cm"</span>
              <span>3.45 Meters / 345 cm</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-emerald-600 dark:text-emerald-400">
              <span>"42in" or "42.5in"</span>
              <span>42.5 Inches</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-emerald-600 dark:text-emerald-400">
              <span>"12.5ft"</span>
              <span>12.5 Feet</span>
            </div>
          </div>
        </div>

        {/* Section 3: Saw Kerf & Milling Waste */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
            ⚙️ 3. Milling Kerf & Bark Waste
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            In the <strong>Milling Yield Estimator</strong>, Saw Kerf Loss (typically 10-15%) represents wood turned to sawdust by saw blades, while Bark/Slab waste (typically 12-20%) accounts for outer rounding cuts.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-md"
        >
          Close Help Guide
        </button>
      </div>
    </div>
  )
}
