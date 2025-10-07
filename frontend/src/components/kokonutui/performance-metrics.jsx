import React from "react"
import { cn } from "../utils"

export const METRICS = [
  {
    id: "1",
    title: "Win Rate",
    value: "68%",
    change: "+5.2%",
    trend: "up",
    description: "Percentage of profitable trades",
  },
  {
    id: "2",
    title: "Total P&L",
    value: "₹5,872.40",
    change: "+₹1,245.80",
    trend: "up",
    description: "Total profit/loss for period",
  },
  {
    id: "3",
    title: "Avg Win/Loss",
    value: "2.4",
    change: "+0.3",
    trend: "up",
    description: "Ratio of average win to average loss",
  },
  {
    id: "4",
    title: "ROI",
    value: "12.8%",
    change: "+3.2%",
    trend: "up",
    description: "Return on investment",
  },
  {
    id: "5",
    title: "Total Trades",
    value: "142",
    change: "+28",
    trend: "up",
    description: "Number of trades placed",
  },
]

function PerformanceMetrics({ metrics = METRICS, className }) {
  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto",
        "bg-white dark:bg-zinc-900/70",
        "border border-zinc-100 dark:border-zinc-800",
        "rounded-xl shadow-sm backdrop-blur-xl",
        className,
      )}
    >
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">Trading Performance</p>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Month to Date</h1>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">Key Metrics</h2>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className={cn(
                "group flex flex-col",
                "p-3 rounded-lg",
                "bg-zinc-50 dark:bg-zinc-800/50",
                "border border-zinc-100 dark:border-zinc-800",
                "hover:border-zinc-200 dark:hover:border-zinc-700",
                "transition-all duration-200",
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{metric.title}</h3>
                {metric.trend && (
                  <div className="flex items-center">
                    {metric.trend === "up" ? (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-0.5">
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                        {metric.change}
                      </span>
                    ) : (
                      <span className="text-[11px] text-red-600 dark:text-red-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-0.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                        {metric.change}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{metric.value}</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-1">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          className={cn(
            "w-full flex items-center justify-center gap-2",
            "py-2 px-3 rounded-lg",
            "text-xs font-medium",
            "bg-zinc-100 dark:bg-zinc-800",
            "text-zinc-900 dark:text-zinc-100",
            "hover:bg-zinc-200 dark:hover:bg-zinc-700",
            "transition-all duration-200",
          )}
        >
          <span>View Detailed Analytics</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M21 21H8V8h8v13z" />
            <path d="M10 12h8" />
            <path d="M14 16h4" />
            <path d="M10 8V3" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default PerformanceMetrics 