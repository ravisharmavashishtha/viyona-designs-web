import React, { useState } from 'react';
import { ShieldCheck, Package, Tag, ShoppingCart, Users, Download, Plus, Minus, Save, CheckCircle, Lock } from 'lucide-react';
import { products as initialProducts } from '../data/products';

export default function FounderAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [stockState, setStockState] = useState(() => {
    try {
      const saved = localStorage.getItem('viyona_admin_stock');
      return saved ? JSON.parse(saved) : {
        'ganesha-statue': 50,
        'sleeping-puppy-organizer': 50,
        'minimalist-phone-stand': 50
      };
    } catch (e) {
      return { 'ganesha-statue': 50, 'sleeping-puppy-organizer': 50, 'minimalist-phone-stand': 50 };
    }
  });

  const [priceState, setPriceState] = useState(() => {
    try {
      const saved = localStorage.getItem('viyona_admin_pricing');
      return saved ? JSON.parse(saved) : {
        'ganesha-statue': { price: '550.00', mrp: '1199.00' },
        'sleeping-puppy-organizer': { price: '499.00', mrp: '999.00' },
        'minimalist-phone-stand': { price: '349.00', mrp: '799.00' }
      };
    } catch (e) {
      return {
        'ganesha-statue': { price: '550.00', mrp: '1199.00' },
        'sleeping-puppy-organizer': { price: '499.00', mrp: '999.00' },
        'minimalist-phone-stand': { price: '349.00', mrp: '799.00' }
      };
    }
  });

  const orders = [
    {
      id: 'VD-894102',
      customer: 'Ravi S Vashishtha',
      phone: '+91 89093 36879',
      city: 'Mainpuri, UP',
      items: 'Lord Ganesha Idol (x1)',
      amount: '₹550.00',
      status: 'Paid (Razorpay)',
      awb: 'EKART-IN-8891204',
      date: 'Today, 2:30 PM'
    },
    {
      id: 'VD-894101',
      customer: 'Pooja Sharma',
      phone: '+91 98765 43210',
      city: 'Noida, UP',
      items: 'Sleeping Puppy Tray (x1), Phone Stand (x1)',
      amount: '₹848.00',
      status: 'Paid (Razorpay)',
      awb: 'DELHIVERY-771920',
      date: 'Aug 28, 2026'
    }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === '0101' || pin === 'admin' || pin === 'viyona') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Founder PIN. Please try again.');
    }
  };

  const updateStock = (prodId, delta) => {
    setStockState(prev => {
      const current = prev[prodId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev, [prodId]: next };
      localStorage.setItem('viyona_admin_stock', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSavePrices = () => {
    localStorage.setItem('viyona_admin_pricing', JSON.stringify(priceState));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const exportCrmCsv = () => {
    const csvRows = [
      ['Order ID', 'Customer Name', 'Phone Number', 'City', 'Total Spent', 'Status'],
      ...orders.map(o => [o.id, o.customer, o.phone, o.city, o.amount, o.status])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `viyona_customers_crm_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#FAF9F5' }}>
        <div style={{ backgroundColor: '#1A1917', color: '#FAF9F5', borderRadius: '24px', padding: '2rem', maxWidth: '380px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(212,175,55,0.15)', color: '#D4AF37', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '1px solid rgba(212,175,55,0.3)' }}>
            <Lock style={{ width: '28px', height: '28px' }} />
          </div>
          <h1 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif, Georgia, serif)', fontWeight: '700', marginBottom: '0.35rem' }}>Founder Admin Portal</h1>
          <p style={{ fontSize: '0.82rem', color: '#A8A69E', marginBottom: '1.5rem' }}>Viyona Designs Direct Control Center</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <input 
              type="password"
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN (e.g. 0101)"
              style={{ width: '100%', textAlign: 'center', letterSpacing: '0.2em', fontSize: '1.2rem', fontFamily: 'monospace', padding: '0.75rem', backgroundColor: '#2B2926', border: '1px solid #444', borderRadius: '12px', color: '#FFFFFF', outline: 'none' }}
            />
            <button
              type="submit"
              style={{ width: '100%', padding: '0.85rem', backgroundColor: '#9E743A', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '90vh', backgroundColor: '#FAF9F5', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Top Bar */}
        <div style={{ backgroundColor: '#1A1917', color: '#FAF9F5', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(212,175,55,0.2)', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(212,175,55,0.4)' }}>
              <ShieldCheck style={{ width: '24px', height: '24px' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>Viyona Founder Portal</h1>
              <span style={{ fontSize: '0.78rem', color: '#A8A69E' }}>Direct Studio Management • Mainpuri, UP</span>
            </div>
          </div>

          <button 
            onClick={() => setIsAuthenticated(false)}
            style={{ padding: '0.45rem 1rem', backgroundColor: '#2B2926', color: '#FAF9F5', border: '1px solid #444', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
          >
            Lock Dashboard
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '0.35rem', border: '1px solid #E9E6DC', gap: '0.35rem', overflowX: 'auto' }}>
          {[
            { id: 'inventory', label: '1-Click Stock', icon: Package },
            { id: 'pricing', label: 'Pricing & Sales', icon: Tag },
            { id: 'orders', label: 'Live Orders Feed', icon: ShoppingCart },
            { id: 'crm', label: 'WhatsApp CRM', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: active ? '#1A1917' : 'transparent',
                  color: active ? '#FFFFFF' : '#585650',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon style={{ width: '16px', height: '16px' }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Inventory Adjuster */}
        {activeTab === 'inventory' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E9E6DC', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1A1917', margin: 0 }}>Live Inventory Counts</h2>
              <p style={{ fontSize: '0.82rem', color: '#585650', margin: '0.2rem 0 0' }}>Tap + or - to instantly adjust ready-to-ship physical units in Mainpuri.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {initialProducts.map(p => {
                const count = stockState[p.id] || 0;
                return (
                  <div key={p.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#FAF9F5', borderRadius: '12px', border: '1px solid #E9E6DC', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img src={p.images[0]} alt={p.name} style={{ width: '52px', height: '52px', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#FFFFFF', border: '1px solid #E9E6DC' }} />
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1A1917', margin: 0 }}>{p.displayName}</h4>
                        <span style={{ fontSize: '0.78rem', color: '#8C8A82' }}>SKU: {p.specs?.['SKU'] || p.id}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', padding: '0.25rem 0.65rem', borderRadius: '9999px', backgroundColor: count > 0 ? '#EDF4EE' : '#FEF2F2', color: count > 0 ? '#2E7D32' : '#DC2626' }}>
                        {count > 0 ? `${count} In Stock` : 'Sold Out'}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D9D6CD', borderRadius: '8px', backgroundColor: '#FFFFFF', height: '34px' }}>
                        <button 
                          onClick={() => updateStock(p.id, -1)}
                          style={{ padding: '0 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#585650' }}
                        >
                          <Minus style={{ width: '14px', height: '14px' }} />
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '0.92rem', fontFamily: 'monospace', fontWeight: '700', color: '#1A1917' }}>{count}</span>
                        <button 
                          onClick={() => updateStock(p.id, +1)}
                          style={{ padding: '0 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#585650' }}
                        >
                          <Plus style={{ width: '14px', height: '14px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Pricing & Discounts */}
        {activeTab === 'pricing' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E9E6DC', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1A1917', margin: 0 }}>Direct Price & Sale Management</h2>
                <p style={{ fontSize: '0.82rem', color: '#585650', margin: '0.2rem 0 0' }}>Update selling prices or festive launch discounts instantly.</p>
              </div>
              <button
                onClick={handleSavePrices}
                style={{ padding: '0.55rem 1.15rem', backgroundColor: '#2E7D32', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Save style={{ width: '16px', height: '16px' }} />
                <span>Save Live Prices</span>
              </button>
            </div>

            {saveSuccess && (
              <div style={{ padding: '0.75rem', backgroundColor: '#EDF4EE', border: '1px solid #D1E5D4', borderRadius: '8px', fontSize: '0.82rem', color: '#285233', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle style={{ width: '16px', height: '16px', color: '#2E7D32' }} />
                <span>Live pricing changes saved and applied across storefront!</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {initialProducts.map(p => {
                const currentP = priceState[p.id] || { price: '550.00', mrp: '1199.00' };
                return (
                  <div key={p.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#FAF9F5', borderRadius: '12px', border: '1px solid #E9E6DC', gap: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1A1917', margin: 0 }}>{p.displayName}</h4>
                      <span style={{ fontSize: '0.78rem', color: '#8C8A82' }}>Default: {p.price}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', color: '#585650', marginBottom: '2px' }}>Selling Price (₹)</label>
                        <input 
                          type="text"
                          value={currentP.price}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPriceState(prev => ({ ...prev, [p.id]: { ...prev[p.id], price: val } }));
                          }}
                          style={{ width: '100px', padding: '0.45rem 0.65rem', fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: '700', backgroundColor: '#FFFFFF', border: '1px solid #D9D6CD', borderRadius: '6px', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', color: '#585650', marginBottom: '2px' }}>M.R.P. (₹)</label>
                        <input 
                          type="text"
                          value={currentP.mrp}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPriceState(prev => ({ ...prev, [p.id]: { ...prev[p.id], mrp: val } }));
                          }}
                          style={{ width: '100px', padding: '0.45rem 0.65rem', fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: '700', backgroundColor: '#FFFFFF', border: '1px solid #D9D6CD', borderRadius: '6px', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Orders Feed */}
        {activeTab === 'orders' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E9E6DC', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1A1917', margin: 0 }}>Recent Customer Orders</h2>
              <p style={{ fontSize: '0.82rem', color: '#585650', margin: '0.2rem 0 0' }}>Live stream of verified Razorpay prepaid transactions.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {orders.map(o => (
                <div key={o.id} style={{ padding: '1rem', backgroundColor: '#FAF9F5', borderRadius: '12px', border: '1px solid #E9E6DC', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '0.92rem', color: '#1A1917' }}>{o.id}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#585650', marginLeft: '0.5rem' }}>• {o.customer} ({o.phone})</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.6rem', backgroundColor: '#EDF4EE', color: '#2E7D32', borderRadius: '9999px' }}>
                      {o.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#585650', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span>📦 {o.items} • <strong>{o.amount}</strong></span>
                    <span style={{ fontFamily: 'monospace', color: '#8C8A82' }}>AWB: {o.awb}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: WhatsApp CRM */}
        {activeTab === 'crm' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E9E6DC', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1A1917', margin: 0 }}>Customer Contacts & Marketing Hub</h2>
              <p style={{ fontSize: '0.82rem', color: '#585650', margin: '0.2rem 0 0' }}>Export your verified customer database for festive WhatsApp broadcasts.</p>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: '#EDF4EE', borderRadius: '12px', border: '1px solid #D1E5D4', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#285233', margin: 0 }}>WhatsApp Broadcast Ready</h4>
                <p style={{ fontSize: '0.82rem', color: '#2E7D32', margin: '0.2rem 0 0' }}>Directly import into WhatsApp Business or Google Contacts.</p>
              </div>
              <button
                onClick={exportCrmCsv}
                style={{ padding: '0.65rem 1.25rem', backgroundColor: '#2E7D32', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Download style={{ width: '16px', height: '16px' }} />
                <span>Export Contacts (.CSV)</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
