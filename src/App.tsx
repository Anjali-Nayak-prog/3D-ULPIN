import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ToastProvider } from './components/common/Toast'
import { MainLayout } from './components/layout/MainLayout'
import { LandingPage } from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import { CadastralMap } from './pages/CadastralMap'
import { PropertySearch } from './pages/PropertySearch'
import { PropertyDetailsPage } from './pages/PropertyDetailsPage'
import { ULPINGenerator } from './pages/ULPINGenerator'
import { DataProcessing } from './pages/DataProcessing'
import { AIProcessing } from './pages/AIProcessing'
import { ValidationConflicts } from './pages/ValidationConflicts'
import { NotFound } from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<CadastralMap />} />
            <Route path="/properties" element={<PropertySearch />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />
            <Route path="/data-processing" element={<DataProcessing />} />
            <Route path="/ai-processing" element={<AIProcessing />} />
            <Route path="/ulpin-generator" element={<ULPINGenerator />} />
            <Route path="/validation" element={<ValidationConflicts />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App