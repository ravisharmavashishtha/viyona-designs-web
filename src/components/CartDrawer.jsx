import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ShieldCheck, ArrowRight, Truck, Sparkles } from 'lucide-react';
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

  if (!isCartOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto fill city/state on 6 digit pincode
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
      // 1. Create Razorpay Order via Serverless API
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
        key: orderData.key_id || 'rzp_live_5TfI427B0e7yV7', // Fallback to live key
        amount: (subtotal * 100).toString(),
        currency: 'INR',
        name: 'Viyona Designs',
        description: `Order: ${cart.map(i => `${i.displayName} (x${i.quantity})`).join(', ')}`,
        image: 'https://viyonadesigns.com/logo.png',
        order_id: orderData.id,
        handler: async function (response) {
          // 2. Verify Payment on Backend
          try {
            const verifyRes = await fetch('/api/verify-payment', {
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

            const verifyData = await verifyRes.json();
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
      // Fallback: If serverless API is offline during local test, trigger standard Razorpay modal
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animate-slideInRight">
          
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
              <h2 className="text-lg font-serif font-bold text-gray-900">Your Selection ({totalItems})</h2>
            </div>
            <button 
              onClick={closeCart}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
              <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>🎉 You have unlocked <strong>100% FREE Pan-India Shipping</strong>!</span>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-gray-400">
                <ShoppingBag className="w-16 h-16 text-gray-200" />
                <div>
                  <h3 className="text-base font-semibold text-gray-700">Your cart is empty</h3>
                  <p className="text-sm text-gray-500 mt-1">Discover our collection of modern, sustainable 3D decor.</p>
                </div>
                <button
                  onClick={closeCart}
                  className="mt-4 px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-amber-800 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <>
                {!showAddressForm ? (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 p-3 bg-stone-50 rounded-xl border border-gray-100 items-center">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg bg-white border border-gray-200 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{item.displayName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-gray-900">₹{item.price.toFixed(2)}</span>
                            {item.mrp > item.price && (
                              <span className="text-xs text-gray-400 line-through">₹{item.mrp.toFixed(2)}</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-gray-100 text-gray-600 rounded-l-md transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-xs font-semibold text-gray-800">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-100 text-gray-600 rounded-r-md transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form id="checkout-address-form" onSubmit={handleProceedToPayment} className="space-y-3.5 py-1 animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Shipping Address</h3>
                      <button 
                        type="button" 
                        onClick={() => setShowAddressForm(false)}
                        className="text-xs text-amber-800 hover:underline font-semibold"
                      >
                        Edit Cart Items
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                      <input 
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Ravi Sharma"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile (for Delivery) *</label>
                        <input 
                          type="tel"
                          name="phone"
                          required
                          maxLength="10"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="10-digit number"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email (for Receipt)</label>
                        <input 
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Optional"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address / House No. *</label>
                      <input 
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House / Flat No, Street, Landmark"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode *</label>
                        <input 
                          type="text"
                          name="pincode"
                          required
                          maxLength="6"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="6 Digits"
                          className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                        <input 
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                        <input 
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none"
                        />
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                        {errorMessage}
                      </div>
                    )}
                  </form>
                )}
              </>
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-stone-50 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>M.R.P. Total:</span>
                  <span className="line-through text-gray-400">₹{totalMrp.toFixed(2)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Special Savings:</span>
                    <span>-₹{totalSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Pan-India Shipping:</span>
                  <span className="text-emerald-700 font-bold uppercase">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Final Payable Amount:</span>
                  <span className="text-lg text-amber-900">₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              {!showAddressForm ? (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full py-3.5 bg-gray-900 hover:bg-amber-800 text-white rounded-xl font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="checkout-address-form"
                  disabled={isCheckingOut}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isCheckingOut ? 'Opening Secure Gateway...' : `Pay ₹${subtotal.toFixed(2)} via UPI / Cards`}</span>
                </button>
              )}

              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 pt-1">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-600" /> Razorpay 256-Bit SSL</span>
                <span>•</span>
                <span>⚡ Instant UPI / Cards</span>
                <span>•</span>
                <span>🌱 100% Bio-Plastic</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
