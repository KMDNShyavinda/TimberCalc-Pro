import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function MillingEstimator() {
  const { t } = useLanguage()

  const [rawVolumeCft, setRawVolumeCft] = useState('100')
  const [purchaseCost, setPurchaseCost] = useState('2500')
  const [kerfLossPct, setKerfLossPct] = useState('12')
  const [barkWastePct, setBarkWastePct] = useState('15')
  const [plankPricePerCft, setPlankPricePerCft] = useState('45.00')

  const [millingResult, setMillingResult] = useState(null)

  const handleCalculateMilling = (e) => {
    e.preventDefault()

    const vol = Math.max(0, parseFloat(rawVolumeCft) || 0)
    const cost = Math.max(0, parseFloat(purchaseCost) || 0)
    const kerfPct = Math.max(0, parseFloat(kerfLossPct) || 0)
    const barkPct = Math.max(0, parseFloat(barkWastePct) || 0)
    const plankPrice = Math.max(0, parseFloat(plankPricePerCft) || 0)

    const totalWastePct = kerfPct + barkPct
    const kerfVolume = (vol * (kerfPct / 100))
    const barkVolume = (vol * (barkPct / 100))
    const totalWasteVolume = kerfVolume + barkVolume
    const netUsableVolume = Math.max(0, vol - totalWasteVolume)

    const grossRevenue = netUsableVolume * plankPrice
    const netProfit = grossRevenue - cost
    const profitMarginPct = cost > 0 ? ((netProfit / cost) * 100) : 0

    setMillingResult({
      rawVolumeCft: vol.toFixed(2),
      purchaseCost: cost.toFixed(2),
      kerfVolumeCft: kerfVolume.toFixed(2),
      barkVolumeCft: barkVolume.toFixed(2),
      totalWasteVolumeCft: totalWasteVolume.toFixed(2),
      totalWastePct: totalWastePct.toFixed(1),
      netUsableVolumeCft: netUsableVolume.toFixed(2),
      grossRevenue: grossRevenue.toFixed(2),
      netProfit: netProfit.toFixed(2),
      profitMarginPct: profitMarginPct.toFixed(1),
      isProfitable: netProfit >= 0,
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 md:p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t('millingTitle')}</h1>
        <p className="text-emerald-100 text-sm md:text-base">
          {t('millingDesc')}
        </p>
      </div>

      {/* Inputs Form */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <form onSubmit={handleCalculateMilling} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Raw Volume */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {t('logVolumeCft')}
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              required
              value={rawVolumeCft}
              onChange={(e) => setRawVolumeCft(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Log Purchase Cost */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {t('logPurchaseCost')}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={purchaseCost}
              onChange={(e) => setPurchaseCost(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Kerf Loss % */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {t('kerfWastePct')}
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="50"
              required
              value={kerfLossPct}
              onChange={(e) => setKerfLossPct(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Bark & Slab Waste % */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {t('barkWastePct')}
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="50"
              required
              value={barkWastePct}
              onChange={(e) => setBarkWastePct(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Plank Sale Price per CFT */}
          <div className="flex flex-col space-y-2 lg:col-span-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {t('plankSalePrice')}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={plankPricePerCft}
              onChange={(e) => setPlankPricePerCft(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="sm:col-span-2 lg:col-span-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-xl transition duration-150 shadow-md cursor-pointer text-sm"
          >
            {t('calculateProfit')}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {millingResult && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-6 md:p-8 shadow-md space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {t('yieldBreakdown')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Usable Lumber */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-5 text-center">
              <span className="text-[11px] uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-bold block mb-1">
                {t('netUsableLumber')}
              </span>
              <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
                {millingResult.netUsableVolumeCft} <span className="text-sm font-semibold">CFT</span>
              </span>
              <span className="block text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                ({(100 - millingResult.totalWastePct).toFixed(1)}% yield)
              </span>
            </div>

            {/* Milling Waste */}
            <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-xl p-5 text-center">
              <span className="text-[11px] uppercase tracking-wider text-rose-800 dark:text-rose-300 font-bold block mb-1">
                {t('totalMillingWaste')}
              </span>
              <span className="text-3xl font-extrabold text-rose-700 dark:text-rose-400">
                {millingResult.totalWasteVolumeCft} <span className="text-sm font-semibold">CFT</span>
              </span>
              <span className="block text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-1">
                ({millingResult.totalWastePct}% waste)
              </span>
            </div>

            {/* Gross Sales */}
            <div className="bg-teal-50/70 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 rounded-xl p-5 text-center">
              <span className="text-[11px] uppercase tracking-wider text-teal-800 dark:text-teal-300 font-bold block mb-1">
                {t('grossRevenue')}
              </span>
              <span className="text-3xl font-extrabold text-teal-700 dark:text-teal-400">
                ${millingResult.grossRevenue}
              </span>
            </div>

            {/* Net Profit Margin */}
            <div
              className={`border rounded-xl p-5 text-center ${
                millingResult.isProfitable
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/40'
                  : 'bg-rose-100/70 dark:bg-rose-950/50 border-rose-200'
              }`}
            >
              <span className="text-[11px] uppercase tracking-wider text-amber-800 dark:text-amber-300 font-bold block mb-1">
                {t('netProfit')}
              </span>
              <span
                className={`text-3xl font-extrabold ${
                  millingResult.isProfitable
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-rose-700 dark:text-rose-400'
                }`}
              >
                ${millingResult.netProfit}
              </span>
              <span className="block text-[11px] font-semibold mt-1">
                ({millingResult.profitMarginPct}% ROI)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
