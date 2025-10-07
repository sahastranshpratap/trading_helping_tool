import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Save, PieChart } from 'lucide-react';
import { useTheme } from '../theme-provider';

// Utility function for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

const SettingsSection = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] shadow-sm mb-5">
    <div className="p-4 border-b border-gray-200 dark:border-[#1F1F23] flex items-center">
      {icon}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white ml-2">{title}</h2>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

const SelectOption = ({ id, label, description, options, value, onChange }) => (
  <div className="py-3">
    <label htmlFor={id} className="block font-medium text-gray-900 dark:text-white mb-1">{label}</label>
    {description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{description}</p>}
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#151518] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const ActionButton = ({ onClick, children, color = "blue", Icon }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors",
      color === "blue" && "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800",
      color === "red" && "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800",
      color === "gray" && "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
    )}
  >
    {Icon && <Icon className="w-4 h-4 mr-2" />}
    {children}
  </button>
);

const SettingsPage = () => {
  // Get theme from ThemeProvider
  const { theme, setTheme } = useTheme();
  
  // State for interface settings
  const [timeFormat, setTimeFormat] = useState('24h');
  const [chartStyle, setChartStyle] = useState('candle');

  // State for notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [mobilePushNotifications, setMobilePushNotifications] = useState(true);
  const [tradeAlerts, setTradeAlerts] = useState(true);
  const [marketAlerts, setMarketAlerts] = useState(true);
  const [newsDigest, setNewsDigest] = useState(false);

  // State for trading preferences
  const [defaultMarket, setDefaultMarket] = useState('nse');
  const [defaultTimeframe, setDefaultTimeframe] = useState('daily');
  const [defaultCurrency, setDefaultCurrency] = useState('inr');

  // State for data & privacy
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [saveTradeHistory, setSaveTradeHistory] = useState(true);
  
  // Status message state
  const [statusMessage, setStatusMessage] = useState('');
  const [showStatus, setShowStatus] = useState(false);

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('trade-journal-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setTimeFormat(settings.timeFormat || '24h');
        setChartStyle(settings.chartStyle || 'candle');
        setEmailNotifications(settings.emailNotifications !== undefined ? settings.emailNotifications : true);
        setMobilePushNotifications(settings.mobilePushNotifications !== undefined ? settings.mobilePushNotifications : true);
        setTradeAlerts(settings.tradeAlerts !== undefined ? settings.tradeAlerts : true);
        setMarketAlerts(settings.marketAlerts !== undefined ? settings.marketAlerts : true);
        setNewsDigest(settings.newsDigest !== undefined ? settings.newsDigest : false);
        setDefaultMarket(settings.defaultMarket || 'nse');
        setDefaultTimeframe(settings.defaultTimeframe || 'daily');
        setDefaultCurrency(settings.defaultCurrency || 'inr');
        setTwoFactorEnabled(settings.twoFactorEnabled || false);
        setDataSharing(settings.dataSharing || false);
        setSaveTradeHistory(settings.saveTradeHistory !== undefined ? settings.saveTradeHistory : true);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Market options
  const marketOptions = [
    { value: 'nse', label: 'National Stock Exchange (NSE)' },
    { value: 'bse', label: 'Bombay Stock Exchange (BSE)' },
    { value: 'mcx', label: 'Multi Commodity Exchange (MCX)' },
    { value: 'all', label: 'All Indian Markets' }
  ];

  // Timeframe options
  const timeframeOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'intraday', label: 'Intraday' }
  ];

  // Currency options
  const currencyOptions = [
    { value: 'inr', label: 'Indian Rupee (₹)' },
    { value: 'usd', label: 'US Dollar ($)' }
  ];

  // Chart style options
  const chartOptions = [
    { value: 'candle', label: 'Candlestick' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
    { value: 'area', label: 'Area Chart' }
  ];

  // Save all settings
  const saveSettings = () => {
    // Collect all settings into an object
    const settings = {
      timeFormat,
      chartStyle,
      emailNotifications,
      mobilePushNotifications,
      tradeAlerts,
      marketAlerts,
      newsDigest,
      defaultMarket,
      defaultTimeframe,
      defaultCurrency,
      twoFactorEnabled,
      dataSharing,
      saveTradeHistory
    };
    
    // Save to localStorage
    localStorage.setItem('trade-journal-settings', JSON.stringify(settings));
    
    // Show success message
    setStatusMessage('Settings saved successfully!');
    setShowStatus(true);
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setShowStatus(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <ActionButton onClick={saveSettings} Icon={Save}>Save Changes</ActionButton>
      </div>

      {/* Status message */}
      {showStatus && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-3 rounded-lg">
          {statusMessage}
        </div>
      )}

      {/* Interface Settings Section */}
      <SettingsSection title="Interface Settings" icon={<SettingsIcon className="w-5 h-5 text-gray-900 dark:text-white" />}>
        <div className="space-y-1">
          {/* Theme Selection */}
          <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
            <p className="font-medium text-gray-900 dark:text-white mb-3">Theme</p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setTheme('light')}
                className={cn(
                  "flex-1 p-3 border rounded-lg transition-colors flex items-center justify-center gap-2",
                  theme === 'light' 
                    ? "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" 
                    : "border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151518] text-gray-700 dark:text-gray-300"
                )}
              >
                <Sun className="w-5 h-5" />
                <span>Light</span>
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={cn(
                  "flex-1 p-3 border rounded-lg transition-colors flex items-center justify-center gap-2",
                  theme === 'dark' 
                    ? "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" 
                    : "border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151518] text-gray-700 dark:text-gray-300"
                )}
              >
                <Moon className="w-5 h-5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Time Format */}
          <SelectOption
            id="timeFormat"
            label="Time Format"
            description="Choose your preferred time format"
            options={[
              { value: '24h', label: '24-Hour' },
              { value: '12h', label: '12-Hour' }
            ]}
            value={timeFormat}
            onChange={(e) => setTimeFormat(e.target.value)}
          />

          {/* Chart Style */}
          <SelectOption
            id="chartStyle"
            label="Default Chart Style"
            description="Choose your preferred chart style for analysis"
            options={chartOptions}
            value={chartStyle}
            onChange={(e) => setChartStyle(e.target.value)}
          />
        </div>
      </SettingsSection>

      {/* Trading Preferences */}
      <SettingsSection title="Trading Preferences" icon={<PieChart className="w-5 h-5 text-gray-900 dark:text-white" />}>
        <div className="space-y-1">
          <SelectOption
            id="defaultMarket"
            label="Default Market"
            description="Choose your primary trading market"
            options={marketOptions}
            value={defaultMarket}
            onChange={(e) => setDefaultMarket(e.target.value)}
          />
          <div className="border-t border-gray-100 dark:border-gray-800"></div>
          <SelectOption
            id="defaultTimeframe"
            label="Default Timeframe"
            description="Choose your preferred trading timeframe"
            options={timeframeOptions}
            value={defaultTimeframe}
            onChange={(e) => setDefaultTimeframe(e.target.value)}
          />
          <div className="border-t border-gray-100 dark:border-gray-800"></div>
          <SelectOption
            id="defaultCurrency"
            label="Default Currency"
            description="Choose your preferred currency for display"
            options={currencyOptions}
            value={defaultCurrency}
            onChange={(e) => setDefaultCurrency(e.target.value)}
          />
        </div>
      </SettingsSection>

      {/* Save Button */}
      <div className="flex justify-end">
        <ActionButton onClick={saveSettings} Icon={Save}>
          Save All Settings
        </ActionButton>
      </div>
    </div>
  );
};

export default SettingsPage; 