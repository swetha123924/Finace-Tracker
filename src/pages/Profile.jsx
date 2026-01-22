import { useAuth } from '../context/AuthContext';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Your account details</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900 dark:text-white">{user?.name || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900 dark:text-white">{user?.email || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Joined</p>
            <p className="font-medium text-gray-900 dark:text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Member ID</p>
            <p className="font-medium text-gray-900 dark:text-white">{user?.id || '—'}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4 flex items-center justify-between">
          <p className="text-xs text-gray-500">Need help? Email: cswetha061@gmail.com</p>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <footer className="max-w-3xl mx-auto mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Expense Splitter • Built with care</p>
      </footer>
    </div>
  );
};

export default Profile;
