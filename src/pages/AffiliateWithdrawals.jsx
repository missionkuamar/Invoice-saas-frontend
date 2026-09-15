// frontend/src/pages/AffiliateWithdrawals.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../themes/ThemeProvider';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaSpinner } from "react-icons/fa";

// Import components
import WithdrawalHeader from '../components/affiliate/WithdrawalHeader';
import WithdrawalStats from '../components/affiliate/WithdrawalStats';
import WithdrawalFilters from '../components/affiliate/WithdrawalFilters';
import WithdrawalTable from '../components/affiliate/WithdrawalTable';
import WithdrawModal from '../components/affiliate/WithdrawModal';
import WithdrawalDetailModal from '../components/affiliate/WithdrawalDetailModal';
import WithdrawalStatsModal from '../components/affiliate/WithdrawalStatsModal';

const AffiliateWithdrawals = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    search: '',
    paymentMethod: '',
  });
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');

  const [paymentDetails, setPaymentDetails] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'savings',
    upiId: '',
    upiName: '',
    paypalEmail: '',
    paypalName: '',
  });
  const [earnings, setEarnings] = useState(0);
  const [withdrawStats, setWithdrawStats] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
    fetchStats();
    fetchEarnings();
  }, [pagination?.page, filters]);

  const fetchEarnings = async () => {
    try {
      const response = await api.get('/affiliate/dashboard');
      setEarnings(response.data.data.stats.totalEarnings || 0);
    } catch (error) {
     // console.error('Failed to fetch earnings:', error);
     toast.error(error.message || 'Internal server error');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/affiliate/withdrawals/stats');
      //console.log("response fetchEarnings:", response);
      
      setWithdrawStats(response.data.data);
    } catch (error) {
   //   console.error('Failed to fetch stats:', error);
   toast.error(error.message || 'Internal server error');
    }
  };

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const params = {
        status: filters.status || '',
        page: pagination.page,
        limit: pagination.limit,
        paymentMethod: filters.paymentMethod || '',
      };

      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.search) params.search = filters.search;

      Object.keys(params).forEach(key => {
        if (!params[key] || params[key] === '') {
          delete params[key];
        }
      });

      const response = await api.get('/affiliate/withdrawals', { params });

      if (response.data.success) {
        setWithdrawals(response.data.data.withdrawals || []);
        setPagination(response.data.data.pagination);
        setStats(response.data.data.stats);
      } else {
        toast.error(response.data.message || 'Failed to load withdrawals');
      }
    } catch (error) {
     // console.error('Fetch withdrawals error:', error);
      toast.error(error.response?.data?.message || 'Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };


  const handleWithdraw = async (e) => {
  e.preventDefault();

  const amountNum = parseFloat(amount);
  const MIN_WITHDRAWAL = 100;
  const MAX_WITHDRAWAL = 10000;

  if (amountNum < MIN_WITHDRAWAL) {
    toast.error(`Minimum withdrawal is ₹${MIN_WITHDRAWAL}`);
    return;
  }

  if (amountNum > MAX_WITHDRAWAL) {
    toast.error(`Maximum per transaction is ₹${MAX_WITHDRAWAL}`);
    return;
  }

  if (amountNum > earnings) {
    toast.error("Insufficient earnings");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      amount: amountNum,
      paymentMethod,
      paymentDetails,
    };

    // console.log("🚀 Withdrawal Payload:");
    // console.log(payload);

    // console.log("💰 Amount:", amountNum);
    // console.log("💳 Payment Method:", paymentMethod);
    // console.log("📄 Payment Details:", paymentDetails);

    const response = await api.post("/affiliate/withdraw", payload);

   // console.log("✅ API Response:", response.data);

    toast.success(
      "Withdrawal request submitted! Admin will process it shortly."
    );

    setShowWithdrawModal(false);
    setAmount("");

    setPaymentDetails({
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountType: "savings",
      upiId: "",
      upiName: "",
      paypalEmail: "",
      paypalName: "",
    });

    fetchWithdrawals();
    fetchEarnings();
    fetchStats();

  } catch (error) {
    // console.error("❌ Withdrawal Error:", error);

    // console.error("Status:", error.response?.status);
    // console.error("Response:", error.response?.data);

    toast.error(
      error.response?.data?.message || "Failed to request withdrawal"
    );
  } finally {
    setLoading(false);
  }
};

  const handleCancelWithdrawal = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this withdrawal?')) return;
    try {
      await api.post(`/affiliate/withdraw/${id}/cancel`);
      toast.success('Withdrawal cancelled successfully');
      fetchWithdrawals();
      fetchEarnings();
      fetchStats();
    } catch (error) {
      toast.error('Failed to cancel withdrawal');
    }
  };

  const handleViewDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowDetailModal(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
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
        <WithdrawalHeader
          onBack={() => navigate('/affiliate')}
          onViewStats={() => setShowStatsModal(true)}
          onWithdraw={() => setShowWithdrawModal(true)}
          earnings={earnings}
        />

        <WithdrawalStats
          withdrawStats={withdrawStats}
          withdrawals={withdrawals}
        />

        <WithdrawalFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <WithdrawalTable
          withdrawals={withdrawals}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onViewDetails={handleViewDetails}
          onCancel={handleCancelWithdrawal}
          onWithdraw={() => setShowWithdrawModal(true)}
          earnings={earnings}
        />
      </div>

      {/* Modals */}
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        earnings={earnings}
        amount={amount}
        setAmount={setAmount}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentDetails={paymentDetails}
        setPaymentDetails={setPaymentDetails}
        onSubmit={handleWithdraw}
        loading={loading}
      />

      <WithdrawalDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        withdrawal={selectedWithdrawal}
      />

      <WithdrawalStatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        withdrawals={withdrawals}
      />
    </div>
  );
};

export default AffiliateWithdrawals;