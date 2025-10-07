import { subDays, format, parseISO, isAfter, isBefore, addDays } from 'date-fns';

// Helper to generate random numbers
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDecimal = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);

// Generate dates for the last 90 days
const generateRecentDate = (daysAgo = 90) => {
  const date = subDays(new Date(), randomInRange(0, daysAgo));
  return format(date, 'yyyy-MM-dd');
};

// Possible values for trade properties
const SYMBOLS = ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'PYPL', 'ADBE', 'INTC', 'CSCO', 'CMCSA', 'PEP', 'AVGO', 'TXN', 'QCOM', 'COST', 'TMUS', 'CHTR', 'SBUX', 'MDLZ', 'AMAT', 'AMD', 'BKNG', 'ADI', 'GILD', 'LRCX', 'MU', 'ATVI', 'CSX', 'BIIB', 'ISRG', 'VRTX'];
const STRATEGIES = ['Breakout', 'Support Bounce', 'Resistance Break', 'Gap Fill', 'Trend Following', 'Reversal', 'Swing', 'Scalp', 'Momentum', 'Pullback', 'Fib Retracement', 'VWAP Bounce', 'Earnings Play', 'News Event'];
const POSITIONS = ['Long', 'Short'];
const TIMES_OF_DAY = ['Pre-market', 'Morning', 'Afternoon', 'Power Hour', 'Closing'];
const EMOTIONS = ['Confident', 'Anxious', 'Excited', 'Fearful', 'Neutral', 'Frustrated', 'Impatient', 'Greedy', 'Calm', 'Cautious', 'Focused'];
const SECTORS = ['Technology', 'Healthcare', 'Finance', 'Consumer Cyclical', 'Energy', 'Utilities', 'Real Estate', 'Basic Materials', 'Communication Services', 'Industrial', 'Consumer Defensive'];
const TIMEFRAMES = ['Intraday', 'Swing', 'Position', 'Day Trade', 'Scalp'];
const PATTERNS = ['Bullish Flag', 'Bearish Flag', 'Double Top', 'Double Bottom', 'Head and Shoulders', 'Inverse H&S', 'Cup and Handle', 'Triangle', 'Wedge', 'Pennant', 'Channel', 'Island Reversal'];
const CUSTOM_TAGS = ['High Conviction', 'Low Conviction', 'Follow Plan', 'Deviated From Plan', 'Revenge Trade', 'FOMO', 'Oversize', 'Undersize', 'Perfect Setup', 'Questionable Setup', 'Gap Strategy', 'First Hour', 'EOD Play'];
const PERFORMANCE_RATINGS = [1, 2, 3, 4, 5];
const MISTAKES = ['Early Entry', 'Late Entry', 'Early Exit', 'Late Exit', 'Ignored Stop Loss', 'Overtraded', 'Emotional Decision', 'No Plan', 'Position Sizing', 'Averaging Down', 'Chasing', 'No Confirmation'];

// Generate random tags for a trade
const generateTags = () => {
  const sectors = Math.random() > 0.7 ? [] : [SECTORS[randomInRange(0, SECTORS.length - 1)]];
  const timeframes = Math.random() > 0.7 ? [] : [TIMEFRAMES[randomInRange(0, TIMEFRAMES.length - 1)]];
  const patterns = Math.random() > 0.5 ? [] : [PATTERNS[randomInRange(0, PATTERNS.length - 1)]];
  
  // Generate 0-3 custom tags
  const customTagCount = randomInRange(0, 3);
  const customTags = [];
  for (let i = 0; i < customTagCount; i++) {
    const tag = CUSTOM_TAGS[randomInRange(0, CUSTOM_TAGS.length - 1)];
    if (!customTags.includes(tag)) {
      customTags.push(tag);
    }
  }
  
  return {
    sector: sectors,
    timeframe: timeframes,
    pattern: patterns,
    custom: customTags
  };
};

