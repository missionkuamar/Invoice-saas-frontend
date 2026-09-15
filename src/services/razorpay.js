// src/services/razorpay.js

import toast from "react-hot-toast";

/**
 * Load Razorpay script dynamically
 * @returns {Promise} Razorpay constructor
 */
export const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    // Check if script already exists and is loaded
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    // Check if script tag already exists but not loaded
    const existingScript = document.getElementById('razorpay-script');
    if (existingScript) {
      // Wait for it to load
      existingScript.addEventListener('load', () => {
        if (window.Razorpay) {
          resolve(window.Razorpay);
        } else {
          reject(new Error('Razorpay SDK failed to load'));
        }
      });
      return;
    }

    // Create and append script
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
      } else {
        reject(new Error('Razorpay SDK failed to load'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load Razorpay SDK. Please check your internet connection.'));
    };

    document.body.appendChild(script);
  });
};

/**
 * Initialize Razorpay payment with better error handling
 * @param {Object} options - Razorpay options
 * @returns {Promise} Payment response
 */
export const initRazorpayPayment = async (options) => {
  try {
    const Razorpay = await loadRazorpay();
    
    return new Promise((resolve, reject) => {
      const rzp = new Razorpay({
        ...options,
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          },
          escape: true,
          backdropclose: false,
        },
        handler: (response) => {
          resolve(response);
        },
        // Add these to handle errors better
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        timeout: 300, // 5 minutes
        // Disable tracking to avoid CORS errors
        prefill: options.prefill || {},
        theme: options.theme || { color: '#0ea5e9' },
        // Add this to handle modal close
        close: () => {
          // User closed the modal
        },
      });

      rzp.open();
    });
  } catch (error) {
  //  console.error('Razorpay initialization error:', error);
  toast.error(error.message || 'Internal server error');
    throw error;
  }
};

/**
 * Create Razorpay order with retry logic
 */
export const createRazorpayOrder = async (api, plan, user) => {
  try {
    const response = await api.post('/subscriptions/create-order', { 
      plan: plan.id,
      amount: plan.price * 100,
    });
    return response.data.data;
  } catch (error) {
   // console.error('Failed to create order:', error);
   toast.error(error.message || 'Internal server error');
    throw error;
  }
};

/**
 * Verify Razorpay payment
 */
export const verifyRazorpayPayment = async (api, paymentData) => {
  try {
    const response = await api.post('/subscriptions/verify', paymentData);
    return response.data.data;
  } catch (error) {
   // console.error('Payment verification failed:', error);
   toast.error(error.message || 'Internal server error');
    throw error;
  }
};