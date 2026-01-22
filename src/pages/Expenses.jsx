import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { 
  Plus, Receipt, Trash2, Edit2, Search, 
  DollarSign,  User, X, Calendar, 
 CheckCircle, AlertCircle, Loader2
} from 'lucide-react';

const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Travel', 'Other'];

const categoryColors = {
  Food: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  Transport: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  Shopping: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  Entertainment: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  Bills: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  Health: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  Travel: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  Other: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

const Expenses = () => {
  const { state, addExpense, editExpense, deleteExpense } = useExpense();
  const { members, expenses} = state;

  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form, setForm] = useState({ description: '', amount: '', paidBy: '', category: 'Other', splitBetween: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setForm({ description: '', amount: '', paidBy: '', category: 'Other', splitBetween: [] });
    setEditingExpense(null);
  };

  const openAddModal = () => {
    resetForm();
    setForm(prev => ({ ...prev, splitBetween: members.map(m => m.id) }));
    setShowModal(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setForm({
      description: expense.description,
      amount: expense.amount.toString(),
      paidBy: expense.paidBy,
      category: expense.category || 'Other',
      splitBetween: expense.splitBetween || members.map(m => m.id),
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.description || !form.amount || !form.paidBy) {
      alert('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);
    
    const payload = {
      description: form.description,
      amount: parseFloat(form.amount),
      paidBy: parseInt(form.paidBy),
      category: form.category,
      splitBetween: form.splitBetween.length > 0 ? form.splitBetween : members.map(m => m.id),
    };

    let result;
    if (editingExpense) {
      result = await editExpense(editingExpense.id, payload);
    } else {
      result = await addExpense(payload);
    }
    
    if (result.success) {
      setShowModal(false);
      resetForm();
    } else {
      alert(result.error || 'Failed to save expense');
    }
    
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this expense?')) {
      await deleteExpense(id);
    }
  };

  const toggleSplitMember = (memberId) => {
    setForm(prev => ({
      ...prev,
      splitBetween: prev.splitBetween.includes(memberId)
        ? prev.splitBetween.filter(id => id !== memberId)
        : [...prev.splitBetween, memberId],
    }));
  };

  const filteredExpenses = expenses
    .filter(exp => {
      const matchesSearch = exp.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !filterCategory || exp.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'amount') return parseFloat(b.amount) - parseFloat(a.amount);
      return 0;
    });

  const totalFiltered = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage all your group expenses</p>
        </div>
        <button 
          onClick={openAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/30"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalFiltered.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Transactions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredExpenses.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Categories</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{new Set(expenses.map(e => e.category)).size}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Avg per Expense</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${expenses.length > 0 ? (totalFiltered / expenses.length).toFixed(2) : '0.00'}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Receipt className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No expenses found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Add your first expense to get started</p>
            <button 
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredExpenses.map((expense) => {
              const payer = members.find(m => m.id === expense.paidBy);
              const splitCount = expense.splitBetween?.length || members.length;
              return (
                <div key={expense.id} className="p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${categoryColors[expense.category || 'Other']}`}>
                      <Receipt className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{expense.description}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[expense.category || 'Other']}`}>
                          {expense.category || 'Other'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {payer?.name || 'Unknown'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(expense.createdAt).toLocaleDateString()}
                        </span>
                        <span>Split {splitCount} ways</span>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto mt-3 sm:mt-0 flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">${parseFloat(expense.amount).toFixed(2)}</p>
                        <p className="text-sm text-gray-500">${(parseFloat(expense.amount) / splitCount).toFixed(2)}/person</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => openEditModal(expense)}
                          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button 
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g., Dinner at restaurant"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paid by *</label>
                <select
                  value={form.paidBy}
                  onChange={(e) => setForm({ ...form, paidBy: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="">Select who paid</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                {members.length === 0 && (
                  <p className="text-sm text-orange-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Add members first in the Members section
                  </p>
                )}
              </div>
              
              {members.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Split between</label>
                  <div className="flex flex-wrap gap-2">
                    {members.map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleSplitMember(m.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          form.splitBetween.includes(m.id)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {form.splitBetween.includes(m.id) && <CheckCircle className="w-4 h-4 inline mr-1" />}
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingExpense ? 'Save Changes' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
