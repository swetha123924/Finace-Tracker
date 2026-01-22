import { useState } from 'react';
import Card, { CardHeader, CardBody } from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useExpense } from '../context/ExpenseContext';
import { Settings as SettingsIcon, Trash2, Download, Upload, Moon, Sun, Globe, Bell, Shield, HelpCircle } from 'lucide-react';

const Settings = () => {
  const { state, dispatch } = useExpense();
  const [confirmClear, setConfirmClear] = useState(false);

  const exportData = () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-splitter-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result);
        if (data.members && data.expenses) {
          localStorage.setItem('expenseSplitterState', JSON.stringify(data));
          window.location.reload();
        } else {
          alert('Invalid backup file format');
        }
      } catch (err) {
        alert('Error reading backup file');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirmClear) {
      dispatch({ type: 'CLEAR_ALL' });
      setConfirmClear(false);
      window.location.reload();
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const settingSections = [
    {
      title: 'Data Management',
      icon: Shield,
      items: [
        {
          label: 'Export Data',
          description: 'Download a backup of all your data',
          action: <Button onClick={exportData} icon={Download} variant="secondary" size="sm">Export</Button>
        },
        {
          label: 'Import Data',
          description: 'Restore from a backup file',
          action: (
            <label className="cursor-pointer">
              <input type="file" accept=".json" onChange={importData} className="hidden" />
              <Button as="span" icon={Upload} variant="secondary" size="sm">Import</Button>
            </label>
          )
        },
        {
          label: 'Clear All Data',
          description: 'Delete all members and expenses',
          action: (
            <Button 
              onClick={clearAllData} 
              icon={Trash2} 
              variant={confirmClear ? 'danger' : 'secondary'} 
              size="sm"
            >
              {confirmClear ? 'Confirm Delete' : 'Clear'}
            </Button>
          )
        }
      ]
    }
  ];

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm lg:text-base">Manage your preferences</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 w-full">
        <Card className="p-3 sm:p-4 lg:p-6">
          <p className="text-xs sm:text-sm text-gray-500">Members</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{state.members.length}</p>
        </Card>
        <Card className="p-3 sm:p-4 lg:p-6">
          <p className="text-xs sm:text-sm text-gray-500">Expenses</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{state.expenses.length}</p>
        </Card>
        <Card className="p-3 sm:p-4 lg:p-6">
          <p className="text-xs sm:text-sm text-gray-500">Currency</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{state.settings?.currencySymbol || '$'}</p>
        </Card>
        <Card className="p-3 sm:p-4 lg:p-6">
          <p className="text-xs sm:text-sm text-gray-500">Groups</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{state.groups?.length || 1}</p>
        </Card>
      </div>

      {/* Settings Sections */}
      {settingSections.map((section) => (
        <Card key={section.title} className="w-full">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <section.icon className="w-5 h-5 text-emerald-500" />
              {section.title}
            </h3>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {section.items.map((item, idx) => (
                <div key={idx} className="p-3 sm:p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{item.description}</p>
                  </div>
                  {item.action}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}

      {/* About */}
      <Card className="w-full">
        <CardBody className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">ES</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Expense Splitter</h3>
              <p className="text-sm text-gray-500">Version 1.0.0</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            A modern expense splitting app to help you manage shared expenses with friends, family, or roommates. 
            Track who paid what, split bills fairly, and settle up easily.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default Settings;
