import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages - Phase 0 (Landing & Marketing)
import LandingPage from './views/frontend/landing/LandingPage.web';
import PlatformOverviewPage from './views/frontend/landing/PlatformOverviewPage.web';
import CountrySelectionPage from './views/frontend/landing/CountrySelectionPage.web';
import PricingPage from './views/frontend/landing/PricingPage.web';

// Pages - Auth (Phase 1)
// TODO: Import auth pages when created
// import LoginPage from './views/auth/LoginPage.web';
// import SignUpPage from './views/auth/SignUpPage.web';

/**
 * Main App Component with Router
 * Entry point for the web application
 * 
 * Structure:
 * - Phase 0 (Landing): Public pages, no authentication required
 * - Phase 1 (Auth): Login, signup, password reset
 * - Phase 2 (Core): Dashboard, applications, documents, universities
 * - Phase 3 (AI): Intelligence engines, AI features
 * - Phase 4 (Backend): Admin & moderator panels
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Phase 0: Landing Pages (Public) */}
        <Route
          path="/"
          element={
            <MainLayout>
              <LandingPage />
            </MainLayout>
          }
        />

        <Route
          path="/platform"
          element={
            <MainLayout>
              <PlatformOverviewPage />
            </MainLayout>
          }
        />

        <Route
          path="/countries"
          element={
            <MainLayout>
              <CountrySelectionPage />
            </MainLayout>
          }
        />

        <Route
          path="/pricing"
          element={
            <MainLayout>
              <PricingPage />
            </MainLayout>
          }
        />

        {/* Phase 1: Authentication (TODO) */}
        {/* <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} /> */}

        {/* Phase 2: Core Features (TODO) */}
        {/* <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/universities" element={<UniversitiesPage />} /> */}

        {/* Phase 3: AI Features (TODO) */}
        {/* <Route path="/ai/sop-generator" element={<SOPGeneratorPage />} />
        <Route path="/ai/interview-prep" element={<InterviewPrepPage />} /> */}

        {/* Phase 4: Backend (TODO) */}
        {/* <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/moderator/panel" element={<ModeratorPanelPage />} /> */}

        {/* Temporary redirects for auth routes during development */}
        <Route
          path="/auth/login"
          element={
            <MainLayout>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Login Page</h2>
                <p>Coming in Phase 1: Authentication</p>
              </div>
            </MainLayout>
          }
        />

        <Route
          path="/auth/signup"
          element={
            <MainLayout>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Sign Up Page</h2>
                <p>Coming in Phase 1: Authentication</p>
              </div>
            </MainLayout>
          }
        />

        {/* Catch-all: redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
