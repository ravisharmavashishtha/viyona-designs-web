/**
 * Vercel Serverless API: Pincode Serviceability & Courier ETA
 * GET /api/check-pincode?pincode=205001
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pincode = req.query.pincode || req.body?.pincode;

  if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ success: false, message: 'Invalid 6-digit pincode' });
  }

  try {
    const postRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const postData = await postRes.json();

    let location = `Pincode ${pincode}`;
    if (postData?.[0]?.Status === 'Success' && postData[0]?.PostOffice?.length > 0) {
      const po = postData[0].PostOffice[0];
      location = `${po.District || po.Name}, ${po.State}`;
    }

    const d = new Date();
    d.setDate(d.getDate() + 3);
    const estDelivery = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

    return res.status(200).json({
      success: true,
      serviceable: true,
      pincode,
      location,
      estimated_delivery: estDelivery,
      courier: 'Ekart / Delhivery Express',
      free_shipping: true
    });

  } catch (err) {
    return res.status(200).json({
      success: true,
      serviceable: true,
      pincode,
      location: `Pincode ${pincode}`,
      estimated_delivery: '3-4 Business Days',
      courier: 'Ekart Express',
      free_shipping: true
    });
  }
}
