// frontend/src/pages/admin/AdminWithdrawals.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../themes/ThemeProvider';
import { withdrawalAPI } from '../../services/api'; // ✅ Using withdrawalAPI
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import {
  fetchWithdrawals,
  approveWithdrawal,
  completeWithdrawal,
  rejectWithdrawal,
  clearWithdrawalError,
  resetWithdrawalState,
} from '../../store/slices/withdrawalSlice';

// Import components
import AdminWithdrawalsHeader from '../../components/admin/withdrawals/AdminWithdrawalsHeader';
import AdminWithdrawalsStats from '../../components/admin/withdrawals/AdminWithdrawalsStats';
import AdminWithdrawalsFilters from '../../components/admin/withdrawals/AdminWithdrawalsFilters';
import AdminWithdrawalsTable from '../../components/admin/withdrawals/AdminWithdrawalsTable';
import AdminWithdrawalDetailModal from '../../components/admin/withdrawals/AdminWithdrawalDetailModal';

const AdminWithdrawals = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  
  const {
    withdrawals,
    stats,
    pagination,
    loading,
    processing,
    error,
    totalWithdrawals,
  } = useSelector((state) => state.withdrawals);

  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({ status: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchWithdrawalsData = useCallback(async () => {
    const params = {
      status: filters.status || '',
      page: pagination.page,
      limit: pagination.limit,
      search: searchTerm,
    };

    Object.keys(params).forEach(key => {
      if (!params[key] || params[key] === '') delete params[key];
    });

    await dispatch(fetchWithdrawals(params));
  }, [dispatch, filters.status, pagination.page, pagination.limit, searchTerm]);
// console.log("fileter :", filters)
  useEffect(() => {
    fetchWithdrawalsData();
  }, [fetchWithdrawalsData]);

  useEffect(() => {
    const interval = setInterval(fetchWithdrawalsData, 30000);
    return () => clearInterval(interval);
  }, [fetchWithdrawalsData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearWithdrawalError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    return () => dispatch(resetWithdrawalState());
  }, [dispatch]);

  const handleApprove = async (id) => {
    try {
      await dispatch(approveWithdrawal({
        id,
        notes: `Approved by ${user?.name || 'Admin'}`,
      })).unwrap();
      toast.success('✅ Withdrawal approved!');
      await fetchWithdrawalsData();
    } catch (err) {
      toast.error(err || 'Failed to approve');
    }
  };

  const handleComplete = async (id) => {
    const transactionId = prompt('Enter Bank Transaction ID:');
    if (!transactionId) return;

    try {
      await dispatch(completeWithdrawal({
        id,
        transactionId,
        notes: 'Payment sent successfully',
      })).unwrap();
      toast.success('🎉 Withdrawal completed!');
      await fetchWithdrawalsData();
    } catch (err) {
      toast.error(err || 'Failed to complete');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    try {
      await dispatch(rejectWithdrawal({
        id,
        notes: reason,
      })).unwrap();
      toast.success('❌ Withdrawal rejected');
      await fetchWithdrawalsData();
    } catch (err) {
      toast.error(err || 'Failed to reject');
    }
  };

  const handleStatusChange = (status) => {
    setFilters({ ...filters, status });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleClearFilters = () => {
    setFilters({ status: '' });
    setSearchTerm('');
  };

  const handlePageChange = (page) => {
    // Update pagination
  };

  const handleViewDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowModal(true);
  };

  const handleRefresh = () => {
    fetchWithdrawalsData();
    toast.success('Refreshed!');
  };

  if (loading && withdrawals.length === 0) {
    return (
      <div className={`flex justify-center items-center h-64 ${theme.colors.background}`}>
        <div className="text-center">
          <FaSpinner className={`animate-spin text-4xl ${theme.colors.primary} mx-auto mb-4`} />
          <p className={theme.colors.text}>Loading withdrawals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.colors.background} p-3 md:p-6`}>
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <AdminWithdrawalsHeader
          onRefresh={handleRefresh}
          loading={loading}
          totalWithdrawals={totalWithdrawals}
        />

        <AdminWithdrawalsStats
          withdrawals={withdrawals}
          stats={stats}
        />

        <AdminWithdrawalsFilters
          filters={filters}
          searchTerm={searchTerm}
          onStatusChange={handleStatusChange}
          onSearch={handleSearch}
          onClearFilters={handleClearFilters}
        />

        <AdminWithdrawalsTable
          withdrawals={withdrawals}
          pagination={pagination}
          onPageChange={handlePageChange}
          onApprove={handleApprove}
          onComplete={handleComplete}
          onReject={handleReject}
          onViewDetails={handleViewDetails}
          processing={processing}
        />
      </div>

      <AdminWithdrawalDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        withdrawal={selectedWithdrawal}
      />
    </div>
  );
};

export default AdminWithdrawals;