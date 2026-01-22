const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getProfile: () => apiRequest('/auth/profile'),
  
  updateProfile: (data) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  updateSettings: (settings) => apiRequest('/auth/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  }),
  
  changePassword: (passwords) => apiRequest('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwords),
  }),
};

// Members API
export const membersAPI = {
  getAll: () => apiRequest('/members'),
  
  add: (name) => apiRequest('/members', {
    method: 'POST',
    body: JSON.stringify({ name }),
  }),
  
  update: (id, name) => apiRequest(`/members/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  }),
  
  delete: (id) => apiRequest(`/members/${id}`, {
    method: 'DELETE',
  }),
  
  getStats: (id) => apiRequest(`/members/${id}/stats`),
};

// Expenses API
export const expensesAPI = {
  getAll: () => apiRequest('/expenses'),
  
  getOne: (id) => apiRequest(`/expenses/${id}`),
  
  add: (expense) => apiRequest('/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  }),
  
  update: (id, expense) => apiRequest(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expense),
  }),
  
  delete: (id) => apiRequest(`/expenses/${id}`, {
    method: 'DELETE',
  }),
  
  getStats: () => apiRequest('/expenses/stats'),
  
  getBalances: () => apiRequest('/expenses/balances'),
};

// Settlements API
export const settlementsAPI = {
  getAll: () => apiRequest('/settlements'),
  
  create: (settlement) => apiRequest('/settlements', {
    method: 'POST',
    body: JSON.stringify(settlement),
  }),
  
  complete: (id) => apiRequest(`/settlements/${id}/complete`, {
    method: 'PUT',
  }),
  
  delete: (id) => apiRequest(`/settlements/${id}`, {
    method: 'DELETE',
  }),
  
  settleAll: () => apiRequest('/settlements/settle-all', {
    method: 'POST',
  }),
};

export default {
  auth: authAPI,
  members: membersAPI,
  expenses: expensesAPI,
  settlements: settlementsAPI,
};
