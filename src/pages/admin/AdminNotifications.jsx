// frontend/src/pages/admin/AdminNotifications.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaBell, 
  FaCheck, 
  FaTrash, 
  FaSpinner,
  FaWallet,
  FaUser,
  FaGift,
  FaTimes,
} from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminNotifications = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [pagination.page]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications', {
        params: { page: pagination.page, limit: pagination.limit }
      });
      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      toast.success('All notifications marked as read');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      toast.success('Notification deleted');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'withdrawal_request':
        return <FaWallet className="text-yellow-500" />;
      case 'withdrawal_approved':
        return <FaCheck className="text-blue-500" />;
      case 'withdrawal_completed':
        return <FaWallet className="text-green-500" />;
      case 'withdrawal_rejected':
        return <FaWallet className="text-red-500" />;
      case 'affiliate_commission':
        return <FaGift className="text-purple-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-primary-500 text-4xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBell className="text-yellow-500" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500">Manage all your notifications</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="btn-primary flex items-center gap-2"
          >
            <FaCheck /> Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No notifications</p>
            <p className="text-gray-400 text-sm">When you have notifications, they will appear here</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((n) => (
              <div 
                key={n._id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-xl">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-semibold ${!n.isRead ? 'text-blue-700' : 'text-gray-800'}`}>
                          {n.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        {!n.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(n._id)}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(n._id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-400">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                      {n.priority === 'high' && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                          🔴 High Priority
                        </span>
                      )}
                      {!n.isRead && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    {n.data && (
                      <div className="mt-2 text-xs text-gray-400">
                        <pre className="bg-gray-50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(n.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded text-sm">
                {pagination.page} / {pagination.pages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;