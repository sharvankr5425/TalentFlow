import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatedPage } from '../ui/AnimatedPage';
import { Footer } from './Footer'; // Import the new Footer
import Header from './Header';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    // Updated to use flexbox for a sticky footer effect
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      {/* THE FIX IS HERE: Added overflow-y-auto to the main content area */}
      <main className="container mx-auto p-6 w-full flex-grow overflow-y-auto">
        <AnimatePresence mode="wait">
          <AnimatedPage key={location.key}>
            {children}
          </AnimatedPage>
        </AnimatePresence>
      </main>
      <Footer /> {/* Add the Footer component here */}
    </div>
  );
}

