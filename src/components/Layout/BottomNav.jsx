import React from 'react';
import { Home, Receipt, Users, PieChart, Wallet } from 'lucide-react';

const navItems = [
  { id: 'dashboard', icon: Home, label: 'Home' },
  { id: 'expenses', icon: Receipt, label: 'Expenses' },
  { id: 'members', icon: Users, label: 'Members' },
  { id: 'analytics', icon: PieChart, label: 'Stats' },
  { id: 'settlements', icon: Wallet, label: 'Settle' },
];

const BottomNav = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-xl transition-all ${
              activeTab === item.id
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <div
              className={`p-2 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-emerald-100 dark:bg-emerald-900/50'
                  : ''
              }`}
            >
              <item.icon
                className={`w-5 h-5 transition-transform ${
                  activeTab === item.id ? 'scale-110' : ''
                }`}
              />
            </div>
            <span className={`text-xs mt-1 font-medium ${
              activeTab === item.id ? 'text-emerald-600 dark:text-emerald-400' : ''
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
