import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { RefreshCw, Edit, Trash2, ChevronDown, ChevronUp, Filter } from 'lucide-react';

// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Function to format percentage
const formatPercent = (value) => {
  return `${(value * 100).toFixed(2)}%`;
};

const TradesList = () => {
  // State
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('entryDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Effect to fetch trades on component mount and when filters/sort change
  useEffect(() => {
    fetchTrades();
  }, [filters, sortField, sortDirection]);

  // Function to fetch trades from API
  const fetchTrades = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedTrades = await apiService.trades.getAll({
        ...filters,
        sort: sortField,
        order: sortDirection
      });
      
      setTrades(fetchedTrades);
    } catch (err) {
      console.error('Error fetching trades:', err);
      setError(err.message || 'Failed to fetch trades');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle sorting
  const handleSort = (field) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new sort field
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Function to handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trade?')) return;
    
    try {
      await apiService.trades.delete(id);
      // Remove deleted trade from state
      setTrades(trades.filter(trade => trade.id !== id));
    } catch (err) {
      console.error('Error deleting trade:', err);
      alert('Failed to delete trade: ' + (err.message || 'Unknown error'));
    }
  };

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value
    }));
  };

  // Render loading state
  if (isLoading && trades.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Loading trades...</span>
      </div>
    );
  }

  // Render error state
  if (error && trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p className="text-lg font-semibold">Error loading trades</p>
        <p>{error}</p>
        <button 
          onClick={fetchTrades}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trade History</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md flex items-center"
          >
            <Filter className="mr-1 h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <button
            onClick={fetchTrades}
            className="px-3 py-2 bg-primary text-white rounded-md flex items-center"
            disabled={isLoading}
          >
            <RefreshCw className={`mr-1 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
            <input
              type="text"
              name="symbol"
              value={filters.symbol || ''}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g. AAPL"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Strategy</label>
            <select
              name="strategy"
              value={filters.strategy || ''}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Strategies</option>
              <option value="Breakout">Breakout</option>
              <option value="Swing">Swing</option>
              <option value="Day Trade">Day Trade</option>
              <option value="Position">Position</option>
              <option value="Scalping">Scalping</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position Type</label>
            <select
              name="positionType"
              value={filters.positionType || ''}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Types</option>
              <option value="LONG">Long</option>
              <option value="SHORT">Short</option>
            </select>
          </div>
        </div>
      )}

      {/* Trades table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('entryDate')}
              >
                <div className="flex items-center">
                  Date
                  {sortField === 'entryDate' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center">
                  Symbol
                  {sortField === 'symbol' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('profitLoss')}
              >
                <div className="flex items-center">
                  P&L
                  {sortField === 'profitLoss' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('roi')}
              >
                <div className="flex items-center">
                  ROI
                  {sortField === 'roi' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Strategy
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trades.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No trades found. Try adjusting your filters.
                </td>
              </tr>
            ) : (
              trades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(trade.entryDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {trade.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      trade.positionType === 'LONG' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.positionType === 'LONG' ? 'LONG' : 'SHORT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`font-semibold ${
                      trade.profitLoss > 0 ? 'text-green-600' : trade.profitLoss < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {formatCurrency(trade.profitLoss)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`font-semibold ${
                      trade.roi > 0 ? 'text-green-600' : trade.roi < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {formatPercent(trade.roi)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trade.strategy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit trade"
                        onClick={() => alert(`Edit trade ${trade.id} - Not implemented`)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        title="Delete trade"
                        onClick={() => handleDelete(trade.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination (simple implementation) */}
      {trades.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {trades.length} trade{trades.length !== 1 ? 's' : ''}
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
              disabled={true}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
              disabled={true}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradesList; 