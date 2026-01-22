import { Menu } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick,  user }) => {
  const navigate = useNavigate();




  const handleProfileClick = () => navigate('/profile');

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          {/* Logo - only on mobile (desktop has it in sidebar) */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ES</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Expense Splitter
            </h1>
          </div>
        </div>

       

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Avatar navigates directly to profile (no dropdown) */}
          <div>
            <button
              onClick={handleProfileClick}
              className="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center ml-1 cursor-pointer hover:shadow-lg transition-shadow"
              aria-label="Open profile"
            >
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </button>
          </div>
        </div>
      </div>

     
    </header>
  );
};

Header.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default Header;
