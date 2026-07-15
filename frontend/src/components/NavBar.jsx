import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <nav className="bg-emerald-800 text-white px-6 py-3 flex items-center gap-6">
      <span className="font-bold text-lg">TimberMate</span>
      <Link to="/" className="hover:underline">Timber Calculator</Link>
      <Link to="/convert" className="hover:underline">Unit Converter</Link>
      <Link to="/history" className="hover:underline">History</Link>
    </nav>
  )
}
