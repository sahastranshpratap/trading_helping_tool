import React from "react"
import { cn } from "../utils"

// Sample trade data - would be replaced with actual data from your API
const TRADES = [
  {
    id: "1",
    title: "AAPL Long",
    amount: "₹95,460",
    type: "win",
    category: "stocks",
    timestamp: "Today, 2:45 PM",
    status: "closed",
  },
  {
    id: "2",
    title: "EURUSD Short",
    amount: "₹49,500",
    type: "loss",
    category: "forex",
    timestamp: "Today, 9:30 AM",
    status: "closed",
  },
  {
    id: "3",
    title: "SPY Put Options",
    amount: "₹62,850",
    type: "win",
    category: "options",
    timestamp: "Yesterday",
    status: "closed",
  },
  {
    id: "4",
    title: "TSLA Short",
    amount: "₹1,17,200",
    type: "loss",
    category: "stocks",
    timestamp: "2 days ago",
    status: "closed",
  },
  {
    id: "5",
    title: "BTC Long",
    amount: "₹2,47,300",
    type: "win",
    category: "crypto",
    timestamp: "3 days ago",
    status: "closed",
  }
]

function TradesList({ trades = TRADES, className }) {
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
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Recent Trades
            <span className="text-xs font-normal text-zinc-600 dark:text-zinc-400 ml-1">({trades.length} trades)</span>
          </h2>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">This Week</span>
        </div>

        <div className="space-y-1">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className={cn(
                "group flex items-center gap-3",
                "p-2 rounded-lg",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                "transition-all duration-200",
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg",
                  "bg-zinc-100 dark:bg-zinc-800",
                  "border border-zinc-200 dark:border-zinc-700",
                )}
              >
                {trade.category === "stocks" && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-900 dark:text-zinc-100">
                    <path d="m2 16 4-4 4 4 4-4 4 4 4-4" />
                    <path d="M2 8h20" />
                    <path d="M18 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  </svg>
                )}
                {trade.category === "forex" && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-900 dark:text-zinc-100">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m2 12 20 0" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                )}
                {trade.category === "crypto" && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-900 dark:text-zinc-100">
                    <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
                  </svg>
                )}
                {trade.category === "options" && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-900 dark:text-zinc-100">
                    <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1" />
                    <path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1" />
                  </svg>
                )}
              </div>

              <div className="flex-1 flex items-center justify-between min-w-0">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{trade.title}</h3>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">{trade.timestamp}</p>
                </div>

                <div className="flex items-center gap-1.5 pl-3">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      trade.type === "win"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400",
                    )}
                  >
                    {trade.type === "win" ? "+" : "-"}
                    {trade.amount}
                  </span>
                  {trade.type === "win" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-red-600 dark:text-red-400">
                      <path d="m6 15 6-6 6 6" />
                    </svg>
                  )}
                </div>
              </div>
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
            "bg-gradient-to-r from-zinc-900 to-zinc-800",
            "dark:from-zinc-50 dark:to-zinc-200",
            "text-zinc-50 dark:text-zinc-900",
            "hover:from-zinc-800 hover:to-zinc-700",
            "dark:hover:from-zinc-200 dark:hover:to-zinc-300",
            "shadow-sm hover:shadow",
            "transform transition-all duration-200",
            "hover:-translate-y-0.5",
            "active:translate-y-0",
          )}
        >
          <span>View All Trades</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TradesList 