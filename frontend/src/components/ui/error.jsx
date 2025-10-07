import React from "react";
import { AlertTriangle, XCircle, Info, AlertOctagon, RefreshCw } from "lucide-react";

// Utility function for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

export const ErrorTypes = {
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  VALIDATION: "validation"
};

export function ErrorMessage({ 
  type = ErrorTypes.ERROR, 
  title, 
  message, 
  onRetry, 
  className 
}) {
  const icons = {
    [ErrorTypes.ERROR]: XCircle,
    [ErrorTypes.WARNING]: AlertTriangle,
    [ErrorTypes.INFO]: Info,
    [ErrorTypes.VALIDATION]: AlertOctagon
  };

  const colors = {
    [ErrorTypes.ERROR]: "border-red-300 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-400",
    [ErrorTypes.WARNING]: "border-yellow-300 bg-yellow-50 text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-900/20 dark:text-yellow-400",
    [ErrorTypes.INFO]: "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-400",
    [ErrorTypes.VALIDATION]: "border-orange-300 bg-orange-50 text-orange-800 dark:border-orange-500/30 dark:bg-orange-900/20 dark:text-orange-400"
  };

  const Icon = icons[type];

  return (
    <div 
      className={cn(
        "flex flex-col p-4 rounded-md border",
        colors[type],
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        <Icon className="w-5 h-5 mr-2 flex-shrink-0" />
        <div className="flex-1">
          {title && <h4 className="font-medium text-sm mb-1">{title}</h4>}
          {message && <p className="text-sm">{message}</p>}
        </div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="ml-4 text-sm flex items-center hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
            aria-label="Retry"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export function ApiErrorBoundary({ error, onRetry, children }) {
  if (!error) return children;

  let title = "An error occurred";
  let message = "Please try again later.";
  let type = ErrorTypes.ERROR;

  // Handle different types of API errors
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const status = error.response.status;
    
    if (status === 401 || status === 403) {
      title = "Authentication Error";
      message = "You don't have permission to access this resource. Please log in again.";
    } else if (status === 404) {
      title = "Resource Not Found";
      message = "The requested resource could not be found.";
    } else if (status === 429) {
      title = "Too Many Requests";
      message = "Please slow down and try again later.";
      type = ErrorTypes.WARNING;
    } else if (status >= 500) {
      title = "Server Error";
      message = "Our servers are experiencing issues. Please try again later.";
    }
    
    // Use server provided message if available
    if (error.response.data && error.response.data.message) {
      message = error.response.data.message;
    }
  } else if (error.request) {
    // The request was made but no response was received
    title = "Network Error";
    message = "Could not connect to the server. Please check your internet connection.";
    type = ErrorTypes.WARNING;
  } else {
    // Something happened in setting up the request that triggered an Error
    title = "Application Error";
    message = error.message || "An unexpected error occurred.";
  }

  return (
    <ErrorMessage 
      type={type}
      title={title}
      message={message}
      onRetry={onRetry}
    />
  );
}

export function FormErrorMessage({ errors }) {
  if (!errors || Object.keys(errors).length === 0) return null;

  return (
    <ErrorMessage 
      type={ErrorTypes.VALIDATION}
      title="Please correct the following errors:"
      message={
        <ul className="mt-1 ml-5 list-disc">
          {Object.values(errors).map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      }
    />
  );
} 