import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FormErrorMessage } from "../ui/error";
import { LoadingSpinner } from "../ui/loading";
import { CandlestickChart, Trash2, Calendar, Clock, DollarSign, Tag, FileText } from "lucide-react";

// Default form values
const defaultTrade = {
  symbol: "",
  entryPrice: "",
  exitPrice: "",
  entryDate: "",
  entryTime: "",
  exitDate: "",
  exitTime: "",
  quantity: "",
  initialCapital: "",
  strategy: "",
  position: "long",
  stopLoss: "",
  takeProfit: "",
  notes: "",
  emotion: "",
  fees: "",
  tags: [],
  // New advanced fields
  tradeSetup: "",
  riskRewardRatio: "",
  marketCondition: "",
  tradeDuration: "",
  entryConfidence: "medium",
  exitReason: "",
  learningPoints: "",
  mistakes: "",
  customTagCategories: {
    sector: [],
    timeframe: [],
    pattern: [],
    custom: []
  }
};

// Strategies for dropdown
const strategies = [
  "Breakout",
  "Reversal",
  "Trend Following",
  "Gap Fill",
  "Support/Resistance",
  "VWAP Bounce",
  "Momentum",
  "Scalping",
  "Swing",
  "Earnings Play",
  "Other"
];

// Emotion options
const emotions = [
  "Confident",
  "Anxious",
  "Excited",
  "Fearful",
  "Calm",
  "Impatient",
  "Greedy",
  "Cautious",
  "Neutral",
  "Other"
];

// New constants for advanced options
const marketConditions = [
  "Bullish",
  "Bearish",
  "Sideways/Ranging",
  "Volatile",
  "Low Volatility",
  "Pre-Market",
  "After Hours",
  "Opening Range",
  "Closing Range"
];

const entryConfidenceLevels = [
  "Very Low",
  "Low",
  "Medium",
  "High",
  "Very High"
];

const exitReasons = [
  "Target Hit",
  "Stop Loss Hit",
  "Technical Exit",
  "Gut Feeling",
  "News Event",
  "Time-Based",
  "Changed Opinion",
  "Risk Management",
  "Other"
];

const tradeSetups = [
  "Flag Pattern",
  "Double Bottom",
  "Double Top", 
  "Head and Shoulders",
  "Cup and Handle",
  "Engulfing Pattern",
  "MACD Crossover",
  "RSI Divergence",
  "Moving Average Crossover",
  "Fibonacci Retracement",
  "Trendline Bounce",
  "Volume Spike",
  "Other"
];

// Default tag categories
const defaultTagCategories = {
  sector: ["Technology", "Finance", "Healthcare", "Energy", "Consumer", "Industrial", "Utilities"],
  timeframe: ["Scalp", "Intraday", "Swing", "Position", "Long-term"],
  pattern: ["Breakout", "Reversal", "Trend Following", "Range Bound", "Divergence"],
  custom: []
};

