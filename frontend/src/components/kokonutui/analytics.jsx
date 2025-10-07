import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CandlestickChart,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { CardLoading, TableLoading } from '../ui/loading';
import TagAnalysis from './tag-analysis';

// Utility function for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Mock data for demonstrations
const mockTradeData = {
  trades: [
    { id: 1, symbol: 'RELIANCE', entry: 2450, exit: 2500, pnl: 50, entryDate: '2023-08-15', exitDate: '2023-08-17', strategy: 'Breakout', timeOfDay: 'Morning', position: 'Long', stopLoss: 2430, target: 2520, quantity: 10, notes: 'Strong momentum on earnings beat', emotion: 'Confident' },
    { id: 2, symbol: 'TATASTEEL', entry: 120, exit: 115, pnl: -5, entryDate: '2023-08-16', exitDate: '2023-08-16', strategy: 'Swing', timeOfDay: 'Afternoon', position: 'Long', stopLoss: 113, target: 125, quantity: 100, notes: 'Exited early due to market weakness', emotion: 'Anxious' },
    { id: 3, symbol: 'HDFCBANK', entry: 1650, exit: 1680, pnl: 30, entryDate: '2023-08-18', exitDate: '2023-08-22', strategy: 'Breakout', timeOfDay: 'Morning', position: 'Long', stopLoss: 1640, target: 1700, quantity: 15, notes: 'Followed the plan exactly', emotion: 'Neutral' },
    { id: 4, symbol: 'INFY', entry: 1450, exit: 1420, pnl: -30, entryDate: '2023-08-21', exitDate: '2023-08-23', strategy: 'Gap Fill', timeOfDay: 'Morning', position: 'Long', stopLoss: 1410, target: 1500, quantity: 20, notes: 'IT sector news affected performance', emotion: 'Disappointed' },
    { id: 5, symbol: 'SBIN', entry: 580, exit: 600, pnl: 20, entryDate: '2023-08-24', exitDate: '2023-08-25', strategy: 'Support Bounce', timeOfDay: 'Afternoon', position: 'Long', stopLoss: 575, target: 610, quantity: 50, notes: 'Good technical setup', emotion: 'Confident' },
    { id: 6, symbol: 'TCS', entry: 3200, exit: 3150, pnl: -50, entryDate: '2023-08-26', exitDate: '2023-08-29', strategy: 'Trend Following', timeOfDay: 'Morning', position: 'Long', stopLoss: 3140, target: 3300, quantity: 5, notes: 'Earnings disappoint', emotion: 'Calm' },
    { id: 7, symbol: 'BAJFINANCE', entry: 7100, exit: 7200, pnl: 100, entryDate: '2023-08-28', exitDate: '2023-09-01', strategy: 'Breakout', timeOfDay: 'Morning', position: 'Long', stopLoss: 7050, target: 7300, quantity: 5, notes: 'Strong sector movement', emotion: 'Excited' },
    { id: 8, symbol: 'ICICIBANK', entry: 950, exit: 970, pnl: 20, entryDate: '2023-09-01', exitDate: '2023-09-04', strategy: 'Swing', timeOfDay: 'Afternoon', position: 'Long', stopLoss: 940, target: 980, quantity: 25, notes: 'Banking sector rally', emotion: 'Confident' },
    { id: 9, symbol: 'ASIANPAINT', entry: 3100, exit: 3050, pnl: -50, entryDate: '2023-09-05', exitDate: '2023-09-07', strategy: 'Reversal', timeOfDay: 'Afternoon', position: 'Long', stopLoss: 3040, target: 3180, quantity: 10, notes: 'Supply chain issues reported', emotion: 'Worried' },
    { id: 10, symbol: 'MARUTI', entry: 9800, exit: 10000, pnl: 200, entryDate: '2023-09-08', exitDate: '2023-09-12', strategy: 'Breakout', timeOfDay: 'Morning', position: 'Long', stopLoss: 9700, target: 10100, quantity: 2, notes: 'Auto sales beat expectations', emotion: 'Confident' },
    { id: 11, symbol: 'RELIANCE', entry: 2520, exit: 2480, pnl: -40, entryDate: '2023-09-11', exitDate: '2023-09-13', strategy: 'Support Bounce', timeOfDay: 'Morning', position: 'Long', stopLoss: 2470, target: 2550, quantity: 10, notes: 'Oil price uncertainty', emotion: 'Confused' },
    { id: 12, symbol: 'TATAMOTORS', entry: 625, exit: 645, pnl: 20, entryDate: '2023-09-14', exitDate: '2023-09-15', strategy: 'Gap Fill', timeOfDay: 'Afternoon', position: 'Long', stopLoss: 620, target: 650, quantity: 40, notes: 'New model announcement', emotion: 'Excited' }
  ]
};

