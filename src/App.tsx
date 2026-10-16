import { AppShell } from '@/components/AppShell'
import { StoreProvider } from '@/lib/store'
import { AssumptionsPage } from '@/pages/AssumptionsPage'
import { AssistSettingsPage } from '@/pages/AssistSettingsPage'
import { AuditPage } from '@/pages/AuditPage'
import { IdentityPage } from '@/pages/IdentityPage'
import { LandingPage } from '@/pages/LandingPage'
import { MinePage } from '@/pages/MinePage'
import { QueuePage } from '@/pages/QueuePage'
import { ReviewPage } from '@/pages/ReviewPage'
import { SubmitPage } from '@/pages/SubmitPage'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/entry/:role" element={<IdentityPage />} />
          <Route path="/assumptions" element={<AssumptionsPage />} />
          <Route element={<AppShell />}>
            <Route path="queue" element={<QueuePage />} />
            <Route path="mine" element={<MinePage />} />
            <Route path="submit" element={<SubmitPage />} />
            <Route path="submit/:id" element={<SubmitPage />} />
            <Route path="review/:id" element={<ReviewPage />} />
            <Route path="audit/:id" element={<AuditPage />} />
            <Route path="assist-settings" element={<AssistSettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  )
}
