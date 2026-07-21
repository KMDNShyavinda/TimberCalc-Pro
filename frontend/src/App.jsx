import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import NavBar from './components/NavBar'
import TimberCalculator from './pages/TimberCalculator'
import MillingEstimator from './pages/MillingEstimator'
import UnitConverter from './pages/UnitConverter'
import History from './pages/History'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
            <NavBar />
            <main className="flex-1 pb-12">
              <Routes>
                <Route path="/" element={<TimberCalculator />} />
                <Route path="/milling" element={<MillingEstimator />} />
                <Route path="/convert" element={<UnitConverter />} />
                <Route path="/history" element={<History />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App
