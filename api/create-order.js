/**
 * Vercel Serverless API: Create Razorpay Order
 * POST /api/create-order
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
    const { amount, items, customer } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid order amount' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_5TfI427B0e7yV7';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'Z7G8g31e2V7Kk99xLq2';

    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const receiptId = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // in paise
        currency: 'INR',
        receipt: receiptId,
        notes: {
          customer_name: customer?.name || 'Guest',
          customer_phone: customer?.phone || 'N/A',
          city: customer?.city || 'N/A',
          pincode: customer?.pincode || 'N/A',
          items: items ? JSON.stringify(items.map(i => `${i.name} (x${i.quantity})`)) : 'Standard Order'
        }
      })
    });

    const orderData = await rzpRes.json();

    if (!rzpRes.ok) {
      console.error('Razorpay Error:', orderData);
      return res.status(rzpRes.status).json({ success: false, message: orderData.error?.description || 'Razorpay order creation failed' });
    }

    return res.status(200).json({
      success: true,
      id: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      receipt: orderData.receipt,
      key_id: keyId
    });

  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
  }
}
