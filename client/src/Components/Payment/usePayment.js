import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { api } from '../../Lib/api';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
};

export const usePayment = () => {

  const { getToken } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = useCallback(async (bookingId, bookingDetails) => {

    setIsProcessing(true);

    try {

      await loadRazorpayScript();

      const token = await getToken();

      // Create Order
      const orderResponse = await api.createPaymentOrder(bookingId, token);

      if (!orderResponse.success) {
        throw new Error(orderResponse.error || 'Failed to create order');
      }

      const { order } = orderResponse;

      return new Promise((resolve, reject) => {

        const options = {

          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'Quick Show',
          description: 'Movie Ticket Booking',
          order_id: order.id,

          handler: async (response) => {
            try {

              const verifyRes = await api.verifyPayment({
                ...response,
                bookingId
              }, token);

              if (verifyRes.success) {
                resolve(verifyRes);
              } else {
                reject(new Error(verifyRes.error));
              }

            } catch (error) {
              reject(error);
            }
          },

          prefill: {
            name: bookingDetails?.userName || '',
            email: bookingDetails?.userEmail || '',
          },

          theme: {
            color: '#dc2626'
          },

          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled by user'));
            }
          }

        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

      });

    } catch (error) {

      throw error;

    } finally {

      setIsProcessing(false);

    }

  }, [getToken]);

  return {
    handlePayment,
    isProcessing
  };
};

export default usePayment;