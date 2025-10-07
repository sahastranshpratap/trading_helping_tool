import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, status = 'info', duration = 5000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = {
      id,
      title,
      description,
      status,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto dismiss
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, duration);

    return id;
  };

  const closeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, closeToast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start rounded-md shadow-lg p-4 max-w-md transform transition-all duration-300 ease-in-out ${
              t.status === 'error' ? 'bg-red-100 dark:bg-red-900' :
              t.status === 'success' ? 'bg-green-100 dark:bg-green-900' :
              t.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' :
              'bg-blue-100 dark:bg-blue-900'
            }`}
            role="alert"
          >
            <div className="flex-1">
              {t.title && (
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t.title}
                </h3>
              )}
              {t.description && (
                <div className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                  {t.description}
                </div>
              )}
            </div>
            <button
              type="button"
              className="ml-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={() => closeToast(t.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 