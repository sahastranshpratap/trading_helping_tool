import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [performance, setPerformance] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [patterns, setPatterns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [performanceRes, suggestionsRes, patternsRes] = await Promise.all([
        axios.get('/api/analytics/performance'),
        axios.get('/api/analytics/suggestions'),
        axios.get('/api/analytics/patterns')
      ]);

      setPerformance(performanceRes.data);
      setSuggestions(suggestionsRes.data.suggestions);
      setPatterns(patternsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch analytics data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const performanceChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Profit/Loss',
        data: [0, 100, 200, 150, 300, 250],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h2>
          {performance && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Total Trades</h3>
                <p className="text-2xl font-semibold text-gray-900">{performance.total_trades}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Win Rate</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {(performance.win_rate * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Total Profit</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{performance.total_profit.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Chart</h2>
          <div className="h-64">
            <Line data={performanceChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Trading Suggestions</h2>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-primary-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2 text-sm text-gray-700">{suggestion}</p>
              </li>
            ))}
          </ul>
        </div>

        {patterns && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Trading Patterns</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Most Traded Symbols</h3>
                <ul className="space-y-2">
                  {Object.entries(patterns.most_traded_symbols).map(([symbol, count]) => (
                    <li key={symbol} className="flex justify-between">
                      <span className="text-sm text-gray-700">{symbol}</span>
                      <span className="text-sm text-gray-500">{count} trades</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Position Type Distribution</h3>
                <ul className="space-y-2">
                  {Object.entries(patterns.position_type_distribution).map(([type, count]) => (
                    <li key={type} className="flex justify-between">
                      <span className="text-sm text-gray-700">{type}</span>
                      <span className="text-sm text-gray-500">{count} trades</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics; 