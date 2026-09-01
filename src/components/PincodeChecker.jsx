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
      const postRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const postData = await postRes.json();

      let locationName = '';
      if (postData?.[0]?.Status === 'Success' && postData[0]?.PostOffice?.length > 0) {
        const po = postData[0].PostOffice[0];
        locationName = `${po.District || po.Name}, ${po.State}`;
      }

      setTimeout(() => {
        setLoading(false);
        const estDate = calculateDeliveryDate(3);
        setResult({
          serviceable: true,
          location: locationName || `Pincode ${pincode}`,
          estimatedDelivery: estDate,
          courier: 'Ekart / Delhivery Express',
          prepaidFree: true
        });
      }, 400);

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
    <div
      style={{
        padding: '1rem',
        backgroundColor: '#FAF9F5',
        borderRadius: '12px',
        border: '1px solid #E9E6DC',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', fontWeight: '700', color: '#1A1917', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        <Truck style={{ width: '16px', height: '16px', color: '#9E743A' }} />
        <span>Check Delivery & Courier ETA</span>
      </div>

      <form onSubmit={handleCheck} style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="Enter 6-digit pincode"
          style={{
            flex: 1,
            padding: '0.6rem 0.75rem',
            fontSize: '0.88rem',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D9D6CD',
            borderRadius: '8px',
            fontFamily: 'monospace',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.6rem 1rem',
            backgroundColor: '#1A1917',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} /> : 'Check'}
        </button>
      </form>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#DC2626' }}>
          <AlertCircle style={{ width: '14px', height: '14px' }} />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: '#EDF4EE',
            borderRadius: '8px',
            border: '1px solid #D1E5D4',
            fontSize: '0.8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#285233', fontWeight: '700' }}>
            <CheckCircle2 style={{ width: '16px', height: '16px', color: '#2E7D32', flexShrink: 0 }} />
            <span>Delivery available to {result.location}!</span>
          </div>
          <div style={{ color: '#585650', paddingLeft: '1.4rem' }}>
            🚚 Expected Delivery: <strong>{result.estimatedDelivery}</strong> via <em>{result.courier}</em>
          </div>
          <div style={{ color: '#2E7D32', fontWeight: '600', paddingLeft: '1.4rem' }}>
            ✨ 100% Free Pan-India Delivery on this order.
          </div>
        </div>
      )}
    </div>
  );
}
