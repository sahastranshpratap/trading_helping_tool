import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

const TradeForm = ({ onSave, onCancel }) => {
  const [trade, setTrade] = useState({
    symbol: '',
    entryPrice: '',
    exitPrice: '',
    positionSize: '',
    tradeType: 'buy',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(trade);
  };

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] p-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Trade</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Symbol</label>
          <input
            type="text"
            value={trade.symbol}
            onChange={(e) => setTrade({ ...trade, symbol: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-[#1F1F23] dark:text-white"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Entry Price</label>
            <input
              type="number"
              value={trade.entryPrice}
              onChange={(e) => setTrade({ ...trade, entryPrice: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-[#1F1F23] dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Exit Price</label>
            <input
              type="number"
              value={trade.exitPrice}
              onChange={(e) => setTrade({ ...trade, exitPrice: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-[#1F1F23] dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position Size</label>
          <input
            type="number"
            value={trade.positionSize}
            onChange={(e) => setTrade({ ...trade, positionSize: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-[#1F1F23] dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Trade Type</label>
          <select
            value={trade.tradeType}
            onChange={(e) => setTrade({ ...trade, tradeType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-[#1F1F23] dark:text-white"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
          <textarea
            value={trade.notes}
            onChange={(e) => setTrade({ ...trade, notes: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-[#1F1F23] dark:text-white"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#1F1F23] rounded-md hover:bg-gray-200 dark:hover:bg-[#2F2F33]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Trade
          </button>
        </div>
      </form>
    </div>
  );
};

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [trades, setTrades] = useState({});

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setShowTradeForm(true);
  };

  const handleSaveTrade = (trade) => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    setTrades(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), { ...trade, date: selectedDate }]
    }));
    setShowTradeForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trading Calendar</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#1F1F23]"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#1F1F23]"
            >
              <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}

          {days.map((day, dayIdx) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayTrades = trades[dateKey] || [];
            
            return (
              <div
                key={day.toString()}
                className={`
                  relative p-2 h-24 border border-gray-200 dark:border-[#1F1F23] rounded-md
                  ${isSameMonth(day, currentMonth) ? 'bg-white dark:bg-[#0F0F12]' : 'bg-gray-50 dark:bg-[#1F1F23]'}
                  ${isSameDay(day, selectedDate) ? 'ring-2 ring-blue-500' : ''}
                  hover:bg-gray-50 dark:hover:bg-[#1F1F23] cursor-pointer
                `}
                onClick={() => handleDateClick(day)}
              >
                <span className={`
                  text-sm
                  ${isSameMonth(day, currentMonth) ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}
                `}>
                  {format(day, 'd')}
                </span>
                {dayTrades.length > 0 && (
                  <div className="absolute bottom-1 right-1">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {dayTrades.length}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showTradeForm && (
        <TradeForm
          onSave={handleSaveTrade}
          onCancel={() => setShowTradeForm(false)}
        />
      )}

      {selectedDate && trades[format(selectedDate, 'yyyy-MM-dd')] && (
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] p-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Trades for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          <div className="space-y-4">
            {trades[format(selectedDate, 'yyyy-MM-dd')].map((trade, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-[#1F1F23] rounded-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{trade.symbol}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {trade.tradeType === 'buy' ? 'Buy' : 'Sell'} | Entry: {trade.entryPrice} | Exit: {trade.exitPrice}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    trade.tradeType === 'buy'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {trade.tradeType === 'buy' ? 'Long' : 'Short'}
                  </span>
                </div>
                {trade.notes && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{trade.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar; 