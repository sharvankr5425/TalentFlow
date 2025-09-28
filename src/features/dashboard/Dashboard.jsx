import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Briefcase, Users } from 'lucide-react';
import React from 'react';
import { CandidateFunnelChart } from './CandidateFunnelChart';
import { StatCard } from './StatCard';

// API function to fetch dashboard data
const fetchDashboardStats = async () => {
  const response = await fetch('/api/dashboard-stats');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });

  // Animation variants for the container and list items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Each child will animate 0.15s after the previous one
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading dashboard...</div>;
  }

  if (isError) {
    return <div className="text-center p-10 text-red-500">Error loading dashboard data.</div>;
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Stat Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Open Jobs"
          value={data.openJobs}
          icon={<Briefcase />}
        />
        <StatCard
          title="Total Candidates"
          value={data.totalCandidates}
          icon={<Users />}
        />
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants}>
        <CandidateFunnelChart data={data.funnelData} />
      </motion.div>
    </motion.div>
  );
}

