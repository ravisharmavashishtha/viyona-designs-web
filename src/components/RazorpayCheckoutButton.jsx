import { useState } from 'react';
import { startRazorpayCheckout } from '../utils/razorpay';
import { trackEvent, trackMetaEvent } from '../utils/analytics';

/**
 * Razorpay Standard Web Checkout Button Component
 * Supports direct payment with Cards, UPI, NetBanking, and Wallets
 */
export default function RazorpayCheckoutButton({
  product,
  customAmount,
  buttonText = '⚡ Buy Now with Razorpay',
  className = 'btn btn-primary',
  style = {}
}) {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' | 'failed' | null
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Determine amount in paise (minimum 100 paise)
  let rawAmount = 550;
  if (customAmount) {
    rawAmount = customAmount;
  } else if (product?.price) {
    rawAmount = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 550;
  }
  const amountInPaise = Math.max(100, Math.round(rawAmount * 100));

  const handleCheckout = async () => {
    setLoading(true);
    setPaymentStatus(null);
    setErrorMessage('');

    // Analytics tracking
    trackEvent('click_razorpay_checkout', {
      product_id: product?.id || 'direct_item',
      product_name: product?.displayName || product?.name || 'Studio Creation',
      amount: rawAmount
    });

    trackMetaEvent('InitiateCheckout', {
      content_name: product?.displayName || product?.name || 'Studio Creation',
      content_ids: [product?.id || 'direct_item'],
      content_type: 'product',
      value: rawAmount,
      currency: 'INR'
    });

    await startRazorpayCheckout({
      amountInPaise,
      productName: product?.displayName || product?.name || 'Viyona Studio Creation',
      description: product?.tagline || 'Direct Studio Order • 100% Secure',
      onSuccess: (result) => {
        setLoading(false);
        setPaymentStatus('success');
        setPaymentDetails(result);

        trackEvent('purchase_success_razorpay', {
          order_id: result.order_id,
          payment_id: result.payment_id,
          value: rawAmount
        });

        trackMetaEvent('Purchase', {
          content_name: product?.displayName || product?.name,
          content_ids: [product?.id],
          value: rawAmount,
          currency: 'INR'
        });
      },
      onError: (err) => {
        setLoading(false);
        setPaymentStatus('failed');
        setErrorMessage(err.message || 'Payment failed or was cancelled.');
      },
      onDismiss: () => {
        setLoading(false);
      }
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={className}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          padding: '0.95rem 1.25rem',
          fontSize: '1rem',
          fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          background: 'linear-gradient(135deg, #0C2340 0%, #1A365D 100%)',
          color: '#FFFFFF',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderRadius: 'var(--radius-md, 8px)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
          transition: 'all 0.2s ease',
          ...style
        }}
      >
        <span>💳</span>
        <span>{loading ? 'Opening Secure Checkout...' : buttonText}</span>
      </button>

      {/* Success Notification */}
      {paymentStatus === 'success' && paymentDetails && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#DCFCE7',
            border: '1px solid #86EFAC',
            borderRadius: 'var(--radius-sm, 6px)',
            color: '#166534',
            fontSize: '0.9rem'
          }}
        >
          <div style={{ fontWeight: '700', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>✅</span> Payment Verified Successfully!
          </div>
          <div>Payment ID: <b>{paymentDetails.payment_id}</b></div>
          <div style={{ fontSize: '0.8rem', marginTop: '0.2rem', color: '#15803D' }}>
            Thank you! Your order is being processed for fast dispatch.
          </div>
        </div>
      )}

      {/* Error / Cancellation Notification */}
      {paymentStatus === 'failed' && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.85rem 1rem',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: 'var(--radius-sm, 6px)',
            color: '#991B1B',
            fontSize: '0.88rem'
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '0.2rem' }}>⚠️ {errorMessage}</div>
          <div style={{ fontSize: '0.78rem' }}>Please try again or choose an alternative payment option.</div>
        </div>
      )}
    </div>
  );
}
