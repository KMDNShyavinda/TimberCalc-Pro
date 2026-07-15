import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import TimberCalculator from './pages/TimberCalculator'
import UnitConverter from './pages/UnitConverter'
import History from './pages/History'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<TimberCalculator />} />
        <Route path="/convert" element={<UnitConverter />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