// Generate a single trade
const generateTrade = (id) => {
  const entryDate = generateRecentDate();
  const isWinning = Math.random() > 0.4; // 60% winning trades
  const position = POSITIONS[randomInRange(0, POSITIONS.length - 1)];
  const symbol = SYMBOLS[randomInRange(0, SYMBOLS.length - 1)];
  
  // Base price between $10 and $1000
  const basePrice = randomDecimal(10, 1000);
  
  // Different range for winning vs losing
  const pnlPercent = isWinning 
    ? randomDecimal(0.5, 5) // winning trade: 0.5% to 5% 
    : -randomDecimal(0.5, 3); // losing trade: -0.5% to -3%
  
  const entry = basePrice;
  const exit = basePrice * (1 + pnlPercent / 100);
  
  // Adjust based on position type
  const normalizedEntry = position === 'Long' ? entry : exit;
  const normalizedExit = position === 'Long' ? exit : entry;
  
  // Generate risk values
  const stopLoss = position === 'Long' 
    ? normalizedEntry * (1 - randomDecimal(0.5, 2) / 100) 
    : normalizedEntry * (1 + randomDecimal(0.5, 2) / 100);
  
  const target = position === 'Long'
    ? normalizedEntry * (1 + randomDecimal(1, 5) / 100)
    : normalizedEntry * (1 - randomDecimal(1, 5) / 100);
  
  // Calculate actual P&L
  const quantity = randomInRange(1, 100);
  const pnl = (normalizedExit - normalizedEntry) * quantity;
  
  // Generate between 0-2 mistakes for the trade
  const mistakeCount = Math.random() > 0.6 ? randomInRange(1, 2) : 0;
  const mistakes = [];
  for (let i = 0; i < mistakeCount; i++) {
    const mistake = MISTAKES[randomInRange(0, MISTAKES.length - 1)];
    if (!mistakes.includes(mistake)) {
      mistakes.push(mistake);
    }
  }

  return {
    id,
    symbol,
    entry: parseFloat(normalizedEntry.toFixed(2)),
    exit: parseFloat(normalizedExit.toFixed(2)),
    quantity,
    position,
    strategy: STRATEGIES[randomInRange(0, STRATEGIES.length - 1)],
    entryDate,
    exitDate: format(addDays(parseISO(entryDate), randomInRange(0, 5)), 'yyyy-MM-dd'),
    timeOfDay: TIMES_OF_DAY[randomInRange(0, TIMES_OF_DAY.length - 1)],
    pnl: parseFloat(pnl.toFixed(2)),
    stopLoss: parseFloat(stopLoss.toFixed(2)),
    target: parseFloat(target.toFixed(2)),
    tags: generateTags(),
    performanceRating: PERFORMANCE_RATINGS[randomInRange(0, PERFORMANCE_RATINGS.length - 1)],
    notes: `${isWinning ? 'Good' : 'Poor'} trade on ${symbol}. ${Math.random() > 0.5 ? 'Followed my trading plan.' : 'Needs improvement on execution.'}`,
    emotion: EMOTIONS[randomInRange(0, EMOTIONS.length - 1)],
    mistakes
  };
};

// Generate a list of trades
const generateTrades = (count = 50) => {
  const trades = [];
  for (let i = 1; i <= count; i++) {
    trades.push(generateTrade(i));
  }
  return trades;
};

// Mock list of all trades
const mockTrades = generateTrades(100);

// Mock user profiles
const mockUsers = [
  {
    id: 1,
    username: 'trader1',
    email: 'trader1@example.com',
    name: 'John Trader',
    joined: '2023-01-15',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Day trader focused on momentum strategies',
    preferences: {
      theme: 'dark',
      defaultTimeframe: 'week',
      notifications: true,
      riskPerTrade: 1.5,
      currency: 'USD',
      timezone: 'America/New_York'
    }
  },
  {
    id: 2,
    username: 'swingtrader',
    email: 'swing@example.com',
    name: 'Emma Swing',
    joined: '2023-02-20',
    profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Swing trader specializing in tech stocks',
    preferences: {
      theme: 'light',
      defaultTimeframe: 'month',
      notifications: false,
      riskPerTrade: 2,
      currency: 'EUR',
      timezone: 'Europe/London'
    }
  }
];

