// frontend/src/components/affiliate/WithdrawModal.jsx
import React from 'react';
import { FaTimes, FaWallet, FaSpinner, FaMobile, FaPaypal, FaInfoCircle } from 'react-icons/fa';
import { CiBank } from "react-icons/ci";
import { useTheme } from '../../themes/ThemeProvider';

const WithdrawModal = ({
  isOpen,
  onClose,
  earnings,
  amount,
  setAmount,
  paymentMethod,
  setPaymentMethod,
  paymentDetails,
  setPaymentDetails,
  onSubmit,
  loading,
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-3 md:px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        <div className={`relative ${theme.colors.card} rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto border ${theme.colors.border}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${theme.colors.text} flex items-center gap-2`}>
              <FaWallet className="text-purple-500" />
              Withdraw Earnings
            </h3>
            <button onClick={onClose} className={`${theme.colors.text} opacity-60 hover:opacity-100`}>
              <FaTimes />
            </button>
          </div>

          <div className={`p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border} mb-4`}>
            <p className={`text-sm ${theme.colors.text} opacity-70`}>Available Balance</p>
            <p className={`text-2xl font-bold ${theme.colors.primary}`}>₹{earnings.toFixed(2)}</p>
            <p className={`text-xs ${theme.colors.text} opacity-60`}>Min: ₹100 | Max per transaction: ₹10,000</p>
          </div>

          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                  placeholder="Enter amount"
                  min="100"
                  max={Math.min(10000, earnings)}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['bank', 'upi', 'paypal'].map((method) => {
                    const icons = {
                      bank: <CiBank className={`mx-auto mb-1 text-lg ${paymentMethod === method ? theme.colors.primary : ''}`} />,
                      upi: <FaMobile className={`mx-auto mb-1 text-lg ${paymentMethod === method ? theme.colors.primary : ''}`} />,
                      paypal: <FaPaypal className={`mx-auto mb-1 text-lg ${paymentMethod === method ? theme.colors.primary : ''}`} />,
                    };
                    const labels = { bank: 'Bank', upi: 'UPI', paypal: 'PayPal' };
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          paymentMethod === method
                            ? `border-primary-500 ${theme.colors.background}`
                            : `${theme.colors.border} ${theme.colors.hover}`
                        }`}
                      >
                        {icons[method]}
                        <span className={`text-xs font-medium ${paymentMethod === method ? theme.colors.primary : theme.colors.text}`}>
                          {labels[method]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Payment Fields */}
              {paymentMethod === 'bank' && (
                <div className={`space-y-3 p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
                  <h4 className={`font-medium text-sm ${theme.colors.text} flex items-center gap-2`}>
                    <CiBank className={theme.colors.primary} /> Bank Details
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      placeholder="Account Holder Name"
                      value={paymentDetails.accountHolderName}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, accountHolderName: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Bank Name"
                      value={paymentDetails.bankName}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, bankName: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={paymentDetails.accountNumber}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                      required
                    />
                    <input
                      type="text"
                      placeholder="IFSC Code"
                      value={paymentDetails.ifscCode}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, ifscCode: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className={`space-y-3 p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
                  <h4 className={`font-medium text-sm ${theme.colors.text} flex items-center gap-2`}>
                    <FaMobile className={theme.colors.primary} /> UPI Details
                  </h4>
                  <input
                    type="text"
                    placeholder="UPI ID (e.g., name@upi)"
                    value={paymentDetails.upiId}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Name on UPI"
                    value={paymentDetails.upiName}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, upiName: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                  />
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className={`space-y-3 p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
                  <h4 className={`font-medium text-sm ${theme.colors.text} flex items-center gap-2`}>
                    <FaPaypal className={theme.colors.primary} /> PayPal Details
                  </h4>
                  <input
                    type="email"
                    placeholder="PayPal Email"
                    value={paymentDetails.paypalEmail}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, paypalEmail: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Name on PayPal"
                    value={paymentDetails.paypalName}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, paypalName: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                  />
                </div>
              )}

              {/* Info Box */}
              <div className={`p-4 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
                <div className="flex items-start gap-2">
                  <FaInfoCircle className={`${theme.colors.primary} mt-0.5 flex-shrink-0`} />
                  <div className={`text-xs md:text-sm ${theme.colors.text} opacity-70`}>
                    <p>📌 Processing time: 2-3 business days</p>
                    <p className="mt-1">📌 Admin will review and approve your request</p>
                    <p className="mt-1">📌 You will receive notification on status update</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm w-full sm:w-auto`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`${theme.colors.button} text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Request Withdrawal'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;