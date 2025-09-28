import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-slate-200 shadow-sm mt-auto">
      <div className="container mx-auto px-6 py-4 text-center text-sm text-slate-500">
        <p>&copy; {currentYear} TalentFlow. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
