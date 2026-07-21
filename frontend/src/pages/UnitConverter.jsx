export default function UnitConverter() {
  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Universal Unit Converter</h1>
        <p className="text-emerald-100 text-sm">
          Convert length, area, volume, weight, temperature, speed, pressure, and digital units.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-6 shadow-sm">
        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
          The converter engine handles standard multipliers as well as complex scale adjustments (like Temperature). Complete multi-category converter module is currently under development.
        </p>
      </div>
    </div>
  )
}

