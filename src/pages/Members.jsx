import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { 
  Plus, Users, Trash2, Search, UserPlus,
  Mail, Phone, MoreVertical, Crown, X, Loader2
} from 'lucide-react';

const avatarColors = [
  'from-purple-400 to-pink-500',
  'from-blue-400 to-indigo-500',
  'from-green-400 to-emerald-500',
  'from-yellow-400 to-orange-500',
  'from-red-400 to-rose-500',
  'from-cyan-400 to-teal-500',
];

const Members = () => {
  const { state, addMember, removeMember, calculateBalances } = useExpense();
  const { members, expenses, loading } = state;
  const { balances } = calculateBalances();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  const handleAddMember = async () => {
    if (!name.trim()) return;
    setAddingMember(true);
    const result = await addMember(name.trim());
    if (result.success) {
      setName('');
      setShowModal(false);
    } else {
      alert(result.error || 'Failed to add member');
    }
    setAddingMember(false);
  };

  const handleRemoveMember = async (id) => {
    if (confirm('Remove this member? Their expenses will remain.')) {
      await removeMember(id);
    }
  };

  const getColorClass = (idx) => avatarColors[idx % avatarColors.length];

  const getMemberStats = (memberId) => {
    const memberExpenses = expenses.filter(e => e.paidBy === memberId);
    const totalPaid = memberExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const balance = balances[memberId]?.balance || 0;
    return { totalPaid, balance, expenseCount: memberExpenses.length };
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Members</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your group members</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/30"
        >
          <UserPlus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total Members</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{members.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Avg per Person</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${members.length > 0 ? (totalExpenses / members.length).toFixed(2) : '0.00'}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Transactions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{expenses.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 border border-gray-100 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No members found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Add members to start tracking expenses</p>
          <button 
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Add Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredMembers.map((member, idx) => {
            const stats = getMemberStats(member.id);
            return (
              <div key={member.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getColorClass(idx)} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{member.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{stats.expenseCount} expenses</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Total Paid</p>
                    <p className="font-bold text-gray-900 dark:text-white">${stats.totalPaid.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Balance</p>
                    <p className={`font-bold ${stats.balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {stats.balance >= 0 ? '+' : ''}{stats.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Member</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Member Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                placeholder="Enter name"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
            </div>
            
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                disabled={addingMember}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {addingMember && <Loader2 className="w-4 h-4 animate-spin" />}
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
