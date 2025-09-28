import { Briefcase, LayoutDashboard, UserCircle2 } from 'lucide-react';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function Header() {
  const linkClasses = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors";
  const activeLinkClasses = "bg-slate-200 text-slate-900";

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-slate-200 shadow-sm">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left side: Logo now links to /app */}
        <Link to="/app" className="flex items-center gap-2">
          <Briefcase className="text-blue-600 h-7 w-7" />
          <span className="text-2xl font-bold text-gray-800">TalentFlow</span>
        </Link>
        
        {/* Right side: Navigation and User Profile */}
        <div className="flex items-center gap-4">
          {/* Jobs link now points to /app */}
          <NavLink 
            to="/app" 
            end // Add 'end' prop to ensure it's only active on the exact path
            className={({ isActive }) => cn(linkClasses, isActive && activeLinkClasses)}
          >
            Jobs
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => cn(linkClasses, isActive && activeLinkClasses)}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>

          {/* Vertical Divider */}
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          
          <button className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors">
            <UserCircle2 size={22} />
          </button>
        </div>
      </nav>
    </header>
  );
}

