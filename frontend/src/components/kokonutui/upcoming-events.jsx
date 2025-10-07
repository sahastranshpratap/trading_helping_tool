import React from "react"
import { cn } from "../utils"

const EVENTS = [
  {
    id: "1",
    title: "FOMC Meeting Minutes",
    subtitle: "Federal Reserve monetary policy",
    date: "Oct 15, 2023",
    time: "2:00 PM EST",
    importance: "high",
  },
  {
    id: "2",
    title: "US Non-Farm Payrolls",
    subtitle: "Employment statistics report",
    date: "Oct 18, 2023",
    time: "8:30 AM EST",
    importance: "high",
  },
  {
    id: "3",
    title: "Apple (AAPL) Earnings",
    subtitle: "Q3 Financial Results",
    date: "Oct 25, 2023",
    time: "4:30 PM EST",
    importance: "medium",
  }
]

function UpcomingEvents({ events = EVENTS }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-none">
      <div className="flex gap-3 min-w-full p-1">
        {events.map((event) => (
          <div
            key={event.id}
            className={cn(
              "flex flex-col",
              "w-[280px] shrink-0",
              "bg-white dark:bg-zinc-900/70",
              "rounded-xl",
              "border border-zinc-100 dark:border-zinc-800",
              "hover:border-zinc-200 dark:hover:border-zinc-700",
              "transition-all duration-200",
              "shadow-sm backdrop-blur-xl",
            )}
          >
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </div>
                <div
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
                    event.importance === "high" 
                      ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" 
                      : event.importance === "medium"
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  )}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  {event.importance.charAt(0).toUpperCase() + event.importance.slice(1)}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">{event.title}</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">{event.subtitle}</p>
              </div>

              <div className="flex items-center text-xs text-zinc-600 dark:text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 mr-1.5">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                <span>{event.date}</span>
                {event.time && (
                  <>
                    <span className="mx-1.5">•</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 mr-1.5">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{event.time}</span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-auto border-t border-zinc-100 dark:border-zinc-800">
              <button
                className={cn(
                  "w-full flex items-center justify-center gap-2",
                  "py-2.5 px-3",
                  "text-xs font-medium",
                  "text-zinc-600 dark:text-zinc-400",
                  "hover:text-zinc-900 dark:hover:text-zinc-100",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                  "transition-colors duration-200",
                )}
              >
                Set Reminder
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                  <path d="m5 3-2 2" />
                  <path d="m19 3 2 2" />
                  <path d="M2 7h2" />
                  <path d="M20 7h2" />
                  <path d="m5 21-2-2" />
                  <path d="m19 21 2-2" />
                  <path d="M2 17h2" />
                  <path d="M20 17h2" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingEvents 