import { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import BottomNav from './components/Layout/BottomNav';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Members from './pages/Members';
import Analytics from './pages/Analytics';
import Settlements from './pages/Settlements';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { useIsMobile } from './hooks/useMediaQuery';

const tabs = {
  dashboard: <Dashboard />,
  expenses: <Expenses />,
  members: <Members />,
  analytics: <Analytics />,
  settlements: <Settlements />,
  settings: <Settings />,
  help: (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Help & Support</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Get help with using Expense Splitter</p>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
        <p className="text-gray-600 dark:text-gray-400">Email: support@expensesplitter.com</p>
      </div>
    </div>
  ),
};

const AppInner = () => {
  const { isAuthenticated, login, register, logout, loading: authLoading, user } = useAuth();
  const [authMode, setAuthMode] = useState('login');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDark]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screens if not authenticated
  if (!isAuthenticated) {
    if (authMode === 'login') {
      return (
        <Login 
          onLogin={login} 
          onSwitchToRegister={() => setAuthMode('register')} 
        />
      );
    }
    return (
      <Register 
        onRegister={register} 
        onSwitchToLogin={() => setAuthMode('login')} 
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header 
        onMenuClick={() => setSidebarOpen(true)} 
        isDarkMode={isDark} 
        toggleDarkMode={() => setIsDark(!isDark)}
        user={user}
        onLogout={logout}
      />
      
      <div className="flex w-full">
        {/* Sidebar - fixed width on desktop */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* Main Content - takes remaining width */}
        <main className={`flex-1 min-h-[calc(100vh-64px)] w-full ${isMobile ? 'pb-20' : ''}`}>
          {location.pathname === '/profile' ? (
            <Profile />
          ) : (
            tabs[activeTab]
          )}
        </main>
      </div>

      {/* Bottom Navigation - mobile only */}
      {isMobile && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <AppInner />
      </ExpenseProvider>
    </AuthProvider>
  );
};

export default App;
