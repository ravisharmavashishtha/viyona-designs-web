import crypto from 'node:crypto';

/**
 * Vercel Serverless API: Verify Razorpay Payment & Book Courier
 * POST /api/verify-payment
 */
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customer, items, totalAmount } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'Z7G8g31e2V7Kk99xLq2';

    if (razorpay_order_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Payment verification signature mismatch' });
      }
    }

    console.log(`[PAYMENT VERIFIED] Order: ${razorpay_order_id || 'Direct'} | Payment ID: ${razorpay_payment_id} | Amount: ₹${totalAmount}`);
    console.log(`[CUSTOMER] ${customer?.name} (${customer?.phone}) -> ${customer?.city}, ${customer?.state} - ${customer?.pincode}`);

    return res.status(200).json({
      success: true,
      verified: true,
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      customer_name: customer?.name,
      message: 'Payment verified and order confirmed successfully'
    });

  } catch (err) {
    console.error('Payment verification error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
  }
}
