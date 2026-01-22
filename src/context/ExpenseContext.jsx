import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { membersAPI, expensesAPI } from '../services/api';

const ExpenseContext = createContext();

const initialState = {
  members: [],
  expenses: [],
  groups: [{ id: 1, name: 'Default Group', members: [], expenses: [] }],
  activeGroupId: 1,
  settings: {
    currency: 'USD',
    currencySymbol: '$',
  },
  loading: false,
  error: null,
};

const expenseReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_MEMBERS':
      return { ...state, members: action.payload, loading: false };
    case 'ADD_MEMBER':
      return {
        ...state,
        members: [...state.members, action.payload],
        loading: false,
      };
    case 'REMOVE_MEMBER':
      return {
        ...state,
        members: state.members.filter(m => m.id !== action.payload),
        loading: false,
      };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload, loading: false };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
        loading: false,
      };
    case 'EDIT_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(e => 
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
        loading: false,
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(e => e.id !== action.payload),
        loading: false,
      };
    case 'ADD_GROUP':
      return {
        ...state,
        groups: [...state.groups, { id: Date.now(), name: action.payload, members: [], expenses: [] }],
      };
    case 'SET_ACTIVE_GROUP':
      return { ...state, activeGroupId: action.payload };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'CLEAR_ALL':
      return { ...initialState };
    case 'RESET_STATE':
      return { ...initialState };
    default:
      return state;
  }
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  const isAuthenticated = !!localStorage.getItem('token');

  // Fetch members from API
  const fetchMembers = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const members = await membersAPI.getAll();
      dispatch({ type: 'SET_MEMBERS', payload: members });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, [isAuthenticated]);

  // Fetch expenses from API
  const fetchExpenses = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const expenses = await expensesAPI.getAll();
      dispatch({ type: 'SET_EXPENSES', payload: expenses });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, [isAuthenticated]);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMembers();
      fetchExpenses();
    } else {
      dispatch({ type: 'RESET_STATE' });
    }
  }, [isAuthenticated, fetchMembers, fetchExpenses]);

  // Member actions
  const addMember = async (name) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await membersAPI.add(name);
      dispatch({ type: 'ADD_MEMBER', payload: result.member });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      return { success: false, error: err.message };
    }
  };

  const removeMember = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await membersAPI.delete(id);
      dispatch({ type: 'REMOVE_MEMBER', payload: id });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      return { success: false, error: err.message };
    }
  };

  // Expense actions
  const addExpense = async (expense) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await expensesAPI.add(expense);
      dispatch({ type: 'ADD_EXPENSE', payload: result.expense });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      return { success: false, error: err.message };
    }
  };

  const editExpense = async (id, expense) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await expensesAPI.update(id, expense);
      dispatch({ type: 'EDIT_EXPENSE', payload: result.expense });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      return { success: false, error: err.message };
    }
  };

  const deleteExpense = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await expensesAPI.delete(id);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      return { success: false, error: err.message };
    }
  };

  // Calculate balances (from local state for real-time updates)
  const calculateBalances = useCallback(() => {
    const balances = {};
    const { members, expenses } = state;

    if (members.length === 0) return { balances: {}, settlements: [] };

    // Initialize balances
    members.forEach(member => {
      balances[member.id] = { 
        name: member.name, 
        avatar: member.avatar,
        paid: 0, 
        owes: 0, 
        balance: 0 
      };
    });

    // Calculate who paid what and who owes what
    expenses.forEach(expense => {
      const amount = parseFloat(expense.amount);
      const paidBy = expense.paidBy;
      const splitBetween = expense.splitBetween || members.map(m => m.id);
      
      if (splitBetween.length === 0) return;
      
      const perPerson = amount / splitBetween.length;

      // Add to paid
      if (balances[paidBy]) {
        balances[paidBy].paid += amount;
      }

      // Add to owes
      splitBetween.forEach(memberId => {
        if (balances[memberId]) {
          balances[memberId].owes += perPerson;
        }
      });
    });

    // Calculate final balance
    Object.keys(balances).forEach(memberId => {
      balances[memberId].balance = balances[memberId].paid - balances[memberId].owes;
    });

    // Calculate settlements (who pays whom)
    const settlements = calculateSettlements(balances);

    return { balances, settlements };
  }, [state]);

  const calculateSettlements = (balances) => {
    const settlements = [];
    const debtors = [];
    const creditors = [];

    Object.entries(balances).forEach(([id, data]) => {
      if (data.balance < -0.01) {
        debtors.push({ id: parseInt(id), name: data.name, amount: Math.abs(data.balance) });
      } else if (data.balance > 0.01) {
        creditors.push({ id: parseInt(id), name: data.name, amount: data.balance });
      }
    });

    // Sort by amount
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    // Match debtors with creditors
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const amount = Math.min(debtors[i].amount, creditors[j].amount);
      if (amount > 0.01) {
        settlements.push({
          from: debtors[i].name,
          fromId: debtors[i].id,
          to: creditors[j].name,
          toId: creditors[j].id,
          amount: amount.toFixed(2),
        });
      }
      debtors[i].amount -= amount;
      creditors[j].amount -= amount;
      if (debtors[i].amount < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }

    return settlements;
  };

  const getTotalExpenses = useCallback(() => {
    return state.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  }, [state.expenses]);

  const getExpensesByCategory = useCallback(() => {
    const categories = {};
    state.expenses.forEach(exp => {
      const cat = exp.category || 'Other';
      categories[cat] = (categories[cat] || 0) + parseFloat(exp.amount || 0);
    });
    return categories;
  }, [state.expenses]);

  // Refresh data
  const refreshData = async () => {
    await Promise.all([fetchMembers(), fetchExpenses()]);
  };

  const value = {
    state,
    dispatch,
    // Member actions
    addMember,
    removeMember,
    // Expense actions
    addExpense,
    editExpense,
    deleteExpense,
    // Calculations
    calculateBalances,
    getTotalExpenses,
    getExpensesByCategory,
    // Refresh
    refreshData,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within ExpenseProvider');
  }
  return context;
};
