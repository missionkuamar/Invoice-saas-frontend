// frontend/src/pages/AffiliateDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { useTheme } from '../themes/ThemeProvider';
import api from '../services/api';
import toast from 'react-hot-toast';

// Import components
import AffiliateHeader from '../components/affiliate/AffiliateHeader';
import AffiliateStats from '../components/affiliate/AffiliateStats';
import AffiliateCommission from '../components/affiliate/AffiliateCommission';
import AffiliateLinks from '../components/affiliate/AffiliateLinks';
import AffiliateReferrals from '../components/affiliate/AffiliateReferrals';
import AffiliateJoin from '../components/affiliate/AffiliateJoin';
import CreateLinkModal from '../components/affiliate/CreateLinkModal';

const AffiliateDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState(null);
  const [stats, setStats] = useState(null);
  const [links, setLinks] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [showCreateLink, setShowCreateLink] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', destination: '', slug: '' });

  useEffect(() => {
    fetchDashboard();
    fetchWithdrawals();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await api.get('/affiliate/dashboard');
      const data = response.data.data;
      setAffiliate(data.affiliate);
      setStats(data.stats);
      setLinks(data.links || []);
      setReferrals(data.recentReferrals || []);
      setEarnings(data.stats?.totalEarnings || 0);
    } catch (error) {
      if (error.response?.status === 404) {
        setAffiliate(null);
      } else {
        console.error('Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const response = await api.get('/affiliate/withdrawals');
      setWithdrawals(response.data.data?.withdrawals || []);
    } catch (error) {
    //  console.error('Failed to fetch withdrawals:', error);
    console.error(error.message || 'Internal server error');
    }
  };

  const handleJoinAffiliate = async () => {
    try {
      await api.post('/affiliate/join');
      toast.success('Joined affiliate program successfully!');
      fetchDashboard();
    } catch (error) {
      console.error(error.response?.data?.message || 'Failed to join');
    }
  };

  const handleCreateLink = async (e) => {
    e.preventDefault();
    if (!newLink.name.trim()) {
      toast.error('Please enter a link name');
      return;
    }
    if (!newLink.destination.trim()) {
      console.error('Please enter a destination URL');
      return;
    }

    setIsCreatingLink(true);
    try {
      const response = await api.post('/affiliate/links', {
        name: newLink.name,
        destination: newLink.destination,
        slug: newLink.slug || undefined,
      });
      
      setLinks([response.data.data, ...links]);
      setNewLink({ name: '', destination: '', slug: '' });
      setShowCreateLink(false);
      toast.success('Affiliate link created successfully!');
    } catch (error) {
      console.error(error.response?.data?.message || 'Failed to create link');
    } finally {
      setIsCreatingLink(false);
    }
  };

  const handleDeleteLink = async (id) => {
    if (!window.confirm('Delete this link?')) return;
    try {
      await api.delete(`/affiliate/links/${id}`);
      setLinks(links.filter(l => l._id !== id));
      console.success('Link deleted');
    } catch (error) {
      console.error('Failed to delete link');
    }
  };

  const handleCopyLink = (slug, code) => {
    const backendUrl = import.meta.env.VITE_API_URL || 'https://invoice-saas-backend-58pc.onrender.com';
    const url = `${backendUrl}/r/${slug}?ref=${code}`;
    navigator.clipboard.writeText(url);
    console.success('Link copied to clipboard!');
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

  if (!affiliate) {
    return <AffiliateJoin onJoin={handleJoinAffiliate} stats={stats} />;
  }

  return (
    <div className={`min-h-screen ${theme.colors.background} p-3 md:p-6`}>
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <AffiliateHeader
          affiliate={affiliate}
          onToggleHistory={() => setShowHistory(!showHistory)}
          showHistory={showHistory}
          onWithdraw={() => navigate('/affiliate/withdrawals')}
        />

        <AffiliateStats stats={stats} earnings={earnings} />

        <AffiliateCommission affiliate={affiliate} />

        {showHistory && (
          <AffiliateReferrals 
            title="Withdrawal History"
            items={withdrawals}
            type="withdrawal"
            onClose={() => setShowHistory(false)}
          />
        )}

        <AffiliateLinks
          links={links}
          affiliateCode={affiliate.affiliateCode}
          onCopyLink={handleCopyLink}
          onDeleteLink={handleDeleteLink}
          onCreateLink={() => setShowCreateLink(true)}
        />

        {referrals.length > 0 && (
          <AffiliateReferrals 
            title="Recent Referrals"
            items={referrals}
            type="referral"
          />
        )}

        <CreateLinkModal
          isOpen={showCreateLink}
          onClose={() => setShowCreateLink(false)}
          newLink={newLink}
          setNewLink={setNewLink}
          onSubmit={handleCreateLink}
          isCreating={isCreatingLink}
        />
      </div>
    </div>
  );
};

export default AffiliateDashboard;