export default function TradeForm({ onSubmit, initialData, isEditing = false }) {
  const [trade, setTrade] = useState(initialData || defaultTrade);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [activeTagCategory, setActiveTagCategory] = useState("custom");
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  useEffect(() => {
    // Set today's date as default for entry date if creating a new trade
    if (!isEditing && !trade.entryDate) {
      const today = new Date().toISOString().split("T")[0];
      setTrade(prev => ({ ...prev, entryDate: today }));
    }
    
    // Initialize tag categories if empty
    if (!isEditing && (!trade.customTagCategories || Object.keys(trade.customTagCategories).length === 0)) {
      setTrade(prev => ({
        ...prev,
        customTagCategories: JSON.parse(JSON.stringify(defaultTagCategories))
      }));
    }
  }, [isEditing, trade.entryDate]);
  
  const calculatePnL = () => {
    if (!trade.entryPrice || !trade.exitPrice || !trade.quantity) {
      return 0;
    }
    
    const entry = parseFloat(trade.entryPrice);
    const exit = parseFloat(trade.exitPrice);
    const qty = parseFloat(trade.quantity);
    const fees = parseFloat(trade.fees) || 0;
    
    if (isNaN(entry) || isNaN(exit) || isNaN(qty)) {
      return 0;
    }
    
    const multiplier = trade.position === "long" ? 1 : -1;
    return ((exit - entry) * qty * multiplier) - fees;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrade(prev => ({ ...prev, [name]: value }));
    
    // Clear the error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handlePositionChange = (position) => {
    setTrade(prev => ({ ...prev, position }));
  };
  
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    if (!trade.tags.includes(tagInput.trim())) {
      setTrade(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
    }
    
    setTagInput("");
  };
  
  const removeTag = (tag) => {
    setTrade(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  // New functions for advanced tag management
  const addCategoryTag = (tag) => {
    if (!tag.trim()) return;
    
    if (!trade.customTagCategories[activeTagCategory].includes(tag.trim())) {
      setTrade(prev => ({
        ...prev,
        customTagCategories: {
          ...prev.customTagCategories,
          [activeTagCategory]: [...prev.customTagCategories[activeTagCategory], tag.trim()]
        }
      }));
    }
    
    setTagInput("");
  };
  
  const removeCategoryTag = (category, tag) => {
    setTrade(prev => ({
      ...prev,
      customTagCategories: {
        ...prev.customTagCategories,
        [category]: prev.customTagCategories[category].filter(t => t !== tag)
      }
    }));
  };
  
  const addCustomCategory = () => {
    if (!customCategoryInput.trim()) return;
    
    // Check if category already exists
    if (Object.keys(trade.customTagCategories).includes(customCategoryInput.trim())) {
      return;
    }
    
    setTrade(prev => ({
      ...prev,
      customTagCategories: {
        ...prev.customTagCategories,
        [customCategoryInput.trim()]: []
      }
    }));
    
    setActiveTagCategory(customCategoryInput.trim());
    setCustomCategoryInput("");
  };
  
  const removeCustomCategory = (category) => {
    if (["sector", "timeframe", "pattern", "custom"].includes(category)) {
      return; // Don't allow removing default categories
    }
    
    setTrade(prev => {
      const updatedCategories = { ...prev.customTagCategories };
      delete updatedCategories[category];
      return {
        ...prev,
        customTagCategories: updatedCategories
      };
    });
    
    setActiveTagCategory("custom");
  };
  
  const validate = () => {
    const newErrors = {};
    
    // Required fields
    if (!trade.symbol.trim()) {
      newErrors.symbol = "Symbol is required";
    }
    
    if (!trade.entryPrice) {
      newErrors.entryPrice = "Entry price is required";
    } else if (isNaN(parseFloat(trade.entryPrice)) || parseFloat(trade.entryPrice) <= 0) {
      newErrors.entryPrice = "Entry price must be a positive number";
    }
    
    if (!trade.exitPrice && isEditing) {
      newErrors.exitPrice = "Exit price is required for completed trades";
    } else if (trade.exitPrice && (isNaN(parseFloat(trade.exitPrice)) || parseFloat(trade.exitPrice) <= 0)) {
      newErrors.exitPrice = "Exit price must be a positive number";
    }
    
    if (!trade.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (isNaN(parseFloat(trade.quantity)) || parseFloat(trade.quantity) <= 0) {
      newErrors.quantity = "Quantity must be a positive number";
    }
    
    if (!trade.entryDate) {
      newErrors.entryDate = "Entry date is required";
    }
    
    if (trade.exitDate && trade.entryDate && new Date(trade.exitDate) < new Date(trade.entryDate)) {
      newErrors.exitDate = "Exit date cannot be before entry date";
    }
    
    if (trade.stopLoss && isNaN(parseFloat(trade.stopLoss))) {
      newErrors.stopLoss = "Stop loss must be a number";
    }
    
    if (trade.takeProfit && isNaN(parseFloat(trade.takeProfit))) {
      newErrors.takeProfit = "Take profit must be a number";
    }
    
    if (trade.fees && (isNaN(parseFloat(trade.fees)) || parseFloat(trade.fees) < 0)) {
      newErrors.fees = "Fees must be a non-negative number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return;
    }
    
    setLoading(true);
    
    try {
      // Calculate profit/loss before submitting
      const pnl = calculatePnL();
      const tradeData = {
        ...trade,
        pnl
      };
      
      await onSubmit(tradeData);
      
      // Reset form if not editing
      if (!isEditing) {
        setTrade(defaultTrade);
      }
    } catch (error) {
      console.error("Error submitting trade:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const pnl = calculatePnL();
  const isProfitable = pnl > 0;
  
  return (
    <Card className="bg-white dark:bg-[#0F0F12] shadow-sm border border-gray-200 dark:border-[#1F1F23]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CandlestickChart className="w-5 h-5 mr-2" />
            {isEditing ? "Edit Trade" : "New Trade Entry"}
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="text-sm"
          >
            {showAdvancedOptions ? "Hide Advanced Options" : "Show Advanced Options"}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <FormErrorMessage errors={errors} />
          
          {/* Trade Basics Section */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-white">
              Trade Basics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Symbol */}
              <div className="space-y-2">
                <Label 
                  htmlFor="symbol" 
                  className={errors.symbol ? "text-red-500 dark:text-red-400" : ""}
                >
                  Symbol/Ticker *
                </Label>
                <Input
                  id="symbol"
                  name="symbol"
                  value={trade.symbol}
                  onChange={handleInputChange}
                  placeholder="e.g. AAPL, RELIANCE"
                  className={errors.symbol ? "border-red-300 dark:border-red-500" : ""}
                  aria-invalid={errors.symbol ? "true" : "false"}
                  aria-describedby={errors.symbol ? "symbol-error" : undefined}
                />
                {errors.symbol && (
                  <p className="text-xs text-red-500 dark:text-red-400" id="symbol-error">
                    {errors.symbol}
                  </p>
                )}
              </div>
              
              {/* Position Type */}
              <div className="space-y-2">
                <Label htmlFor="position-type">Position Type *</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={trade.position === "long" ? "default" : "outline"}
                    className={`flex-1 ${trade.position === "long" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                    onClick={() => handlePositionChange("long")}
                  >
                    Long
                  </Button>
                  <Button
                    type="button"
                    variant={trade.position === "short" ? "default" : "outline"}
                    className={`flex-1 ${trade.position === "short" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
                    onClick={() => handlePositionChange("short")}
                  >
                    Short
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Entry Price */}
              <div className="space-y-2">
                <Label 
                  htmlFor="entryPrice" 
                  className={errors.entryPrice ? "text-red-500 dark:text-red-400" : ""}
                >
                  Entry Price *
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                  </span>
                  <Input
                    id="entryPrice"
                    name="entryPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={trade.entryPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={`pl-9 ${errors.entryPrice ? "border-red-300 dark:border-red-500" : ""}`}
                    aria-invalid={errors.entryPrice ? "true" : "false"}
                    aria-describedby={errors.entryPrice ? "entryPrice-error" : undefined}
                  />
                </div>
                {errors.entryPrice && (
                  <p className="text-xs text-red-500 dark:text-red-400" id="entryPrice-error">
                    {errors.entryPrice}
                  </p>
                )}
              </div>
              
              {/* Exit Price */}
              <div className="space-y-2">
                <Label 
                  htmlFor="exitPrice" 
                  className={errors.exitPrice ? "text-red-500 dark:text-red-400" : ""}
                >
                  Exit Price {isEditing && "*"}
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                  </span>
                  <Input
                    id="exitPrice"
                    name="exitPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={trade.exitPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={`pl-9 ${errors.exitPrice ? "border-red-300 dark:border-red-500" : ""}`}
                    aria-invalid={errors.exitPrice ? "true" : "false"}
                    aria-describedby={errors.exitPrice ? "exitPrice-error" : undefined}
                  />
                </div>
                {errors.exitPrice && (
                  <p className="text-xs text-red-500 dark:text-red-400" id="exitPrice-error">
                    {errors.exitPrice}
                  </p>
                )}
              </div>
              
              {/* Quantity */}
              <div className="space-y-2">
                <Label 
                  htmlFor="quantity" 
                  className={errors.quantity ? "text-red-500 dark:text-red-400" : ""}
                >
                  Quantity *
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={trade.quantity}
                  onChange={handleInputChange}
                  placeholder="Number of shares/contracts"
                  className={errors.quantity ? "border-red-300 dark:border-red-500" : ""}
                  aria-invalid={errors.quantity ? "true" : "false"}
                  aria-describedby={errors.quantity ? "quantity-error" : undefined}
                />
                {errors.quantity && (
                  <p className="text-xs text-red-500 dark:text-red-400" id="quantity-error">
                    {errors.quantity}
                  </p>
                )}
              </div>
              {/* Initial Capital */}
              <div className="space-y-2">
                <Label 
                  htmlFor="initialCapital" 
                  className={errors.initialCapital ? "text-red-500 dark:text-red-400" : ""}
                >
                  Initial Capital
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                  </span>
                  <Input
                    id="initialCapital"
                    name="initialCapital"
                    type="number"
                    step="0.01"
                    min="0"
                    value={trade.initialCapital}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={`pl-9 ${errors.initialCapital ? "border-red-300 dark:border-red-500" : ""}`}
                    aria-invalid={errors.initialCapital ? "true" : "false"}
                    aria-describedby={errors.initialCapital ? "initialCapital-error" : undefined}
                  />
                </div>
                {errors.initialCapital && (
                  <p className="text-xs text-red-500 dark:text-red-400" id="initialCapital-error">
                    {errors.initialCapital}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Date and Time Section */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-white">
              Date and Time
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="entryDate" 
                  className={errors.entryDate ? "text-red-500 dark:text-red-400" : ""}
                >
                  Entry Date *
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <Input
                    id="entryDate"
                    name="entryDate"
                    type="date"
                    value={trade.entryDate}
                    onChange={handleInputChange}
                    className={`pl-9 ${errors.entryDate ? "border-red-300 dark:border-red-500" : ""}`}
                    aria-invalid={errors.entryDate ? "true" : "false"}
                    aria-describedby={errors.entryDate ? "entryDate-error" : undefined}
                  />
                </div>
                {errors.entryDate && (
                  <p className="text-xs text-red-500 dark:text-red-400" id="entryDate-error">
                    {errors.entryDate}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="entryTime">Entry Time</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                  </span>
                  <Input
                    id="entryTime"
                    name="entryTime"
                    type="time"
                    value={trade.entryTime}
                    onChange={handleInputChange}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="exitDate" 
                  className={errors.exitDate ? "text-red-500 dark:text-red-400" : ""}
                >
                  Exit Date {isEditing && "*"}
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <Input
                    id="exitDate"
                    name="exitDate"
                    type="date"
                    value={trade.exitDate}
                    onChange={handleInputChange}
                    className={`pl-9 ${errors.exitDate ? "border-red-300 dark:border-red-500" : ""}`}
                    aria-invalid={errors.exitDate ? "true" : "false"}
                    aria-describedby={errors.exitDate ? "exitDate-error" : undefined}
                  />
                </div>
                {errors.exitDate && (
                  <p className="text-xs text-red-500 dark:text-red-400" id="exitDate-error">
                    {errors.exitDate}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exitTime">Exit Time</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                  </span>
                  <Input
                    id="exitTime"
                    name="exitTime"
                    type="time"
                    value={trade.exitTime}
                    onChange={handleInputChange}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Strategy and Risk Management */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-white">
              Strategy and Risk Management
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="strategy">Strategy</Label>
                <select
                  id="strategy"
                  name="strategy"
                  value={trade.strategy}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1F1F23] px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Select a strategy</option>
                  {strategies.map(strategy => (
                    <option key={strategy} value={strategy}>{strategy}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="stopLoss" 
                  className={errors.stopLoss ? "text-red-500 dark:text-red-400" : ""}
                >
                  Stop Loss
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                  </span>
                  <Input
                    id="stopLoss"
                    name="stopLoss"
                    type="number"
                    step="0.01"
                    min="0"
                    value={trade.stopLoss}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={`pl-9 ${errors.stopLoss ? "border-red-300 dark:border-red-500" : ""}`}
                    aria-invalid={errors.stopLoss ? "true" : "false"}
                    aria-describedby={errors.stopLoss ? "stopLoss-error" : undefined}
                  />
                </div>
                {errors.stopLoss && (
                  <p className="text-xs text-red-500 dark:text-red-400" id="stopLoss-error">
                    {errors.stopLoss}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="takeProfit" 
                  className={errors.takeProfit ? "text-red-500 dark:text-red-400" : ""}
                >
                  Take Profit
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                  </span>
                  <Input
                    id="takeProfit"
                    name="takeProfit"
                    type="number"
                    step="0.01"
                    min="0"
                    value={trade.takeProfit}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={`pl-9 ${errors.takeProfit ? "border-red-300 dark:border-red-500" : ""}`}
                    aria-invalid={errors.takeProfit ? "true" : "false"}
                    aria-describedby={errors.takeProfit ? "takeProfit-error" : undefined}
                  />
                </div>
                {errors.takeProfit && (
                  <p className="text-xs text-red-500 dark:text-red-400" id="takeProfit-error">
                    {errors.takeProfit}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-white">
              Additional Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emotion">Emotion During Trade</Label>
                <select
                  id="emotion"
                  name="emotion"
                  value={trade.emotion}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1F1F23] px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Select emotion</option>
                  {emotions.map(emotion => (
                    <option key={emotion} value={emotion}>{emotion}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="fees" 
                  className={errors.fees ? "text-red-500 dark:text-red-400" : ""}
                >
                  Fees/Commissions
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                  </span>
                  <Input
                    id="fees"
                    name="fees"
                    type="number"
                    step="0.01"
                    min="0"
                    value={trade.fees}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={`pl-9 ${errors.fees ? "border-red-300 dark:border-red-500" : ""}`}
                    aria-invalid={errors.fees ? "true" : "false"}
                    aria-describedby={errors.fees ? "fees-error" : undefined}
                  />
                </div>
                {errors.fees && (
                  <p className="text-xs text-red-500 dark:text-red-400" id="fees-error">
                    {errors.fees}
                  </p>
                )}
              </div>
            </div>
            
            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              
              {/* Tag categories tabs */}
              <div className="flex flex-wrap gap-2 mb-2 border-b border-gray-200 dark:border-gray-700">
                {Object.keys(trade.customTagCategories).map(category => (
                  <button
                    key={category}
                    type="button"
                    className={`px-3 py-1.5 text-sm rounded-t-md ${
                      activeTagCategory === category 
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                    onClick={() => setActiveTagCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    {category !== "sector" && 
                     category !== "timeframe" && 
                     category !== "pattern" && 
                     category !== "custom" && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCustomCategory(category);
                        }}
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Remove category {category}</span>
                        ×
                      </button>
                    )}
                  </button>
                ))}
                
                {/* Add custom category */}
                <div className="flex items-center ml-auto">
                  <Input
                    id="customCategoryInput"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    placeholder="New category"
                    className="w-32 h-8 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomCategory();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addCustomCategory}
                    className="ml-1 h-8 text-xs"
                    variant="outline"
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              {/* Tag input for active category */}
              <div className="flex">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <Tag className="w-4 h-4" />
                  </span>
                  <Input
                    id="tagInput"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder={`Add ${activeTagCategory} tag (press Enter to add)`}
                    className="pl-9"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCategoryTag(tagInput);
                      }
                    }}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => addCategoryTag(tagInput)}
                  className="ml-2"
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              
              {/* Display tags for active category */}
              <div className="flex flex-wrap gap-2 mt-2">
                {trade.customTagCategories[activeTagCategory]?.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeCategoryTag(activeTagCategory, tag)}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                    >
                      <span className="sr-only">Remove tag {tag}</span>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <div className="relative">
                <span className="absolute top-3 left-3 text-gray-500 dark:text-gray-400">
                  <FileText className="w-4 h-4" />
                </span>
                <textarea
                  id="notes"
                  name="notes"
                  value={trade.notes}
                  onChange={handleInputChange}
                  placeholder="What was your reasoning? What did you learn?"
                  rows={4}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1F1F23] px-3 py-2 pl-9 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Advanced Options Section */}
          {showAdvancedOptions && (
            <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
                Advanced Trade Details
              </h3>
              
              {/* Trade Setup & Risk-Reward Ratio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tradeSetup">Trade Setup</Label>
                  <select
                    id="tradeSetup"
                    name="tradeSetup"
                    value={trade.tradeSetup}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1F1F23] px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">Select setup</option>
                    {tradeSetups.map(setup => (
                      <option key={setup} value={setup}>{setup}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="riskRewardRatio">Risk-Reward Ratio</Label>
                  <Input
                    id="riskRewardRatio"
                    name="riskRewardRatio"
                    placeholder="e.g. 1:2, 1:3"
                    value={trade.riskRewardRatio}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              {/* Market Condition & Trade Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marketCondition">Market Condition</Label>
                  <select
                    id="marketCondition"
                    name="marketCondition"
                    value={trade.marketCondition}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1F1F23] px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">Select market condition</option>
                    {marketConditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tradeDuration">Trade Duration</Label>
                  <Input
                    id="tradeDuration"
                    name="tradeDuration"
                    placeholder="e.g. 3 days, 2 hours"
                    value={trade.tradeDuration}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              {/* Entry Confidence & Exit Reason */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entryConfidence">Entry Confidence</Label>
                  <select
                    id="entryConfidence"
                    name="entryConfidence"
                    value={trade.entryConfidence}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1F1F23] px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    {entryConfidenceLevels.map(level => (
                      <option key={level} value={level.toLowerCase()}>{level}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exitReason">Exit Reason</Label>
                  <select
                    id="exitReason"
                    name="exitReason"
                    value={trade.exitReason}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1F1F23] px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">Select exit reason</option>
                    {exitReasons.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Learning Points & Mistakes */}
              <div className="space-y-2">
                <Label htmlFor="learningPoints">Key Learning Points</Label>
                <textarea
                  id="learningPoints"
                  name="learningPoints"
                  value={trade.learningPoints}
                  onChange={handleInputChange}
                  placeholder="What did you learn from this trade?"
                  rows={2}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1F1F23] px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                ></textarea>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mistakes">Mistakes Made</Label>
                <textarea
                  id="mistakes"
                  name="mistakes"
                  value={trade.mistakes}
                  onChange={handleInputChange}
                  placeholder="What mistakes did you make? How can you avoid them next time?"
                  rows={2}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1F1F23] px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                ></textarea>
              </div>
            </div>
          )}
          
          {/* Profit/Loss Display */}
          {trade.entryPrice && trade.exitPrice && trade.quantity && (
            <div className={`p-4 rounded-md border ${
              isProfitable 
                ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30" 
                : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30"
            }`}>
              <p className="text-center">
                <span className="font-medium">Calculated P&L: </span>
                <span className={`font-bold ${
                  isProfitable 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}>
                  {isProfitable ? "+" : ""}${Math.abs(pnl).toFixed(2)}
                </span>
              </p>
            </div>
          )}
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  {isEditing ? "Updating..." : "Submitting..."}
                </>
              ) : (
                isEditing ? "Update Trade" : "Add Trade"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 