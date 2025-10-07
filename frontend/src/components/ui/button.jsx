import React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  type = "button",
  children,
  ...props 
}, ref) => {
  // Define variant styles
  const variantStyles = {
    default: "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
    outline: "border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-[#0F0F12] dark:hover:bg-[#1F1F23] dark:hover:text-zinc-50",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
    ghost: "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
    link: "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50",
  };

  // Define size styles
  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-900",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      ref={ref}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button"; 