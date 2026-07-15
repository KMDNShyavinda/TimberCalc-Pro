import { useState } from 'react'
import { parseMixedUnit } from '../utils/parseMixedUnit'

export default function TimberCalculator() {
  const [diameterInput, setDiameterInput] = useState('')
  const [lengthInput, setLengthInput] = useState('')
  const [result, setResult] = useState(null)

  const handleCalculate = () => {
    // TODO: replace with real call to timberService.calculate()
    const diameter = parseMixedUnit(diameterInput)
    const length = parseMixedUnit(lengthInput)
    setResult({ diameter, length, volume: null })
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Timber Volume Calculator</h1>

      <label className="block mb-2 text-sm font-medium">
        Diameter / Circumference (e.g. "42in" or "1m 5cm")
      </label>
      <input
        className="w-full border rounded px-3 py-2 mb-4"
        value={diameterInput}
        onChange={(e) => setDiameterInput(e.target.value)}
        placeholder="42in"
      />

      <label className="block mb-2 text-sm font-medium">
        Length (e.g. "12ft" or "3m 45cm")
      </label>
      <input
        className="w-full border rounded px-3 py-2 mb-4"
        value={lengthInput}
        onChange={(e) => setLengthInput(e.target.value)}
        placeholder="12ft"
      />

      <button
        onClick={handleCalculate}
        className="bg-emerald-700 text-white px-4 py-2 rounded hover:bg-emerald-800"
      >
        Calculate
      </button>

      {result && (
        <pre className="mt-6 bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
