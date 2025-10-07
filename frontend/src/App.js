import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider.jsx';
import { AuthProvider, useAuth } from './services/auth';
import { ToastProvider } from './components/ui/toast';
import './App.css';

// Lazy load components
const Dashboard = lazy(() => import('./components/kokonutui/dashboard'));
const ResponsiveHelper = lazy(() => import('./components/ui/responsive-helper').then(module => ({ default: module.ResponsiveHelper })));
const A11yHelper = lazy(() => import('./components/ui/a11y-helper').then(module => ({ default: module.A11yHelper })));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

// A placeholder component to simulate different pages
function PageContent({ page }) {
  return (
    <Dashboard pageType={page} />
  );
}

// Simplified Route component for development (no authentication required)
function AppRoute({ children }) {
  return children;
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* All routes are now public for development */}
                <Route path="/" element={
                  <AppRoute>
                    <Navigate to="/dashboard" replace />
                  </AppRoute>
                } />
                <Route path="/dashboard" element={
                  <AppRoute>
                    <PageContent page="dashboard" />
                  </AppRoute>
                } />
                <Route path="/analytics" element={
                  <AppRoute>
                    <PageContent page="analytics" />
                  </AppRoute>
                } />
                <Route path="/journal" element={
                  <AppRoute>
                    <PageContent page="journal" />
                  </AppRoute>
                } />
                <Route path="/trades" element={
                  <AppRoute>
                    <PageContent page="trades" />
                  </AppRoute>
                } />
                <Route path="/suggestions" element={
                  <AppRoute>
                    <PageContent page="suggestions" />
                  </AppRoute>
                } />
                <Route path="/calendar" element={
                  <AppRoute>
                    <PageContent page="calendar" />
                  </AppRoute>
                } />
                <Route path="/profile" element={
                  <AppRoute>
                    <PageContent page="profile" />
                  </AppRoute>
                } />
                <Route path="/settings" element={
                  <AppRoute>
                    <PageContent page="settings" />
                  </AppRoute>
                } />
                
                {/* Development helpers */}
                {process.env.NODE_ENV === 'development' && (
                  <>
                    <Route path="/responsive-helper" element={<ResponsiveHelper />} />
                    <Route path="/a11y-helper" element={<A11yHelper />} />
                  </>
                )}
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 