// Mock user settings
const mockSettings = {
  appearance: {
    theme: 'dark',
    dataVisualization: 'detailed',
    compactMode: false,
    fontSize: 'medium'
  },
  trading: {
    defaultPosition: 'Long',
    defaultQuantity: 10,
    riskPercentage: 1,
    defaultTimeframe: 'Day',
    preferredMarkets: ['US Equities', 'Crypto']
  },
  notifications: {
    emailAlerts: true,
    tradeReminders: true,
    marketNews: false,
    priceAlerts: true
  },
  privacy: {
    publicProfile: false,
    showRealMoney: false,
    anonymizeData: true
  },
  apiConnections: {
    connectedBrokers: ['TDAmeritrade'],
    dataImport: true,
    autoSync: false
  }
};

// Generate analytics summaries
const generateAnalyticsSummary = (timeframe) => {
  // Filter trades by timeframe
  let filteredTrades = [...mockTrades];
  
  if (timeframe !== 'all') {
    const today = new Date();
    let startDate;
    
    switch (timeframe) {
      case 'day':
        startDate = subDays(today, 1);
        break;
      case 'week':
        startDate = subDays(today, 7);
        break;
      case 'month':
        startDate = subDays(today, 30);
        break;
      case 'year':
        startDate = subDays(today, 365);
        break;
      default:
        startDate = subDays(today, 9999); // All time
    }
    
    filteredTrades = filteredTrades.filter(trade => 
      isAfter(parseISO(trade.entryDate), startDate) && 
      isBefore(parseISO(trade.entryDate), today)
    );
  }
  
  // Calculate metrics
  const winningTrades = filteredTrades.filter(trade => trade.pnl > 0);
  const losingTrades = filteredTrades.filter(trade => trade.pnl < 0);
  
  const totalPnL = filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0));
  
  const winRate = filteredTrades.length > 0 ? (winningTrades.length / filteredTrades.length) * 100 : 0;
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : grossProfit > 0 ? "∞" : 0;
  const averagePnL = filteredTrades.length > 0 ? totalPnL / filteredTrades.length : 0;
  
  // Find best and worst trades
  const bestTrade = filteredTrades.length > 0 
    ? filteredTrades.reduce((best, trade) => trade.pnl > best.pnl ? trade : best, filteredTrades[0])
    : null;
    
  const worstTrade = filteredTrades.length > 0 
    ? filteredTrades.reduce((worst, trade) => trade.pnl < worst.pnl ? trade : worst, filteredTrades[0])
    : null;
  
  // Calculate performance by strategy
  const strategyPerformance = STRATEGIES.map(strategy => {
    const strategyTrades = filteredTrades.filter(t => t.strategy === strategy);
    if (strategyTrades.length === 0) return null;
    
    const totalPnL = strategyTrades.reduce((sum, t) => sum + t.pnl, 0);
    const winningStrategyTrades = strategyTrades.filter(t => t.pnl > 0);
    
    return {
      name: strategy,
      performance: parseFloat(totalPnL.toFixed(2)),
      performancePercent: Math.min(Math.abs(totalPnL / 100), 100),
      winRate: strategyTrades.length > 0 ? Math.round((winningStrategyTrades.length / strategyTrades.length) * 100) : 0,
      tradeCount: strategyTrades.length
    };
  }).filter(Boolean);
  
  // Calculate performance by symbol
  const symbolPerformance = SYMBOLS.slice(0, 15).map(symbol => {
    const symbolTrades = filteredTrades.filter(t => t.symbol === symbol);
    if (symbolTrades.length === 0) return null;
    
    const totalPnL = symbolTrades.reduce((sum, t) => sum + t.pnl, 0);
    const winningSymbolTrades = symbolTrades.filter(t => t.pnl > 0);
    
    return {
      name: symbol,
      performance: parseFloat(totalPnL.toFixed(2)),
      performancePercent: Math.min(Math.abs(totalPnL / 100), 100),
      winRate: symbolTrades.length > 0 ? Math.round((winningSymbolTrades.length / symbolTrades.length) * 100) : 0,
      tradeCount: symbolTrades.length
    };
  }).filter(Boolean);
  
  // Calculate performance by time of day
  const timePerformance = TIMES_OF_DAY.map(timeOfDay => {
    const timeTrades = filteredTrades.filter(t => t.timeOfDay === timeOfDay);
    if (timeTrades.length === 0) return null;
    
    const totalPnL = timeTrades.reduce((sum, t) => sum + t.pnl, 0);
    const winningTimeTrades = timeTrades.filter(t => t.pnl > 0);
    
    return {
      name: timeOfDay,
      performance: parseFloat(totalPnL.toFixed(2)),
      performancePercent: Math.min(Math.abs(totalPnL / 100), 100),
      winRate: timeTrades.length > 0 ? Math.round((winningTimeTrades.length / timeTrades.length) * 100) : 0,
      tradeCount: timeTrades.length
    };
  }).filter(Boolean);
  
  // Generate tag analysis data
  const generateTagAnalysis = () => {
    const tagCategories = ['sector', 'timeframe', 'pattern', 'custom'];
    const tagAnalysis = {};
    
    tagCategories.forEach(category => {
      const uniqueTags = new Set();
      
      // Collect all unique tags in this category
      filteredTrades.forEach(trade => {
        if (trade.tags[category]) {
          trade.tags[category].forEach(tag => uniqueTags.add(tag));
        }
      });
      
      // Calculate performance for each tag
      tagAnalysis[category] = Array.from(uniqueTags).map(tag => {
        // Find trades with this tag
        const tagTrades = filteredTrades.filter(trade => 
          trade.tags[category] && trade.tags[category].includes(tag)
        );
        
        if (tagTrades.length === 0) return null;
        
        const tagTotalPnL = tagTrades.reduce((sum, t) => sum + t.pnl, 0);
        const winningTagTrades = tagTrades.filter(t => t.pnl > 0);
        
        return {
          tag,
          performance: parseFloat(tagTotalPnL.toFixed(2)),
          performancePercent: Math.min(Math.abs(tagTotalPnL / 100), 100),
          winRate: tagTrades.length > 0 ? Math.round((winningTagTrades.length / tagTrades.length) * 100) : 0,
          tradeCount: tagTrades.length
        };
      }).filter(Boolean);
    });
    
    return tagAnalysis;
  };
  
  return {
    summary: {
      winRate: winRate.toFixed(1),
      profitFactor,
      averagePnL: parseFloat(averagePnL.toFixed(2)),
      totalPnL: parseFloat(totalPnL.toFixed(2)),
      totalTrades: filteredTrades.length,
      bestTrade: bestTrade ? {
        symbol: bestTrade.symbol,
        pnl: bestTrade.pnl,
        date: bestTrade.entryDate
      } : null,
      worstTrade: worstTrade ? {
        symbol: worstTrade.symbol,
        pnl: worstTrade.pnl,
        date: worstTrade.entryDate
      } : null
    },
    performance: {
      byStrategy: strategyPerformance,
      bySymbol: symbolPerformance,
      byTimeOfDay: timePerformance
    },
    tagAnalysis: generateTagAnalysis(),
    trades: filteredTrades
  };
};

