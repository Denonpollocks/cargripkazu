import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import UserManagement from './UserManagement.tsx';
import QuotationManagement from './QuotationManagement.tsx';
import OrderManagement from './OrderManagement.tsx';
import ShippingManagement from './ShippingManagement.tsx';
import ContentManagement from './ContentManagement.tsx';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-black text-gold-400 p-6">
      {/* Admin Navigation */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gold-500 mb-6">Admin Dashboard</h1>
        <nav className="flex space-x-4 border-b border-gold-500">
          <Link
            to="/admin"
            className={`px-4 py-2 ${
              activeTab === 'dashboard'
                ? 'text-gold-500 border-b-2 border-gold-500'
                : 'text-gold-400 hover:text-gold-300'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            className={`px-4 py-2 ${
              activeTab === 'users'
                ? 'text-gold-500 border-b-2 border-gold-500'
                : 'text-gold-400 hover:text-gold-300'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </Link>
          <Link
            to="/admin/quotations"
            className={`px-4 py-2 ${
              activeTab === 'quotations'
                ? 'text-gold-500 border-b-2 border-gold-500'
                : 'text-gold-400 hover:text-gold-300'
            }`}
            onClick={() => setActiveTab('quotations')}
          >
            Quotations
          </Link>
          <Link
            to="/admin/orders"
            className={`px-4 py-2 ${
              activeTab === 'orders'
                ? 'text-gold-500 border-b-2 border-gold-500'
                : 'text-gold-400 hover:text-gold-300'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </Link>
          <Link
            to="/admin/shipping"
            className={`px-4 py-2 ${
              activeTab === 'shipping'
                ? 'text-gold-500 border-b-2 border-gold-500'
                : 'text-gold-400 hover:text-gold-300'
            }`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping
          </Link>
          <Link
            to="/admin/content"
            className={`px-4 py-2 ${
              activeTab === 'content'
                ? 'text-gold-500 border-b-2 border-gold-500'
                : 'text-gold-400 hover:text-gold-300'
            }`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </Link>
        </nav>
      </div>

      {/* Admin Routes */}
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/quotations" element={<QuotationManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/shipping" element={<ShippingManagement />} />
        <Route path="/content" element={<ContentManagement />} />
      </Routes>
    </div>
  );
};

// Simple dashboard component showing overview
const AdminDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-zinc-900 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gold-500 mb-4">Quick Stats</h3>
        <div className="space-y-2">
          <p>Total Users: Loading...</p>
          <p>Active Quotations: Loading...</p>
          <p>Pending Orders: Loading...</p>
        </div>
      </div>
      <div className="bg-zinc-900 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gold-500 mb-4">Recent Activity</h3>
        <div className="space-y-2">
          <p>Loading recent activities...</p>
        </div>
      </div>
      <div className="bg-zinc-900 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gold-500 mb-4">System Status</h3>
        <div className="space-y-2">
          <p>All systems operational</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 