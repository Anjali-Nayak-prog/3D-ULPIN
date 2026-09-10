import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './components/common/Toast'
import { MainLayout } from './components/layout/MainLayout'
import { LandingPage } from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import { CadastralMap } from './pages/CadastralMap'
import { PropertySearch } from './pages/PropertySearch'
import { PropertyDetailsPage } from './pages/PropertyDetailsPage'
import { ULPINGenerator } from './pages/ULPINGenerator'
import { DataManagement } from './pages/DataManagement'
import { AIProcessing } from './pages/AIProcessing'
import { ValidationConflicts } from './pages/ValidationConflicts'
import { Analytics } from './pages/Analytics'
import { Reports } from './pages/Reports'
import { Notifications } from './pages/Notifications'
import { UserManagement } from './pages/UserManagement'
import { RolesPermissions } from './pages/RolesPermissions'
import { SystemSettings } from './pages/SystemSettings'
import { AuditLogs } from './pages/AuditLogs'
import { NotFound } from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<CadastralMap />} />
            <Route path="/properties" element={<PropertySearch />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />
            <Route path="/ulpin-generator" element={<ULPINGenerator />} />
            <Route path="/data-management" element={<DataManagement />} />
            <Route path="/ai-processing" element={<AIProcessing />} />
            <Route path="/validation" element={<ValidationConflicts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/roles" element={<RolesPermissions />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App