// API endpoint functions
const mockDataService = {
  // Trades API
  getTrades: async (filters = {}) => {
    let filteredTrades = [...mockTrades];
    
    // Apply filters
    if (filters.startDate) {
      filteredTrades = filteredTrades.filter(trade => 
        isAfter(parseISO(trade.entryDate), parseISO(filters.startDate)) || 
        trade.entryDate === filters.startDate
      );
    }
    
    if (filters.endDate) {
      filteredTrades = filteredTrades.filter(trade => 
        isBefore(parseISO(trade.entryDate), parseISO(filters.endDate)) || 
        trade.entryDate === filters.endDate
      );
    }
    
    if (filters.symbol) {
      filteredTrades = filteredTrades.filter(trade => 
        trade.symbol.toLowerCase().includes(filters.symbol.toLowerCase())
      );
    }
    
    if (filters.strategy) {
      filteredTrades = filteredTrades.filter(trade => 
        trade.strategy === filters.strategy
      );
    }
    
    if (filters.position) {
      filteredTrades = filteredTrades.filter(trade => 
        trade.position === filters.position
      );
    }
    
    // Simulate async API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: filteredTrades,
          total: filteredTrades.length,
          page: filters.page || 1,
          pageSize: filters.pageSize || 25,
          totalPages: Math.ceil(filteredTrades.length / (filters.pageSize || 25))
        });
      }, 500);
    });
  },
  
  getTrade: async (id) => {
    const trade = mockTrades.find(t => t.id === parseInt(id));
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (trade) {
          resolve({ data: trade });
        } else {
          reject({ status: 404, message: 'Trade not found' });
        }
      }, 300);
    });
  },
  
  createTrade: async (tradeData) => {
    const newId = mockTrades.length > 0 ? Math.max(...mockTrades.map(t => t.id)) + 1 : 1;
    const newTrade = { id: newId, ...tradeData };
    
    return new Promise(resolve => {
      setTimeout(() => {
        mockTrades.push(newTrade);
        resolve({ data: newTrade, message: 'Trade created successfully' });
      }, 600);
    });
  },
  
  updateTrade: async (id, tradeData) => {
    const index = mockTrades.findIndex(t => t.id === parseInt(id));
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (index !== -1) {
          mockTrades[index] = { ...mockTrades[index], ...tradeData };
          resolve({ data: mockTrades[index], message: 'Trade updated successfully' });
        } else {
          reject({ status: 404, message: 'Trade not found' });
        }
      }, 600);
    });
  },
  
  deleteTrade: async (id) => {
    const index = mockTrades.findIndex(t => t.id === parseInt(id));
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (index !== -1) {
          mockTrades.splice(index, 1);
          resolve({ message: 'Trade deleted successfully' });
        } else {
          reject({ status: 404, message: 'Trade not found' });
        }
      }, 400);
    });
  },
  
  // Analytics API
  getAnalytics: async (timeframe = 'all') => {
    const analytics = generateAnalyticsSummary(timeframe);
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: analytics });
      }, 800);
    });
  },
  
  // User API
  getUser: async (username) => {
    const user = mockUsers.find(u => u.username === username);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user) {
          resolve({ data: user });
        } else {
          reject({ status: 404, message: 'User not found' });
        }
      }, 300);
    });
  },
  
  updateUser: async (username, userData) => {
    const index = mockUsers.findIndex(u => u.username === username);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (index !== -1) {
          mockUsers[index] = { ...mockUsers[index], ...userData };
          resolve({ data: mockUsers[index], message: 'User updated successfully' });
        } else {
          reject({ status: 404, message: 'User not found' });
        }
      }, 500);
    });
  },
  
  // Settings API
  getSettings: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: mockSettings });
      }, 300);
    });
  },
  
  updateSettings: async (settingsData) => {
    return new Promise(resolve => {
      setTimeout(() => {
        Object.assign(mockSettings, settingsData);
        resolve({ data: mockSettings, message: 'Settings updated successfully' });
      }, 400);
    });
  },
  
  // Helper methods for mocking errors
  simulateNetworkError: async () => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject({ status: 0, message: 'Network Error' });
      }, 500);
    });
  },
  
  simulateServerError: async () => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject({ status: 500, message: 'Internal Server Error' });
      }, 500);
    });
  },
  
  simulateAuthError: async () => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject({ status: 401, message: 'Unauthorized' });
      }, 300);
    });
  }
};

export default mockDataService; 