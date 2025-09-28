import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import CandidateProfilePage from './pages/CandidateProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import JobDetailPage from './pages/JobDetailPage';
import { JobsBoardPage } from './pages/JobsBoardPage';
import { LandingPage } from './pages/LandingPage';

function App() {
  return (
    <Routes>
      {/* Route for the new public-facing landing page */}
      <Route path="/" element={<LandingPage />} />

      {/* All main application pages are now nested and will have the main Header and Footer */}
      <Route element={<AppShell />}>
        <Route path="/app" element={<JobsBoardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailPage />} />
        <Route path="/candidates/:candidateId" element={<CandidateProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;

