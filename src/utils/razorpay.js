/**
 * Razorpay Standard Web Checkout Client Integration
 * Handles order creation, modal invocation, payment events, and server signature verification.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TTWjZhUsLcGF4P';

/**
 * Ensures Razorpay SDK script is loaded
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Initiates Razorpay Standard Checkout flow
 * 
 * @param {Object} params
 * @param {number} params.amountInPaise - Amount in smallest currency unit (e.g. 59900 for ₹599)
 * @param {string} params.productName - Name of the product
 * @param {string} [params.description] - Description/Tagline
 * @param {Object} [params.customer] - { name, email, contact, address }
 * @param {Function} [params.onSuccess] - Callback on verified payment
 * @param {Function} [params.onError] - Callback on error/payment failure
 * @param {Function} [params.onDismiss] - Callback on modal dismiss/cancel
 */
export async function startRazorpayCheckout({
  amountInPaise,
  productName,
  description = 'Direct Studio Order — Viyona Designs',
  customer = {},
  onSuccess,
  onError,
  onDismiss
}) {
  try {
    // 1. Ensure Razorpay SDK is available
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      const err = new Error('Failed to load Razorpay SDK. Please check your internet connection.');
      if (onError) onError(err);
      return { success: false, error: err.message };
    }

    // 2. Call backend to create Razorpay Order
    const createOrderUrl = `${API_BASE_URL}/api/create-order`;
    const orderRes = await fetch(createOrderUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now().toString().slice(-8)}`,
        notes: {
          product_name: productName,
          customer_name: customer.name || 'Valued Patron',
          customer_phone: customer.contact || ''
        }
      })
    });

    if (!orderRes.ok) {
      const errorData = await orderRes.json().catch(() => ({}));
      const err = new Error(errorData.error || `Failed to create order (Status: ${orderRes.status})`);
      if (onError) onError(err);
      return { success: false, error: err.message };
    }

    const orderData = await orderRes.json();
    const orderId = orderData.order_id;
    const keyId = orderData.key_id || RAZORPAY_KEY_ID;

    // 3. Configure Razorpay Standard Checkout Options
    const options = {
      key: keyId,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: 'Viyona Designs',
      description: `${productName} — ${description}`,
      image: 'https://viyonadesigns.com/logo.png',
      order_id: orderId,
      prefill: {
        name: customer.name || '',
        email: customer.email || '',
        contact: customer.contact || ''
      },
      notes: {
        product: productName,
        address: customer.address || ''
      },
      theme: {
        color: '#D4AF37' // Luxury Studio Gold
      },
      modal: {
        ondismiss: () => {
          console.log('Razorpay modal closed by user');
          if (onDismiss) onDismiss();
        }
      },
      handler: async function (response) {
        // 4. Send payment details to backend for HMAC-SHA256 signature verification
        try {
          const verifyUrl = `${API_BASE_URL}/api/verify-payment`;
          const verifyRes = await fetch(verifyUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyData = await verifyRes.json().catch(() => ({}));

          if (verifyRes.ok && verifyData.success) {
            console.log('Payment verified successfully:', verifyData);
            if (onSuccess) {
              onSuccess({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                verified: true
              });
            }
          } else {
            const err = new Error(verifyData.error || 'Payment signature verification failed');
            console.error('Payment verification failed:', err);
            if (onError) onError(err);
          }
        } catch (verifyErr) {
          console.error('Network error during verification:', verifyErr);
          if (onError) onError(verifyErr);
        }
      }
    };

    const rzp = new window.Razorpay(options);

    // Handle payment failure event
    rzp.on('payment.failed', function (response) {
      console.error('Razorpay Payment Failed:', response.error);
      const failureError = new Error(response.error.description || 'Payment Failed');
      failureError.details = response.error;
      if (onError) onError(failureError);
    });

    // Open Razorpay Standard Checkout Modal
    rzp.open();

    return { success: true, order_id: orderId };

  } catch (err) {
    console.error('Error in startRazorpayCheckout:', err);
    if (onError) onError(err);
    return { success: false, error: err.message };
  }
}
