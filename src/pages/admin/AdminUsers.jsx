// frontend/src/pages/admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../themes/ThemeProvider';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Import components
import AdminUsersHeader from '../../components/admin/users/AdminUsersHeader';
import AdminUsersFilters from '../../components/admin/users/AdminUsersFilters';
import AdminUsersTable from '../../components/admin/users/AdminUsersTable';
import AdminUserEditModal from '../../components/admin/users/AdminUserEditModal';
import AdminUserDetailsModal from '../../components/admin/users/AdminUserDetailsModal';

const AdminUsers = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    subscription: '',
    status: '',
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          params[key] = filters[key];
        }
      });
      params.page = pagination.page;
      params.limit = pagination.limit;

      const response = await api.get('/admin/users', { params });
      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
    } catch (error) {
    //  console.error('Fetch users error:', error);
   toast.error(error.message || 'Internal server error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? All associated data will be lost.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${selectedUser._id}`, selectedUser);
      toast.success('User updated successfully');
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.put(`/admin/users/${userId}`, { isActive: newStatus });
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setUserDetails(response.data.data);
      setShowDetailsModal(true);
    } catch (error) {
      toast.error('Failed to load user details');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({ search: '', role: '', subscription: '', status: '' });
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleEditUser = (user) => {
    setSelectedUser({
      ...user,
      subscription: user.subscription || { plan: 'free', status: 'inactive' }
    });
    setShowEditModal(true);
  };

  if (loading && users.length === 0) {
    return (
      <div className={`flex justify-center items-center h-64 ${theme.colors.background}`}>
        <div className="text-center">
          <FaSpinner className={`animate-spin text-4xl ${theme.colors.primary} mx-auto mb-4`} />
          <p className={theme.colors.text}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.colors.background} p-3 md:p-6`}>
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <AdminUsersHeader 
          totalUsers={pagination.total} 
          onRefresh={fetchUsers}
          loading={loading}
        />

        <AdminUsersFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          usersCount={users.length}
        />

        <AdminUsersTable
          users={users}
          pagination={pagination}
          onPageChange={handlePageChange}
          onViewDetails={handleViewDetails}
          onEditUser={handleEditUser}
          onToggleStatus={handleToggleStatus}
          onDeleteUser={handleDeleteUser}
        />
      </div>

      <AdminUserEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        onSubmit={handleUpdateUser}
      />

      <AdminUserDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        userDetails={userDetails}
      />
    </div>
  );
};

export default AdminUsers;