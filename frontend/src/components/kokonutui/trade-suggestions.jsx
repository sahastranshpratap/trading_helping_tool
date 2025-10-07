import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Loader2, ArrowUpRight, ArrowDownLeft, Calendar, TrendingUp } from 'lucide-react';

// Define the base URL for the backend API
const API_BASE_URL = 'http://localhost:5000'; // Assuming backend runs on port 5000

// Utility function for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Format currency to Indian Rupee - memoize for performance
const formatINR = (value) => {
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Format with Indian Rupee symbol and thousands separator
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(numValue);
};

// Constants moved outside component to prevent recreation on each render
const MOCK_TRADES = [
  {
    symbol: 'RELIANCE',
    trade_type: 'buy',
    entry_price: 2850.25,
    exit_price: 2975.50,
    pnl: 125.25,
    setup_type: 'Breakout',
    notes: 'Bought on earnings anticipation'
  },
  {
    symbol: 'HDFCBANK',
    trade_type: 'sell',
    entry_price: 1620.10,
    exit_price: 1575.75,
    pnl: 44.35,
    setup_type: 'Gap down',
    notes: 'Sold on market weakness'
  },
  {
    symbol: 'TATAMOTORS',
    trade_type: 'buy',
    entry_price: 710.30,
    exit_price: 695.45,
    pnl: -14.85,
    setup_type: 'Support level',
    notes: 'Failed support level'
  }
];

const MOCK_SUGGESTIONS = [
  {
    title: 'Focus on Nifty Index Stocks',
    description: 'Your most profitable trades are in Nifty stocks. Consider allocating more capital to these trades, particularly during earnings season.',
    category: 'strategy',
    progress: 78
  },
  {
    title: 'Improve Stop Loss Discipline',
    description: 'Several losing trades could have been minimized with tighter stop losses. Consider setting a max loss of 3% per trade.',
    category: 'risk',
    progress: 35
  },
  {
    title: 'Leverage Breakout Patterns',
    description: 'Your success rate with breakout patterns is 78%, significantly higher than other strategies. Look for similar setups in your watchlist.',
    category: 'pattern',
    progress: 65
  }
];

// Separate components for better code organization and performance
const TradeStats = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Trades</p>
      <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{stats.totalTrades}</p>
    </div>
    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Win Rate</p>
      <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{stats.winRate}%</p>
    </div>
    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Avg. Profit</p>
      <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">{formatINR(stats.avgProfit)}</p>
    </div>
    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Avg. Loss</p>
      <p className="text-xl font-semibold text-red-600 dark:text-red-400">{formatINR(stats.avgLoss)}</p>
    </div>
  </div>
);

const TradeItem = ({ trade }) => (
  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn(
          "p-1.5 rounded-lg",
          trade.pnl > 0
            ? "bg-emerald-100 dark:bg-emerald-900/30"
            : "bg-red-100 dark:bg-red-900/30"
        )}>
          {trade.pnl > 0 
            ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            : <ArrowDownLeft className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          }
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{trade.symbol}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">{trade.trade_type.toUpperCase()}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={cn(
          "text-sm font-medium",
          trade.pnl > 0
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-600 dark:text-red-400"
        )}>
          {trade.pnl > 0 ? "+" : ""}{formatINR(trade.pnl)}
        </span>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {trade.setup_type}
        </p>
      </div>
    </div>
    
    <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Entry:</span>
          <span className="text-gray-900 dark:text-white ml-1">{formatINR(trade.entry_price)}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Exit:</span>
          <span className="text-gray-900 dark:text-white ml-1">{formatINR(trade.exit_price)}</span>
        </div>
      </div>
      {trade.notes && (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic">
          "{trade.notes}"
        </p>
      )}
    </div>
  </div>
);

