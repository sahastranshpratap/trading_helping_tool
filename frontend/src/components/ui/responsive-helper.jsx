import React, { useState } from 'react';
import { Laptop, Smartphone, Tablet, X, Monitor } from 'lucide-react';

/**
 * ResponsiveHelper - A floating component to help with responsive design testing
 * 
 * This component shows the current viewport size and offers buttons to simulate
 * different device sizes during development.
 */
export function ResponsiveHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const [viewportDetails, setViewportDetails] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    breakpoint: getBreakpoint(window.innerWidth)
  });
  
  // Update viewport details on resize
  React.useEffect(() => {
    const handleResize = () => {
      setViewportDetails({
        width: window.innerWidth,
        height: window.innerHeight,
        breakpoint: getBreakpoint(window.innerWidth)
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleOpen = () => setIsOpen(!isOpen);
  
  // Device presets for testing
  const presets = [
    { name: 'Mobile SM', width: 320, height: 568, icon: Smartphone },
    { name: 'Mobile MD', width: 375, height: 667, icon: Smartphone },
    { name: 'Mobile LG', width: 425, height: 812, icon: Smartphone },
    { name: 'Tablet', width: 768, height: 1024, icon: Tablet },
    { name: 'Laptop', width: 1024, height: 768, icon: Laptop },
    { name: 'Desktop', width: 1440, height: 900, icon: Monitor }
  ];
  
  // Set viewport to a specific size for testing
  const setViewportSize = (width, height) => {
    window.open(`${window.location.href}`, '_blank', `width=${width},height=${height}`);
  };
  
  // Get Tailwind breakpoint name from width
  function getBreakpoint(width) {
    if (width < 640) return 'xs';
    if (width < 768) return 'sm';
    if (width < 1024) return 'md';
    if (width < 1280) return 'lg';
    if (width < 1536) return 'xl';
    return '2xl';
  }
  
  // Color code for breakpoints
  const breakpointColors = {
    'xs': 'bg-red-500',
    'sm': 'bg-orange-500',
    'md': 'bg-yellow-500',
    'lg': 'bg-green-500',
    'xl': 'bg-blue-500',
    '2xl': 'bg-purple-500'
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-gray-900 dark:text-white">Responsive Testing</h3>
            <button 
              onClick={toggleOpen}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              aria-label="Close responsive helper"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="p-3">
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Current Viewport:</p>
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${breakpointColors[viewportDetails.breakpoint]}`}></span>
                <span className="font-medium">{viewportDetails.width} × {viewportDetails.height}</span>
                <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {viewportDetails.breakpoint}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Test Presets:</p>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <button
                      key={preset.name}
                      onClick={() => setViewportSize(preset.width, preset.height)}
                      className="flex items-center justify-center px-2 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                      aria-label={`Test on ${preset.name} (${preset.width}x${preset.height})`}
                    >
                      <Icon size={16} className="mr-1.5" />
                      <span>{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tailwind Breakpoints: XS (&lt;640px), SM (≥640px), 
                MD (≥768px), LG (≥1024px), XL (≥1280px), 2XL (≥1536px)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleOpen}
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Open responsive testing helper"
        >
          <Smartphone size={20} />
        </button>
      )}
    </div>
  );
} 