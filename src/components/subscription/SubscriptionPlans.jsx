// frontend/src/components/subscription/SubscriptionPlans.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaCheck, FaSpinner, FaCreditCard, FaShieldAlt, 
  FaCrown, FaStar, FaRocket, FaArrowRight,
  FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import { fetchPlans, createOrder, verifyPayment } from '../../store/slices/subscriptionSlice';
import { loadRazorpay } from '../../services/razorpay';
import { useTheme } from '../../themes/ThemeProvider';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SubscriptionPlans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { plans, loading, error, verifying, orderData } = useSelector((state) => state.subscription);
  const { user } = useSelector((state) => state.auth);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleSubscribe = async (plan) => {
    try {
      setProcessingPlan(plan.id);
      setPaymentError(null);
      
      const loadingToast = toast.loading('Initializing payment...');

      const orderResult = await dispatch(createOrder(plan.id)).unwrap();
      
      //console.log('Order created:', orderResult);

      if (!orderResult || !orderResult.orderId) {
        throw new Error('Invalid order response');
      }

      toast.loading('Loading payment gateway...', { id: loadingToast });

      const Razorpay = await loadRazorpay();
      
      const options = {
        key: orderResult.key || process.env.RAZORPAY_KEY_ID,
        amount: orderResult.amount,
        currency: orderResult.currency || 'INR',
        name: 'InvoicePro',
        description: `${plan.name} Plan Subscription`,
        order_id: orderResult.orderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#0ea5e9',
        },
        modal: {
          ondismiss: () => {
            setProcessingPlan(null);
            toast.error('Payment cancelled', { id: loadingToast });
          },
        },
        handler: async (response) => {
          try {
            toast.loading('Verifying payment...', { id: loadingToast });
            
            const verifyData = {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              plan: plan.id,
            };
            
            const result = await dispatch(verifyPayment(verifyData)).unwrap();
            
            toast.success('Payment successful! Your subscription is now active.', { id: loadingToast });
            setProcessingPlan(null);
            
            navigate('/payment-success', { 
              state: { 
                plan, 
                paymentId: response.razorpay_payment_id,
                affiliate: result?.affiliate || null
              } 
            });
          } catch (error) {
           // console.error('Verification error:', error);
            toast.error('Payment verification failed. Please contact support.', { id: loadingToast });
            setPaymentError('Payment verification failed');
            setProcessingPlan(null);
          }
        },
        onError: (error) => {
         // console.error('Razorpay error:', error);
          toast.error('Payment failed. Please try again.');
          setPaymentError('Payment failed');
          setProcessingPlan(null);
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        timeout: 300,
      };

      const rzp = new Razorpay(options);
      rzp.open();
      
      toast.dismiss(loadingToast);
      
    } catch (error) {
     // console.error('Subscription error:', error);
      const errorMessage = error.message || 'Failed to initiate payment. Please try again.';
      toast.error(errorMessage);
      setProcessingPlan(null);
      setPaymentError(errorMessage);
    }
  };

  // Get plan icon
  const getPlanIcon = (planName) => {
    const icons = {
      'basic': <FaStar className="text-2xl" />,
      'pro': <FaRocket className="text-2xl" />,
      'enterprise': <FaCrown className="text-2xl" />,
    };
    return icons[planName?.toLowerCase()] || <FaCreditCard className="text-2xl" />;
  };

  // Get plan color
  const getPlanColor = (planName) => {
    const colors = {
      'basic': 'from-blue-500 to-blue-600',
      'pro': 'from-purple-500 to-indigo-600',
      'enterprise': 'from-amber-500 to-orange-600',
    };
    return colors[planName?.toLowerCase()] || 'from-primary-500 to-primary-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FaSpinner className={`animate-spin text-4xl ${theme.colors.primary} mx-auto mb-4`} />
          <p className={theme.colors.text}>Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.colors.background} p-3 md:p-6`}>
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text}`}>
                💎 Choose Your Plan
              </h1>
              <p className={`text-sm md:text-base ${theme.colors.text} opacity-70 mt-1`}>
                Select the perfect plan for your business needs
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl ${theme.colors.background} border ${theme.colors.border}`}>
              <span className={`text-sm ${theme.colors.text} opacity-70`}>
                Current Plan: 
              </span>
              <span className={`font-semibold ml-1 ${theme.colors.primary}`}>
                {user?.subscription?.plan?.toUpperCase() || 'FREE'}
              </span>
            </div>
          </div>
        </div>

        {/* Active Subscription Banner */}
        {user?.subscription?.status === 'active' && (
          <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border-2 border-green-500/30 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="p-3 rounded-full bg-green-500/20">
                <FaShieldAlt className="text-green-500 text-2xl" />
              </div>
              <div className="flex-1">
                <p className={`text-base md:text-lg font-semibold text-green-700 dark:text-green-400`}>
                  ✅ Subscription Active
                </p>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>
                  Valid until {new Date(user.subscription.endDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <button 
                onClick={() => navigate('/settings')}
                className={`${theme.colors.button} text-white px-4 py-2 rounded-xl text-sm hover:scale-105 transition-all`}
              >
                Manage Subscription
              </button>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {error && (
          <div className={`${theme.colors.card} rounded-2xl p-4 border-2 border-red-500/30 bg-red-50 dark:bg-red-900/20`}>
            <div className="flex items-start gap-3">
              <FaTimesCircle className="text-red-500 text-xl mt-0.5" />
              <div className="flex-1">
                <p className={`font-semibold text-red-700 dark:text-red-400`}>Error</p>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>{error}</p>
              </div>
              <button
                onClick={() => {}}
                className="text-red-500 hover:text-red-700"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {paymentError && (
          <div className={`${theme.colors.card} rounded-2xl p-4 border-2 border-red-500/30 bg-red-50 dark:bg-red-900/20`}>
            <div className="flex items-start gap-3">
              <FaTimesCircle className="text-red-500 text-xl mt-0.5" />
              <div className="flex-1">
                <p className={`font-semibold text-red-700 dark:text-red-400`}>Payment Error</p>
                <p className={`text-sm ${theme.colors.text} opacity-70`}>{paymentError}</p>
              </div>
              <button
                onClick={() => setPaymentError(null)}
                className="text-red-500 hover:text-red-700"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Billing Toggle */}
        <div className={`${theme.colors.card} rounded-2xl p-4 border ${theme.colors.border}`}>
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? theme.colors.primary : theme.colors.text}`}>
              Monthly
            </span>
            {/* <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${billingCycle === 'yearly' ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-7' : ''}`} />
            </button> */}
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? theme.colors.primary : theme.colors.text}`}>
              Yearly
              <span className={`ml-1 text-xs font-bold text-green-500`}>Save 20%</span>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {plans.map((plan, index) => {
            const isCurrentPlan = user?.subscription?.plan === plan.id;
            const isProcessing = processingPlan === plan.id;
            const isPopular = plan.popular || index === 1;
            const price = billingCycle === 'yearly' ? plan.yearlyPrice || plan.price * 10 : plan.price;

            return (
              <div
                key={plan.id}
                className={`relative ${theme.colors.card} rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                  isCurrentPlan
                    ? `border-primary-500 shadow-xl ${theme.colors.glow}`
                    : isPopular
                    ? `border-${theme.colors.primary} shadow-lg`
                    : `${theme.colors.border} hover:shadow-lg`
                }`}
              >
                {/* Popular Badge */}
                {isPopular && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`bg-gradient-to-r ${getPlanColor(plan.name)} text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg`}>
                      🔥 MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                      ✅ CURRENT PLAN
                    </span>
                  </div>
                )}

                <div className="p-4 md:p-6">
                  {/* Plan Icon & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${getPlanColor(plan.name)} text-white`}>
                      {getPlanIcon(plan.name)}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${theme.colors.text}`}>
                        {plan.name}
                      </h3>
                      <p className={`text-sm ${theme.colors.text} opacity-60`}>
                        {plan.description || 'Perfect for small businesses'}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className={`text-4xl font-bold ${theme.colors.text}`}>
                      ₹{price}
                    </span>
                    <span className={`text-sm ${theme.colors.text} opacity-60 ml-1`}>
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                    {billingCycle === 'yearly' && (
                      <p className={`text-xs text-green-500 mt-1`}>
                        Save ₹{(plan.price * 12 - price).toFixed(0)} yearly
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {plan.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <FaCheck className={`text-green-500 mt-0.5 flex-shrink-0`} size={14} />
                        <span className={`text-sm ${theme.colors.text} opacity-80`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={isProcessing || isCurrentPlan || verifying}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isCurrentPlan
                        ? `bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed`
                        : isProcessing || verifying
                        ? `bg-primary-400 text-white cursor-wait`
                        : `bg-gradient-to-r ${getPlanColor(plan.name)} text-white hover:shadow-lg hover:scale-105`
                    }`}
                  >
                    {isProcessing || verifying ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentPlan ? (
                      <>
                        <FaCheckCircle /> Current Plan
                      </>
                    ) : (
                      <>
                        <FaCreditCard />
                        Subscribe Now
                        <FaArrowRight size={12} />
                      </>
                    )}
                  </button>

                  {/* Plan Features Tag */}
                  {!isCurrentPlan && (
                    <div className={`mt-3 text-center text-xs ${theme.colors.text} opacity-50`}>
                      {plan.features?.length || 0} features included
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className={`${theme.colors.card} rounded-2xl p-4 md:p-6 border ${theme.colors.border}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${theme.colors.background} border ${theme.colors.border}`}>
                <FaShieldAlt className={theme.colors.primary} size={20} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${theme.colors.text}`}>Secure Payment</p>
                <p className={`text-xs ${theme.colors.text} opacity-60`}>256-bit encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${theme.colors.background} border ${theme.colors.border}`}>
                <FaCreditCard className={theme.colors.primary} size={20} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${theme.colors.text}`}>Multiple Gateways</p>
                <p className={`text-xs ${theme.colors.text} opacity-60`}>Razorpay, Stripe & more</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${theme.colors.background} border ${theme.colors.border}`}>
                <FaCheckCircle className={theme.colors.primary} size={20} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${theme.colors.text}`}>Money Back Guarantee</p>
                <p className={`text-xs ${theme.colors.text} opacity-60`}>7-day risk-free</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className={`${theme.colors.card} rounded-2xl p-4 border ${theme.colors.border}`}>
          <p className={`text-center text-sm ${theme.colors.text} opacity-70 flex items-center justify-center gap-2`}>
            <span className="text-xl">🔒</span>
            Secure payment powered by Razorpay. Your payment information is safe and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;