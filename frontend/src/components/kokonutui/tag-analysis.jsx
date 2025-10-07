import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tag, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Utility function for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

const TagAnalysis = ({ tagData, title = "Tag Performance Analysis" }) => {
  const [activeCategory, setActiveCategory] = useState(Object.keys(tagData)[0] || "");
  
  // No data handling
  if (!tagData || Object.keys(tagData).length === 0) {
    return (
      <Card className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] shadow-sm">
        <CardHeader className="border-b border-gray-200 dark:border-[#1F1F23]">
          <CardTitle className="text-gray-900 dark:text-white flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">
          No tag data available. Add tags to your trades to see performance analysis.
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23] shadow-sm">
      <CardHeader className="border-b border-gray-200 dark:border-[#1F1F23]">
        <CardTitle className="text-gray-900 dark:text-white flex items-center">
          <Tag className="w-5 h-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 p-3 border-b border-gray-200 dark:border-[#1F1F23] overflow-x-auto">
        {Object.keys(tagData).map(category => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1 text-sm rounded-md ${
              activeCategory === category 
                ? "bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Tag Performance List */}
      <div className="p-3">
        {activeCategory && tagData[activeCategory] && tagData[activeCategory].length > 0 ? (
          <div className="space-y-3">
            {tagData[activeCategory].map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.tag}</span>
                  <span className={cn(
                    "text-sm font-medium flex items-center",
                    item.performance > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {item.performance > 0 ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    )}
                    {item.performance > 0 ? '+' : ''}₹{Math.abs(item.performance)}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className={cn(
                      "h-2 rounded-full",
                      item.performance > 0 ? "bg-green-500" : "bg-red-500"
                    )} 
                    style={{ width: `${Math.min(Math.abs(item.performancePercent), 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div>{item.winRate}% win rate</div>
                  <div>{item.tradeCount} trades</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No data available for this category
          </div>
        )}
      </div>
    </Card>
  );
};

export default TagAnalysis; 