// Analytics Dashboard Metric Card
const MetricCard = ({ title, value, icon: Icon, change, changeType = "neutral", tooltip }) => (
  <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] shadow-sm p-4">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
      </div>
      <div className="p-2 rounded-lg bg-gray-100 dark:bg-[#1F1F23]">
        <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </div>
    </div>
    {change && (
      <div className="mt-2 flex items-center">
        {changeType === "positive" && <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />}
        {changeType === "negative" && <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />}
        <span className={cn(
          "text-sm",
          changeType === "positive" && "text-green-500",
          changeType === "negative" && "text-red-500",
          changeType === "neutral" && "text-gray-500 dark:text-gray-400"
        )}>
          {change}
        </span>
      </div>
    )}
    {tooltip && (
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {tooltip}
      </div>
    )}
  </div>
);

// Chart component (placeholder - would be replaced with a real chart library)
const ChartSection = ({ title, description, type, data, className }) => (
  <div className={cn("bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] shadow-sm", className)}>
    <div className="p-4 border-b border-gray-200 dark:border-[#1F1F23]">
      <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
    </div>
    <div className="p-4 h-64 flex items-center justify-center">
      {type === "line" && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <LineChart className="w-10 h-10 text-gray-400 dark:text-gray-600 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Line chart visualization would appear here</p>
        </div>
      )}
      {type === "bar" && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <BarChart3 className="w-10 h-10 text-gray-400 dark:text-gray-600 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Bar chart visualization would appear here</p>
        </div>
      )}
      {type === "pie" && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <PieChart className="w-10 h-10 text-gray-400 dark:text-gray-600 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Pie chart visualization would appear here</p>
        </div>
      )}
      {type === "candlestick" && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <CandlestickChart className="w-10 h-10 text-gray-400 dark:text-gray-600 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Candlestick chart visualization would appear here</p>
        </div>
      )}
    </div>
  </div>
);

