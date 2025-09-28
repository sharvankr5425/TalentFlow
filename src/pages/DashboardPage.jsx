import React from 'react';
import { Dashboard } from '../features/dashboard/Dashboard';

export function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <Dashboard />
    </div>
  );
}