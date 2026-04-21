import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SilkWavePage from "./pages/components/SilkWave"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/components/silk-wave" element={<SilkWavePage />} />
      </Routes>
    </BrowserRouter>
  )
}
