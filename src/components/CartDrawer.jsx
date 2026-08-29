import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, subtotal, totalMrp, totalSavings, totalItems } = useCart();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    state: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Explicitly manage body scroll lock so background is never permanently frozen
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'pincode' && value.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${value}`)
        .then(res => res.json())
        .then(data => {
          if (data?.[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
            const po = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              city: po.District || po.Block || '',
              state: po.State || ''
            }));
          }
        })
        .catch(() => {});
    }
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pincode.trim()) {
      setErrorMessage('Please fill in your name, 10-digit mobile number, address, and 6-digit pincode.');
      return;
    }

    if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile phone number.');
      return;
    }

    setIsCheckingOut(true);

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: subtotal,
          items: cart.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price, sku: i.sku })),
          customer: formData
        })
      });

      const orderData = await res.json();

      if (!orderData.success && !orderData.id) {
        throw new Error(orderData.message || 'Failed to initialize payment gateway.');
      }

      const options = {
        key: orderData.key_id || 'rzp_live_5TfI427B0e7yV7',
        amount: (subtotal * 100).toString(),
        currency: 'INR',
        name: 'Viyona Designs',
        description: `Order: ${cart.map(i => `${i.displayName} (x${i.quantity})`).join(', ')}`,
        image: 'https://viyonadesigns.com/logo.png',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customer: formData,
                items: cart,
                totalAmount: subtotal
              })
            });
            closeCart();
            navigate(`/order-success?order_id=${response.razorpay_order_id}&payment_id=${response.razorpay_payment_id}`);
          } catch (vErr) {
            closeCart();
            navigate(`/order-success?order_id=${response.razorpay_order_id}&payment_id=${response.razorpay_payment_id}`);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email || 'customer@viyonadesigns.com',
          contact: formData.phone
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          source: 'react-www.viyonadesigns.com'
        },
        theme: {
          color: '#0C2340'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setErrorMessage(`Payment failed: ${resp.error.description || 'Transaction declined'}`);
        setIsCheckingOut(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Checkout error:', err);
      if (window.Razorpay) {
        const fallbackOptions = {
          key: 'rzp_live_5TfI427B0e7yV7',
          amount: (subtotal * 100).toString(),
          currency: 'INR',
          name: 'Viyona Designs',
          description: `Order: ${cart.map(i => i.displayName).join(', ')}`,
          image: 'https://viyonadesigns.com/logo.png',
          prefill: { name: formData.name, contact: formData.phone },
          theme: { color: '#0C2340' },
          handler: function (resp) {
            closeCart();
            navigate(`/order-success?payment_id=${resp.razorpay_payment_id}`);
          }
        };
        const rzp = new window.Razorpay(fallbackOptions);
        rzp.open();
      } else {
        setErrorMessage('Unable to connect to Razorpay. Please check internet connection.');
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 13, 20, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'flex-end',
        transition: 'opacity 0.25s ease'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isCheckingOut) closeCart();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.25)',
          color: '#1A1917',
          fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, sans-serif)'
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.1rem 1.25rem',
            borderBottom: '1px solid #E9E6DC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAF9F5'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag style={{ width: '20px', height: '20px', color: '#9E743A' }} />
            <h2 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif, Georgia, serif)', fontWeight: '700', margin: 0, color: '#1A1917' }}>
              Your Selection ({totalItems})
            </h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{
              background: '#F4F2EB',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#585650'
            }}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Free Shipping Banner */}
        <div
          style={{
            backgroundColor: '#EDF4EE',
            padding: '0.65rem 1.25rem',
            borderBottom: '1px solid #D1E5D4',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: '#285233',
            fontWeight: '600'
          }}
        >
          <Truck style={{ width: '16px', height: '16px', color: '#2E7D32', flexShrink: 0 }} />
          <span>🎉 You have unlocked <strong>100% Free Pan-India Delivery</strong>!</span>
        </div>

        {/* Cart Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '1.25rem' }}>
          {cart.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem 1rem', color: '#8C8A82' }}>
              <ShoppingBag style={{ width: '56px', height: '56px', color: '#D9D6CD', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1A1917', marginBottom: '0.35rem' }}>Your cart is empty</h3>
              <p style={{ fontSize: '0.88rem', color: '#585650', maxWidth: '260px', marginBottom: '1.5rem' }}>
                Discover our collection of sustainable, modern architectural decor.
              </p>
              <button
                onClick={closeCart}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#1A1917',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Explore Creations
              </button>
            </div>
          ) : (
            <>
              {!showAddressForm ? (
                /* Item List View */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '0.85rem',
                        padding: '0.85rem',
                        backgroundColor: '#FAF9F5',
                        borderRadius: '12px',
                        border: '1px solid #E9E6DC',
                        alignItems: 'center'
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '64px',
                          height: '64px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E9E6DC',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#1A1917', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.2rem' }}>
                          {item.displayName || item.name}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1A1917' }}>
                            {item.priceFormatted || `₹${item.price}`}
                          </span>
                          {item.mrp && (
                            <span style={{ fontSize: '0.78rem', color: '#8C8A82', textDecoration: 'line-through' }}>
                              {item.mrpFormatted || `₹${item.mrp}`}
                            </span>
                          )}
                        </div>

                        {/* Quantity Stepper & Trash */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              border: '1px solid #D9D6CD',
                              borderRadius: '6px',
                              backgroundColor: '#FFFFFF',
                              height: '28px'
                            }}
                          >
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              style={{ background: 'none', border: 'none', padding: '0 6px', cursor: 'pointer', color: '#585650' }}
                            >
                              <Minus style={{ width: '12px', height: '12px' }} />
                            </button>
                            <span style={{ padding: '0 6px', fontSize: '0.82rem', fontWeight: '700', color: '#1A1917' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{ background: 'none', border: 'none', padding: '0 6px', cursor: 'pointer', color: '#585650' }}
                            >
                              <Plus style={{ width: '12px', height: '12px' }} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', padding: '4px' }}
                            aria-label="Remove item"
                          >
                            <Trash2 style={{ width: '15px', height: '15px' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Address Form View */
                <form onSubmit={handleProceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1A1917' }}>Shipping Address</h3>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      style={{ background: 'none', border: 'none', fontSize: '0.78rem', color: '#9E743A', fontWeight: '700', cursor: 'pointer' }}
                    >
                      ← Back to Items
                    </button>
                  </div>

                  {errorMessage && (
                    <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', fontSize: '0.78rem', color: '#DC2626' }}>
                      {errorMessage}
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: '#585650', marginBottom: '3px' }}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Ravi Sharma"
                      style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #D9D6CD', borderRadius: '8px', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: '#585650', marginBottom: '3px' }}>Mobile Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #D9D6CD', borderRadius: '8px', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: '#585650', marginBottom: '3px' }}>House / Flat & Street Address *</label>
                    <textarea
                      name="address"
                      required
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Complete house/apartment and street address"
                      style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #D9D6CD', borderRadius: '8px', fontSize: '0.88rem', resize: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: '#585650', marginBottom: '3px' }}>Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        required
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="6-digit pincode"
                        style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #D9D6CD', borderRadius: '8px', fontSize: '0.88rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: '#585650', marginBottom: '3px' }}>City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #D9D6CD', borderRadius: '8px', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div style={{ padding: '1.1rem 1.25rem', borderTop: '1px solid #E9E6DC', backgroundColor: '#FAF9F5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#585650' }}>Total Value:</span>
              <span style={{ fontSize: '0.85rem', color: '#8C8A82', textDecoration: 'line-through' }}>₹{totalMrp.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#16A34A', fontWeight: '600' }}>Festive Savings:</span>
              <span style={{ fontSize: '0.85rem', color: '#16A34A', fontWeight: '700' }}>-₹{totalSavings.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', paddingTop: '0.35rem', borderTop: '1px dashed #D9D6CD' }}>
              <span style={{ fontSize: '1rem', fontWeight: '700', color: '#1A1917' }}>Subtotal (Free Shipping):</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1A1917' }}>₹{subtotal.toFixed(2)}</span>
            </div>

            {!showAddressForm ? (
              <button
                onClick={() => setShowAddressForm(true)}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  backgroundColor: '#0C2340',
                  color: '#FFFFFF',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '12px',
                  fontSize: '0.96rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
                }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            ) : (
              <button
                onClick={handleProceedToPayment}
                disabled={isCheckingOut}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  background: 'linear-gradient(135deg, #0C2340 0%, #1A365D 100%)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '12px',
                  fontSize: '0.96rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: isCheckingOut ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                }}
              >
                <ShieldCheck style={{ width: '18px', height: '18px', color: '#F3E5AB' }} />
                <span>{isCheckingOut ? 'Opening Razorpay...' : `Pay ₹${subtotal.toFixed(2)} via Razorpay`}</span>
              </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.72rem', color: '#8C8A82' }}>
              <ShieldCheck style={{ width: '13px', height: '13px', color: '#16A34A' }} />
              <span>100% Encrypted UPI & Card Payments • Razorpay Verified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
