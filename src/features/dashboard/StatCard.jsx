import React from 'react';
import { Card } from '../../components/ui/Card';

export function StatCard({ title, value, icon }) {
  return (
    <Card className="flex items-center p-6">
      <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </Card>
  );
}
