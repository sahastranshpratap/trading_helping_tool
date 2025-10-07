import mockDataService from './mockData';

// Configuration for determining which service to use
const config = {
  // Set to true to use mock data instead of real API endpoints
  useMockData: true,
  
  // API base URL for backend
  apiBaseUrl: 'http://localhost:5000/api',
  
  // API version
  apiVersion: 'v1',
  
  // Request timeout in milliseconds
  timeout: 10000
};

// Helper to determine if we should use mock data or real API
const shouldUseMockData = () => {
  // Check if we're in development mode and configured to use mock data
  return process.env.NODE_ENV === 'development' && config.useMockData;
};

// Mock API service implementations for development
const mockApiService = {
  // Trade-related endpoints
  trades: {
    getAll: async (filters = {}) => {
      return mockDataService.getTrades(filters);
    },
    
    getById: async (id) => {
      return mockDataService.getTradeById(id);
    },
    
    create: async (tradeData) => {
      return mockDataService.createTrade(tradeData);
    },
    
    update: async (id, tradeData) => {
      return mockDataService.updateTrade(id, tradeData);
    },
    
    delete: async (id) => {
      return mockDataService.deleteTrade(id);
    }
  },
  
  // Analytics endpoints
  analytics: {
    getSummary: async (timeframe = '1M') => {
      return mockDataService.getAnalyticsSummary(timeframe);
    },
    
    getPerformance: async () => {
      return mockDataService.getPerformanceMetrics();
    },
    
    getTradeActivity: async () => {
      return mockDataService.getTradeActivity();
    }
  },
  
  // User profile endpoints
  users: {
    getProfile: async () => {
      return mockDataService.getUserProfile();
    },
    
    updateProfile: async (userData) => {
      return mockDataService.updateUserProfile(userData);
    }
  },
  
  // Settings endpoints
  settings: {
    get: async () => {
      return mockDataService.getUserSettings();
    },
    
    update: async (settingsData) => {
      return mockDataService.updateUserSettings(settingsData);
    }
  }
};

// Real API service implementations (for when not using mock data)
const realApiService = {
  // Trade-related endpoints
  trades: {
    getAll: async (filters = {}) => {
      const response = await fetch(`${config.apiBaseUrl}/trades`);
      if (!response.ok) throw new Error('Failed to fetch trades');
      return response.json();
    },
    
    getById: async (id) => {
      const response = await fetch(`${config.apiBaseUrl}/trades/${id}`);
      if (!response.ok) throw new Error('Failed to fetch trade');
      return response.json();
    },
    
    create: async (tradeData) => {
      const response = await fetch(`${config.apiBaseUrl}/trades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradeData)
      });
      if (!response.ok) throw new Error('Failed to create trade');
      return response.json();
    },
    
    update: async (id, tradeData) => {
      const response = await fetch(`${config.apiBaseUrl}/trades/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradeData)
      });
      if (!response.ok) throw new Error('Failed to update trade');
      return response.json();
    },
    
    delete: async (id) => {
      const response = await fetch(`${config.apiBaseUrl}/trades/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete trade');
      return response.json();
    }
  },
  
  // Analytics endpoints
  analytics: {
    getSummary: async (timeframe = '1M') => {
      const response = await fetch(`${config.apiBaseUrl}/performance-metrics?timeRange=${timeframe}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    
    getPerformance: async () => {
      const response = await fetch(`${config.apiBaseUrl}/performance`);
      if (!response.ok) throw new Error('Failed to fetch performance');
      return response.json();
    },
    
    getTradeActivity: async () => {
      const response = await fetch(`${config.apiBaseUrl}/trade-activity`);
      if (!response.ok) throw new Error('Failed to fetch trade activity');
      return response.json();
    }
  }
};

// Export the appropriate service based on configuration
const apiService = shouldUseMockData() ? mockApiService : realApiService;

// Main API functions
export const api = {
  // Trade operations
  trades: {
    getAll: (filters) => apiService.trades.getAll(filters),
    getById: (id) => apiService.trades.getById(id),
    create: (tradeData) => apiService.trades.create(tradeData),
    update: (id, tradeData) => apiService.trades.update(id, tradeData),
    delete: (id) => apiService.trades.delete(id)
  },
  
  // Analytics operations
  analytics: {
    getSummary: (timeframe) => apiService.analytics.getSummary(timeframe),
    getPerformance: () => apiService.analytics.getPerformance(),
    getTradeActivity: () => apiService.analytics.getTradeActivity()
  },
  
  // User operations
  users: {
    getProfile: () => apiService.users.getProfile(),
    updateProfile: (userData) => apiService.users.updateProfile(userData)
  },
  
  // Settings operations
  settings: {
    get: () => apiService.settings.get(),
    update: (settingsData) => apiService.settings.update(settingsData)
  }
};

export default api; 