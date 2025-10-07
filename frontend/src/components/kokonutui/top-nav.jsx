import React, { useState } from "react"
import { ThemeToggle } from "../theme-toggle.jsx"
import { Link } from "react-router-dom"

function TopNav() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  const breadcrumbs = [
    { label: "TradeJournal", href: "/" },
    { label: "Dashboard", href: "/" },
  ]

  return (
    <nav className="px-3 sm:px-6 flex items-center justify-between bg-white dark:bg-[#0F0F12] border-b border-gray-200 dark:border-[#1F1F23] h-full">
      <div className="font-medium text-sm hidden sm:flex items-center space-x-1 truncate max-w-[300px]">
        {breadcrumbs.map((item, index) => (
          <div key={item.label} className="flex items-center">
            {index > 0 && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-500 dark:text-gray-400 mx-1">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-gray-100">{item.label}</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
        <button
          type="button"
          className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </button>

        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="focus:outline-none"
          >
            <img
              src="https://ui-avatars.com/api/?name=Developer&background=0D8ABC&color=fff"
              alt="User avatar"
              width={28}
              height={28}
              className="rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30] sm:w-8 sm:h-8 cursor-pointer"
            />
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23] rounded-lg shadow-lg z-50">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="https://ui-avatars.com/api/?name=Developer&background=0D8ABC&color=fff"
                    alt="User profile"
                    width={40}
                    height={40}
                    className="rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30]"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Developer</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">dev@example.com</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-md text-sm transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-600 dark:text-gray-400">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-gray-900 dark:text-gray-100">Profile</span>
                  </Link>
                  
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-md text-sm transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-600 dark:text-gray-400">
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span className="text-gray-900 dark:text-gray-100">Settings</span>
                  </Link>
                  
                  <div className="h-px bg-gray-200 dark:bg-[#1F1F23] my-2" />
                  
                  <div className="p-2 text-xs text-gray-500 dark:text-gray-400">
                    Development Mode - No Authentication Required
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default TopNav 