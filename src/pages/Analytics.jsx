import { useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { 
  TrendingUp, PieChart, BarChart2, Calendar,
  DollarSign, Users, Receipt, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Analytics = () => {
  const { state, getTotalExpenses, getExpensesByCategory } = useExpense();
  const { members, expenses } = state;
  const total = getTotalExpenses();
  const categories = getExpensesByCategory();

  const categoryData = useMemo(() => ({
    labels: Object.keys(categories),
    datasets: [{
      data: Object.values(categories),
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'],
      borderWidth: 0,
    }],
  }), [categories]);

  const memberData = useMemo(() => {
    const memberExpenses = {};
    members.forEach(m => { memberExpenses[m.name] = 0; });
    expenses.forEach(exp => {
      const member = members.find(m => m.id === exp.paidBy);
      if (member) memberExpenses[member.name] += parseFloat(exp.amount);
    });
    return {
      labels: Object.keys(memberExpenses),
      datasets: [{
        label: 'Amount Paid',
        data: Object.values(memberExpenses),
        backgroundColor: '#10B981',
        borderRadius: 8,
      }],
    };
  }, [members, expenses]);

  const trendData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyTotals = last7Days.map(day => {
      return expenses
        .filter(e => e.createdAt?.split('T')[0] === day)
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);
    });

    return {
      labels: last7Days.map(d => new Date(d).toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [{
        label: 'Daily Spending',
        data: dailyTotals,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      }],
    };
  }, [expenses]);

  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
  const avgExpense = expenses.length > 0 ? total / expenses.length : 0;

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Detailed insights into your spending</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <span className="text-xs text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total Spent</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Receipt className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-blue-600 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">Count</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{expenses.length}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Transactions</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-purple-600 bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 rounded-full">Avg</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${avgExpense.toFixed(2)}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Per Transaction</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <PieChart className="w-5 h-5 text-orange-500" />
            <span className="text-xs text-orange-600 bg-orange-100 dark:bg-orange-900/50 px-2 py-0.5 rounded-full">Top</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">{topCategory?.[0] || 'N/A'}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Top Category</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Spending Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Spending Trend</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Last 7 days</p>
            </div>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            <Line 
              data={trendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: v => `$${v}` } },
                  x: { grid: { display: false } }
                }
              }}
            />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">By Category</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Spending distribution</p>
            </div>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center">
            {Object.keys(categories).length > 0 ? (
              <Doughnut 
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '60%',
                  plugins: { legend: { position: 'right', labels: { usePointStyle: true, padding: 15 } } }
                }}
              />
            ) : (
              <div className="text-center text-gray-500">
                <PieChart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Member Contributions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Member Contributions</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Who paid what</p>
          </div>
          <BarChart2 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="h-64">
          {members.length > 0 ? (
            <Bar 
              data={memberData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: v => `$${v}` } },
                  x: { grid: { display: false } }
                }
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Add members to see contributions</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Details */}
      {Object.keys(categories).length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Category Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(categories)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amount], idx) => {
                const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500'];
                const percentage = ((amount / total) * 100).toFixed(1);
                return (
                  <div key={cat} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${colors[idx % colors.length]}`} />
                      <span className="font-medium text-gray-900 dark:text-white">{cat}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">${amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{percentage}% of total</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
