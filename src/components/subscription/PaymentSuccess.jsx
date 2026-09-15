// frontend/src/components/subscription/PaymentSuccess.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaGift, FaMoneyBillWave } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { plan, paymentId, affiliate } = location.state || {};

  useEffect(() => {
    // Track affiliate conversion if not already tracked
    if (paymentId) {
      trackConversion();
    }
  }, []);

  const trackConversion = async () => {
    try {
      // This is already handled by the backend
      // Just log for debugging
     // console.log('✅ Payment successful! Affiliate commission processed.');
     toast.error('Internal server error');
    } catch (error) {
     // console.error('Error tracking conversion:', error);
     toast.error(error.message || 'Internal server error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <FaCheckCircle className="text-green-500 text-6xl" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your subscription to the <strong>{plan?.name}</strong> plan has been activated.
        </p>

        {/* Affiliate Commission Info */}
        {affiliate?.earned && affiliate?.commission > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 rounded-full p-2 text-white">
                <FaGift />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-purple-700">🎉 You Earned Commission!</p>
                <p className="text-lg font-bold text-purple-600">
                  ₹{affiliate.commission.toFixed(2)}
                </p>
                <p className="text-xs text-purple-500">Credited to your affiliate account</p>
              </div>
            </div>
          </div>
        )}

        {paymentId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600">
            <p>Payment ID: <span className="font-mono">{paymentId}</span></p>
            {affiliate?.earned && (
              <p className="text-green-600 mt-1">✅ Commission credited: ₹{affiliate.commission.toFixed(2)}</p>
            )}
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full btn-primary"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/affiliate')}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <FaMoneyBillWave /> View Affiliate Earnings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;