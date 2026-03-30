import React from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { usePayment } from './usePayment';

const PaymentButton = ({ 
  bookingId, 
  bookingDetails, 
  onSuccess, 
  onError, 
  className = '',
  children 
}) => {

  const { handlePayment, isProcessing } = usePayment();

  const handleClick = async () => {
    try {

      const result = await handlePayment(bookingId, bookingDetails);

      if (onSuccess) {
        onSuccess(result);
      }

    } catch (error) {

      if (onError && error.message !== 'Payment cancelled by user') {
        onError(error);
      }

    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className={`
        group relative overflow-hidden 
        bg-red-600 hover:bg-red-500 
        disabled:bg-red-800/50 disabled:cursor-not-allowed
        text-white px-8 py-3.5 rounded-xl 
        flex items-center justify-center gap-3 
        font-semibold transition-all duration-300
        shadow-lg shadow-red-600/30 
        hover:shadow-red-500/40 
        hover:-translate-y-0.5
        w-full sm:w-auto
        ${className}
      `}
    >

      {isProcessing ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>{children || 'Pay Now'}</span>
        </>
      )}

      {!isProcessing && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      )}

    </button>
  );
};

export default PaymentButton;