const SuggestionItem = ({ suggestion }) => (
  <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <MessageSquare className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white">{suggestion.title}</h3>
          </div>
        </div>
        {suggestion.category && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
            {suggestion.category}
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400">{suggestion.description}</p>
      
      {suggestion.progress && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Implementation Progress</span>
            <span className="text-gray-900 dark:text-white">{suggestion.progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 dark:bg-gray-300 rounded-full"
              style={{ width: `${suggestion.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
    
    <div className="border-t border-zinc-200 dark:border-zinc-700">
      <button className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1F1F23] transition-colors">
        View Details
        <ArrowUpRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const ChatMessage = ({ message }) => (
  <div className={cn(
    "p-3 rounded-lg max-w-[80%]",
    message.role === 'user'
      ? "bg-zinc-50 dark:bg-zinc-800/50 ml-auto text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700"
      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700"
  )}>
    {message.content}
  </div>
);

// Performance optimized main component
const TradeSuggestions = ({ trades = [], className }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatMode, setIsChatMode] = useState(false);
  const [tradeStats, setTradeStats] = useState({
    totalTrades: 0,
    winRate: 0,
    avgProfit: 0,
    avgLoss: 0
  });

  // Use mock trades if no trades provided - memoized to prevent recalculation
  const tradeData = useMemo(() => 
    trades.length > 0 ? trades : MOCK_TRADES, 
    [trades]
  );

  // Memoized calculation of trade statistics
  useEffect(() => {
    if (tradeData.length > 0) {
      const winningTrades = tradeData.filter(t => parseFloat(t.pnl) > 0);
      const losingTrades = tradeData.filter(t => parseFloat(t.pnl) < 0);
      const winRate = (winningTrades.length / tradeData.length) * 100;
      
      const avgProfit = winningTrades.length > 0 
        ? winningTrades.reduce((sum, t) => sum + parseFloat(t.pnl), 0) / winningTrades.length 
        : 0;
        
      const avgLoss = losingTrades.length > 0 
        ? Math.abs(losingTrades.reduce((sum, t) => sum + parseFloat(t.pnl), 0) / losingTrades.length)
        : 0;
      
      setTradeStats({
        totalTrades: tradeData.length,
        winRate: winRate.toFixed(1),
        avgProfit: avgProfit.toFixed(2),
        avgLoss: avgLoss.toFixed(2)
      });
    }
  }, [tradeData]);

  // Fetch suggestions from backend - useCallback for dependency array stability
  const generateSuggestions = useCallback(async () => {
    if (!tradeData || tradeData.length === 0) {
      console.log("No trade data available, using mock suggestions.");
      setSuggestions(MOCK_SUGGESTIONS); // Use mock data if no trades
      return;
    }

    setLoading(true);
    setError(null);
    console.log("Generating suggestions for trades:", tradeData); // Log input trades

    try {
      // Prepare trade data - ensure consistent field naming for backend
      const formattedTrades = tradeData.map(trade => ({
        date: trade.entryDate || trade.date || new Date().toISOString().split('T')[0],
        symbol: trade.symbol || 'Unknown',
        type: trade.trade_type || trade.type || 'buy',
        entryPrice: trade.entry_price || trade.entry || trade.entryPrice || 0,
        exitPrice: trade.exit_price || trade.exit || trade.exitPrice || 0,
        positionSize: trade.quantity || trade.position_size || trade.positionSize || 1,
        pnl: trade.pnl || 0,
        notes: trade.notes || ''
      }));

      console.log("Sending analysis with formatted trades:", formattedTrades);
      
      const response = await axios.post(`${API_BASE_URL}/api/gemini/analyze`, { 
        trades: formattedTrades 
      });
      
      console.log("API Response:", response); // Log the full response
      
      if (response.data && response.data.result) {
        // Try to parse the result as JSON if it's a string
        let suggestions;
        try {
          if (typeof response.data.result === 'string') {
            // Parse the JSON string result
            const parsedData = JSON.parse(response.data.result);
            suggestions = parsedData.recommendations || [];
            if (suggestions.length > 0) {
              // Convert to expected format for SuggestionItem
              suggestions = suggestions.map((rec, index) => ({
                title: `Trading Insight ${index + 1}`,
                description: rec,
                category: 'suggestion',
                progress: Math.floor(Math.random() * 100) // Random progress for demonstration
              }));
            }
          } else {
            // Use the result directly if it's already an object
            suggestions = response.data.result.recommendations || [];
          }
        } catch (parseError) {
          console.error("Error parsing suggestions:", parseError);
          // If the response contains an error object
          if (response.data.result && response.data.result.error) {
            setError(`AI service error: ${response.data.result.error}`);
            // Still show mockups but with indication
            suggestions = MOCK_SUGGESTIONS.map(sugg => ({
              ...sugg,
              title: `${sugg.title} (Demo)`,
              description: `${sugg.description} Note: Using sample data while AI service is unavailable.`,
            }));
          } else {
            // If we can't parse, just display the text as a single suggestion
            suggestions = [{
              title: 'Trading Analysis',
              description: response.data.result,
              category: 'analysis',
              progress: 50
            }];
          }
        }
        
        setSuggestions(suggestions.length > 0 ? suggestions : MOCK_SUGGESTIONS);
        console.log("Suggestions set:", suggestions); // Log processed suggestions
      } else {
         console.warn("Received empty or invalid suggestions:", response.data);
         setError("Received invalid suggestions from the server.");
         setSuggestions(MOCK_SUGGESTIONS); // Fallback to mock data on invalid response
      }
    } catch (err) {
      console.error("Error generating suggestions:", err);
      let errorMsg = "Failed to fetch suggestions";
      
      if (err.response) {
        errorMsg += `: ${err.response.data.error || err.response.statusText || err.message}`;
        console.error("Error response:", err.response.data);
      } else if (err.request) {
        errorMsg += ": No response received from server. Check your connection.";
      } else {
        errorMsg += `: ${err.message}`;
      }
      
      setError(errorMsg);
      setSuggestions(MOCK_SUGGESTIONS.map(sugg => ({
        ...sugg,
        title: `${sugg.title} (Demo)`,
        description: `${sugg.description} Note: Using sample data while server is unavailable.`,
      }))); // Fallback to mock suggestions on error
    } finally {
      setLoading(false);
    }
  }, [tradeData]);

  // Initial suggestion generation on component mount or when tradeData changes
  useEffect(() => {
    console.log("Trade data changed, generating suggestions..."); // Log effect trigger
    generateSuggestions();
  }, [generateSuggestions]); // Use the memoized callback here

  // Memoized chat message handler to prevent dependency issues
  const sendChatMessage = useCallback(async () => {
    if (!chatMessage.trim()) return;

    const newUserMessage = { role: 'user', content: chatMessage };
    setChatHistory(prev => [...prev, newUserMessage]);
    setChatMessage(''); // Clear input immediately
    setLoading(true); // Indicate loading for AI response
    setError(null);

    try {
      // Prepare trade data - ensure consistent field naming for backend
      const formattedTrades = tradeData.map(trade => ({
        date: trade.entryDate || trade.date || new Date().toISOString().split('T')[0],
        symbol: trade.symbol || 'Unknown',
        type: trade.trade_type || trade.type || 'buy',
        entryPrice: trade.entry_price || trade.entry || trade.entryPrice || 0,
        exitPrice: trade.exit_price || trade.exit || trade.exitPrice || 0,
        positionSize: trade.quantity || trade.position_size || trade.positionSize || 1,
        pnl: trade.pnl || 0,
        notes: trade.notes || ''
      }));

      console.log("Sending chat with formatted trades:", formattedTrades);
      
      const response = await axios.post(`${API_BASE_URL}/api/gemini/chat`, { 
        question: chatMessage, 
        history: chatHistory.slice(-5), // Send only the last 5 messages to keep context smaller
        trades: formattedTrades 
      });
      
      console.log("Received chat response:", response.data);
      
      if (response.data && (response.data.response || response.data.result)) {
        // Use whatever is available in the response
        const replyContent = response.data.response || response.data.result || 'No specific insights available.';
        const aiMessage = { role: 'assistant', content: replyContent };
        setChatHistory(prev => [...prev, aiMessage]);
      } else {
        console.warn("Received empty or invalid chat response:", response.data);
        const errorMessage = { 
          role: 'assistant', 
          content: "I received an empty response. This might be due to an issue with the AI service. Please try again with a more specific question."
        };
        setChatHistory(prev => [...prev, errorMessage]);
        setError("Received invalid response from chat server.");
      }
    } catch (err) {
      console.error("Chat error details:", err);
      console.error("Error sending chat message:", err.response ? err.response.data : err.message);
      
      // Determine appropriate error message based on the error
      let errorContent = "I'm having trouble connecting to the AI service. This could be due to API limits or configuration issues.";
      
      if (err.response) {
        // Server responded with an error
        if (err.response.status === 400) {
          errorContent = "Your question may be missing required information. Please be more specific.";
        } else if (err.response.status === 429) {
          errorContent = "The AI service is currently handling too many requests. Please try again in a few minutes.";
        } else if (err.response.status >= 500) {
          errorContent = "The server encountered an error. Our team has been notified.";
        }
        
        // Include specific error message if available
        if (err.response.data && err.response.data.error) {
          errorContent += " Error: " + err.response.data.error;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorContent = "Unable to reach the AI service. Please check your internet connection and try again.";
      }
      
      const errorMessage = { role: 'assistant', content: errorContent };
      setChatHistory(prev => [...prev, errorMessage]);
      setError(`Chat error: ${err.response ? err.response.data.error || err.message : err.message}`);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  }, [chatMessage, chatHistory, tradeData]); // Add all dependencies

  // KeyDown handler for the chat input field
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  }, [sendChatMessage]);

  // Tab buttons for switching between insights and chat
  const TabButtons = () => (
    <div className="flex space-x-2">
      <button
        onClick={() => setIsChatMode(false)}
        className={cn(
          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
          !isChatMode 
            ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900" 
            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        )}
      >
        Insights
      </button>
      <button
        onClick={() => setIsChatMode(true)}
        className={cn(
          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
          isChatMode 
            ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900" 
            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        )}
      >
        Chat
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Trading Assistant</h1>
        <TabButtons />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trade Stats Card */}
        <div className="lg:col-span-3 bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-[#1F1F23]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-900 dark:text-white" />
              Performance Metrics
            </h2>
          </div>
          <div className="p-4">
            <TradeStats stats={tradeStats} />
          </div>
        </div>

        {/* Content Area based on Mode */}
        {isChatMode ? (
          <div className="lg:col-span-3 bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] shadow-sm">
            <div className="p-4 border-b border-gray-200 dark:border-[#1F1F23]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-900 dark:text-white" />
                Trading Assistant Chat
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ask questions about your trading patterns and get personalized advice</p>
            </div>

            <div className="p-4 h-[500px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">Ask a question about your trading to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatHistory.map((msg, i) => (
                      <ChatMessage key={i} message={msg} />
                    ))}
                    {loading && (
                      <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg flex items-center space-x-2 max-w-[80%] border border-zinc-200 dark:border-zinc-700">
                        <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-[#1F1F23] pt-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about your trading patterns..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-[#1F1F23] bg-white dark:bg-[#0F0F12] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={loading || !chatMessage.trim()}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg",
                      "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900",
                      "hover:bg-zinc-800 dark:hover:bg-zinc-200",
                      "transition-colors",
                      (loading || !chatMessage.trim()) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Suggestions */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] shadow-sm h-full">
                <div className="p-4 border-b border-gray-200 dark:border-[#1F1F23] flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-900 dark:text-white" />
                      Trading Insights
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered suggestions to improve your trading</p>
                  </div>
                  <button
                    onClick={generateSuggestions}
                    disabled={loading}
                    className={cn(
                      "p-2 rounded-lg",
                      "text-gray-600 dark:text-gray-300",
                      "hover:text-gray-900 dark:hover:text-white",
                      "hover:bg-gray-100 dark:hover:bg-[#1F1F23]",
                      "transition-colors",
                      loading && "opacity-50 cursor-not-allowed"
                    )}
                    title="Refresh suggestions"
                  >
                    <Loader2 className={cn("h-5 w-5", loading && "animate-spin")} />
                  </button>
                </div>

                <div className="p-4 space-y-4 h-[500px] overflow-y-auto">
                  {error ? (
                    <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
                  ) : loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-pulse text-sm text-gray-500 dark:text-gray-400">
                        Analyzing your trades...
                      </div>
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      No suggestions available yet. Add more trades to get personalized insights.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {suggestions.map((suggestion, index) => (
                        <SuggestionItem key={index} suggestion={suggestion} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Recent Trades */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] shadow-sm h-full">
                <div className="p-4 border-b border-gray-200 dark:border-[#1F1F23]">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-900 dark:text-white" />
                    Recent Trades
                  </h2>
                </div>
                
                <div className="p-4 space-y-3 h-[500px] overflow-y-auto">
                  {tradeData.map((trade, index) => (
                    <TradeItem key={index} trade={trade} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(TradeSuggestions); 