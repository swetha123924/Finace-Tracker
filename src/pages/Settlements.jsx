import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { 
  ArrowRight, CheckCircle, Wallet, 
  Copy, Share2, RefreshCw, AlertCircle
} from 'lucide-react';

const Settlements = () => {
  const { state, calculateBalances } = useExpense();
  const { members } = state;
  const { balances, settlements } = calculateBalances();
  const [copiedIdx, setCopiedIdx] = useState(null);

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copyAllSettlements = () => {
    const text = settlements.map(s => `${s.from} pays ${s.to}: $${s.amount}`).join('\n');
    navigator.clipboard.writeText(text);
    alert('Settlements copied to clipboard!');
  };

  const totalOwed = Object.values(balances)
    .filter(b => b.balance < 0)
    .reduce((sum, b) => sum + Math.abs(b.balance), 0);

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settlements</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Settle up with your group</p>
        </div>
        {settlements.length > 0 && (
          <button 
            onClick={copyAllSettlements}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/30"
          >
            <Share2 className="w-5 h-5" />
            Share Settlements
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total Members</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{members.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Pending Settlements</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{settlements.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total to Settle</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalOwed.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Status</p>
          <p className={`text-2xl font-bold ${settlements.length === 0 ? 'text-emerald-600' : 'text-orange-500'}`}>
            {settlements.length === 0 ? 'Settled!' : 'Pending'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Balances */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-scroll">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-500" />
              Member Balances
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Who owes and who is owed</p>
          </div>
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {members.map((member) => (
              <li key={member.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Paid: ${member.paid ? member.paid.toFixed(2) : '0.00'}</p>
                </div>
                <p className={`text-sm font-bold ${member.balance < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {member.balance < 0 ? `Owes $${Math.abs(member.balance || 0).toFixed(2)}` : `Owed $${(member.balance || 0).toFixed(2)}`}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Settlements */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-scroll">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-500" />
              Suggested Settlements
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Minimum transactions to settle</p>
          </div>
          
          {settlements.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">All Settled!</h4>
              <p className="text-gray-500 dark:text-gray-400">Everyone is even. No payments needed.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {settlements.map((settlement, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {settlement.from.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="font-medium text-gray-900 dark:text-white truncate">{settlement.from}</span>
                        <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="font-medium text-gray-900 dark:text-white truncate">{settlement.to}</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {settlement.to.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-4">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">${settlement.amount}</span>
                      <button
                        onClick={() => copyToClipboard(`${settlement.from} pays ${settlement.to}: $${settlement.amount}`, idx)}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {copiedIdx === idx ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">How settlements work</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              The algorithm calculates the minimum number of transactions needed to settle all debts. 
              Positive balances mean that person is owed money, negative balances mean they owe money. 
              Follow the suggested payments to settle up efficiently!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settlements;
