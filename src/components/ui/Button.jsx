import React from 'react';
import { cn } from '../../lib/utils';

export function Button({ children, className, ...props }) {
  return (
    <button
      className={cn(
        // Refined styles for a more modern button feel
        'inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

