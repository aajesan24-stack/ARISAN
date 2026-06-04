import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { 
  Phone, Search, MessageSquare, Calendar, Sparkles, Trash2, ShoppingBag 
} from 'lucide-react';

const getWhatsAppNumber = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return '88' + cleaned;
  }
  if (cleaned.startsWith('1') && cleaned.length === 10) {
    return '880' + cleaned;
  }
  if (cleaned.startsWith('880') && cleaned.length === 13) {
    return cleaned;
  }
  return cleaned;
};

export const AdminOrdersDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    deleteOrder
  } = useApp();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Delivered' | 'Cancelled'>('All');
  const [selectedScreenshotForModal, setSelectedScreenshotForModal] = useState<string | null>(null);

  const matchesSearch = (o: Order) => {
    if (!orderSearchQuery) return true;
    const q = orderSearchQuery.toLowerCase();
    return (
      o.customerName?.toLowerCase().includes(q) ||
      o.phone?.includes(orderSearchQuery) ||
      o.id?.toLowerCase().includes(q)
    );
  };

  const filteredOrders = orders.filter(o => {
    const srch = matchesSearch(o);
    if (orderStatusFilter === 'All') return srch;
    return srch && o.status === orderStatusFilter;
  });

  const activeOrder = filteredOrders.find(o => o.id === selectedOrderId) || filteredOrders[0];

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-850 pb-4">
        <div>
          <h3 className="text-base font-black uppercase tracking-wider text-amber-400 font-sans">
            Live Customer Orders Control Panel
          </h3>
          <p className="text-[11.5px] text-stone-400 mt-1">
            গ্রাহকদের অর্ডার ট্র্যাক করুন এবং বাটন ক্লিক করে স্ট্যাটাস ও WhatsApp নোটিফিকেশন বার্তা নিয়ন্ত্রণ করুন।
          </p>
        </div>
        <div className="bg-stone-950 border border-stone-800 font-mono text-[11px] px-3 py-1 text-stone-400 rounded-md">
          সর্বমোট কাস্টমার অর্ডারের সংখ্যা: <span className="text-amber-400 font-bold">{orders.length}</span>
        </div>
      </div>
      
      {/* Search and filters workspace container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-stone-900/40 p-4 border border-stone-850 rounded-lg">
        {/* Search input field */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-500" />
          <input
            type="text"
            value={orderSearchQuery}
            onChange={(e) => {
              setOrderSearchQuery(e.target.value);
              setSelectedOrderId(null); // Reset manual selection to prevent mismatch
            }}
            placeholder="কাস্টমারের নাম, ফোন বা অর্ডার আইডি লিখে খুঁজুন..."
            className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 rounded-lg pl-9 pr-4 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none transition-colors"
          />
        </div>
        
        {/* Responsive status tab triggers */}
        <div className="flex flex-wrap gap-1.5 justify-start md:justify-end font-sans">
          {(['All', 'Pending', 'Approved', 'Delivered', 'Cancelled'] as const).map((status) => {
            const label = status === 'All' ? 'সব অর্ডার' :
                          status === 'Pending' ? 'পেন্ডিং' :
                          status === 'Approved' ? 'এপ্রুভড' :
                          status === 'Delivered' ? 'ডেলিভারি' : 'বাতিল';
            
            return (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setOrderStatusFilter(status);
                  setSelectedOrderId(null);
                }}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  orderStatusFilter === status
                    ? 'bg-amber-400 text-stone-950 font-black shadow-md shadow-amber-500/10'
                    : 'bg-stone-950 border border-stone-850 text-stone-400 hover:text-white hover:bg-stone-900'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT PANEL: Interactive Customer Lists */}
          <div className="lg:col-span-1 bg-stone-950/40 rounded-lg border border-stone-850 p-3.5 space-y-3 max-h-[600px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-850 pb-2.5 mb-1.5 font-sans">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                👤 গ্রাহক তালিকা
              </span>
              <span className="bg-stone-900 text-stone-400 px-2 py-0.5 rounded font-mono text-[10px] border border-stone-800 font-semibold">
                পাওয়া গেছে: {filteredOrders.length} টি
              </span>
            </div>
            
            <div className="space-y-2">
              {filteredOrders.map((o) => {
                const isSelected = activeOrder?.id === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setSelectedOrderId(o.id)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer block ${
                      isSelected
                        ? 'bg-amber-400/5 border-amber-400 shadow-md shadow-amber-500/5'
                        : 'bg-stone-950/60 border-stone-900 hover:bg-stone-900/60 hover:border-stone-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5 font-sans">
                      <span className={`font-extrabold text-xs truncate text-left ${isSelected ? 'text-amber-400' : 'text-stone-200'}`}>
                        {o.customerName || 'No Name'}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-wider shrink-0 ${
                        o.status === 'Pending' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 
                        o.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        o.status === 'Confirmed' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20' : 
                        o.status === 'Shipped' ? 'bg-indigo-500/10 text-indigo-400' : 
                        o.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {o.status === 'Pending' ? 'পেন্ডিং' : o.status === 'Approved' ? 'এপ্রুভড' : o.status === 'Delivered' ? 'ডেলিভারি' : o.status === 'Cancelled' ? 'বাতিল' : o.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] text-stone-500 font-mono mb-1">
                      <span>অর্ডার ID: #{o.id.slice(0, 8).toUpperCase()}</span>
                      <span className="text-emerald-400 font-bold">{o.total.toLocaleString()} ৳</span>
                    </div>
                    
                    <div className="text-[10px] text-stone-400 truncate text-left">
                      📞 {o.phone}
                    </div>
                    <div className="text-[9px] text-stone-500 mt-1 text-left font-sans">
                      📅 {new Date(o.createdAt).toLocaleDateString('bn-BD')} {new Date(o.createdAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL: Complete details cockpit displaying all customer info, items list, and action buttons */}
          <div className="lg:col-span-2">
            {activeOrder ? (
              <div className="bg-stone-950 border border-stone-850 rounded-lg p-5 space-y-5 text-left shadow-lg">
                {/* Header info badge bar */}
                <div className="flex flex-wrap justify-between items-center bg-stone-900/60 p-3 rounded-lg border border-stone-805 border-stone-800 gap-3 font-sans">
                  <div>
                    <div className="text-[9px] uppercase font-bold tracking-wider text-amber-500">Selected Order Details</div>
                    <h4 className="text-xs md:text-sm font-black text-stone-100 mt-0.5">
                      {activeOrder.customerName} এর অর্ডারের সম্পূর্ণ বিবরণী ও কন্ট্রোল
                    </h4>
                  </div>
                  <div className="text-right text-[10px]">
                    <span className="text-stone-400">Order ID:</span>
                    <span className="block font-mono font-bold text-amber-400 bg-stone-950 border border-stone-800 px-2 py-0.5 rounded select-all mt-0.5 uppercase tracking-wide">
                      #{activeOrder.id}
                    </span>
                  </div>
                </div>

                {/* Grid profiling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  {/* Left sub-box of Customer Data */}
                  <div className="space-y-2 bg-stone-900/20 p-3 rounded-lg border border-stone-900">
                    <div className="text-stone-400 uppercase font-black text-[9px] border-b border-stone-900 pb-1.5 mb-1 flex items-center gap-1">
                      <span>👤 কাস্টমারের তথ্য ও ঠিকানা</span>
                    </div>
                    <div className="space-y-1.5 pt-1 text-stone-300">
                      <div className="flex justify-between">
                        <span className="text-stone-500">নাম:</span>
                        <span className="font-extrabold text-stone-100">{activeOrder.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">মোবাইল নম্বর:</span>
                        <span className="font-mono text-amber-400 font-bold select-all">{activeOrder.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">ইমেইল:</span>
                        <span className="text-stone-300 font-mono text-[11px]">{activeOrder.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">জেলা/শহর:</span>
                        <span className="text-stone-200 font-semibold">{activeOrder.district || activeOrder.city}</span>
                      </div>
                      <div className="flex flex-col pt-1.5 border-t border-stone-900 text-[11px]">
                        <span className="text-stone-500 font-semibold mb-0.5">ডেলিভারি এড্রেস:</span>
                        <span className="text-stone-300 italic leading-relaxed">{activeOrder.address}</span>
                      </div>
                      
                      <div className="pt-2">
                        <a
                          href={`tel:${activeOrder.phone}`}
                          className="inline-flex items-center gap-1.5 py-1 px-3 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 font-bold rounded text-[10.5px] cursor-pointer transition-colors"
                        >
                          <Phone className="w-3 h-3 text-emerald-400" />
                          সরাসরি কল দিন
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right sub-box of Payment info & proofs */}
                  <div className="space-y-2 bg-stone-900/20 p-3 rounded-lg border border-stone-900">
                    <div className="text-stone-400 uppercase font-black text-[9px] border-b border-stone-900 pb-1.5 mb-1 flex items-center gap-1">
                      <span>💳 পেমেন্ট ও ডেলিভারি বিবরণ</span>
                    </div>
                    <div className="space-y-1.5 pt-1 text-stone-300">
                      <div className="flex justify-between">
                        <span className="text-stone-500">পেমেন্ট মেথড:</span>
                        <span className="font-bold text-stone-200">{activeOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">ডেলিভারি চার্জ:</span>
                        <span className="font-mono text-stone-200">{activeOrder.deliveryCharge} ৳ ({activeOrder.deliveryOption || 'Standard'})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">বর্তমান স্ট্যাটাস:</span>
                        <span className={`px-2 py-0.5 font-bold uppercase rounded text-[9px] ${
                          activeOrder.status === 'Pending' ? 'bg-amber-400/10 text-amber-400 border border-amber-405/25' : 
                          activeOrder.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          activeOrder.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/25'
                        }`}>
                          ● {activeOrder.status === 'Pending' ? 'পেন্ডিং' : activeOrder.status === 'Approved' ? 'এপ্রুভড' : activeOrder.status === 'Delivered' ? 'ডেলিভারি' : activeOrder.status === 'Cancelled' ? 'বাতিল' : activeOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">অর্ডার করার সময়:</span>
                        <span className="text-stone-400 font-mono text-[10px]">{new Date(activeOrder.createdAt).toLocaleString()}</span>
                      </div>

                      {/* Render TrxID block */}
                      <div className="pt-2 border-t border-stone-900 text-[11px] space-y-1.5">
                        {activeOrder.transactionId && (
                          <div className="flex justify-between items-center">
                            <span className="text-stone-500 font-bold">TrxId / Txn:</span>
                            <span className="select-all font-mono font-bold bg-stone-950 text-emerald-400 px-1.5 py-0.5 rounded border border-stone-900">{activeOrder.transactionId}</span>
                          </div>
                        )}
                        
                        {activeOrder.paymentScreenshot ? (
                          <div className="pt-1">
                            <span className="text-stone-500 block mb-1">পেমেন্ট রিসিভ স্ক্রিনশট:</span>
                            <button
                              type="button"
                              onClick={() => setSelectedScreenshotForModal(activeOrder.paymentScreenshot || null)}
                              className="w-full flex items-center justify-between text-left p-1.5 bg-stone-950 border border-stone-850 hover:bg-stone-900 rounded group transition-colors cursor-pointer"
                            >
                              <img 
                                src={activeOrder.paymentScreenshot} 
                                alt="Payment proof receipt" 
                                className="max-h-12 rounded bg-stone-905 object-contain"
                              />
                              <span className="text-[10px] text-amber-400 group-hover:underline pr-2 font-bold uppercase shrink-0">জুম করুন 🔍</span>
                            </button>
                          </div>
                        ) : (
                          activeOrder.paymentMethod !== 'Cash on Delivery' && (
                            <span className="text-[10px] text-stone-605 text-stone-550 block italic">কোনো স্ক্রিনশট রিসিভ আপলোড নেই</span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ordered products details display */}
                <div className="bg-stone-900/30 p-4 rounded-lg border border-stone-900 text-xs">
                  <div className="text-[10px] text-amber-400 uppercase font-black tracking-wider mb-2.5 border-b border-stone-900 pb-1.5 flex items-center gap-1.5 font-sans">
                    <span>💎 কেনা গহনার তালিকা ও মোট হিসাব (Ordered Items)</span>
                  </div>
                  <div className="space-y-2.5 divide-y divide-stone-900/60 max-h-[140px] overflow-y-auto pr-1">
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-xs pt-2.5 first:pt-0">
                        <div>
                          <span className="font-extrabold text-stone-200 block font-sans">{item.title}</span>
                          {(item.size || item.color) && (
                            <span className="block text-[10px] text-stone-500 mt-0.5 font-sans font-medium">
                              সাইজ: {item.size || 'Standard'} | কালার: {item.color || 'Gold'}
                            </span>
                          )}
                        </div>
                        <div className="text-stone-300 font-mono text-[11px] shrink-0">
                          <span className="font-bold text-amber-400">{item.quantity}</span> টি × {item.price} ৳
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2.5 border-t border-stone-900 text-[11px] space-y-1.5 mt-2.5 font-sans">
                    <div className="flex justify-between text-stone-400">
                      <span>সাবটোটাল (Subtotal):</span>
                      <span className="text-stone-300 font-mono">{activeOrder.subtotal} ৳</span>
                    </div>
                    <div className="flex justify-between text-stone-400">
                      <span>ডেলিভারি চার্জ (+ {activeOrder.deliveryOption}):</span>
                      <span className="text-stone-300 font-mono">+ {activeOrder.deliveryCharge} ৳</span>
                    </div>
                    {activeOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-red-400">
                        <span>কুপন ডিসকাউন্ট (-):</span>
                        <span className="font-mono">- {activeOrder.discountAmount} ৳</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs font-black pt-2 bg-stone-950/20 px-2 py-1 rounded border border-stone-900 mt-1.5 text-stone-100 font-mono">
                      <span className="text-stone-300 font-sans">সর্বমোট প্রদেয় (Total Payable BDT):</span>
                      <span className="text-amber-400 font-black text-sm">{activeOrder.total.toLocaleString()} ৳</span>
                    </div>
                  </div>
                </div>

                {/* THE MANDATORY USER REQUESTED ACTIONS PIPELINE WITH WHATSAPP POPUPS */}
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 space-y-3.5 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="border-b border-stone-850 pb-2.5 flex flex-wrap items-center justify-between gap-2 font-sans">
                    <span className="text-amber-400 text-[11px] uppercase font-black tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                      অর্ডার ম্যানেজমেন্ট গেটওয়ে (Approve/Cancel/Delivery Options)
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">
                      স্ট্যাটাস আপডেট করুন এবং কাস্টমারকে WhatsApp-এ মেসেজ পাঠান
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs w-full">
                    
                    {/* OPTION 1: CONFIRM AND APPROVE */}
                    <button
                      type="button"
                      onClick={() => {
                        updateOrderStatus(activeOrder.id, 'Approved');
                        const itemsListText = activeOrder.items.map((it) => `${it.title} (${it.quantity} টি)`).join(', ');
                        const messageText = `🎉 ARISAN\n\nপ্রিয় ${activeOrder.customerName},\n\nআপনার অর্ডারটি সফলভাবে কনফার্ম করা হয়েছে।\n\n📦 Order ID: #${activeOrder.id.slice(0, 8).toUpperCase()}\n💎 Product: ${itemsListText}\n💰 Total Amount: ${activeOrder.total} BDT\n\nশীঘ্রই আমাদের লজিস্টিক পার্টনার আপনার ঠিকানায় পার্সেলটি পৌঁছে দেবে। সাথে থাকার জন্য ধন্যবাদ। 💚`;
                        const waUrl = `https://wa.me/${getWhatsAppNumber(activeOrder.phone)}?text=${encodeURIComponent(messageText)}`;
                        window.open(waUrl, '_blank');
                      }}
                      className="p-3 bg-emerald-950/55 hover:bg-emerald-900/60 border border-emerald-500/20 hover:border-emerald-400 rounded-xl text-left space-y-1.5 transition-all cursor-pointer active:scale-95 group shadow-sm hover:shadow-emerald-500/10 font-sans"
                    >
                      <div className="font-black text-center text-emerald-400 flex items-center justify-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0"></span>
                        🟢 এপ্রুভ করুন (Confirm)
                      </div>
                      <p className="text-[9.5px] text-stone-400 group-hover:text-stone-300 leading-normal text-center font-medium">
                        অর্ডারটি Approved হবে এবং সাথে সাথে কাস্টমারের WhatsApp-এ কনফার্মেশন মেসেজ যাবে।
                      </p>
                    </button>

                    {/* OPTION 2: COMPLETED DELIVERY */}
                    <button
                      type="button"
                      onClick={() => {
                        updateOrderStatus(activeOrder.id, 'Delivered');
                        const itemsListText = activeOrder.items.map((it) => `${it.title} (${it.quantity} টি)`).join(', ');
                        const messageText = `🎉 ARISAN\n\nপ্রিয় ${activeOrder.customerName || 'গ্রাহক'},\n\nআপনার অর্ডার সফলভাবে ডেলিভারি সম্পন্ন হয়েছে।\n\n📦 Order ID: #${activeOrder.id.slice(0, 8).toUpperCase()}\n💎 Product: ${itemsListText}\n📅 Delivery Date: ${new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}\n\nআমাদের উপর আস্থা রাখার জন্য আন্তরিক ধন্যবাদ। আপনার মতামত ও রিভিউ আমাদের জন্য অত্যন্ত মূল্যবান। ⭐\n\nআবারও ARISAN-এ আপনাকে স্বাগতম। 💚`;
                        const waUrl = `https://wa.me/${getWhatsAppNumber(activeOrder.phone)}?text=${encodeURIComponent(messageText)}`;
                        window.open(waUrl, '_blank');
                      }}
                      className="p-3 bg-amber-400/10 hover:bg-amber-400 hover:text-stone-950 border border-amber-500/25 hover:border-amber-400 rounded-xl text-left space-y-1.5 transition-all cursor-pointer active:scale-95 group shadow-sm hover:shadow-amber-500/15 font-sans"
                    >
                      <div className="font-black text-center text-amber-400 group-hover:text-stone-950 flex items-center justify-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce shrink-0"></span>
                        🟡 ডেলিভারি সম্পন্ন করুন
                      </div>
                      <p className="text-[9.5px] text-stone-400 group-hover:text-stone-900 leading-normal text-center font-medium">
                        স্ট্যাটাস Delivered হবে এবং কাস্টমারকে ধন্যবাদ ও সফল ডেলিভারি মেসেজ পাঠাবে।
                      </p>
                    </button>

                    {/* OPTION 3: CANCEL ORDER */}
                    <button
                      type="button"
                      onClick={() => {
                        updateOrderStatus(activeOrder.id, 'Cancelled');
                        const itemsListText = activeOrder.items.map((it) => `${it.title} (${it.quantity} টি)`).join(', ');
                        const messageText = `⚠️ ARISAN\n\nপ্রিয় ${activeOrder.customerName || 'গ্রাহক'},\n\nঅনিবার্য কারণবশত আপনার অর্ডারটি বাতিল করা হয়েছে।\n\n📦 Order ID: #${activeOrder.id.slice(0, 8).toUpperCase()}\n💎 Product: ${itemsListText}\n\nআপনার কোনো প্রশ্ন বা বিস্তারিত জিজ্ঞাস্য থাকলে সরাসরি আমাদের হেল্পলাইনে কথা বলুন। ধন্যবাদ। 💚`;
                        const waUrl = `https://wa.me/${getWhatsAppNumber(activeOrder.phone)}?text=${encodeURIComponent(messageText)}`;
                        window.open(waUrl, '_blank');
                      }}
                      className="p-3 bg-red-950/40 hover:bg-red-900/50 border border-red-900/30 hover:border-red-500 rounded-xl text-left space-y-1.5 transition-all cursor-pointer active:scale-95 group shadow-sm hover:shadow-red-500/10 font-sans"
                    >
                      <div className="font-black text-center text-red-400 group-hover:text-red-350 flex items-center justify-center gap-1.5">
                        <Trash2 className="w-3.5 h-3.5" />
                        🔴 অর্ডার বাতিল করুন (Cancel)
                      </div>
                      <p className="text-[9.5px] text-stone-400 group-hover:text-stone-300 leading-normal text-center font-medium">
                        স্ট্যাটাস Cancelled হবে এবং কাস্টমারকে দুঃখ প্রকাশ ও বাতিল নোটিশ মেসেজ পাঠানো হবে।
                      </p>
                    </button>

                  </div>

                  {/* Manual permanent removal panel */}
                  <div className="pt-2 border-t border-stone-900 flex justify-end text-[10px] font-sans">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('আপনি কি সত্যিই এই অর্ডারটি ডাটাবেজ থেকে চিরতরে ডিলিট করতে চান? এটি রিভার্ট করা যাবে না।')) {
                          deleteOrder(activeOrder.id);
                        }
                      }}
                      className="inline-flex items-center gap-1 bg-stone-900 hover:bg-red-950 hover:text-red-400 border border-stone-800 hover:border-red-900/50 px-2.5 py-1 rounded transition-all text-stone-500 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      অর্ডার রেকর্ড চিরতরে ডিলিট করুন (Delete Order Forever)
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-24 bg-stone-950 border border-stone-900 rounded-lg text-stone-500 font-sans">
                <MessageSquare className="w-12 h-12 text-stone-700 animate-pulse mb-3" />
                <p className="font-bold text-xs">কোনো অর্ডার সিলেক্ট করা হয়নি</p>
                <p className="text-[11px] mt-1 text-stone-605">বাম পাশের তালিকা থেকে যেকোনো কাস্টমার কার্ডে ক্লিক করলে সম্পুর্ণ বিবরণ লক হয়ে এখানে শো করবে।</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-stone-950/25 border border-stone-900 border-dashed rounded font-sans text-stone-500">
          <ShoppingBag className="w-8 h-8 text-stone-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-stone-300">কোনো কাস্টমার অর্ডার পাওয়া যায়নি</h3>
          <p className="text-xs text-stone-505 mt-0.5">আপনার নির্বাচিত ফিল্টার বা সার্চ কিওয়ার্ড অনুযায়ী অর্ডার জিম্মি নেই।</p>
        </div>
      )}

      {/* LIGHTBOX POPUP SPECIFIC FOR PROOFS */}
      {selectedScreenshotForModal && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 cursor-zoom-out" 
          onClick={() => setSelectedScreenshotForModal(null)}
        >
          <div 
            className="relative max-w-2xl max-h-[90vh] bg-stone-950 p-3 border border-stone-850 rounded-xl flex flex-col" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2.5 text-stone-400 border-b border-stone-900 mb-2.5 font-sans">
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-400">Payment Screenshot Details</span>
              <button 
                type="button"
                className="text-stone-400 hover:text-white font-bold text-xs bg-stone-900 hover:bg-stone-850 border border-stone-800 px-3 py-1 rounded cursor-pointer"
                onClick={() => setSelectedScreenshotForModal(null)}
              >
                ✕ Close
              </button>
            </div>
            <img src={selectedScreenshotForModal} alt="Expanded receipt proof" className="max-w-full max-h-[75vh] object-contain rounded-lg bg-stone-950" />
          </div>
        </div>
      )}
    </div>
  );
};
