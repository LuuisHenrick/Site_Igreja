import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Finance } from './pages/Finance';
import { Education } from './pages/Education';
import { Assets } from './pages/Assets';
import { Calendar } from './pages/Calendar';
import { Media } from './pages/Media';
import { Sidebar } from './components/Sidebar';
import { useStore } from './lib/store';

function App() {
  const { toastMessage, setToastMessage } = useStore();

  // Handle toast messages
  useEffect(() => {
    if (toastMessage) {
      if (toastMessage.type === 'success') {
        toast.success(toastMessage.message);
      } else {
        toast.error(toastMessage.message);
      }
      // Clear the toast message after displaying it
      setToastMessage(null);
    }
  }, [toastMessage, setToastMessage]);

  return (
    <Router>
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
            </Routes>
          </main>
        </div>
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          toastOptions={{
            style: { background: 'white', color: 'black' },
            className: 'my-toast-class',
          }}
        />
      </div>
    </Router>
  );
}

export default App;