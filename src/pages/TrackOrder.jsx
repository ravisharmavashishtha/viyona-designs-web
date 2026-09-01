import React, { useState } from 'react';
import { Truck, Search, Package, MapPin, CheckCircle2, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TrackOrder() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
      setOrderInfo({
        orderId: query.startsWith('VD-') ? query : `VD-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'In Transit',
        awb: 'EKART-IN-' + Math.floor(10000000 + Math.random() * 90000000),
        courier: 'Ekart Logistics Express',
        expectedDate: new Date(Date.now() + 2 * 86400000).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' }),
        items: [
          { name: 'Lord Ganesha Idol — Modern Minimalist Statue', qty: 1, color: 'Pure White' }
        ],
        steps: [
          { title: 'Order Confirmed', desc: 'Prepaid Razorpay payment verified', time: 'Aug 29, 2026', done: true },
          { title: 'Packed in 5x5x5 Rigid Box', desc: 'Shockproof bio-cushioning applied', time: 'Aug 29, 2026', done: true },
          { title: 'Handed to Courier', desc: 'Dispatched via Ekart Express hub', time: 'Aug 30, 2026', done: true },
          { title: 'In Transit', desc: 'On way to destination hub', time: 'In Progress', active: true },
          { title: 'Out for Delivery', desc: 'Courier partner will contact you', time: 'Pending', done: false }
        ]
      });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="px-3.5 py-1 bg-amber-100/80 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">
            Self-Service Logistics
          </span>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Track Your Delivery
          </h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Enter your Viyona Order ID (e.g. <code>VD-102938</code>) or 10-digit mobile phone number.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleTrack} className="flex gap-2 p-2 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Order ID or Mobile Number..."
              className="w-full pl-11 pr-4 py-3 text-sm bg-transparent border-none focus:outline-none text-gray-900"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gray-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors shadow flex items-center gap-2"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {/* Tracking Milestone Card */}
        {searched && orderInfo && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-6 animate-fadeIn">
            
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide block">Order Status</span>
                <span className="text-lg font-bold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  {orderInfo.status}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 uppercase tracking-wide block">Expected Arrival</span>
                <span className="text-sm font-bold text-gray-900">{orderInfo.expectedDate}</span>
              </div>
            </div>

            {/* Courier & AWB */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-gray-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-amber-800" />
                <div>
                  <span className="font-semibold text-gray-900">{orderInfo.courier}</span>
                  <span className="text-gray-500 block font-mono">AWB: {orderInfo.awb}</span>
                </div>
              </div>
              <a
                href={`https://shiprocket.co/tracking/${orderInfo.awb}`}
                target="_blank"
                rel="noreferrer"
                className="text-amber-800 hover:underline font-bold flex items-center gap-1 text-[11px]"
              >
                <span>Live GPS</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Step-by-Step Milestones */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Tracking Timeline</h3>
              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {orderInfo.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 relative items-start">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      step.done 
                        ? 'bg-emerald-500 text-white' 
                        : step.active 
                        ? 'bg-amber-600 text-white ring-4 ring-amber-100 animate-pulse' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3 h-3" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className={`text-xs font-bold ${step.active ? 'text-amber-900' : 'text-gray-900'}`}>{step.title}</h4>
                        <span className="text-[11px] text-gray-400">{step.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
