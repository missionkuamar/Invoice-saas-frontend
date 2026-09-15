// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Import components
import AdminStats from '../../components/admin/AdminStats';
import AdminRecentUsers from '../../components/admin/AdminRecentUsers';
import AdminRecentInvoices from '../../components/admin/AdminRecentInvoices';
import AdminSubscriptionDistribution from '../../components/admin/AdminSubscriptionDistribution';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    totalCompanies: 0,
    recentUsers: [],
    recentInvoices: [],
    subscriptionDistribution: [],
    monthlyStats: [],
    pendingWithdrawals: 0,
    totalWithdrawals: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      toast.error(error.message || 'Internal server error');
     // console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${theme.colors.background}`}>
        <div className="text-center">
          <FaSpinner className={`animate-spin text-4xl ${theme.colors.primary} mx-auto mb-4`} />
          <p className={theme.colors.text}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.colors.background} p-3 md:p-6`}>
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <AdminHeader stats={stats} />

        <AdminStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <AdminRecentUsers users={stats.recentUsers} />
          <AdminRecentInvoices invoices={stats.recentInvoices} />
        </div>

        <AdminSubscriptionDistribution distribution={stats.subscriptionDistribution} />
      </div>
    </div>
  );
};

export default AdminDashboard;