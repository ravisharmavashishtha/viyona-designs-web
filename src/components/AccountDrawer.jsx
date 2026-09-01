import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Package, MapPin, User, LogOut, ExternalLink, Plus, Check, ShieldCheck, Truck } from 'lucide-react';

export default function AccountDrawer() {
  const { isAccountDrawerOpen, closeAccountDrawer, user, logout, orders, loadingOrders, saveAddress } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'profile'
  
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    tag: 'Home'
  });

  // Body scroll lock
  useEffect(() => {
    if (isAccountDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAccountDrawerOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAccountDrawerOpen) {
        closeAccountDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAccountDrawerOpen, closeAccountDrawer]);

  if (!isAccountDrawerOpen || !user) return null;

  const handleCreateAddress = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.phone || !newAddr.address || !newAddr.pincode) return;
    saveAddress(newAddr);
    setShowAddAddress(false);
    setNewAddr({ name: '', phone: '', address: '', city: '', state: '', pincode: '', tag: 'Home' });
  };

  const initial = (user.name || user.phone || 'V')[0].toUpperCase();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 13, 20, 0.78)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'flex-end',
        transition: 'opacity 0.25s ease'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAccountDrawer();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
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
            padding: '1.25rem',
            borderBottom: '1px solid #E9E6DC',
            backgroundColor: '#FAF9F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0C2340 0%, #1A365D 100%)',
                color: '#F3E5AB',
                fontSize: '1.15rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid rgba(212, 175, 55, 0.5)'
              }}
            >
              {initial}
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1A1917', margin: 0 }}>
                {user.name || 'Valued Collector'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#585650', margin: '2px 0 0 0' }}>
                +91 {user.phone} • Verified
              </p>
            </div>
          </div>

          <button
            onClick={closeAccountDrawer}
            aria-label="Close"
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

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E9E6DC',
            backgroundColor: '#FAF9F5',
            padding: '0 1rem'
          }}
        >
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              flex: 1,
              padding: '0.75rem 0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '2.5px solid #0C2340' : '2.5px solid transparent',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'orders' ? '700' : '600',
              color: activeTab === 'orders' ? '#0C2340' : '#8C8A82',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Package style={{ width: '16px', height: '16px' }} />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            style={{
              flex: 1,
              padding: '0.75rem 0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'addresses' ? '2.5px solid #0C2340' : '2.5px solid transparent',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'addresses' ? '700' : '600',
              color: activeTab === 'addresses' ? '#0C2340' : '#8C8A82',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <MapPin style={{ width: '16px', height: '16px' }} />
            <span>Addresses ({user.savedAddresses?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            style={{
              flex: 1,
              padding: '0.75rem 0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '2.5px solid #0C2340' : '2.5px solid transparent',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'profile' ? '700' : '600',
              color: activeTab === 'profile' ? '#0C2340' : '#8C8A82',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <User style={{ width: '16px', height: '16px' }} />
            <span>Profile</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '1.25rem' }}>
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div>
              {loadingOrders ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#8C8A82' }}>
                  <p>Loading your orders & courier tracking...</p>
                </div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#8C8A82' }}>
                  <Package style={{ width: '48px', height: '48px', color: '#D9D6CD', margin: '0 auto 1rem' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1A1917', marginBottom: '0.35rem' }}>No orders found yet</h4>
                  <p style={{ fontSize: '0.85rem', color: '#585650', maxWidth: '280px', margin: '0 auto' }}>
                    Orders placed with phone +91 {user.phone} will appear here with live courier tracking.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        background: '#FAF9F5',
                        border: '1px solid #E9E6DC',
                        borderRadius: '14px',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0C2340' }}>{order.id}</span>
                          <span style={{ fontSize: '0.75rem', color: '#8C8A82', marginLeft: '8px' }}>
                            {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: order.status === 'Delivered' ? '#DCFCE7' : '#DBEAFE',
                            color: order.status === 'Delivered' ? '#166534' : '#1E40AF'
                          }}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                            <span style={{ fontWeight: '600', color: '#1A1917' }}>
                              {item.name} × {item.quantity}
                            </span>
                            <span style={{ fontWeight: '700', color: '#0C2340' }}>{item.price}</span>
                          </div>
                        ))}
                      </div>

                      {/* Courier & Live Tracking */}
                      {order.awb && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            background: '#FFFFFF',
                            border: '1px solid #E9E6DC',
                            borderRadius: '8px',
                            fontSize: '0.78rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Truck style={{ width: '14px', height: '14px', color: '#16A34A' }} />
                            <span>AWB: <strong>{order.awb}</strong></span>
                          </div>
                          {order.trackingUrl && (
                            <a
                              href={order.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#0C2340', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}
                            >
                              <span>Track Live</span>
                              <ExternalLink style={{ width: '12px', height: '12px' }} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div>
              {!showAddAddress ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>Saved Delivery Locations</h4>
                    <button
                      onClick={() => setShowAddAddress(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: '#0C2340',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus style={{ width: '14px', height: '14px' }} />
                      <span>Add New</span>
                    </button>
                  </div>

                  {user.savedAddresses?.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#8C8A82' }}>
                      <MapPin style={{ width: '40px', height: '40px', color: '#D9D6CD', margin: '0 auto 0.75rem' }} />
                      <p style={{ fontSize: '0.85rem' }}>No saved addresses yet. Add one to enable 1-click checkout!</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {user.savedAddresses?.map((addr) => (
                        <div
                          key={addr.id}
                          style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            background: '#FAF9F5',
                            border: addr.isDefault ? '1.5px solid #D4AF37' : '1px solid #E9E6DC',
                            position: 'relative'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1A1917' }}>{addr.name}</span>
                              <span style={{ fontSize: '0.72rem', background: '#E2E8F0', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>
                                {addr.tag || 'Home'}
                              </span>
                            </div>
                            {addr.isDefault && (
                              <span style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <Check style={{ width: '12px', height: '12px' }} /> Default
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.82rem', color: '#585650', margin: '0 0 4px 0', lineHeight: 1.4 }}>
                            {addr.address}, {addr.city} - {addr.pincode}
                          </p>
                          <p style={{ fontSize: '0.78rem', color: '#8C8A82', margin: 0 }}>
                            Phone: +91 {addr.phone}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Add New Address Form */
                <form onSubmit={handleCreateAddress} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>Add Delivery Address</h4>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      style={{ background: 'none', border: 'none', color: '#8C8A82', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Recipient Full Name *"
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid #D9D6CD', borderRadius: '8px', fontSize: '0.88rem' }}
                  />

                  <input
                    type="tel"
                    required
                    placeholder="10-digit Phone Number *"
                    maxLength={10}
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value.replace(/\D/g, '') })}
                    style={{ padding: '10px 12px', border: '1px solid #D9D6CD', borderRadius: '8px', fontSize: '0.88rem' }}
                  />

                  <textarea
                    required
                    rows={2}
                    placeholder="House/Building, Street, Landmark *"
                    value={newAddr.address}
                    onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid #D9D6CD', borderRadius: '8px', fontSize: '0.88rem', resize: 'none' }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      required
                      placeholder="6-digit PIN Code *"
                      maxLength={6}
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                      style={{ padding: '10px 12px', border: '1px solid #D9D6CD', borderRadius: '8px', fontSize: '0.88rem' }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="City *"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      style={{ padding: '10px 12px', border: '1px solid #D9D6CD', borderRadius: '8px', fontSize: '0.88rem' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: '8px',
                      padding: '12px',
                      borderRadius: '10px',
                      background: '#0C2340',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Save Address
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: '#FAF9F5', border: '1px solid #E9E6DC', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#8C8A82', textTransform: 'uppercase' }}>Collector ID</label>
                  <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#1A1917' }}>{user.id}</div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#8C8A82', textTransform: 'uppercase' }}>Mobile Phone</label>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0C2340' }}>+91 {user.phone}</div>
                </div>

                {user.email && (
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#8C8A82', textTransform: 'uppercase' }}>Email Address</label>
                    <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#1A1917' }}>{user.email}</div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#16A34A', background: '#EDF4EE', padding: '10px 14px', borderRadius: '10px' }}>
                <ShieldCheck style={{ width: '18px', height: '18px', color: '#16A34A', flexShrink: 0 }} />
                <span>Your account is verified via secure passwordless WhatsApp OTP.</span>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer & Logout Action */}
        <div style={{ padding: '1.1rem 1.25rem', borderTop: '1px solid #E9E6DC', backgroundColor: '#FAF9F5' }}>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '0.85rem',
              backgroundColor: '#FFFFFF',
              color: '#DC2626',
              border: '1px solid #FCA5A5',
              borderRadius: '10px',
              fontSize: '0.92rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(220, 38, 38, 0.08)'
            }}
          >
            <LogOut style={{ width: '16px', height: '16px' }} />
            <span>Sign Out / Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
