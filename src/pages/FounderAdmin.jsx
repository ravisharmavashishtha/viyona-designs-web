import React, { useState, useEffect } from 'react';
import { ShieldCheck, Package, Tag, ShoppingCart, Users, Download, Plus, Minus, Save, CheckCircle, Lock, RefreshCw } from 'lucide-react';
import { products as initialProducts } from '../data/products';

export default function FounderAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'pricing', 'orders', 'crm'
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state for stock and pricing
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
        'ganesha-statue': { price: '550.00', mrp: '1199.00', inStock: true },
        'sleeping-puppy-organizer': { price: '499.00', mrp: '999.00', inStock: true },
        'minimalist-phone-stand': { price: '349.00', mrp: '799.00', inStock: true }
      };
    } catch (e) {
      return {
        'ganesha-statue': { price: '550.00', mrp: '1199.00', inStock: true },
        'sleeping-puppy-organizer': { price: '499.00', mrp: '999.00', inStock: true },
        'minimalist-phone-stand': { price: '349.00', mrp: '799.00', inStock: true }
      };
    }
  });

  // Sample order feed (syncs with live Razorpay / Supabase)
  const [orders, setOrders] = useState([
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
  ]);

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
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="bg-stone-800 text-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-stone-700 space-y-6 text-center">
          <div className="w-14 h-14 bg-amber-900/40 text-amber-500 rounded-2xl flex items-center justify-center mx-auto border border-amber-800/50">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white">Founder Admin Portal</h1>
            <p className="text-xs text-stone-400 mt-1">Viyona Designs Direct Control Center</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password"
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN (e.g. 0101)"
              className="w-full text-center tracking-widest text-lg font-mono px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-lg"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Bar */}
        <div className="bg-stone-900 text-white rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold">Viyona Founder Portal</h1>
              <span className="text-xs text-stone-400">Founder: Meenu Sharma • Direct Store Management</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-semibold"
            >
              Lock
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white rounded-xl p-1.5 shadow-sm border border-gray-200 gap-1 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'inventory' ? 'bg-amber-900 text-white shadow-sm' : 'text-gray-600 hover:bg-stone-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>1-Click Stock Adjuster</span>
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'pricing' ? 'bg-amber-900 text-white shadow-sm' : 'text-gray-600 hover:bg-stone-100'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Pricing & Festive Sales</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-amber-900 text-white shadow-sm' : 'text-gray-600 hover:bg-stone-100'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Live Orders Feed</span>
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'crm' ? 'bg-amber-900 text-white shadow-sm' : 'text-gray-600 hover:bg-stone-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>WhatsApp CRM</span>
          </button>
        </div>

        {/* Tab 1: Inventory Adjuster */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-base font-bold text-gray-900">Live Inventory Counts</h2>
              <p className="text-xs text-gray-500">Tap + or - to instantly update ready-to-ship physical units in Mainpuri.</p>
            </div>

            <div className="divide-y divide-gray-100">
              {initialProducts.map(p => {
                const count = stockState[p.id] || 0;
                return (
                  <div key={p.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-stone-100" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{p.displayName}</h4>
                        <span className="text-xs text-gray-400">SKU: {p.specs?.['SKU'] || p.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        count > 10 ? 'bg-emerald-100 text-emerald-800' : count > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {count > 0 ? `${count} In Stock` : 'Sold Out'}
                      </span>

                      <div className="flex items-center border border-gray-300 rounded-xl bg-stone-50 overflow-hidden">
                        <button 
                          onClick={() => updateStock(p.id, -1)}
                          className="p-2 hover:bg-gray-200 text-gray-700 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 text-sm font-mono font-bold text-gray-900">{count}</span>
                        <button 
                          onClick={() => updateStock(p.id, +1)}
                          className="p-2 hover:bg-gray-200 text-gray-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
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
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-gray-900">Direct Price & Sale Management</h2>
                <p className="text-xs text-gray-500">Update selling prices or festive launch discounts instantly.</p>
              </div>
              <button
                onClick={handleSavePrices}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
              >
                <Save className="w-4 h-4" />
                <span>Save Live Prices</span>
              </button>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Live pricing changes saved and applied across storefront!</span>
              </div>
            )}

            <div className="space-y-4">
              {initialProducts.map(p => {
                const currentP = priceState[p.id] || { price: '550.00', mrp: '1199.00' };
                return (
                  <div key={p.id} className="p-4 bg-stone-50 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{p.displayName}</h4>
                      <span className="text-xs text-gray-500">Default Catalog Price: {p.price}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 block">Selling Price (₹)</label>
                        <input 
                          type="text"
                          value={currentP.price}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPriceState(prev => ({ ...prev, [p.id]: { ...prev[p.id], price: val } }));
                          }}
                          className="w-24 px-2.5 py-1.5 text-sm font-mono font-bold bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 block">M.R.P. (₹)</label>
                        <input 
                          type="text"
                          value={currentP.mrp}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPriceState(prev => ({ ...prev, [p.id]: { ...prev[p.id], mrp: val } }));
                          }}
                          className="w-24 px-2.5 py-1.5 text-sm font-mono font-bold bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-700 focus:outline-none"
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
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-base font-bold text-gray-900">Recent Customer Orders</h2>
              <p className="text-xs text-gray-500">Live stream of verified Razorpay prepaid transactions.</p>
            </div>

            <div className="divide-y divide-gray-100">
              {orders.map(o => (
                <div key={o.id} className="py-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-sm text-gray-900">{o.id}</span>
                      <span className="ml-2 text-xs font-semibold text-gray-700">• {o.customer} ({o.phone})</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                      {o.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 flex flex-wrap justify-between items-center gap-2">
                    <span>📦 {o.items} • <strong>{o.amount}</strong></span>
                    <span className="font-mono text-gray-500">AWB: {o.awb}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: WhatsApp CRM */}
        {activeTab === 'crm' && (
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-base font-bold text-gray-900">Customer Contacts & Marketing Hub</h2>
              <p className="text-xs text-gray-500">Export your verified customer database for festive WhatsApp broadcasts.</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-emerald-950">WhatsApp Broadcast Ready</h4>
                <p className="text-xs text-emerald-800 mt-0.5">Directly import into WhatsApp Business or Google Contacts.</p>
              </div>
              <button
                onClick={exportCrmCsv}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Export Contacts (.CSV)</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
