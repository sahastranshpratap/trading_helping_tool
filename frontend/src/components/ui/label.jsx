import React from 'react';
import { cn } from '../../lib/utils';

export const Label = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-white",
        className
      )}
      {...props}
    />
  );
});

Label.displayName = "Label"; 