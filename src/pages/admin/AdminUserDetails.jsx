// frontend/src/pages/admin/AdminUserDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendar, 
  FaWallet, 
  FaFileInvoice,
  FaChartLine,
  FaUsers,
  FaEye,
  FaEyeSlash,
  FaCopy,
  FaCheck,
  FaSpinner,
  FaArrowLeft,
  FaCreditCard,
  FaGift,
} from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users/${id}`);
      setUserData(response.data.data);
    } catch (error) {
      toast.error('Failed to load user details');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPassword = () => {
    if (userData?.user?.password) {
      navigator.clipboard.writeText(userData.user.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Password copied!');
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        Active
      </span>
    ) : (
      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-1">
        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
        Inactive
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const colors = {
      user: 'bg-blue-100 text-blue-700',
      admin: 'bg-purple-100 text-purple-700',
      super_admin: 'bg-red-100 text-red-700',
    };
    const labels = {
      user: '👤 User',
      admin: '🛡️ Admin',
      super_admin: '👑 Super Admin',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[role] || colors.user}`}>
        {labels[role] || role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-primary-500 text-4xl" />
      </div>
    );
  }

  if (!userData) return null;

  const { user, stats } = userData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              {user.name}
              {getStatusBadge(user.isActive)}
            </h1>
            <p className="text-sm text-gray-500">User ID: {user._id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`/admin/users/${id}/edit`)}
            className="btn-primary"
          >
            Edit User
          </button>
        </div>
      </div>

      {/* User Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaUser className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <FaEnvelope className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-sm">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <FaPhone className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{user.phone || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <FaCalendar className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="font-medium text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Role & Subscription */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Role</h3>
          {getRoleBadge(user.role)}
          {user.role === 'super_admin' && (
            <p className="text-xs text-gray-500 mt-2">🔑 Has full access to everything</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Subscription</h3>
          <div className="flex items-center gap-3">
            <FaCreditCard className="text-primary-500" />
            <span className="font-medium capitalize">{user.subscription?.plan || 'Free'}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              user.subscription?.status === 'active' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-500'
            }`}>
              {user.subscription?.status || 'Inactive'}
            </span>
          </div>
          {user.subscription?.endDate && (
            <p className="text-sm text-gray-500 mt-1">
              Valid until: {new Date(user.subscription.endDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Super Admin: Show Password */}
      {user.role === 'super_admin' && userData.user.password && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaEye className="text-yellow-600" />
              <span className="font-medium text-gray-700">User Password</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 py-1 bg-yellow-200 rounded-lg hover:bg-yellow-300 transition-colors flex items-center gap-2 text-sm"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
                {showPassword ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={handleCopyPassword}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
              >
                {copied ? <FaCheck /> : <FaCopy />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          {showPassword && (
            <div className="mt-2 p-3 bg-white rounded-lg border border-yellow-200 font-mono text-sm">
              {userData.user.password}
            </div>
          )}
          <p className="text-xs text-yellow-700 mt-2">
            ⚠️ This password is hashed. Only super admin can view it.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Invoices</p>
            <FaFileInvoice className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{stats?.invoices?.total || 0}</p>
          <div className="flex gap-2 text-xs mt-1">
            <span className="text-green-600">Paid: {stats?.invoices?.paid || 0}</span>
            <span className="text-yellow-600">Draft: {stats?.invoices?.draft || 0}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <FaWallet className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            ₹{(stats?.invoices?.totalRevenue || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Affiliate Earnings</p>
            <FaGift className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            ₹{(stats?.affiliate?.commissionStats?.totalEarnings || 0).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Referrals: {stats?.affiliate?.commissionStats?.totalReferrals || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Pending Withdrawals</p>
            <FaChartLine className="text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">
            ₹{(stats?.affiliate?.commissionStats?.pendingWithdrawals || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Recent Invoices</h3>
          {stats?.invoices?.total > 0 ? (
            <div className="space-y-2">
              {stats.invoices.slice(0, 5).map((inv) => (
                <div key={inv._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium text-sm">{inv.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">{inv.client?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{inv.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No invoices yet</p>
          )}
        </div>

        {/* Recent Referrals */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Recent Referrals</h3>
          {stats?.referrals?.length > 0 ? (
            <div className="space-y-2">
              {stats.referrals.slice(0, 5).map((ref) => (
                <div key={ref._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium text-sm">
                      {ref.referredUser?.name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(ref.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      ref.status === 'subscribed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {ref.status}
                    </span>
                    {ref.commission > 0 && (
                      <p className="text-sm font-semibold text-green-600">
                        +₹{ref.commission.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No referrals yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;