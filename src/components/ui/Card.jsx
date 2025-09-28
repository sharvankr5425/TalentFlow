import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow duration-300 hover:shadow-md', 
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

