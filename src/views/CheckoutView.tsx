import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BANGLADESH_DISTRICTS } from '../types';
import { ShieldCheck, Truck, Sparkles, CheckCircle2, Compass, Upload, ArrowLeft, CreditCard, AlertTriangle, Check, ChevronRight } from 'lucide-react';
import { getTranslatedProduct } from '../utils/translations';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    getCartTotal,
    getCartItemCount,
    appliedCoupon,
    placeOrder,
    currentUser,
    setActiveTab,
    trackOrder,
    settings,
    language
  } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [deliveryOption, setDeliveryOption] = useState<'Inside Dhaka' | 'Outside Dhaka'>('Inside Dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash' | 'Nagad'>('Cash on Delivery');
  
  // Payment verification details
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [screenshotName, setScreenshotName] = useState<string>('');

  // Completed receipt storage
  const [placedReceipt, setPlacedReceipt] = useState<any | null>(null);

  // Sync profile details if logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      if (currentUser.district) {
        setDistrict(currentUser.district);
      }
    }
  }, [currentUser]);

  // Adjust delivery option automatically when district changes (optional helper)
  useEffect(() => {
    if (district.toLowerCase() === 'dhaka') {
      setDeliveryOption('Inside Dhaka');
    } else {
      setDeliveryOption('Outside Dhaka');
    }
  }, [district]);

  const subtotal = getCartTotal();
  const freeThreshold = settings?.freeDeliveryThreshold ?? 3000;
  const chargeInside = settings?.deliveryChargeInsideDhaka ?? 80;
  const chargeOutside = settings?.deliveryChargeOutsideDhaka ?? 150;

  const currentDeliveryFee = subtotal >= freeThreshold
    ? 0
    : (deliveryOption === 'Inside Dhaka' ? chargeInside : chargeOutside);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'Percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const grandTotal = subtotal - discountAmount + currentDeliveryFee;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setStep(2);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalOrderPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Call placeOrder from context with all variables
    const receipt = placeOrder({
      customerName: name,
      email: email || 'guest@example.com',
      phone,
      address,
      city,
      district,
      paymentMethod,
      deliveryOption,
      paymentScreenshot: screenshot || undefined,
      transactionId: transactionId || undefined
    });

    if (receipt) {
      setPlacedReceipt(receipt);
    }
  };

  const handleTrackDirect = (orderId: string) => {
    trackOrder(orderId);
    setActiveTab('orders-tracking');
  };

  // SUCCESS BRAND CONFIRMATION PAGE
  if (placedReceipt) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-2xl space-y-8 animate-fadeIn">
        <div className="bg-emerald-950/20 border border-emerald-500/20 p-8 rounded-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
          
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
          
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-amber-400 font-semibold">
              {language === 'bn' ? 'আলহামদুলিল্লাহ্‌, অর্ডারটি সফল হয়েছে' : 'Alhamdulillah, Order Received'}
            </span>
            <h1 className="text-2xl md:text-3xl font-sans font-extrabold text-stone-100">
              {language === 'bn' ? 'অর্ডার সম্পন্ন হয়েছে - যাচাইকরণ প্রক্রিয়াধীন!' : 'Order Placed - Pending Verification!'}
            </h1>
            <p className="text-xs text-stone-300 max-w-md mx-auto font-sans">
              {language === 'bn' 
                ? 'আপনার জুয়েলারি অর্ডারটি সফলভাবে সাবমিট হয়েছে। এডমিন প্যানেলে এটি Pending অবস্থায় আছে। পেমেন্ট যাচাইকরণের পর স্ট্যাটাস অনুমোদিত (Approved) হবে।'
                : 'Your premium jewellery order has been safely placed. It is currently in Pending verification status. Once approved, we will ship immediately.'}
            </p>
          </div>

          {/* Secure Receipt summary */}
          <div className="bg-stone-950 border border-stone-800 rounded-lg p-5 text-left divide-y divide-stone-900 space-y-4 text-xs font-sans">
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-stone-400">{language === 'bn' ? 'অর্ডার আইডি:' : 'Order ID:'}</span>
              <span className="font-mono font-bold text-amber-400 select-all">{placedReceipt.id}</span>
            </div>
            <div className="flex justify-between items-baseline pt-4">
              <span className="text-stone-400">{language === 'bn' ? 'গ্রাহকের নাম:' : 'Recipient Name:'}</span>
              <span className="text-stone-200">{placedReceipt.customerName}</span>
            </div>
            <div className="flex justify-between items-baseline pt-4">
              <span className="text-stone-400">{language === 'bn' ? 'মোবাইল নম্বর:' : 'Phone Number:'}</span>
              <span className="font-mono text-stone-200">{placedReceipt.phone}</span>
            </div>
            <div className="flex justify-between items-baseline pt-4">
              <span className="text-stone-400">{language === 'bn' ? 'ডেলিভারি ঠিকানা:' : 'Delivery Address:'}</span>
              <span className="text-stone-300 text-right max-w-xs justify-end flex flex-wrap">{placedReceipt.address}, {placedReceipt.city}, {placedReceipt.district}</span>
            </div>
            <div className="flex justify-between items-baseline pt-4">
              <span className="text-stone-400 font-bold">{language === 'bn' ? 'সর্বমোট বিল:' : 'Total Bill (bdt):'}</span>
              <span className="font-mono text-emerald-400 font-bold text-base">৳{placedReceipt.total.toLocaleString()} BDT</span>
            </div>
            <div className="flex justify-between items-baseline pt-4">
              <span className="text-stone-400">{language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery Fee Option:'}</span>
              <span className="text-stone-300 font-semibold">
                {language === 'bn' && placedReceipt.deliveryOption === 'Inside Dhaka' ? 'ঢাকার ভেতরে' : 
                 language === 'bn' && placedReceipt.deliveryOption === 'Outside Dhaka' ? 'ঢাকার বাইরে' : placedReceipt.deliveryOption} {placedReceipt.deliveryCharge > 0 ? `(৳${placedReceipt.deliveryCharge})` : `(${language === 'bn' ? 'ফ্রি' : 'Free'})`}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-4">
              <span className="text-stone-400">{language === 'bn' ? 'পেমেন্ট পদ্ধতি:' : 'Payment Option:'}</span>
              <span className="bg-stone-900 px-2.5 py-1 rounded text-[10px] text-amber-305 text-amber-300 border border-stone-850 font-bold uppercase">
                {language === 'bn' && placedReceipt.paymentMethod === 'Cash on Delivery' ? 'ক্যাশ অন ডেলিভারি' : placedReceipt.paymentMethod}
              </span>
            </div>
            {placedReceipt.transactionId && (
              <div className="flex justify-between items-baseline pt-4">
                <span className="text-stone-400">{language === 'bn' ? 'ট্রানজেকশন আইডি (TrxID):' : 'Transaction ID (TrxID):'}</span>
                <span className="font-mono select-all text-stone-300">{placedReceipt.transactionId}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-4">
              <span className="text-stone-400">{language === 'bn' ? 'কুরিয়ার ট্র্যাকিং নম্বর:' : 'Courier Tracking Ref:'}</span>
              <span className="font-mono text-stone-500 select-all">{placedReceipt.trackingNumber}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleTrackDirect(placedReceipt.id)}
              className="flex-1 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold uppercase text-xs tracking-wider py-3.5 rounded cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4.5 h-4.5" />
              <span>{language === 'bn' ? 'অর্ডার ট্র্যাক করুন (লাইভ স্ট্যাটাস)' : 'Track Live Status'}</span>
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className="flex-1 bg-stone-900 border border-stone-850 hover:border-amber-400/40 text-stone-250 py-3.5 rounded font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'শপিং করতে থাকুন' : 'Back to Shop'}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // EMPTY CHECKOUT REDIRECT
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md space-y-4">
        <h2 className="text-xl font-bold text-stone-300 animate-pulse">
          {language === 'bn' ? 'আপনার ব্যাগটি খালি রয়েছে' : 'Your Bag is Empty'}
        </h2>
        <p className="text-xs text-stone-400">
          {language === 'bn' 
            ? 'অর্ডার শুরু করার জন্য অনুগ্রহ করে আপনার পছন্দের জুয়েলারি কার্টে যোগ করুন।'
            : 'Please add your desired jewellery masterpieces to the cart first to proceed with checking out.'}
        </p>
        <button onClick={() => setActiveTab('shop')} className="bg-amber-400 text-stone-950 font-bold text-xs px-6 py-2.5 rounded cursor-pointer uppercase tracking-wider">
          {language === 'bn' ? 'ক্যাটালগ ব্রাউজ করুন' : 'Browse Collections'}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="text-left space-y-2 border-b border-stone-900 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-stone-100 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
            {language === 'bn' ? 'নিরাপদ জুয়েলারি অর্ডার পোর্টাল' : 'Secure Brand Order Portal'}
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            {language === 'bn' 
              ? 'শিপমেন্ট নিশ্চিত করতে আপনার প্রয়োজনীয় ডেলিভারি তথ্য এবং পেমেন্ট প্যারামিটার সরবরাহ করুন।'
              : 'Provide your delivery variables and secure checkout parameters to confirm shipment.'}
          </p>
        </div>
        
        {/* Step indicator */}
        <div className="flex items-center gap-3 bg-stone-950 border border-stone-900 rounded-full px-4 py-1.5 text-xs text-stone-400 font-mono">
          <span className={`${step === 1 ? 'text-amber-400 font-bold' : 'text-stone-500'}`}>
            {language === 'bn' ? '১. ঠিকানা ফর্ম' : '1. Details Form'}
          </span>
          <span className="text-stone-700">/</span>
          <span className={`${step === 2 ? 'text-amber-400 font-bold' : 'text-stone-500'}`}>
            {language === 'bn' ? '২. পেমেন্ট ভেরিফাই' : '2. Pay Verify'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left items-start">
        
        {/* LEADING CONTENT - STEPS */}
        <div className="lg:col-span-2">
          
          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-6">
              
              {/* BILLING FORM */}
              <div className="bg-stone-950 border border-stone-900 p-6 rounded-lg space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-stone-900 pb-3 flex items-center gap-2 font-sans">
                  <span>{language === 'bn' ? '১. কাস্টমার ডেলিভারি ঠিকানা' : '1. Delivery Coordinates'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-2 tracking-wider">
                      {language === 'bn' ? 'সম্পূর্ণ নাম (Full Name) *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'bn' ? 'যেমন: আয়েশা চৌধুরী' : 'e.g. Ayesha Chowdhury'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-850 rounded px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-2 tracking-wider">
                      {language === 'bn' ? 'মোবাইল নম্বর (Phone) *' : 'Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-850 rounded px-3.5 py-2.5 text-xs font-mono text-stone-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-2 tracking-wider">
                    {language === 'bn' ? 'ইমেইল অ্যাড্রেস (Email - ঐচ্ছিক)' : 'Email Address (Optional)'}
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-850 rounded px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-2 tracking-wider">
                      {language === 'bn' ? 'বিস্তারিত হোম অ্যাড্রেস/ঠিকানা *' : 'Detailed Home Address *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'bn' ? 'যেমন: হাউজ নং #১০, রোড নং #২, ধানমন্ডি' : 'e.g. House #10, Road #2, Dhanmondi'}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-850 rounded px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-2 tracking-wider">
                      {language === 'bn' ? 'থানা / শহর *' : 'Police Station / City *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'bn' ? 'যেমন: ধানমন্ডি' : 'e.g. Dhanmondi'}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-850 rounded px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-2 tracking-wider">
                    {language === 'bn' ? 'বাংলাদেশ জেলা নির্বাচন করুন *' : 'Bangladesh District *'}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-850 rounded px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                  >
                    {BANGLADESH_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DELIVERY OPTIONS */}
              <div className="bg-stone-950 border border-stone-900 p-6 rounded-lg space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-stone-900 pb-3 flex items-center gap-2">
                  <span>{language === 'bn' ? '২. ডেলিভারি এরিয়া নির্বাচন করুন' : '2. Delivery Option Selection'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`block border p-4 rounded-lg cursor-pointer transition-all ${
                    deliveryOption === 'Inside Dhaka'
                      ? 'bg-amber-400/5 border-amber-400 text-stone-150'
                      : 'bg-stone-900/40 border-stone-900 text-stone-450 hover:bg-stone-900'
                  }`}>
                    <div className="flex gap-3.5 items-start">
                      <input
                        type="radio"
                        name="deloption"
                        checked={deliveryOption === 'Inside Dhaka'}
                        onChange={() => setDeliveryOption('Inside Dhaka')}
                        className="accent-amber-400 mt-1"
                      />
                      <div>
                        <span className="block text-xs font-bold text-stone-200 uppercase">
                          {language === 'bn' ? 'ঢাকার ভেতরে (হোম ডেলিভারি)' : 'Inside Dhaka (Home Delivery)'}
                        </span>
                        <span className="block text-[11px] text-amber-450/80 font-mono mt-0.5">৳{chargeInside} BDT Logistics Charge</span>
                        <span className="block text-[10px] text-stone-450 mt-1 leading-relaxed font-sans">
                          {language === 'bn' 
                            ? 'ঢাকা সিটি কর্পোরেশনের আওতায় ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি।'
                            : 'Superfast home delivery within 24 to 48 hours directly into Dhaka suburbs.'}
                        </span>
                      </div>
                    </div>
                  </label>

                  <label className={`block border p-4 rounded-lg cursor-pointer transition-all ${
                    deliveryOption === 'Outside Dhaka'
                      ? 'bg-amber-400/5 border-amber-400 text-stone-150'
                      : 'bg-stone-900/40 border-stone-900 text-stone-450 hover:bg-stone-900'
                  }`}>
                    <div className="flex gap-3.5 items-start">
                      <input
                        type="radio"
                        name="deloption"
                        checked={deliveryOption === 'Outside Dhaka'}
                        onChange={() => setDeliveryOption('Outside Dhaka')}
                        className="accent-amber-400 mt-1"
                      />
                      <div>
                        <span className="block text-xs font-bold text-stone-200 uppercase">
                          {language === 'bn' ? 'ঢাকার বাইরে (কুরিয়ার)' : 'Outside Dhaka (Courier)'}
                        </span>
                        <span className="block text-[11px] text-amber-450/80 font-mono mt-0.5">৳{chargeOutside} BDT Logistics Charge</span>
                        <span className="block text-[10px] text-stone-450 mt-1 leading-relaxed font-sans">
                          {language === 'bn' 
                            ? 'সুন্দরবন বা রেডএক্স কুরিয়ারের মাধ্যমে বাংলাদেশের যেকোনো জেলায় ডেলিভারি।'
                            : 'Secure express parcel dispatch through premium courier lines across all 64 districts.'}
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* PAYMENT OPTION PICKER */}
              <div className="bg-stone-950 border border-stone-900 p-6 rounded-lg space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-stone-900 pb-3 flex items-center gap-2 font-sans">
                  <span>{language === 'bn' ? '৩. পেমেন্ট পদ্ধতি পছন্দ করুন' : '3. Select Payment Method'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className={`block border p-4 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'bg-amber-400/5 border-amber-400 text-stone-150 font-semibold'
                      : 'bg-stone-900/40 border-stone-900 text-stone-450 hover:bg-stone-900'
                  }`}>
                    <div className="flex gap-3 items-center">
                      <input
                        type="radio"
                        name="paymethod"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={() => setPaymentMethod('Cash on Delivery')}
                        className="accent-amber-400"
                      />
                      <div>
                        <span className="block text-xs uppercase font-bold text-stone-200">
                          {language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
                        </span>
                        <span className="text-[10px] text-stone-455 block mt-0.5 whitespace-nowrap text-stone-400">
                          {language === 'bn' ? 'হাতে পেয়ে মূল্য পরিশোধ' : 'Cash on Delivery'}
                        </span>
                      </div>
                    </div>
                  </label>

                  <label className={`block border p-4 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'bKash'
                      ? 'bg-amber-400/5 border-amber-400 text-stone-150 font-semibold'
                      : 'bg-stone-900/40 border-stone-900 text-stone-450 hover:bg-stone-900'
                  }`}>
                    <div className="flex gap-3 items-center">
                      <input
                        type="radio"
                        name="paymethod"
                        checked={paymentMethod === 'bKash'}
                        onChange={() => setPaymentMethod('bKash')}
                        className="accent-amber-400"
                      />
                      <div>
                        <span className="block text-xs uppercase font-bold text-stone-200">bKash (বিকাশ)</span>
                        <span className="text-[10px] text-stone-450 block mt-0.5 text-stone-400">
                          {language === 'bn' ? 'ম্যানুয়াল বিকাশ পেমেন্ট' : 'Manual bKash'}
                        </span>
                      </div>
                    </div>
                  </label>

                  <label className={`block border p-4 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'Nagad'
                      ? 'bg-amber-400/5 border-amber-400 text-stone-150 font-semibold'
                      : 'bg-stone-900/40 border-stone-900 text-stone-450 hover:bg-stone-900'
                  }`}>
                    <div className="flex gap-3 items-center">
                      <input
                        type="radio"
                        name="paymethod"
                        checked={paymentMethod === 'Nagad'}
                        onChange={() => setPaymentMethod('Nagad')}
                        className="accent-amber-400"
                      />
                      <div>
                        <span className="block text-xs uppercase font-bold text-stone-200">Nagad (নগদ)</span>
                        <span className="text-[10px] text-stone-450 block mt-0.5 text-stone-400">
                          {language === 'bn' ? 'ম্যানুয়াল নগদ পেমেন্ট' : 'Manual Nagad'}
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-extrabold uppercase text-xs tracking-widest py-4 rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{language === 'bn' ? 'পেমেন্ট ভেরিফিকেশনে যান (পরবর্তী ধাপ)' : 'Proceed to Verification'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </form>
          ) : (
            
            // STEP 2: PAYMENT VERIFICATION PAGE
            <form onSubmit={handleFinalOrderPlace} className="space-y-6 animate-fadeIn">
              
              <div className="bg-stone-950 border border-stone-900 p-6 rounded-lg space-y-6">
                
                {/* Back Link */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-stone-405 text-xs text-stone-400 hover:text-amber-400 transition-colors uppercase font-mono cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ডেলিভারি তথ্য পরিবর্তন করুন' : 'Back to Billing Form'}</span>
                </button>

                <div className="border-b border-stone-900 pb-3 flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-amber-450 text-amber-400 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>{language === 'bn' ? 'পেমেন্ট নিশ্চিতকরণ ও সাবমিট' : 'Payment Verification & Processing'}</span>
                  </h3>
                  <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold font-mono">
                    {paymentMethod}
                  </span>
                </div>

                {/* CONDITION RENDER DIRECTIONS */}
                {paymentMethod === 'Cash on Delivery' ? (
                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-lg space-y-2.5">
                    <div className="flex items-center gap-2 text-amber-450 text-amber-300 font-bold text-xs uppercase">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি নির্দেশিকা' : 'Cash on Delivery Guidelines'}</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-normal font-sans">
                      {language === 'bn'
                        ? 'আপনি "ক্যাশ অন ডেলিভারি (মূল্য পরিশোধ গ্যারান্টি)" পদ্ধতি নির্বাচন করেছেন। এই অর্ডারের জন্য আপনাকে এখন কোনো অগ্রিম টাকা পরিশোধ করতে হবে না। পণ্য হাতে পাওয়ার পর বিল পরিশোধ করুন।'
                        : 'You selected Cash on Delivery. No advance payment is needed right now. Please inspect and cash-out at delivery.'
                      }
                    </p>
                    <p className="text-[10px] text-stone-400 font-sans leading-normal">
                      {language === 'bn'
                        ? 'আমাদের ডেলিভারি অ্যাসিস্ট্যান্ট পণ্য নিয়ে আপনার দরজায় পৌঁছার পর জুয়েলারি চেক করে বুঝে নিন এবং মূল্য নগদ পরিশোধ করুন।'
                        : 'Our shipping agent will deliver your product. Verify clasp and details before handing over cash.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Payment details details */}
                    <div className="p-5 bg-amber-500/5 border border-amber-550/10 rounded-lg space-y-3">
                      <p className="text-xs text-amber-305 text-amber-300 uppercase font-mono tracking-widest font-bold">
                        {language === 'bn' ? `💬 পেমেন্ট নির্দেশিকা (${paymentMethod}):` : `💬 Pay via ${paymentMethod}:`}
                      </p>
                      
                      <div className="space-y-2.5 text-xs font-sans text-stone-300 leading-relaxed">
                        <p>
                          {language === 'bn'
                            ? `আমাদের অফিসিয়াল পার্সোনাল ${paymentMethod} নাম্বারে বিলের সমপরিমাণ টাকা সেন্ডমানি (Send Money) করুনঃ`
                            : `Please Send Money of total billing equivalent to our official wallet:`
                          }
                        </p>
                        <div className="bg-stone-900/80 p-3 rounded font-mono border border-stone-850 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-stone-500 block">Personal Wallet ID</span>
                            <span className="text-stone-150 font-bold select-all text-base text-amber-300">+8801313840136</span>
                          </div>
                          <span className="bg-stone-950 border border-stone-800 rounded px-2 py-1 text-[10px] text-stone-400 font-sans block">
                            {language === 'bn' ? 'সেন্ড মানি করুন' : 'Send Money'}
                          </span>
                        </div>
                        <p>
                          {language === 'bn' ? 'মোট বিলের পরিমাণঃ' : 'Total Invoice Bill:'}{' '}
                          <strong className="text-emerald-400 text-sm font-mono font-bold">৳{grandTotal.toLocaleString()} BDT</strong>
                        </p>
                      </div>
                    </div>

                    {/* Screenshot File Upload */}
                    <div className="space-y-3 text-left">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">
                        {language === 'bn' ? 'পেমেন্ট স্ক্রিনশট আপলোড করুন *' : 'Upload Payment Screenshot *'}
                      </label>
                      
                      <div className="relative border border-dashed border-stone-800 hover:border-amber-400 rounded-lg p-6 bg-stone-950/40 text-center space-y-3 transition-colors cursor-pointer group">
                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={handleScreenshotChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <Upload className="w-8 h-8 text-stone-500 mx-auto group-hover:text-amber-400 transition-colors" />
                        <div>
                          <p className="text-xs text-stone-300 font-semibold font-sans">
                            {screenshotName 
                              ? (language === 'bn' ? `অন্য ছবি নির্বাচন করুন` : `Select another file`) 
                              : (language === 'bn' ? `ট্যাপ বা ড্র্যাগ করে স্ক্রিনশট আপলোড করুন` : `Tap or drag screeny image to upload`)
                            }
                          </p>
                          <p className="text-[10px] text-stone-500 mt-1 font-sans">PNG, JPG formats supported. Max 5MB file sizes.</p>
                        </div>
                        {screenshotName && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-mono">
                            <Check className="w-3.5 h-3.5" />
                            <span className="truncate max-w-xs">{screenshotName}</span>
                          </div>
                        )}
                      </div>

                      {/* Small visual image preview thumbnail if uploaded */}
                      {screenshot && (
                        <div className="mt-2.5 p-2 border border-stone-900 bg-stone-950 rounded inline-block">
                          <span className="text-[9px] text-stone-500 block mb-1 font-mono">Screenshot Image Attached:</span>
                          <img src={screenshot} alt="Visual receipt" className="max-h-32 rounded object-contain border border-stone-900 bg-stone-900" />
                        </div>
                      )}
                    </div>

                    {/* Transation ID Input box */}
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase mb-2 tracking-wider">
                        {language === 'bn' ? 'ট্রানজেকশন আইডি / TrxID (অপশনাল)' : 'Transaction ID / TrxID (Optional)'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 9J35X7PL9"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-850 rounded px-3.5 py-2.5 text-xs font-mono text-stone-200 tracking-wider focus:outline-none focus:border-amber-400"
                      />
                      <p className="text-[9px] text-stone-500 mt-1 font-sans">
                        {language === 'bn' 
                          ? 'পেমেন্ট করার পর ট্রানজেকশন আইডি থাকলে সেটি এখানে দিন। এতে ভেরিফিকেশন আরও দ্রুত হবে।' 
                          : 'Enter your payment transaction text helper here to confirm verification.'}
                      </p>
                    </div>

                  </div>
                )}

              </div>

              {/* ACTION CONFIRM BUTTON */}
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 font-extrabold uppercase text-xs tracking-widest text-stone-950 py-4 rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <CheckCircle2 className="w-4.5 h-4.5" />
                <span>{language === 'bn' ? 'অর্ডার নিশ্চিত করুন (Confirm Order)' : 'Confirm Order'}</span>
              </button>

            </form>

          )}

        </div>

        {/* SIDEBAR ORDER RECAP */}
        <aside className="space-y-6">
          <div className="bg-stone-950 border border-stone-900 rounded-lg p-5 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-stone-900 pb-3 flex justify-between items-baseline font-sans">
              <span>{language === 'bn' ? 'আপনার শপিং ব্যাগ' : 'Your Basket Cart'}</span>
              <span className="text-stone-500 text-[10px] uppercase font-mono">({getCartItemCount()} {language === 'bn' ? 'টি পণ্য' : 'items'})</span>
            </h3>

            {/* List items */}
            <div className="divide-y divide-stone-900/50 max-h-56 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {cart.map((item) => {
                const p = getTranslatedProduct(item.product, language);
                return (
                  <div key={item.id} className="flex gap-3 pt-3 first:pt-0 items-center justify-between font-sans">
                    <div className="flex gap-2.5 items-center min-w-0">
                      <img src={item.product.image} alt={p.title} className="w-10 h-10 object-cover rounded bg-stone-900 shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-xs font-semibold text-stone-200 truncate">{p.title}</span>
                        <span className="text-[10px] text-stone-500 font-mono block">
                          QTY: {item.quantity} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-stone-300 text-xs text-right font-bold shrink-0">
                      ৳{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Price recap summaries */}
            <div className="border-t border-stone-900 pt-3.5 space-y-2.5 text-xs font-sans text-stone-400">
              <div className="flex justify-between">
                <span>{language === 'bn' ? 'উপ-মোট মূল্যঃ' : 'Subtotal Items'}</span>
                <span className="font-mono text-stone-250">৳{subtotal.toLocaleString()}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>{language === 'bn' ? `কুপন ডিসকাউন্ট (${appliedCoupon.code})` : `Coupon Deduction (${appliedCoupon.code})`}</span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{language === 'bn' ? 'শিপিং চার্জ / ডেলিভারি ফিঃ' : 'Logistics Delivery Charge'}</span>
                <span className="font-mono text-stone-250">
                  {currentDeliveryFee === 0 ? <strong className="text-emerald-400 font-sans text-[10px] uppercase">{language === 'bn' ? 'ফ্রি' : 'FREE'}</strong> : `৳${currentDeliveryFee}`}
                </span>
              </div>

              <div className="border-t border-stone-900 pt-3 flex justify-between items-baseline text-stone-200">
                <span className="text-xs font-bold uppercase">{language === 'bn' ? 'সর্বমোট পরিশোধযোগ্য বিলঃ' : 'Estimated Bill (সর্বমোট)'}</span>
                <span className="text-base font-bold font-mono text-emerald-400">৳{grandTotal.toLocaleString()} BDT</span>
              </div>
            </div>

            {/* Delivery threshold warnings */}
            {subtotal < freeThreshold ? (
              <p className="text-[10px] text-stone-500 text-center leading-normal font-sans">
                {language === 'bn' ? (
                  <>
                    কার্টে আরও বডি টিউন <span className="text-amber-405 text-amber-400 font-semibold font-mono">৳{(freeThreshold - subtotal).toLocaleString()}</span> মূল্যের পণ্য যোগ করে ঢাকাসহ দেশজুড়ে উপভোগ করুন <span className="text-emerald-400 uppercase font-bold text-[9px]">ফ্রি শিপিং</span>!
                  </>
                ) : (
                  <>
                    Add <span className="text-amber-405 text-amber-400 font-semibold font-mono">৳{(freeThreshold - subtotal).toLocaleString()}</span> more to unlock <span className="text-emerald-400 uppercase font-bold text-[9px]">Free Shipping</span> across Bangladesh!
                  </>
                )}
              </p>
            ) : (
              <p className="text-[10px] text-emerald-400 bg-emerald-950/20 py-2 border border-emerald-900/30 rounded text-center leading-normal font-sans">
                ⭐ {language === 'bn' ? 'চমৎকার! আপনি অর্ডারে ফ্রি ডেলিভারি উপভোগ করছেন।' : 'Awesome! Free delivery option is unlocked.'}
              </p>
            )}

          </div>

          <div className="p-4 bg-stone-950 border border-stone-900 rounded-lg text-xs text-stone-400 space-y-2 leading-relaxed font-sans">
            <p className="flex items-center gap-2 font-semibold text-stone-300">
              <Truck className="w-4 h-4 text-emerald-400" />
              {language === 'bn' ? 'যেকোনো জেলায় নিরাপদ সরবরাহ গ্যারান্টি' : 'Bangladesh Delivery Care'}
            </p>
            <p>
              {language === 'bn'
                ? 'আমরা আমাদের প্রতিটি গহনা চমৎকার বাবল-র‍্যাপ প্রোটেকশনযুক্ত রাজকীয় খামে সুরক্ষিত করে ডেলিভারি করি।'
                : 'We pack items in custom cushioned boxes with bubble wraps. Perfect for gift surprises or safe transit across Bangladesh.'
              }
            </p>
          </div>

        </aside>

      </div>

    </div>
  );
};
