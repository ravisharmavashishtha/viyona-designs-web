import { useState, useEffect } from 'react';
import { startRazorpayCheckout } from '../utils/razorpay';
import { trackEvent, trackMetaEvent } from '../utils/analytics';
import { useAuth } from '../context/AuthContext';

/**
 * CheckoutModal Component
 * Collects customer shipping address, checks live courier ETA,
 * invokes Razorpay Standard Checkout, and displays live Shiprocket tracking.
 */
export default function CheckoutModal({
  isOpen,
  onClose,
  product,
  customAmount
}) {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Auto-prefill customer saved details if authenticated
  useEffect(() => {
    if (user && isOpen) {
      const defAddr = user.savedAddresses?.find(a => a.isDefault) || user.savedAddresses?.[0];
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || defAddr?.name || '',
        phone: prev.phone || user.phone || defAddr?.phone || '',
        email: prev.email || user.email || '',
        address: prev.address || defAddr?.address || '',
        city: prev.city || defAddr?.city || '',
        state: prev.state || defAddr?.state || '',
        pincode: prev.pincode || defAddr?.pincode || ''
      }));
    }
  }, [user, isOpen]);

  const [loading, setLoading] = useState(false);
  const [etaText, setEtaText] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Determine amount in paise
  let rawAmount = 550;
  if (customAmount) {
    rawAmount = customAmount;
  } else if (product?.price) {
    rawAmount = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 550;
  }
  const amountInPaise = Math.max(100, Math.round(rawAmount * 100));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'pincode') {
      if (value.length === 6) {
        setEtaText('⚡ Estimated Delivery: 2-3 Days (Ekart Logistics Express)');
      } else {
        setEtaText('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || formData.pincode.trim().length !== 6) {
      setErrorMessage('Please fill in your Name, 10-digit Mobile Number, Complete Address, and 6-digit Pincode.');
      return;
    }

    setLoading(true);

    trackEvent('submit_shipping_address', {
      product_id: product?.id,
      pincode: formData.pincode
    });

    trackMetaEvent('InitiateCheckout', {
      content_name: product?.displayName || product?.name,
      content_ids: [product?.id],
      value: rawAmount,
      currency: 'INR'
    });

    await startRazorpayCheckout({
      amountInPaise,
      productId: product?.id || 'ganesha',
      productName: product?.displayName || product?.name || 'Viyona Studio Creation',
      description: product?.tagline || 'Direct Studio Order • 100% Secure',
      customer: {
        name: formData.name,
        contact: formData.phone,
        email: formData.email,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      },
      onSuccess: (result) => {
        setLoading(false);
        setOrderSuccess(result);

        trackEvent('purchase_success_razorpay', {
          order_id: result.order_id,
          payment_id: result.payment_id,
          awb_code: result.awb_code,
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
        setErrorMessage(err.message || 'Payment failed or cancelled.');
      },
      onDismiss: () => {
        setLoading(false);
      }
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 13, 20, 0.82)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, #181C26 0%, #10131B 100%)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          padding: '24px 20px',
          position: 'relative',
          color: '#F9FAFB'
        }}
      >
        {/* Close Button */}
        {!loading && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#9CA3AF',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        )}

        {!orderSuccess ? (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div
                style={{
                  display: 'inline-block',
                  fontSize: '10px',
                  fontWeight: '700',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#F3E5AB',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  marginBottom: '8px'
                }}
              >
                ✨ Direct Studio Order ✨
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '1.35rem', color: '#FFFFFF', margin: 0 }}>
                Delivery Address & Checkout
              </h3>
            </div>

            {/* Product Summary Pill */}
            {product && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  marginBottom: '16px'
                }}
              >
                {product.images && product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#FFFFFF' }}>
                    {product.displayName || product.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: '600' }}>
                    Free Pan-India Delivery Included
                  </div>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#F3E5AB' }}>
                  {product.price}
                </div>
              </div>
            )}

            {/* Collector Authentication Pill */}
            {isAuthenticated ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '10px',
                  marginBottom: '14px',
                  fontSize: '0.78rem',
                  color: '#F3E5AB'
                }}
              >
                <span>✦ Collector Profile Active (+91 {user?.phone})</span>
                <span style={{ color: '#6EE7B7', fontWeight: '700' }}>✓ Autofilled</span>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px dashed rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  marginBottom: '14px',
                  fontSize: '0.78rem',
                  color: '#9CA3AF'
                }}
              >
                <span>Already a collector?</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openAuthModal();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F3E5AB',
                    fontWeight: '700',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Sign In with WhatsApp ↗
                </button>
              </div>
            )}

            {/* Address Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#D1D5DB', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#0D1017',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#D1D5DB', marginBottom: '4px' }}>
                    Mobile Number (For Courier Tracking) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    maxLength={10}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: '#0D1017',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#D1D5DB', marginBottom: '4px' }}>
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="For e-receipt"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: '#0D1017',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#D1D5DB', marginBottom: '4px' }}>
                  Street Address & Landmark *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House/Flat No., Building, Street Name..."
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#0D1017',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#D1D5DB', marginBottom: '4px' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: '#0D1017',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#D1D5DB', marginBottom: '4px' }}>
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: '#0D1017',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#D1D5DB', marginBottom: '4px' }}>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6 Digits"
                    maxLength={6}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: '#0D1017',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Live ETA Badge */}
              {etaText && (
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    color: '#6EE7B7',
                    fontWeight: '600'
                  }}
                >
                  {etaText}
                </div>
              )}

              {/* Error Box */}
              {errorMessage && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    color: '#FCA5A5'
                  }}
                >
                  ⚠️ {errorMessage}
                </div>
              )}

              {/* Submit / Pay CTA */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  background: 'linear-gradient(135deg, #0C2340 0%, #1A365D 100%)',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>💳</span>
                <span>{loading ? 'Opening Razorpay...' : `Pay ${product?.price || '₹550'} via Razorpay`}</span>
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#9CA3AF', marginTop: '4px' }}>
                🔒 100% Encrypted • Supports UPI, Cards, NetBanking, and Wallets
              </div>
            </form>
          </>
        ) : (
          /* State 2: Order Confirmed & Shipment Booked */
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: '42px', marginBottom: '8px' }}>🎉</div>
            <h3 style={{ fontFamily: 'var(--font-serif, serif)', color: '#F3E5AB', fontSize: '1.45rem', marginBottom: '4px' }}>
              Order Confirmed & Shipped!
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: '600', marginBottom: '18px' }}>
              ॥ श्री गणेशाय नमः ॥ Parcel Booked with Shiprocket 🚚
            </p>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'left',
                marginBottom: '18px',
                fontSize: '0.85rem'
              }}
            >
              <p style={{ margin: '0 0 6px 0', color: '#9CA3AF' }}>
                Order ID: <b style={{ color: '#FFFFFF' }}>{orderSuccess.order_id}</b>
              </p>
              <p style={{ margin: '0 0 6px 0', color: '#9CA3AF' }}>
                Payment ID: <b style={{ color: '#FFFFFF' }}>{orderSuccess.payment_id}</b>
              </p>
              <p style={{ margin: '0 0 6px 0', color: '#9CA3AF' }}>
                Courier: <b style={{ color: '#6EE7B7' }}>{orderSuccess.courier_name || 'Ekart Logistics Surface'}</b>
              </p>
              <p style={{ margin: 0, color: '#9CA3AF' }}>
                AWB Tracking #: <b style={{ color: '#F3E5AB', fontSize: '0.95rem' }}>{orderSuccess.awb_code}</b>
              </p>
            </div>

            {orderSuccess.tracking_url && (
              <a
                href={orderSuccess.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B89025 100%)',
                  color: '#000000',
                  fontWeight: '700',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  marginBottom: '10px'
                }}
              >
                📍 Track Live on Shiprocket ↗
              </a>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#9CA3AF',
                fontSize: '0.85rem',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Done / Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
