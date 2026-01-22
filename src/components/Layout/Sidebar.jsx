import { 
  Home, 
  Receipt, 
  Users, 
  PieChart, 
  Wallet, 
  Settings, 
  HelpCircle,
  X,
  Plus
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'expenses', icon: Receipt, label: 'Expenses' },
  { id: 'members', icon: Users, label: 'Members' },
  { id: 'analytics', icon: PieChart, label: 'Analytics' },
  { id: 'settlements', icon: Wallet, label: 'Settlements' },
];

const bottomMenuItems = [
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'help', icon: HelpCircle, label: 'Help & Support' },
];

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - hidden on mobile, visible on desktop */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 
          bg-white dark:bg-gray-900 
          border-r border-gray-200 dark:border-gray-700 
          transform transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:h-screen lg:z-30 lg:translate-x-0 lg:flex-shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo & Close button - mobile only */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ES</span>
              </div>
              <span className="font-bold text-gray-800 dark:text-white">Expense Splitter</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ES</span>
            </div>
            <span className="font-bold text-gray-800 dark:text-white">Expense Splitter</span>
          </div>

          {/* Add New Button */}
          <div className="p-4">
            <button
              onClick={() => { setActiveTab('expenses'); onClose(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40"
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-3 py-2 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => { setActiveTab(item.id); onClose(); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-emerald-500' : ''}`} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

            <ul className="space-y-1">
              {bottomMenuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => { setActiveTab(item.id); onClose(); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-emerald-500' : ''}`} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer with related text and email */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              This app helps you split expenses easily and fairly among friends and groups.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              Contact: <a href="mailto:cswetha061@gmail.com" className="text-emerald-500 hover:text-emerald-600">cswetha061@gmail.com</a>
            </p>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
