import { useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
  TrendingUp, Users, Receipt, Wallet, 
  Plus, Sparkles, PiggyBank, CreditCard, Activity,
  ChevronRight, Clock, CheckCircle2
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const { state, getTotalExpenses, getExpensesByCategory, calculateBalances } = useExpense();
  const { members, expenses } = state;
  const total = getTotalExpenses();
  const categories = getExpensesByCategory();
  const { balances, settlements } = calculateBalances();

  const avgPerPerson = members.length > 0 ? total / members.length : 0;

  const doughnutData = useMemo(() => ({
    labels: Object.keys(categories).length > 0 ? Object.keys(categories) : ['No expenses yet'],
    datasets: [{
      data: Object.keys(categories).length > 0 ? Object.values(categories) : [1],
      backgroundColor: Object.keys(categories).length > 0 
        ? ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']
        : ['#374151'],
      borderWidth: 0,
      cutout: '70%',
    }],
  }), [categories]);

  const barData = useMemo(() => {
    const memberExpenses = {};
    members.forEach(m => { memberExpenses[m.name] = 0; });
    expenses.forEach(exp => {
      const member = members.find(m => m.id === exp.paidBy);
      if (member) memberExpenses[member.name] += parseFloat(exp.amount);
    });
    return {
      labels: Object.keys(memberExpenses),
      datasets: [{
        data: Object.values(memberExpenses),
        backgroundColor: '#10B981',
        borderRadius: 8,
        barThickness: 32,
      }],
    };
  }, [members, expenses]);

  const recentExpenses = expenses.slice(-5).reverse();

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8">
      {/* Welcome Banner */}
      <div className="w-full mb-6 lg:mb-8 relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 sm:p-8 lg:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-emerald-100 text-sm font-medium">Expense Splitter</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Welcome Back! 👋
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base lg:text-lg max-w-xl">
            Track and split expenses with your group. Keep everyone on the same page.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <span className="text-white font-bold text-lg">${total.toFixed(2)}</span>
              <span className="text-emerald-100 text-sm ml-2">Total Spent</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <span className="text-white font-bold text-lg">{members.length}</span>
              <span className="text-emerald-100 text-sm ml-2">Members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Total Expenses</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">
              Group
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{members.length}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Members</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-full">
              Average
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">${avgPerPerson.toFixed(2)}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Per Person</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${settlements.length > 0 ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-gradient-to-br from-green-400 to-emerald-500'}`}>
              {settlements.length > 0 ? <CreditCard className="w-6 h-6 text-white" /> : <CheckCircle2 className="w-6 h-6 text-white" />}
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${settlements.length > 0 ? 'text-orange-600 bg-orange-100 dark:bg-orange-900/50' : 'text-green-600 bg-green-100 dark:bg-green-900/50'}`}>
              {settlements.length > 0 ? 'Pending' : 'Settled'}
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{settlements.length}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Settlements</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Column - Charts */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Spending by Category */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Spending Overview</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">By category breakdown</p>
              </div>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <div className="h-64 flex items-center justify-center">
                  <Doughnut 
                    data={doughnutData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } }
                    }} 
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">${total.toFixed(0)}</p>
                    <p className="text-gray-500 text-sm">Total</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                {Object.keys(categories).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(categories).map(([cat, amount], idx) => {
                      const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];
                      const percentage = ((amount / total) * 100).toFixed(1);
                      return (
                        <div key={cat} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors[idx % colors.length] }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{cat}</span>
                              <span className="text-sm text-gray-500 ml-2">{percentage}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: colors[idx % colors.length] }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Receipt className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No expenses yet</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Add your first expense</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Member Contributions Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Member Contributions</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Who paid what</p>
              </div>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            
            {members.length > 0 ? (
              <div className="h-64">
                <Bar 
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: (v) => `$${v}`, color: '#9CA3AF' } },
                      y: { grid: { display: false }, ticks: { color: '#9CA3AF' } }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No members yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Add members to see contributions</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-5 shadow-lg">
            <h3 className="text-white font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-4 text-center transition-all duration-200">
                <Plus className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Add Expense</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-4 text-center transition-all duration-200">
                <Users className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Add Member</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-4 text-center transition-all duration-200">
                <Wallet className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Settle Up</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-4 text-center transition-all duration-200">
                <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Analytics</span>
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent</h3>
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {recentExpenses.length > 0 ? (
              <div className="space-y-3">
                {recentExpenses.map((exp, idx) => {
                  const payer = members.find(m => m.id === exp.paidBy);
                  return (
                    <div key={exp.id || idx} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{exp.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{payer?.name || 'Unknown'}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900 dark:text-white">${parseFloat(exp.amount).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
              </div>
            )}
          </div>

          {/* Balances */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Balances</h3>
              <Wallet className="w-5 h-5 text-gray-400" />
            </div>
            
            {Object.keys(balances).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(balances).slice(0, 5).map(([id, data]) => (
                  <div key={id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {data.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white truncate">{data.name}</span>
                    </div>
                    <span className={`font-bold flex-shrink-0 ${data.balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {data.balance >= 0 ? '+' : ''}{data.balance.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Wallet className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No balances</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
