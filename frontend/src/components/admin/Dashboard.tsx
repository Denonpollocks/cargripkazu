import React, { useEffect, useState } from 'react';

interface DashboardStats {
  users: number;
  quotations: number;
  orders: number;
  pendingShipments: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    quotations: 0,
    orders: 0,
    pendingShipments: 0
  });

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gold-500">Dashboard Overview</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.users}
          icon="👥"
        />
        <StatCard
          title="Active Quotations"
          value={stats.quotations}
          icon="📝"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders}
          icon="🛍️"
        />
        <StatCard
          title="Pending Shipments"
          value={stats.pendingShipments}
          icon="🚚"
        />
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gold-500 mb-4">Recent Activity</h3>
        <div className="bg-zinc-900 rounded-lg p-4">
          {/* Add recent activity list here */}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-zinc-900 rounded-lg p-6 border border-gold-500">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gold-400 text-sm">{title}</p>
        <p className="text-gold-500 text-2xl font-bold">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

export default Dashboard; 