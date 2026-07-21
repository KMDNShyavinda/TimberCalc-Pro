import { useState } from 'react'
import { parseMixedUnit, mixedUnitToCentimeters } from '../utils/parseMixedUnit'
import timberService from '../services/timberService'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { exportToCSV } from '../utils/exportUtils'
import LogVisualizer from '../components/LogVisualizer'

const SPECIES_PRESETS = [
  { name: 'Teak (Premium)', pricePerCft: 45.00 },
  { name: 'Teak (Standard)', pricePerCft: 35.00 },
  { name: 'Mahogany', pricePerCft: 28.50 },
  { name: 'Jak (Jackwood)', pricePerCft: 32.00 },
  { name: 'Oak', pricePerCft: 30.00 },
  { name: 'Pine (Softwood)', pricePerCft: 18.00 },
  { name: 'Eucalyptus', pricePerCft: 15.00 },
  { name: 'Custom / Other', pricePerCft: 0 },
]

const QUICK_LENGTHS = ['8ft', '10ft', '12ft', '14ft', '16ft']
const QUICK_GIRTHS = ['24in', '36in', '42in', '48in', '60in']

export default function TimberCalculator() {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()

  const [diameterInput, setDiameterInput] = useState('42in')
  const [lengthInput, setLengthInput] = useState('12ft')
  const [method, setMethod] = useState('standard_cylinder')
  const [selectedSpecies, setSelectedSpecies] = useState('Teak (Standard)')
  const [customSpeciesName, setCustomSpeciesName] = useState('')
  const [pricePerCft, setPricePerCft] = useState('35.00')
  const [quantity, setQuantity] = useState('1')
  const [saveToHistory, setSaveToHistory] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('')

  const handleSpeciesChange = (e) => {
    const name = e.target.value
    setSelectedSpecies(name)
    const preset = SPECIES_PRESETS.find((s) => s.name === name)
    if (preset && preset.pricePerCft > 0) {
      setPricePerCft(preset.pricePerCft.toFixed(2))
    }
  }

  const handleCalculate = async () => {
    setError('')
    setSavedSuccessMsg('')
    setResult(null)
    setLoading(true)

    try {
      const diameterParsed = parseMixedUnit(diameterInput)
      const lengthParsed = parseMixedUnit(lengthInput)

      const diameterCm = mixedUnitToCentimeters(diameterParsed)
      const lengthCm = mixedUnitToCentimeters(lengthParsed)

      if (!diameterCm || diameterCm <= 0) {
        throw new Error('Please enter a valid diameter/girth (e.g. "42in" or "1m 5cm")')
      }
      if (!lengthCm || lengthCm <= 0) {
        throw new Error('Please enter a valid length (e.g. "12ft" or "3m 45cm")')
      }

      const numQuantity = Math.max(1, parseInt(quantity, 10) || 1)
      const numUnitPrice = Math.max(0, parseFloat(pricePerCft) || 0)

      const speciesName = selectedSpecies === 'Custom / Other'
        ? (customSpeciesName || 'Custom Wood')
        : selectedSpecies

      const payload = {
        log_type: 'cylinder',
        diameter: diameterCm,
        diameter_unit: 'cm',
        length: lengthCm,
        length_unit: 'cm',
        calculation_method: method,
        species: speciesName,
        save: isAuthenticated && saveToHistory,
      }

      const response = isAuthenticated
        ? await timberService.calculate(payload)
        : await timberService.calculateGuest(payload)

      const singleVolumeCft = parseFloat(response.data.volume_cubic_feet)
      const singleVolumeM3 = parseFloat(response.data.volume_cubic_meters)
      const totalVolumeCft = (singleVolumeCft * numQuantity).toFixed(3)
      const totalVolumeM3 = (singleVolumeM3 * numQuantity).toFixed(4)
      const estimatedValue = (parseFloat(totalVolumeCft) * numUnitPrice).toFixed(2)

      setResult({
        diameter: diameterParsed,
        length: lengthParsed,
        quantity: numQuantity,
        unitPrice: numUnitPrice,
        species: speciesName,
        single_volume_cft: singleVolumeCft,
        single_volume_m3: singleVolumeM3,
        total_volume_cft: totalVolumeCft,
        total_volume_m3: totalVolumeM3,
        estimated_value: estimatedValue,
        method: method === 'hoppus' ? 'Hoppus (Quarter Girth)' : 'Standard Cylinder',
      })

      if (isAuthenticated && saveToHistory && response.data.saved_item) {
        setSavedSuccessMsg('Calculation saved to your History database!')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || err.message || 'An error occurred during calculation.')
    } finally {
      setLoading(false)
    }
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  const handleExportCSV = () => {
    if (!result) return
    const exportData = [{
      Species: result.species,
      Method: result.method,
      Quantity: result.quantity,
      Single_Volume_CFT: result.single_volume_cft,
      Total_Volume_CFT: result.total_volume_cft,
      Total_Volume_M3: result.total_volume_m3,
      Unit_Price_Per_CFT: `$${result.unitPrice}`,
      Estimated_Commercial_Value: `$${result.estimated_value}`,
    }]
    exportToCSV('Timber_Calculation_Result', exportData)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 print:p-0 print:max-w-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-6 md:p-8 rounded-2xl shadow-lg print:hidden">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t('calculatorTitle')}</h1>
        <p className="text-emerald-100 text-sm md:text-base">
          {t('calculatorDesc')}
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 print:hidden">
        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calculation Method */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {t('calcMethod')}
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
            >
              <option value="standard_cylinder">{t('stdCylinder')}</option>
              <option value="hoppus">{t('hoppusFormula')}</option>
            </select>
          </div>

          {/* Species Preset */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {t('speciesPreset')}
            </label>
            <select
              value={selectedSpecies}
              onChange={handleSpeciesChange}
              className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
            >
              {SPECIES_PRESETS.map((sp) => (
                <option key={sp.name} value={sp.name}>
                  {sp.name} {sp.pricePerCft > 0 ? `($${sp.pricePerCft}/CFT)` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Custom species name if selected */}
          {selectedSpecies === 'Custom / Other' && (
            <div className="flex flex-col space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Custom Wood Species Name
              </label>
              <input
                type="text"
                value={customSpeciesName}
                onChange={(e) => setCustomSpeciesName(e.target.value)}
                placeholder="Enter custom timber species name"
                className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />
            </div>
          )}

          {/* Diameter/Girth Input + Shortcuts */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {t('diameterGirth')}
            </label>
            <input
              type="text"
              value={diameterInput}
              onChange={(e) => setDiameterInput(e.target.value)}
              placeholder='e.g. 42in, 1m 5cm, or 3&apos;6"'
              className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
            {/* Quick Shortcuts */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Presets:</span>
              {QUICK_GIRTHS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setDiameterInput(g)}
                  className="text-[10px] bg-gray-100 hover:bg-emerald-100 dark:bg-gray-700 dark:hover:bg-emerald-900 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-300 px-2 py-0.5 rounded font-mono transition"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Length Input + Shortcuts */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {t('logLength')}
            </label>
            <input
              type="text"
              value={lengthInput}
              onChange={(e) => setLengthInput(e.target.value)}
              placeholder='e.g. 12ft, 3.5m, or 144in'
              className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
            {/* Quick Shortcuts */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Presets:</span>
              {QUICK_LENGTHS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLengthInput(l)}
                  className="text-[10px] bg-gray-100 hover:bg-emerald-100 dark:bg-gray-700 dark:hover:bg-emerald-900 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-300 px-2 py-0.5 rounded font-mono transition"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Unit Price per CFT */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {t('unitPrice')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-500 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={pricePerCft}
                onChange={(e) => setPricePerCft(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />
            </div>
          </div>

          {/* Log Quantity */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {t('batchQuantity')}
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>
        </div>

        {/* Save to history option for logged in users */}
        {isAuthenticated && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/60">
            <input
              type="checkbox"
              id="saveHistory"
              checked={saveToHistory}
              onChange={(e) => setSaveToHistory(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
            />
            <label htmlFor="saveHistory" className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              {t('saveHistory')}
            </label>
          </div>
        )}

        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl transition duration-150 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 flex justify-center items-center gap-2 cursor-pointer text-sm"
        >
          {loading ? (
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : null}
          {loading ? 'Calculating...' : t('calcBtn')}
        </button>
      </div>

      {/* Log Graphic SVG Diagram Visualizer */}
      <LogVisualizer
        diameterInput={diameterInput}
        lengthInput={lengthInput}
        species={selectedSpecies}
        method={method}
        volumeCft={result?.total_volume_cft}
      />

      {/* Results Display */}
      {result && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-6 md:p-8 shadow-md space-y-6 print:shadow-none print:border-none print:p-0">
          {savedSuccessMsg && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3.5 rounded-xl text-xs font-medium print:hidden">
              {savedSuccessMsg}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              {t('calcResults')}
            </h2>
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handleExportCSV}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1"
              >
                📥 {t('exportCsv')}
              </button>
              <button
                onClick={handlePrintReceipt}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1"
              >
                🖨️ {t('printReceipt')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Volume CFT */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-5 text-center">
              <span className="text-[11px] uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-bold block mb-1">
                {t('totVolCft')}
              </span>
              <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
                {result.total_volume_cft} <span className="text-sm font-semibold">ft³</span>
              </span>
              {result.quantity > 1 && (
                <span className="block text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                  ({result.single_volume_cft} ft³ × {result.quantity} logs)
                </span>
              )}
            </div>

            {/* Total Volume m³ */}
            <div className="bg-teal-50/70 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 rounded-xl p-5 text-center">
              <span className="text-[11px] uppercase tracking-wider text-teal-800 dark:text-teal-300 font-bold block mb-1">
                {t('totVolM3')}
              </span>
              <span className="text-3xl font-extrabold text-teal-700 dark:text-teal-400">
                {result.total_volume_m3} <span className="text-sm font-semibold">m³</span>
              </span>
              {result.quantity > 1 && (
                <span className="block text-[11px] text-teal-600/80 dark:text-teal-400/80 mt-1">
                  ({result.single_volume_m3} m³ × {result.quantity} logs)
                </span>
              )}
            </div>

            {/* Estimated Commercial Value */}
            <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-xl p-5 text-center">
              <span className="text-[11px] uppercase tracking-wider text-amber-800 dark:text-amber-300 font-bold block mb-1">
                {t('estValue')}
              </span>
              <span className="text-3xl font-extrabold text-amber-700 dark:text-amber-400">
                ${result.estimated_value}
              </span>
              <span className="block text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1">
                (${result.unitPrice} / ft³)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
