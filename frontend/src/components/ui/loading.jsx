import React from "react";

export function LoadingSpinner({ size = "medium", className = "" }) {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-3",
    large: "h-12 w-12 border-4"
  };
  
  return (
    <div className={`${className}`}>
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-primary-500 border-primary-500/30`} 
           role="status" 
           aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" 
         role="alert" 
         aria-busy="true"
         aria-live="polite">
      <div className="bg-white dark:bg-[#1F1F23] rounded-lg p-6 shadow-lg max-w-sm w-full mx-4 flex flex-col items-center">
        <LoadingSpinner size="large" className="mb-4" />
        <p className="text-center text-gray-900 dark:text-white">{message}</p>
      </div>
    </div>
  );
}

export function CardLoading() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-[#1F1F23] p-6 flex items-center justify-center h-full" 
         role="status"
         aria-busy="true">
      <LoadingSpinner className="mr-2" />
      <span className="text-gray-500 dark:text-gray-400">Loading...</span>
    </div>
  );
}

export function TableLoading({ rows = 5 }) {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      {Array(rows).fill(0).map((_, index) => (
        <div key={index} className="h-12 bg-gray-100 dark:bg-gray-800 rounded mb-2"></div>
      ))}
    </div>
  );
} 