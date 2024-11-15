import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Finance } from './pages/Finance';
import { Education } from './pages/Education';
import { Assets } from './pages/Assets';
import { Calendar } from './pages/Calendar';
import { Media } from './pages/Media';
import { Login } from './pages/Login';
import { ResetPassword } from './pages/ResetPassword';
import { Sidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuth } from './lib/auth';
import { CustomToaster } from './components/ui/CustomToaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function AppContent() {
  const { checkAuth } = useAuth();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/members/*" element={<Members />} />
                      <Route path="/finance/*" element={<Finance />} />
                      <Route path="/education/*" element={<Education />} />
                      <Route path="/assets/*" element={<Assets />} />
                      <Route path="/calendar/*" element={<Calendar />} />
                      <Route path="/media/*" element={<Media />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
      <CustomToaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;