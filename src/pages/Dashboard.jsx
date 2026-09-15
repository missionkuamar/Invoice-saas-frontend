// frontend/src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaFileInvoice, FaUsers, FaMoneyBill, FaChartLine, FaArrowRight } from 'react-icons/fa';
import { fetchInvoices } from '../store/slices/invoiceSlice';
import { useTheme } from '../themes/ThemeProvider';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { invoices, loading } = useSelector((state) => state.invoices);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchInvoices({ limit: 5 }));
  }, [dispatch]);

  const stats = [
    {
      title: 'Total Invoices',
      value: invoices.length,
      icon: FaFileInvoice,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Clients',
      value: new Set(invoices.map((inv) => inv.client?.name)).size,
      icon: FaUsers,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Revenue',
      value: `₹${invoices.reduce((sum, inv) => sum + (inv.total || 0), 0).toFixed(2)}`,
      icon: FaMoneyBill,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Paid Invoices',
      value: invoices.filter((inv) => inv.status === 'paid').length,
      icon: FaChartLine,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.colors.background} p-4 md:p-6 space-y-6`}>
      {/* Welcome Section */}
      <div className={`${theme.colors.card} rounded-2xl p-6 md:p-8 border ${theme.colors.border}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text}`}>
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className={`${theme.colors.text} opacity-70 mt-1 text-sm md:text-base`}>
              Here's what's happening with your invoices today
            </p>
          </div>
          <Link
            to="/create-invoice/simple"
            className={`${theme.colors.button} text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-sm md:text-base whitespace-nowrap`}
          >
            Create New Invoice <FaArrowRight />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${theme.colors.card} rounded-2xl p-6 border ${theme.colors.border} hover:shadow-xl transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.bgColor} p-3 md:p-4 rounded-xl`}>
                  <Icon className={`${stat.textColor} text-xl md:text-2xl`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs md:text-sm ${theme.colors.text} opacity-70`}>
                    {stat.title}
                  </p>
                  <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${theme.colors.text} truncate`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Invoices */}
      <div className={`${theme.colors.card} rounded-2xl p-6 md:p-8 border ${theme.colors.border}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className={`text-lg md:text-xl font-semibold ${theme.colors.text}`}>
            Recent Invoices
          </h2>
          <Link
            to="/invoices"
            className={`text-sm ${theme.colors.primary} hover:underline flex items-center gap-1`}
          >
            View All <FaArrowRight size={12} />
          </Link>
        </div>

        {invoices.length === 0 ? (
          <div className={`text-center py-12 ${theme.colors.text} opacity-70`}>
            <FaFileInvoice className="text-4xl mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No invoices yet</p>
            <p className="text-sm mt-2">Create your first invoice to get started</p>
            <Link
              to="/create-invoice"
              className={`inline-block mt-4 ${theme.colors.button} text-white px-6 py-2 rounded-xl hover:scale-105 transition-all`}
            >
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="min-w-[500px] md:min-w-full">
              <div className="grid grid-cols-12 gap-4 px-4 md:px-0 py-3 border-b border-gray-200 dark:border-gray-700 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                <div className="col-span-4">Invoice</div>
                <div className="col-span-4">Client</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-2 text-right">Status</div>
              </div>
              {invoices.slice(0, 5).map((invoice) => (
                <div
                  key={invoice._id}
                  className={`grid grid-cols-12 gap-4 px-4 md:px-0 py-3 border-b ${theme.colors.border} hover:${theme.colors.hover} transition-colors cursor-pointer items-center`}
                >
                  <div className="col-span-4">
                    <p className={`text-sm font-medium ${theme.colors.text}`}>
                      #{invoice.invoiceNumber || 'N/A'}
                    </p>
                    <p className={`text-xs ${theme.colors.text} opacity-60`}>
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-span-4">
                    <p className={`text-sm ${theme.colors.text}`}>
                      {invoice.client?.name || 'Unknown'}
                    </p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className={`text-sm font-semibold ${theme.colors.text}`}>
                      ₹{(invoice.total || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs font-medium
                      ${invoice.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      {invoice.status || 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;