// Table for trade breakdown
const TradeBreakdownTable = ({ trades }) => (
  <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] shadow-sm">
    <div className="p-4 border-b border-gray-200 dark:border-[#1F1F23]">
      <h3 className="font-bold text-gray-900 dark:text-white">Recent Trades</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 dark:bg-[#151518] text-left">
            <th className="p-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Symbol</th>
            <th className="p-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entry</th>
            <th className="p-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exit</th>
            <th className="p-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">P&L</th>
            <th className="p-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Strategy</th>
            <th className="p-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {trades.map((trade) => (
            <tr key={trade.id} className="text-sm">
              <td className="p-3 text-gray-900 dark:text-white font-medium">{trade.symbol}</td>
              <td className="p-3 text-gray-500 dark:text-gray-400">₹{trade.entry}</td>
              <td className="p-3 text-gray-500 dark:text-gray-400">₹{trade.exit}</td>
              <td className={cn(
                "p-3 font-medium",
                trade.pnl > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {trade.pnl > 0 ? '+' : ''}₹{trade.pnl}
              </td>
              <td className="p-3 text-gray-500 dark:text-gray-400">{trade.strategy}</td>
              <td className="p-3 text-gray-500 dark:text-gray-400">{trade.entryDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Performance by factor (time, day, strategy)
const PerformanceByFactorSection = ({ title, icon: Icon, factors }) => (
  <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] shadow-sm">
    <div className="p-4 border-b border-gray-200 dark:border-[#1F1F23] flex items-center">
      <Icon className="w-5 h-5 text-gray-900 dark:text-white mr-2" />
      <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <div className="p-1">
      {factors.map((factor, index) => (
        <div key={index} className="p-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{factor.name}</span>
            <span className={cn(
              "text-sm font-medium",
              factor.performance > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {factor.performance > 0 ? '+' : ''}₹{factor.performance}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full",
                factor.performance > 0 ? "bg-green-500" : "bg-red-500"
              )} 
              style={{ width: `${Math.min(Math.abs(factor.performancePercent), 100)}%` }}
            ></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{factor.winRate}% win rate</span>
            <span>{factor.tradeCount} trades</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Main Analytics Component
const AnalyticsPage = () => {
  const [trades, setTrades] = useState([]);
  const [timeframe, /*setTimeframe*/] = useState('all');  // Unused - commented value
  const [loading, setLoading] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Calculate metrics from trades
  const [analytics, setAnalytics] = useState({
    winRate: 0,
    profitFactor: 0,
    avgTradeDuration: 0,
    totalTrades: 0,
    totalProfit: 0,
    bestTrade: null,
    worstTrade: null,
    patterns: [],
    insights: []
  });
  
  // Calculate performance by different factors
  // These state variables are currently unused but may be needed in the future
  // eslint-disable-next-line no-unused-vars
  const [performanceByTime, setPerformanceByTime] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [performanceByStrategy, setPerformanceByStrategy] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [performanceBySymbol, setPerformanceBySymbol] = useState([]);
  
  // New state for tag analysis data
  const [tagAnalysisData, setTagAnalysisData] = useState({});
  
  // Function to refresh data
  const refreshData = () => {
    setRefreshing(true);
    // Simulate API fetch - this would be your actual API call
    fetchData();
  };
  
  const fetchData = () => {
    setLoading(true);
    setLoadingCharts(true);
    
    // Simulate API fetch
    setTimeout(() => {
      const data = mockTradeData.trades;
      setTrades(data);
      
      // Calculate metrics
      const winningTrades = data.filter(trade => trade.pnl > 0);
      const losingTrades = data.filter(trade => trade.pnl < 0);
      
      const totalPnL = data.reduce((sum, trade) => sum + trade.pnl, 0);
      const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0);
      const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0));
      
      const winRate = data.length > 0 ? (winningTrades.length / data.length) * 100 : 0;
      const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : grossProfit > 0 ? "∞" : 0;
      const averagePnL = data.length > 0 ? totalPnL / data.length : 0;
      
      // Find best and worst trades
      const bestTrade = data.length > 0 ? Math.max(...data.map(trade => trade.pnl)) : 0;
      const worstTrade = data.length > 0 ? Math.min(...data.map(trade => trade.pnl)) : 0;
      
      // Calculate drawdown (simplified)
      const maxDrawdown = 0.15 * totalPnL; // Just a mock calculation
      
      // Update metrics
      setAnalytics({
        winRate: winRate.toFixed(0),
        profitFactor,
        averagePnL: averagePnL.toFixed(0),
        totalPnL,
        totalTrades: data.length,
        maxDrawdown: maxDrawdown.toFixed(0),
        bestTrade,
        worstTrade,
        averageHoldingTime: "2.3 days", // Mock value
        totalProfit: totalPnL,
        patterns: [],
        insights: []
      });
      
      // Calculate performance by time of day
      const timePerformance = [
        { 
          name: "Morning", 
          performance: data.filter(t => t.timeOfDay === 'Morning').reduce((sum, t) => sum + t.pnl, 0),
          performancePercent: 75,
          winRate: 70,
          tradeCount: data.filter(t => t.timeOfDay === 'Morning').length
        },
        { 
          name: "Afternoon", 
          performance: data.filter(t => t.timeOfDay === 'Afternoon').reduce((sum, t) => sum + t.pnl, 0),
          performancePercent: 45,
          winRate: 55,
          tradeCount: data.filter(t => t.timeOfDay === 'Afternoon').length
        }
      ];
      setPerformanceByTime(timePerformance);
      
      // Calculate performance by strategy
      const strategies = [...new Set(data.map(t => t.strategy))];
      const strategyPerformance = strategies.map(strategy => {
        const strategyTrades = data.filter(t => t.strategy === strategy);
        const totalPnL = strategyTrades.reduce((sum, t) => sum + t.pnl, 0);
        const winningTrades = strategyTrades.filter(t => t.pnl > 0);
        
        return {
          name: strategy,
          performance: totalPnL,
          performancePercent: Math.min(Math.abs(totalPnL / 50), 100),
          winRate: strategyTrades.length > 0 ? Math.round((winningTrades.length / strategyTrades.length) * 100) : 0,
          tradeCount: strategyTrades.length
        };
      });
      setPerformanceByStrategy(strategyPerformance);
      
      // Calculate performance by symbol
      const symbols = [...new Set(data.map(t => t.symbol))];
      const symbolPerformance = symbols.map(symbol => {
        const symbolTrades = data.filter(t => t.symbol === symbol);
        const totalPnL = symbolTrades.reduce((sum, t) => sum + t.pnl, 0);
        const winningTrades = symbolTrades.filter(t => t.pnl > 0);
        
        return {
          name: symbol,
          performance: totalPnL,
          performancePercent: Math.min(Math.abs(totalPnL / 100), 100),
          winRate: symbolTrades.length > 0 ? Math.round((winningTrades.length / symbolTrades.length) * 100) : 0,
          tradeCount: symbolTrades.length
        };
      });
      setPerformanceBySymbol(symbolPerformance);
      
      // Generate mock tag analysis data
      const mockTagData = {
        sector: [
          { tag: "Technology", performance: 350, performancePercent: 80, winRate: 85, tradeCount: 7 },
          { tag: "Finance", performance: 120, performancePercent: 40, winRate: 65, tradeCount: 5 },
          { tag: "Healthcare", performance: -50, performancePercent: 30, winRate: 40, tradeCount: 3 }
        ],
        timeframe: [
          { tag: "Intraday", performance: 200, performancePercent: 60, winRate: 70, tradeCount: 8 },
          { tag: "Swing", performance: 80, performancePercent: 30, winRate: 60, tradeCount: 5 },
          { tag: "Scalp", performance: -30, performancePercent: 20, winRate: 45, tradeCount: 2 }
        ],
        pattern: [
          { tag: "Breakout", performance: 280, performancePercent: 70, winRate: 75, tradeCount: 6 },
          { tag: "Trend Following", performance: 150, performancePercent: 50, winRate: 65, tradeCount: 4 },
          { tag: "Reversal", performance: -100, performancePercent: 40, winRate: 30, tradeCount: 3 }
        ],
        custom: [
          { tag: "High Conviction", performance: 320, performancePercent: 90, winRate: 85, tradeCount: 5 },
          { tag: "News Event", performance: 60, performancePercent: 30, winRate: 60, tradeCount: 3 },
          { tag: "Follow Plan", performance: 180, performancePercent: 60, winRate: 75, tradeCount: 4 }
        ]
      };
      
      setTagAnalysisData(mockTagData);
      
      setLoading(false);
      
      setTimeout(() => {
        setLoadingCharts(false);
        setRefreshing(false);
      }, 800);
    }, 1200);
  };
  
  useEffect(() => {
    fetchData();
  }, [timeframe]);
  
  // Time filter options
  const timeframeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'month', label: 'This Month' },
    { value: 'week', label: 'This Week' },
    { value: 'day', label: 'Today' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              className="flex items-center space-x-1 bg-white dark:bg-[#1F1F23] rounded-lg px-3 py-2 text-sm border border-gray-200 dark:border-[#2D2D32]"
              onClick={() => {/* Toggle dropdown */}}
              disabled={loading || refreshing}
              aria-haspopup="listbox"
              aria-expanded="false"
              aria-label="Select timeframe"
            >
              <span>{timeframeOptions.find(option => option.value === timeframe)?.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {/* Dropdown menu would go here */}
          </div>
          <button
            className="p-2 rounded-lg bg-white dark:bg-[#1F1F23] border border-gray-200 dark:border-[#2D2D32] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            onClick={refreshData}
            disabled={loading || refreshing}
            aria-label="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <CardLoading />
            <CardLoading />
            <CardLoading />
            <CardLoading />
          </>
        ) : (
          <>
            <MetricCard 
              title="Win Rate" 
              value={`${analytics.winRate}%`} 
              icon={Target} 
              change="vs. previous period" 
              changeType="positive" 
            />
            <MetricCard 
              title="Profit Factor" 
              value={analytics.profitFactor} 
              icon={TrendingUp} 
              change="vs. previous period" 
              changeType="positive" 
            />
            <MetricCard 
              title="Average P&L" 
              value={`₹${analytics.averagePnL}`} 
              icon={DollarSign} 
              change="vs. previous period" 
              changeType="positive" 
            />
            <MetricCard 
              title="Max Drawdown" 
              value={`₹${analytics.maxDrawdown}`} 
              icon={TrendingDown} 
              change="vs. previous period" 
              changeType="negative" 
            />
          </>
        )}
      </div>

      {/* Charts sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loadingCharts ? (
          <>
            <CardLoading />
            <CardLoading />
          </>
        ) : (
          <>
            <ChartSection 
              title="Profit & Loss Over Time" 
              description="Cumulative P&L over the selected time period"
              type="line" 
            />
            <ChartSection 
              title="Win/Loss Distribution" 
              description="Distribution of winning and losing trades"
              type="bar" 
            />
          </>
        )}
      </div>

      {/* Performance by factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loadingCharts ? (
          <>
            <CardLoading />
            <CardLoading />
            <CardLoading />
          </>
        ) : (
          <>
            <PerformanceByFactorSection
              title="Performance by Strategy"
              icon={Target}
              factors={[
                { name: "Breakout", performance: 350, performancePercent: 70, winRate: 75, tradeCount: 5 },
                { name: "Swing", performance: 15, performancePercent: 15, winRate: 50, tradeCount: 2 },
                { name: "Gap Fill", performance: -10, performancePercent: 10, winRate: 25, tradeCount: 2 },
                { name: "Support Bounce", performance: -20, performancePercent: 20, winRate: 50, tradeCount: 2 },
                { name: "Trend Following", performance: -50, performancePercent: 50, winRate: 0, tradeCount: 1 }
              ]}
            />
            <PerformanceByFactorSection
              title="Performance by Time"
              icon={Clock}
              factors={[
                { name: "Morning", performance: 210, performancePercent: 60, winRate: 60, tradeCount: 8 },
                { name: "Afternoon", performance: 85, performancePercent: 40, winRate: 75, tradeCount: 4 }
              ]}
            />
            <PerformanceByFactorSection
              title="Top Symbols"
              icon={CandlestickChart}
              factors={[
                { name: "MARUTI", performance: 200, performancePercent: 80, winRate: 100, tradeCount: 1 },
                { name: "BAJFINANCE", performance: 100, performancePercent: 60, winRate: 100, tradeCount: 1 },
                { name: "RELIANCE", performance: 10, performancePercent: 20, winRate: 50, tradeCount: 2 },
                { name: "HDFCBANK", performance: 30, performancePercent: 30, winRate: 100, tradeCount: 1 },
                { name: "ICICIBANK", performance: 20, performancePercent: 20, winRate: 100, tradeCount: 1 }
              ]}
            />
          </>
        )}
      </div>
      
      {/* Tag Analysis Section */}
      <div>
        {loadingCharts ? (
          <CardLoading />
        ) : (
          <TagAnalysis tagData={tagAnalysisData} title="Tag Performance Analysis" />
        )}
      </div>

      {/* Recent trades */}
      <div>
        {loading ? (
          <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] shadow-sm p-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Trades</h3>
            <TableLoading rows={5} />
          </div>
        ) : (
          <TradeBreakdownTable trades={trades.slice(0, 10)} />
        )}
      </div>
    </div>
  );
};

// Timeframe options for the dropdown
// eslint-disable-next-line no-unused-vars
const timeframeLabels = {
  'day': 'Today',
  'week': 'This Week',
  'month': 'This Month',
  'year': 'This Year',
  'all': 'All Time'
};

export default AnalyticsPage; 