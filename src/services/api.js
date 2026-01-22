const API_BASE_URL = 'https://finace-tracker-zgrg.onrender.com';

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
    credentials: 'include',
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
  register: (userData) => apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getProfile: () => apiRequest('/api/auth/profile'),
  
  updateProfile: (data) => apiRequest('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  updateSettings: (settings) => apiRequest('/api/auth/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  }),
  
  changePassword: (passwords) => apiRequest('/api/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwords),
  }),
};

// Members API
export const membersAPI = {
  getAll: () => apiRequest('/api/members'),
  
  add: (name) => apiRequest('/api/members', {
    method: 'POST',
    body: JSON.stringify({ name }),
  }),
  
  update: (id, name) => apiRequest(`/api/members/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  }),
  
  delete: (id) => apiRequest(`/api/members/${id}`, {
    method: 'DELETE',
  }),
  
  getStats: (id) => apiRequest(`/api/members/${id}/stats`),
};

// Expenses API
export const expensesAPI = {
  getAll: () => apiRequest('/api/expenses'),
  
  getOne: (id) => apiRequest(`/api/expenses/${id}`),
  
  add: (expense) => apiRequest('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  }),
  
  update: (id, expense) => apiRequest(`/api/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expense),
  }),
  
  delete: (id) => apiRequest(`/api/expenses/${id}`, {
    method: 'DELETE',
  }),
  
  getStats: () => apiRequest('/api/expenses/stats'),
  
  getBalances: () => apiRequest('/api/expenses/balances'),
};

// Settlements API
export const settlementsAPI = {
  getAll: () => apiRequest('/api/settlements'),
  
  create: (settlement) => apiRequest('/api/settlements', {
    method: 'POST',
    body: JSON.stringify(settlement),
  }),
  
  complete: (id) => apiRequest(`/api/settlements/${id}/complete`, {
    method: 'PUT',
  }),
  
  delete: (id) => apiRequest(`/api/settlements/${id}`, {
    method: 'DELETE',
  }),
  
  settleAll: () => apiRequest('/api/settlements/settle-all', {
    method: 'POST',
  }),
};

export default {
  auth: authAPI,
  members: membersAPI,
  expenses: expensesAPI,
  settlements: settlementsAPI,
};
