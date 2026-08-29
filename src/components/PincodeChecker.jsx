import React, { useState } from 'react';
import { Truck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const calculateDeliveryDate = (daysToAdd) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit Indian pincode.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // 1. First fetch postal city info
      const postRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const postData = await postRes.json();

      let locationName = '';
      if (postData?.[0]?.Status === 'Success' && postData[0]?.PostOffice?.length > 0) {
        const po = postData[0].PostOffice[0];
        locationName = `${po.District || po.Name}, ${po.State}`;
      }

      // 2. Simulated / API delivery estimate
      setTimeout(() => {
        setLoading(false);
        const estDate = calculateDeliveryDate(3);
        setResult({
          serviceable: true,
          location: locationName || `Pincode ${pincode}`,
          estimatedDelivery: estDate,
          courier: 'Ekart / Delhivery Express',
          codAvailable: false,
          prepaidFree: true
        });
      }, 500);

    } catch (err) {
      setLoading(false);
      setResult({
        serviceable: true,
        location: `Pincode ${pincode}`,
        estimatedDelivery: calculateDeliveryDate(4),
        courier: 'Ekart Express',
        prepaidFree: true
      });
    }
  };

  return (
    <div className="p-4 bg-stone-50 rounded-2xl border border-gray-200/80 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wide">
        <Truck className="w-4 h-4 text-amber-700" />
        <span>Check Delivery & Courier ETA</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input 
          type="text"
          maxLength="6"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="Enter 6-digit delivery pincode"
          className="flex-1 px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:outline-none font-mono"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-gray-900 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Check'}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1 animate-fadeIn">
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Delivery available to {result.location}!</span>
          </div>
          <p className="text-gray-700 pl-5.5">
            🚚 Expected Delivery: <strong>{result.estimatedDelivery}</strong> via <em>{result.courier}</em>.
          </p>
          <p className="text-emerald-700 font-semibold pl-5.5">
            ✨ 100% FREE Pan-India Shipping on all prepaid orders.
          </p>
        </div>
      )}
    </div>
  );
}
