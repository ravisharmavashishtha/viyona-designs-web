import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Printer, Truck, ArrowLeft, PackageCheck, ShieldCheck, Mail, MapPin } from 'lucide-react';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') || `VD-${Math.floor(100000 + Math.random() * 900000)}`;
  const paymentId = searchParams.get('payment_id') || 'pay_confirmed';

  const [orderDate] = useState(() => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center space-y-4 print:shadow-none print:border-none print:p-0">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div>
            <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200">
              Payment Confirmed & Verified
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-3">
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-gray-600 mt-1 max-w-md mx-auto">
              Your 100% plant-based eco-decor order is confirmed and currently being prepared for dispatch in our studio.
            </p>
          </div>

          {/* Key Reference Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-gray-200/80 text-left text-xs">
            <div>
              <span className="text-gray-500 block">Order ID</span>
              <span className="font-mono font-bold text-gray-900">{orderId}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Razorpay Payment ID</span>
              <span className="font-mono font-bold text-emerald-700 truncate block">{paymentId}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-gray-500 block">Order Date</span>
              <span className="font-semibold text-gray-900">{orderDate}</span>
            </div>
          </div>

          {/* Packaging & Shipping Promise */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-left space-y-2 text-xs text-amber-950">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <PackageCheck className="w-4 h-4 text-amber-800" />
              <span>Packaging & Courier Guarantee</span>
            </div>
            <p>
              Your order is being carefully packed in our signature <strong>5×5×5 inch rigid gift box</strong> with shockproof eco-cushioning. You will receive an SMS and WhatsApp tracking link as soon as your Ekart/Delhivery AWB is generated.
            </p>
          </div>

          {/* Action Buttons (Hidden on Print) */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 print:hidden">
            <button
              onClick={handlePrintInvoice}
              className="flex-1 py-3 bg-stone-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice / Packing Slip</span>
            </button>
            <Link
              to="/track"
              className="py-3 px-6 bg-white hover:bg-stone-50 text-gray-800 rounded-xl text-xs font-bold transition-colors border border-gray-300 flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4 text-amber-800" />
              <span>Track Delivery</span>
            </Link>
          </div>

          {/* Studio Contact Footer */}
          <div className="pt-4 text-center text-xs text-gray-500 space-y-1">
            <p className="flex items-center justify-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Questions? Contact us at <strong>viyonadesigns@gmail.com</strong></span>
            </p>
            <p className="flex items-center justify-center gap-1.5 text-gray-400 text-[11px]">
              <MapPin className="w-3 h-3" />
              <span>Viyona Designs • Mainpuri, Uttar Pradesh, India</span>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center print:hidden">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Viyona Designs Homepage</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
