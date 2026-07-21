import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import timberService from '../services/timberService'

export default function History() {
  const { isAuthenticated } = useAuth()

  const [historyItems, setHistoryItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('ALL')

  const fetchHistory = async () => {
    if (!isAuthenticated) return
    setLoading(true)
    setError('')
    try {
      const response = await timberService.getHistory()
      // Laravel pagination returns items under data or data.data
      const items = Array.isArray(response.data)
        ? response.data
        : (response.data?.data || [])
      setHistoryItems(items)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch calculation history from server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [isAuthenticated])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log entry?')) return
    try {
      await timberService.deleteHistoryItem(id)
      setHistoryItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete history log item.')
    }
  }

  // Filtered items logic
  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      (item.species && item.species.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.calculation_method && item.calculation_method.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesSpecies = speciesFilter === 'ALL' || item.species === speciesFilter

    return matchesSearch && matchesSpecies
  })

  // Unique species list for filter dropdown
  const uniqueSpecies = Array.from(new Set(historyItems.map((i) => i.species).filter(Boolean)))

  // Aggregated totals
  const totalCFT = filteredItems.reduce((acc, curr) => acc + (parseFloat(curr.volume_cubic_feet) || 0), 0).toFixed(2)
  const totalM3 = filteredItems.reduce((acc, curr) => acc + (parseFloat(curr.volume_cubic_meters) || 0), 0).toFixed(3)

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-6">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-6 md:p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Calculation History</h1>
          <p className="text-emerald-100 text-sm md:text-base">
            Access your saved timber volume logs and batch records.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-8 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto text-xl">
            🔒
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Authentication Required</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
            Please sign in or register an account to save calculation logs and view your saved history across sessions.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/login"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition shadow-sm"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium px-5 py-2.5 rounded-xl text-sm transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-6 md:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Calculation History</h1>
          <p className="text-emerald-100 text-xs md:text-sm">
            Saved timber logs and calculation records for your account
          </p>
        </div>

        {/* Aggregated Totals Pill */}
        <div className="bg-emerald-950/60 border border-emerald-700/60 p-3 rounded-xl flex items-center gap-4 text-xs">
          <div>
            <span className="text-emerald-300 block text-[10px] uppercase font-bold">Filtered Count</span>
            <span className="text-white font-bold text-base">{filteredItems.length} logs</span>
          </div>
          <div className="h-8 w-px bg-emerald-700/60" />
          <div>
            <span className="text-emerald-300 block text-[10px] uppercase font-bold">Total CFT</span>
            <span className="text-emerald-400 font-bold text-base">{totalCFT} ft³</span>
          </div>
          <div className="h-8 w-px bg-emerald-700/60" />
          <div>
            <span className="text-emerald-300 block text-[10px] uppercase font-bold">Total m³</span>
            <span className="text-teal-400 font-bold text-base">{totalM3} m³</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by species or calculation method..."
          className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        />

        {uniqueSpecies.length > 0 && (
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="ALL">All Species ({historyItems.length})</option>
            {uniqueSpecies.map((sp) => (
              <option key={sp} value={sp}>
                {sp}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-rose-800 dark:text-rose-200 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* History Items List / Table */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-12 text-center text-gray-500">
          <span className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent mb-2" />
          <p className="text-sm font-medium">Loading history logs...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-12 text-center space-y-3">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No saved timber calculation logs found.</p>
          <Link
            to="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-xl text-xs transition"
          >
            Go to Timber Calculator
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400 uppercase font-semibold text-[10px] border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Species</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Dimensions (D × L)</th>
                  <th className="py-3.5 px-4">Volume (CFT)</th>
                  <th className="py-3.5 px-4">Volume (m³)</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition">
                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                      {new Date(item.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-gray-100">
                      {item.species || 'Unspecified'}
                    </td>
                    <td className="py-3.5 px-4 capitalize">
                      <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md font-mono text-[10px] border border-emerald-200 dark:border-emerald-800/40">
                        {item.calculation_method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.diameter} {item.diameter_unit || 'cm'} × {item.length} {item.length_unit || 'cm'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {item.volume_cubic_feet} ft³
                    </td>
                    <td className="py-3.5 px-4 font-bold text-teal-600 dark:text-teal-400">
                      {item.volume_cubic_meters} m³
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 p-1.5 rounded-lg transition"
                        title="Delete entry"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
