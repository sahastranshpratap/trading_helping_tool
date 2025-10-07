import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isToday, parseISO, isSameDay, isAfter, addDays, isSaturday, isSunday, getDay } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Clock
} from 'lucide-react';

// Indian Market Holidays 2023-2024
const MARKET_HOLIDAYS = [
  { date: '2023-01-26', name: 'Republic Day' },
  { date: '2023-03-07', name: 'Holi' },
  { date: '2023-03-30', name: 'Ram Navami' },
  { date: '2023-04-04', name: 'Mahavir Jayanti' },
  { date: '2023-04-07', name: 'Good Friday' },
  { date: '2023-04-14', name: 'Dr. Ambedkar Jayanti' },
  { date: '2023-04-21', name: 'Id-ul-Fitr' },
  { date: '2023-05-01', name: 'Maharashtra Day' },
  { date: '2023-06-28', name: 'Bakri Id' },
  { date: '2023-08-15', name: 'Independence Day' },
  { date: '2023-09-19', name: 'Ganesh Chaturthi' },
  { date: '2023-10-02', name: 'Mahatma Gandhi Jayanti' },
  { date: '2023-10-24', name: 'Dussehra' },
  { date: '2023-11-12', name: 'Diwali' },
  { date: '2023-11-13', name: 'Diwali Balipratipada' },
  { date: '2023-11-27', name: 'Gurunanak Jayanti' },
  { date: '2023-12-25', name: 'Christmas' },
  { date: '2024-01-26', name: 'Republic Day' },
  { date: '2024-03-25', name: 'Holi' },
  { date: '2024-03-29', name: 'Good Friday' },
  { date: '2024-04-11', name: 'Id-Ul-Fitr' },
  { date: '2024-04-17', name: 'Ram Navami' },
  { date: '2024-05-01', name: 'Maharashtra Day' },
  { date: '2024-06-17', name: 'Bakri Id' },
  { date: '2024-08-15', name: 'Independence Day' },
  { date: '2024-10-02', name: 'Mahatma Gandhi Jayanti' },
  { date: '2024-10-31', name: 'Diwali-Laxmi Pujan' },
  { date: '2024-11-01', name: 'Diwali-Balipratipada' },
  { date: '2024-12-25', name: 'Christmas' },
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showHolidayInfo, setShowHolidayInfo] = useState(null);
  const [tradeForm, setTradeForm] = useState({
    symbol: '',
    entry_price: '',
    exit_price: '',
    quantity: '',
    trade_type: 'LONG',
    entry_date: '',
    exit_date: '',
    stop_loss: '',
    take_profit: '',
    notes: '',
    setup_type: '',
  });

  useEffect(() => {
    fetchTrades();
  }, [currentDate]);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      // Simulate API call - in a real app, you'd connect to your backend
      setTimeout(() => {
        const mockTrades = [
          {
            id: 1,
            symbol: 'AAPL',
            trade_type: 'LONG',
            entry_price: 150.25,
            exit_price: 175.50,
            quantity: 10,
            entry_date: '2023-03-05T10:30:00Z',
            exit_date: '2023-03-12T14:45:00Z',
            pnl: 252.50,
            setup_type: 'Breakout',
            notes: 'Strong momentum after earnings'
          },
          {
            id: 2,
            symbol: 'NIFTY',
            trade_type: 'SHORT',
            entry_price: 22450,
            exit_price: 22100,
            quantity: 1,
            entry_date: '2023-03-15T09:15:00Z',
            exit_date: '2023-03-15T15:30:00Z',
            pnl: 350,
            setup_type: 'Reversal',
            notes: 'Short at resistance'
          },
          {
            id: 3,
            symbol: 'INFY',
            trade_type: 'LONG',
            entry_price: 1320,
            exit_price: 1380,
            quantity: 20,
            entry_date: '2023-03-18T10:00:00Z',
            exit_date: '2023-03-25T14:00:00Z',
            pnl: 1200,
            setup_type: 'Swing',
            notes: 'Buy on support'
          }
        ];
        setTrades(mockTrades);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to fetch trades');
      setLoading(false);
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getTradesForDay = (day) => {
    return trades.filter(trade => 
      isSameDay(parseISO(trade.entry_date), day) || 
      isSameDay(parseISO(trade.exit_date), day)
    );
  };

  const isHoliday = (day) => {
    // Check if it's weekend
    if (isSaturday(day) || isSunday(day)) {
      return { isHoliday: true, reason: isSaturday(day) ? 'Saturday' : 'Sunday', type: 'weekend' };
    }
    
    // Check if it's a market holiday
    const formattedDate = format(day, 'yyyy-MM-dd');
    const holiday = MARKET_HOLIDAYS.find(h => h.date === formattedDate);
    
    if (holiday) {
      return { isHoliday: true, reason: holiday.name, type: 'market-holiday' };
    }
    
    return { isHoliday: false };
  };

  const isWeekend = (day) => {
    const dayOfWeek = getDay(day);
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const handleDayClick = (day) => {
    // Don't allow selecting future dates (except today)
    if (isAfter(day, addDays(new Date(), 1))) return;
    
    setSelectedDate(day);
    setTradeForm({
      ...tradeForm,
      entry_date: format(day, 'yyyy-MM-dd') + 'T00:00',
      exit_date: format(day, 'yyyy-MM-dd') + 'T00:00'
    });
    setShowAddForm(true);
  };

  const handleTradeClick = (trade) => {
    setSelectedTrade(trade);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setSelectedDate(null);
  };

  const handleCloseTrade = () => {
    setSelectedTrade(null);
  };
  
  const handleHolidayHover = (day, holidayInfo) => {
    if (holidayInfo.isHoliday) {
      setShowHolidayInfo({ day, info: holidayInfo });
    }
  };
  
  const handleHolidayLeave = () => {
    setShowHolidayInfo(null);
  };

  const handleFormChange = (e) => {
    setTradeForm({
      ...tradeForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulating API call to save trade
      console.log('Submitting trade:', tradeForm);
      
      // In a real app, you'd send this to your backend
      // const response = await axios.post('/api/trades', tradeForm);
      
      // Refresh trades
      fetchTrades();
      
      // Close form
      handleCloseForm();
      
    } catch (err) {
      setError('Failed to save trade');
    }
  };

  const getWeekDayNames = () => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  };

  if (loading && trades.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-white dark:bg-[#0F0F12]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-[#151518] rounded-xl shadow-md dark:shadow-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
          {/* Calendar Header */}
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={goToToday}
                className="px-4 py-2 rounded-md text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Today
              </button>
              
              <div className="flex">
                <button 
                  onClick={prevMonth}
                  className="p-2 rounded-l-md text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={nextMonth}
                  className="p-2 rounded-r-md text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Legend */}
          <div className="px-4 pt-4 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400 dark:bg-amber-500"></div>
              <span className="text-zinc-700 dark:text-zinc-300">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500"></div>
              <span className="text-zinc-700 dark:text-zinc-300">Weekend (Holiday)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400 dark:bg-purple-500"></div>
              <span className="text-zinc-700 dark:text-zinc-300">Market Holiday</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500"></div>
              <span className="text-zinc-700 dark:text-zinc-300">Trading Day</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-4 mb-2">
              {getWeekDayNames().map((day) => (
                <div key={day} className="text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }, (_, i) => (
                <div key={`empty-${i}`} className="h-24 rounded-lg bg-zinc-50 dark:bg-zinc-800/30 opacity-50"></div>
              ))}
              
              {daysInMonth.map((day) => {
                const dayTrades = getTradesForDay(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isCurrentDay = isToday(day);
                const isPastOrToday = !isAfter(day, new Date()) || isToday(day);
                const holidayInfo = isHoliday(day);
                const dayHasHoliday = holidayInfo.isHoliday;
                
                // Color coding
                let bgColorClass = "bg-white dark:bg-zinc-800/50"; // Default for trading days
                let dayStatusClass = "";
                
                if (dayHasHoliday) {
                  if (holidayInfo.type === 'weekend') {
                    bgColorClass = "bg-red-100 dark:bg-red-900/20";
                    dayStatusClass = "text-red-700 dark:text-red-300";
                  } else {
                    bgColorClass = "bg-purple-100 dark:bg-purple-900/20"; 
                    dayStatusClass = "text-purple-700 dark:text-purple-300";
                  }
                } else if (isCurrentDay) {
                  bgColorClass = "bg-amber-100 dark:bg-amber-900/20";
                }
                
                return (
                  <div
                    key={day.toString()}
                    onClick={() => isPastOrToday && !dayHasHoliday && handleDayClick(day)}
                    onMouseEnter={() => handleHolidayHover(day, holidayInfo)}
                    onMouseLeave={handleHolidayLeave}
                    className={`
                      h-24 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800/80
                      ${!isCurrentMonth ? 'opacity-60' : ''}
                      ${isCurrentDay ? 'ring-2 ring-amber-500 dark:ring-amber-400' : ''}
                      ${!dayHasHoliday && isPastOrToday ? 'cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/50' : ''}
                      ${dayHasHoliday ? 'cursor-help' : ''}
                      ${bgColorClass}
                      overflow-hidden flex flex-col
                      transition-colors
                    `}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span 
                        className={`
                          text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center
                          ${isCurrentDay ? 'bg-amber-500 text-white' : dayStatusClass || 'text-zinc-900 dark:text-zinc-300'}
                        `}
                      >
                        {format(day, 'd')}
                      </span>
                      
                      {/* Only show plus button on non-holidays and past/today dates */}
                      {isPastOrToday && !dayHasHoliday && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDayClick(day);
                          }}
                          className="text-zinc-400 hover:text-blue-500 dark:text-zinc-500 dark:hover:text-blue-400 transition-colors"
                          title="Add trade"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      )}
                      
                      {/* Show holiday indicator */}
                      {dayHasHoliday && (
                        <span className={`text-xs ${holidayInfo.type === 'weekend' ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400'}`}>
                          {isWeekend(day) ? 'Weekend' : 'Holiday'}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin relative">
                      {dayTrades.map((trade) => (
                        <div
                          key={trade.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTradeClick(trade);
                          }}
                          className={`
                            text-xs px-2 py-1 rounded-md cursor-pointer truncate
                            ${trade.trade_type === 'LONG' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}
                            hover:bg-opacity-80 dark:hover:bg-opacity-50 transition-colors
                          `}
                        >
                          {trade.symbol} - ₹{trade.pnl.toLocaleString()}
                        </div>
                      ))}
                      
                      {/* Show count badge if there are multiple trades */}
                      {dayTrades.length > 1 && (
                        <div className="absolute bottom-0 right-0 bg-zinc-200 dark:bg-zinc-700 text-[10px] px-1.5 py-0.5 rounded-full text-zinc-700 dark:text-zinc-300">
                          {dayTrades.length}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Holiday Tooltip */}
      {showHolidayInfo && (
        <div 
          className="fixed bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-3 z-50 border border-zinc-200 dark:border-zinc-700"
          style={{
            left: `${window.event ? window.event.clientX + 10 : 0}px`,
            top: `${window.event ? window.event.clientY + 10 : 0}px`,
          }}
        >
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {format(showHolidayInfo.day, 'MMMM d, yyyy')}
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            {showHolidayInfo.info.reason} - Market Closed
          </p>
        </div>
      )}

      {/* Add Trade Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-y-auto max-h-[90vh]">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Add Trade for {format(selectedDate, 'dd MMMM yyyy')}
              </h3>
              <button
                onClick={handleCloseForm}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Symbol
                  </label>
                  <input
                    type="text"
                    name="symbol"
                    required
                    placeholder="e.g., NIFTY, RELIANCE"
                    value={tradeForm.symbol}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Trade Type
                  </label>
                  <select
                    name="trade_type"
                    required
                    value={tradeForm.trade_type}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
                  >
                    <option value="LONG">LONG</option>
                    <option value="SHORT">SHORT</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Entry Price
                  </label>
                  <input
                    type="number"
                    name="entry_price"
                    step="0.01"
                    required
                    placeholder="Entry price"
                    value={tradeForm.entry_price}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Exit Price
                  </label>
                  <input
                    type="number"
                    name="exit_price"
                    step="0.01"
                    placeholder="Exit price (if closed)"
                    value={tradeForm.exit_price}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    placeholder="Quantity"
                    value={tradeForm.quantity}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Setup Type
                  </label>
                  <input
                    type="text"
                    name="setup_type"
                    placeholder="e.g., Breakout, Reversal"
                    value={tradeForm.setup_type}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Entry Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="entry_date"
                    required
                    value={tradeForm.entry_date}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Exit Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="exit_date"
                    value={tradeForm.exit_date}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Stop Loss
                  </label>
                  <input
                    type="number"
                    name="stop_loss"
                    step="0.01"
                    placeholder="Stop loss price"
                    value={tradeForm.stop_loss}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Take Profit
                  </label>
                  <input
                    type="number"
                    name="take_profit"
                    step="0.01"
                    placeholder="Take profit price"
                    value={tradeForm.take_profit}
                    onChange={handleFormChange}
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  placeholder="Add trade notes, insights, or lessons..."
                  value={tradeForm.notes}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-100"
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 rounded-md text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                  Save Trade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Trade Details Modal */}
      {selectedTrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className={`p-4 ${selectedTrade.trade_type === 'LONG' ? 'bg-green-500' : 'bg-red-500'} rounded-t-xl`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{selectedTrade.symbol}</h3>
                <button
                  onClick={handleCloseTrade}
                  className="text-white/70 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">Trade Type</span>
                <span className={`px-2 py-1 rounded ${selectedTrade.trade_type === 'LONG' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                  {selectedTrade.trade_type}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400">P&L</span>
                <span className={`font-semibold ${selectedTrade.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ₹{selectedTrade.pnl.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm text-zinc-700 dark:text-zinc-300">
                <Clock className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                <div>
                  <p>Entry: {format(parseISO(selectedTrade.entry_date), 'dd MMM yyyy HH:mm')}</p>
                  <p>Exit: {format(parseISO(selectedTrade.exit_date), 'dd MMM yyyy HH:mm')}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-1">
                <span className="text-zinc-500 dark:text-zinc-400">Entry Price</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">₹{selectedTrade.entry_price.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400">Exit Price</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">₹{selectedTrade.exit_price.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400">Quantity</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{selectedTrade.quantity}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400">Setup Type</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{selectedTrade.setup_type}</span>
              </div>
              
              {selectedTrade.notes && (
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Notes</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line">{selectedTrade.notes}</p>
                </div>
              )}
              
              <div className="flex justify-between gap-3 pt-3">
                <button
                  onClick={handleCloseTrade}
                  className="flex-1 px-4 py-2 rounded-md text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Convert the selected trade to form data for editing
                    setTradeForm({
                      symbol: selectedTrade.symbol,
                      entry_price: selectedTrade.entry_price,
                      exit_price: selectedTrade.exit_price,
                      quantity: selectedTrade.quantity,
                      trade_type: selectedTrade.trade_type,
                      entry_date: selectedTrade.entry_date.slice(0, 16),
                      exit_date: selectedTrade.exit_date.slice(0, 16),
                      stop_loss: '',
                      take_profit: '',
                      notes: selectedTrade.notes,
                      setup_type: selectedTrade.setup_type,
                    });
                    setSelectedDate(parseISO(selectedTrade.entry_date));
                    setShowAddForm(true);
                    setSelectedTrade(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                  Edit Trade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar; 