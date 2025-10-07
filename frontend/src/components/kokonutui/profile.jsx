import React, { useState } from 'react';
import { User, Settings, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Edit, BarChart3, Wallet } from 'lucide-react';

// Utility function for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Format currency to Indian Rupee
const formatINR = (value) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(numValue);
};

const ProfileSection = ({ title, icon, children }) => (
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

const StatCard = ({ title, value, icon, trend = null, percentage = null }) => (
  <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
    <div className="flex items-start justify-between mb-2">
      <div className="p-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg">
        {icon}
      </div>
      {trend && (
        <div className={cn(
          "flex items-center text-xs font-medium rounded-full px-2 py-1",
          trend === "up" 
            ? "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30" 
            : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
        )}>
          {trend === "up" ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownLeft className="w-3 h-3 mr-1" />}
          {percentage}%
        </div>
      )}
    </div>
    <h3 className="text-gray-500 dark:text-gray-400 text-sm">{title}</h3>
    <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">{value}</p>
  </div>
);

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info');
  
  // Mock data - in a real app this would come from the backend
  const userProfile = {
    name: "Pratap",
    email: "pratap@example.com",
    phone: "+91 9876543210",
    location: "Mumbai, Maharashtra",
    joinDate: "April 2023",
    bio: "Full-time trader focusing on swing trading strategies in Indian markets. Specializing in Nifty derivatives and mid-cap growth stocks.",
    avatar: null, // No external avatar image
    tradingStats: {
      totalTrades: 168,
      winRate: 62.5,
      profitFactor: 1.8,
      avgTradeProfit: 5200,
      avgTradeDuration: "3.2 days",
      accountBalance: 285000,
      monthlyChange: 8.4,
      yearToDate: 24.5
    }
  };

  // Function to render a letter avatar
  const LetterAvatar = ({ name, size = "w-24 h-24" }) => {
    const letter = name.charAt(0).toUpperCase();
    return (
      <div className={`${size} rounded-full flex items-center justify-center bg-blue-600 text-white font-bold text-2xl`}>
        {letter}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] shadow-sm">
        <div className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <LetterAvatar name={userProfile.name} />
            <button className="absolute bottom-0 right-0 p-1.5 bg-zinc-800 dark:bg-zinc-700 text-white rounded-full border-2 border-white dark:border-[#1F1F23] hover:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors">
              <Edit className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Joined {userProfile.joinDate}</p>
            <p className="text-gray-700 dark:text-gray-300 mt-2 max-w-2xl">{userProfile.bio}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-4 md:mt-0">
            <button className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="px-6 pb-0 border-t border-gray-200 dark:border-[#1F1F23]">
          <div className="flex space-x-6 -mb-px">
            <button
              onClick={() => setActiveTab('info')}
              className={cn(
                "py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'info'
                  ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={cn(
                "py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'stats'
                  ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Trading Stats
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={cn(
                "py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'settings'
                  ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              Account Settings
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="space-y-5">
          <ProfileSection 
            title="Contact Information" 
            icon={<User className="w-5 h-5 text-gray-900 dark:text-white" />}
          >
            <div className="space-y-4">
              <div className="flex items-center border-b border-gray-100 dark:border-[#1F1F23] pb-4">
                <Mail className="w-5 h-5 text-gray-400" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                  <p className="text-gray-900 dark:text-white">{userProfile.email}</p>
                </div>
              </div>
              
              <div className="flex items-center border-b border-gray-100 dark:border-[#1F1F23] pb-4">
                <Phone className="w-5 h-5 text-gray-400" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="text-gray-900 dark:text-white">{userProfile.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="text-gray-900 dark:text-white">{userProfile.location}</p>
                </div>
              </div>
            </div>
          </ProfileSection>
          
          <ProfileSection 
            title="Trading Preferences" 
            icon={<BarChart3 className="w-5 h-5 text-gray-900 dark:text-white" />}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-[#1F1F23] pb-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Default Trading Setup</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Swing Trading</p>
                </div>
                <button className="text-blue-600 dark:text-blue-400 text-sm">Change</button>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-[#1F1F23] pb-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Default Time Frame</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Daily</p>
                </div>
                <button className="text-blue-600 dark:text-blue-400 text-sm">Change</button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Default Markets</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">NSE, BSE</p>
                </div>
                <button className="text-blue-600 dark:text-blue-400 text-sm">Change</button>
              </div>
            </div>
          </ProfileSection>
        </div>
      )}
      
      {activeTab === 'stats' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Trades" 
              value={userProfile.tradingStats.totalTrades.toString()}
              icon={<BarChart3 className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
            />
            <StatCard 
              title="Win Rate" 
              value={`${userProfile.tradingStats.winRate}%`}
              icon={<BarChart3 className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
              trend="up"
              percentage="4.2"
            />
            <StatCard 
              title="Profit Factor" 
              value={userProfile.tradingStats.profitFactor.toString()}
              icon={<BarChart3 className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
              trend="up"
              percentage="1.5"
            />
            <StatCard 
              title="Avg. Trade Profit" 
              value={formatINR(userProfile.tradingStats.avgTradeProfit)}
              icon={<Wallet className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
            />
          </div>
        </div>
      )}
      
      {activeTab === 'settings' && (
        <div className="space-y-5">
          <ProfileSection 
            title="Account Settings" 
            icon={<Settings className="w-5 h-5 text-gray-900 dark:text-white" />}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Remove your account and all data</p>
                </div>
                <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </ProfileSection>
          
          <ProfileSection 
            title="Appearance" 
            icon={<Settings className="w-5 h-5 text-gray-900 dark:text-white" />}
          >
            <div className="space-y-5">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Theme</h3>
                <div className="flex space-x-3">
                  <button className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white text-gray-900 hover:bg-gray-50 transition-colors">
                    Light
                  </button>
                  <button className="flex-1 p-3 border border-gray-700 rounded-lg bg-[#0F0F12] text-white hover:bg-[#151518] transition-colors">
                    Dark
                  </button>
                  <button className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    System
                  </button>
                </div>
              </div>
            </div>
          </ProfileSection>
        </div>
      )}
    </div>
  );
};

export default Profile; 