import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, MessageSquare, ChevronDown, CheckCircle2, Search, Compass, ShieldAlert, FileText, HelpCircle, History, Clock } from 'lucide-react';

// --- ABOUT CUSTOMER STORY VIEW ---
export const AboutUsView: React.FC = () => {
  const { settings, language } = useApp();
  
  if (language === 'bn') {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-4xl space-y-12 text-left animate-fadeIn">
        <div className="space-y-4 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">আমাদের ঐতিহ্য এবং দর্শন</span>
          <h1 className="text-3xl md:text-5xl font-sans font-extrabold text-stone-100 tracking-tight">ARISAN BD এর পথচলা</h1>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6">
          <p className="text-sm md:text-base text-stone-300 leading-relaxed font-sans space-y-4">
            <span>
              {settings.brandName} এর মূল উদ্দেশ্যই ছিল আধুনিক গহনাপ্রেমীদের জন্য লাক্সারি বা রাজকীয় গহনার ধারণাকে নতুন করে সংজ্ঞায়িত করা। আমরা বিশ্বাস করি যে প্রকৃত সৌন্দর্য বা আভিজাত্য সস্তা জাঁকজমকতা প্রকাশের চেয়ে সূক্ষ্ম কারুকাজ, সঠিক ফিনিশিং এবং উচ্চ মানের উপাদানের মধ্যে প্রকাশ পায়।
            </span>
            <br /><br />
            <span>
              আমাদের ব্র্যান্ডের মূল স্লোগান, <strong className="text-amber-400">“Simple Look, Premium Jewellery”</strong> আমাদের গ্রাহকদের প্রতি শতভাগ প্রতিশ্রুতি। সম্পূর্ণ বাংলাদেশ-ভিত্তিক এই ব্র্যান্ডের প্রতিটি গহনা দক্ষিণ এশীয় ঐতিহ্যবাহী কারুকাজের সাথে পাশ্চাত্য মিনিমালিজমের এক নিখুঁত সংমিশ্রণ। আপনি ঈদ স্পেশাল চোকার বা ছিমছাম ট্রেন্ডি আংটি খুঁজুন না কেন, আমাদের কালেকশন আপনার মনের আকাঙ্ক্ষা পূরণ করবে।
            </span>
          </p>
          <div className="rounded-lg overflow-hidden border border-stone-900 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop"
              alt="ARISAN Curation craftsmanship"
              className="w-full h-80 object-cover referrer-no-referrer"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="border-t border-stone-900 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-amber-450 text-amber-400 font-mono">১০০%</h4>
            <span className="block text-xs font-semibold uppercase tracking-wider text-stone-250">অ্যালার্জি প্রতিরোধী প্লেটিং</span>
            <p className="text-[11px] text-stone-400">আমাদের সকল গহনা সংবেদনশীল ত্বকের জন্য শতভাগ নিরাপদ ও দীর্ঘস্থায়ী ধাতব বেস দিয়ে তৈরি।</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-emerald-400 font-mono">২০,০০০+</h4>
            <span className="block text-xs font-semibold uppercase tracking-wider text-stone-250">সন্তুষ্ট গ্রাহক</span>
            <p className="text-[11px] text-stone-400">আমরা বাংলাদেশের প্রতিটি পোস্টকোডে চমৎকার প্যাকেজিংয়ের মাধ্যমে রাজকীয় গহনা পৌঁছে দিচ্ছি।</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-stone-100 font-mono">নিরাপদ ক্যাশ অন ডেলিভারি</h4>
            <span className="block text-xs font-semibold uppercase tracking-wider text-stone-250">প্যাকেজ খুলে যাচাই সুবিধা</span>
            <p className="text-[11px] text-stone-400">আমাদের কুরিয়ার প্রতিনিধির কাছ থেকে পার্সেল হাতে পেয়ে খোলামাত্রই কোয়ালিটি দেখে চেকআউট বিল পরিশোধের চমৎকার সুবিধা পাবেন।</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-4xl space-y-12 text-left animate-fadeIn">
      <div className="space-y-4 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">Our Heritage</span>
        <h1 className="text-3xl md:text-5xl font-sans font-extrabold text-stone-100 tracking-tight">The ARISAN BD Philosophy</h1>
        <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-3"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6">
        <p className="text-sm md:text-base text-stone-300 leading-relaxed font-sans space-y-4">
          <span>
            {settings.brandName} emerged from a desire to redefine luxury for contemporary fashion lovers. We believe that true sophistication doesn't lie in excessive loudness—rather, it lives in carefully curated fine details, solid gold plated lines, and high-clarity gemstones.
          </span>
          <br /><br />
          <span>
            Our brand tagline, <strong className="text-amber-400">“Simple Look, Premium Jewellery”</strong>, is our promise. Based entirely in Bangladesh, we hand-select and design jewels that merge traditional South Asian artistry with sleek, occidental minimalism. Whether you are searching for premium Eid choker sets or classical minimal gold rings, we cater to your highest desires.
          </span>
        </p>
        <div className="rounded-lg overflow-hidden border border-stone-900 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop"
            alt="ARISAN Curation craftsmanship"
            className="w-full h-80 object-cover referrer-no-referrer"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="border-t border-stone-900 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-amber-450 text-amber-400 font-mono">100%</h4>
          <span className="block text-xs font-semibold uppercase tracking-wider text-stone-250">Hypoallergenic Plating</span>
          <p className="text-[11px] text-stone-400">All rings utilize non-tarnish physical base metals for maximum skin comfort.</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-emerald-400 font-mono">20,000+</h4>
          <span className="block text-xs font-semibold uppercase tracking-wider text-stone-250">Happy Client list</span>
          <p className="text-[11px] text-stone-400">Delivering luxury aesthetic packages to every post code of Bangladesh.</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-stone-100 font-mono">Secure COD</h4>
          <span className="block text-xs font-semibold uppercase tracking-wider text-stone-250">doorstop unboxing</span>
          <p className="text-[11px] text-stone-400">Inspect the jewelry inside our emerald pouch card packaging before completing cash handovers.</p>
        </div>
      </div>
    </div>
  );
};


// --- ABOUT FOUNDER VIEW ---
export const AboutOwnerView: React.FC = () => {
  const { language } = useApp();

  if (language === 'bn') {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-4xl space-y-12 text-left animate-fadeIn">
        <div className="space-y-4 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">ব্র্যান্ডের নেপথ্যে</span>
          <h1 className="text-3xl md:text-5xl font-sans font-extrabold text-stone-100 tracking-tight">আমাদের স্বপ্নদর্শী প্রতিষ্ঠাতা</h1>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-3"></div>
        </div>

        <div className="bg-stone-950 border border-stone-900 rounded-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 text-center space-y-4">
            <div className="relative inline-block">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=350&auto=format&fit=crop"
                alt="Md Tarikul Alam Jesan"
                className="w-48 h-48 object-cover rounded-full border-2 border-amber-400 mx-auto shadow-2xl animate-pulse"
              />
              <span className="absolute bottom-2 right-6 bg-emerald-500 text-stone-950 font-bold px-3 py-0.5 rounded-full text-[9px] uppercase border border-stone-950 tracking-wider">FOUNDER</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-100 font-sans">মোঃ তারিকুল আলম জেসান</h3>
              <span className="text-xs text-amber-400 uppercase font-mono">কিউরেটর, ঢাকা, বাংলাদেশ</span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4 font-sans text-stone-300 text-sm leading-relaxed">
            <p>
              ARISAN BD প্রতিষ্ঠিত হয়েছে স্বপ্নদর্শী ও দূরদর্শী ফ্যাশন উদ্যোক্তা <strong className="text-stone-100">মোঃ তারিকুল আলম জেসান</strong> এর হাত ধরে। তার স্বপ্ন ছিল বাংলাদেশে ক্রেতাদের জন্য সম্পূর্ণ বিশ্বস্ত, স্বচ্ছ এবং গ্রাহক-কেন্দ্রিক চমৎকার একটি রুচিশীল ফ্যাশন জুয়েলারি ই-কমার্স প্লাটফর্ম গড়ে তোলা।
            </p>
            <p>
              অনলাইনে জুয়েলারি কেনাকাটার ক্ষেত্রে সাধারণ ক্রেতাদের মনে যে বিশ্বাসের ঘাটতি থাকে, তা দূর করার লক্ষ্যে জেসান প্রতিটি প্রোডাকশনের কঠোর গুণগত মান যাচাই (Absolute Quality Check) বাধ্যতামূলক করেছেন। আমাদের চোকার বা লকেট থেকে শুরু করে কানের দুল - প্রতিটি পণ্যই ল্যাবে কঠোর ট্রায়াল ও ফিনিশিংয়ের পর প্যাকেজিংয়ে পাঠানো হয় যাতে গ্রাহকরা পান সেরা অভিজ্ঞতা।
            </p>
            <blockquote className="border-l-2 border-amber-400 pl-4 py-1 text-xs italic text-amber-300">
              "আরেজান বিডি শুধুমাত্র কোনো সাধারণ অনলাইন শপ নয়। এটি এমন একটি প্রিমিয়াম ট্রাস্টেড ব্র্যান্ড যা আমাদের দেশীয় ও পাশ্চাত্য আভিজাত্যের মিলন ঘটায়। আমাদের সম্মানিত ক্রেতারা যখন আমাদের জুয়েলারি পরিধান করেন, তারা যেন নিজেদের মার্জিত ব্যক্তিত্ব ও সৌন্দর্য নিয়ে গর্ববোধ করতে পারেন - এই আমাদের মূল সার্থকতা।"
            </blockquote>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-4xl space-y-12 text-left animate-fadeIn">
      <div className="space-y-4 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">Behind The Brand</span>
        <h1 className="text-3xl md:text-5xl font-sans font-extrabold text-stone-100 tracking-tight">The Visionary Curator</h1>
        <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-3"></div>
      </div>

      <div className="bg-stone-950 border border-stone-900 rounded-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-1 text-center space-y-4">
          <div className="relative inline-block">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=350&auto=format&fit=crop"
              alt="Md Tarikul Alam Jesan"
              className="w-48 h-48 object-cover rounded-full border-2 border-amber-400 mx-auto shadow-2xl"
            />
            <span className="absolute bottom-2 right-6 bg-emerald-500 text-stone-950 font-bold px-3 py-0.5 rounded-full text-[9px] uppercase border border-stone-950 tracking-wider">FOUNDER</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-100">Md Tarikul Alam Jesan</h3>
            <span className="text-xs text-amber-400 uppercase font-mono">Curator, Dhaka, Bangladesh</span>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4 font-sans text-stone-300 text-sm leading-relaxed">
          <p>
            ARISAN BD was founded under the singular guidance of <strong className="text-stone-100">Md Tarikul Alam Jesan</strong>, an aesthetic visionary focused on building a transparent, elegant, and highly customer-oriented online e-commerce infrastructure in Bangladesh.
          </p>
          <p>
            Understanding the trust gaps commonly associated with buying jewellery online in Bangladesh, Jesan introduced absolute quality checks. Every piece—from teardrop chokers to geometric studs—is inspected under loupes in our labs to verify that plating thicknesses and clasp lock systems comply with international standards.
          </p>
          <blockquote className="border-l-2 border-amber-400 pl-4 py-1 text-xs italic text-amber-300">
            "ARISAN BD is not just an e-commerce platform. It is a modern fashion jewellery brand focused on premium style, elegance and trusted online shopping experience in Bangladesh. Our customers don't just dress up; they celebrate their heritage with pride under a label they can unequivocally trust."
          </blockquote>
        </div>
      </div>
    </div>
  );
};


// --- CONTACT US VIEW ---
export const ContactUsView: React.FC = () => {
  const { settings, language } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setName('');
    setEmail('');
    setMsg('');
    setTimeout(() => setSuccess(false), 5000);
  };

  if (language === 'bn') {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-5xl space-y-12 text-left animate-fadeIn">
        <div className="space-y-4 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">গ্রাহক যোগাযোগ ডেস্ক</span>
          <h1 className="text-3xl md:text-5xl font-sans font-extrabold text-stone-100">আরেজান বিডির সাথে যোগাযোগ করুন</h1>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
          
          {/* Contact Form */}
          <div className="bg-stone-950 border border-stone-900 rounded-lg p-6 space-y-6 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
            
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-stone-850 pb-2">আমাদের বার্তা লিখুন</h3>

            {success && (
              <div className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 p-3 rounded text-xs font-medium">
                ✔ বার্তা সফলভাবে পাঠানো হয়েছে! আমাদের একজন কাস্টমার রিপ্রেজেন্টিটিভ শীঘ্রই যোগাযোগ করবেন।
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-stone-400 font-bold mb-1.5 uppercase">আপনার সম্পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমনঃ নুসরত জাহান"
                  className="w-full bg-stone-900 border border-stone-850 rounded px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-stone-400 font-bold mb-1.5 uppercase">আপনার ইমেইল এড্রেস *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-stone-900 border border-stone-850 rounded px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-stone-400 font-bold mb-1.5 uppercase">বার্তার বিবরণী *</label>
                <textarea
                  required
                  rows={4}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="উপহার বক্স, কাস্টম সাইজ অথবা ডেলিভারি সম্পর্কিত কোনো প্রশ্ন থাকলে এখানে বিস্তারিত লিখুন..."
                  className="w-full bg-stone-900 border border-stone-850 rounded px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold uppercase text-xs tracking-wider py-3 rounded hover:opacity-90 transition-opacity cursor-pointer text-center"
              >
                বার্তা পাঠান
              </button>
            </form>
          </div>

          {/* Contact info details */}
          <div className="space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-stone-900 pb-2">সরাসরি যোগাযোগ মাধ্যম</h3>
              <p className="text-stone-300 text-sm leading-relaxed font-sans">
                অর্ডার ডেলিভারির সর্বশেষ অবস্থা জানতে বা যেকোনো জুয়েলারি পণ্যের কারুকার্য সম্পর্কে জানতে আমাদের নিচের হটলাইন নম্বরে কল করতে বা হোয়াটসঅ্যাপ বার্তা পাঠাতে পারেন।
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-xs uppercase text-stone-450 tracking-wider font-semibold">হোয়াটসঅ্যাপ হটলাইন</strong>
                  <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-mono text-stone-100 hover:text-amber-400 text-sm font-semibold">{settings.whatsappNumber}</a>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-xs uppercase text-stone-450 tracking-wider font-semibold">অফিসিয়াল ইমেইল</strong>
                  <a href={`mailto:${settings.email}`} className="font-mono text-stone-100 hover:text-amber-400 text-sm font-semibold">{settings.email}</a>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-xs uppercase text-stone-450 tracking-wider font-semibold">হেড কোয়ার্টার</strong>
                  <span className="text-stone-100 text-sm font-semibold font-sans">বনানী, ঢাকা - ১২১৩, বাংলাদেশ</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-950 border border-stone-900 rounded-lg">
              <span className="text-[10px] text-stone-400 block uppercase tracking-wider font-bold mb-1 font-sans">⚡ সার্ভিস আওয়ারঃ</span>
              <span className="text-xs text-stone-300 block font-sans">শনিবার – বৃহস্পতিবার: সকাল ১০:০০ টা – রাত ০৮:০০ টা (বাংলাদেশ সময়)</span>
              <span className="text-[10px] text-stone-500 block mt-1 font-sans">টেলিগ্রাম এবং হোয়াটসঅ্যাপে আমাদের সাপোর্ট টিম যেকোনো সমস্যা সমাধানে সর্বদা প্রস্তুত।</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-5xl space-y-12 text-left animate-fadeIn">
      <div className="space-y-4 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">Support Desk</span>
        <h1 className="text-3xl md:text-5xl font-sans font-extrabold text-stone-100 tracking-tight">Connect with ARISAN</h1>
        <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-3"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
        
        {/* Contact Form */}
        <div className="bg-stone-950 border border-stone-900 rounded-lg p-6 space-y-6 relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
          
          <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-stone-903 pb-2">Send Client Enquiry</h3>

          {success && (
            <div className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 p-3 rounded text-xs font-medium">
              ✔ Message submitted! An ARISAN specialist will call or email you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-stone-400 font-bold mb-1.5 uppercase">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Nusrat Jahan"
                className="w-full bg-stone-900 border border-stone-850 rounded px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-stone-400 font-bold mb-1.5 uppercase">Official Email address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-stone-900 border border-stone-850 rounded px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-stone-400 font-bold mb-1.5 uppercase">Your Message details *</label>
              <textarea
                required
                rows={4}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Ask about bulk gifting, custom sizes, or delivery schedules in Bangladesh..."
                className="w-full bg-stone-900 border border-stone-850 rounded px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold uppercase text-xs tracking-wider py-3 rounded hover:opacity-90 transition-opacity cursor-pointer text-center"
            >
              Dispatch Message
            </button>
          </form>
        </div>

        {/* Contact info details */}
        <div className="space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-stone-900 pb-2">Direct Communications</h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              We look forward to addressing your requirements. Please use the hotlines below for immediate updates regarding delivery logistics or product specifications.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs uppercase text-stone-450 tracking-wider font-semibold text-stone-405">WhatsApp Line</strong>
                <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-mono text-stone-100 hover:text-amber-400 text-sm font-semibold">{settings.whatsappNumber}</a>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Mail className="w-5 h-5 text-emerald-450 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs uppercase text-stone-450 tracking-wider font-semibold text-stone-405">Email support</strong>
                <a href={`mailto:${settings.email}`} className="font-mono text-stone-100 hover:text-amber-400 text-sm font-semibold">{settings.email}</a>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs uppercase text-stone-450 tracking-wider font-semibold text-stone-405">Physical Curation Center</strong>
                <span className="text-stone-100 text-sm font-semibold">Banani, Dhaka - 1213, Bangladesh</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-stone-950 border border-stone-900 rounded-lg">
            <span className="text-[10px] text-stone-400 block uppercase tracking-wider font-bold mb-1">⚡ Open Hours:</span>
            <span className="text-xs text-stone-300 block">Saturday – Thursday: 10:00 AM – 8:00 PM (Bangladesh Time)</span>
            <span className="text-[10px] text-stone-500 block mt-1">Our WhatsApp line is open 24/7 for urgent delivery disputes.</span>
          </div>
        </div>

      </div>
    </div>
  );
};


// --- SUPPORT CENTER VIEW (REPLACES DETAILED PAGE TAB) ---
export const SupportCenterView: React.FC = () => {
  const { settings, language } = useApp();

  if (language === 'bn') {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-4xl space-y-12 text-left animate-fadeIn">
        <div className="space-y-4 text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">গ্রাহক নিরাপত্তা কেন্দ্র</span>
          <h1 className="text-3xl md:text-5xl font-sans font-extrabold text-stone-100 tracking-tight">সহায়তা ও রিটার্ন পলিসি</h1>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <div className="bg-stone-950 border border-stone-900 rounded-lg p-6 space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-stone-900 pb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
               এক্সচেঞ্জ ও রিটার্ন নীতিমালা
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              আমরা আমাদের সকল সাধারণ নন-কাস্টমাইজড জুয়েলারির ওপর <strong className="text-stone-100 font-medium">৭ দিনের সহজ এক্সচেঞ্জ সুবিধা</strong> দিয়ে থাকি। যদি সাইজে কোনো ধরণের সমস্যা হয় বা আপনি নতুন কোনো ভিন্ন মডেলে রিপ্লেস করতে চান, তবে সরাসরি আমাদের হোয়াটসঅ্যাপে <strong className="text-stone-150">{settings.whatsappNumber}</strong> মেসেজ দিন।
              <br /><br />
              আমাদের ডেলিভারি প্রতিনিধি আপনার ঠিকানায় নতুন পণ্যটি নিয়ে গিয়ে এক্সচেঞ্জ সম্পন্ন করে আসবেন।
            </p>
          </div>

          <div className="bg-stone-950 border border-stone-900 rounded-lg p-6 space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-stone-900 pb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              কুরিয়ার ও হোম ডেলিভারি যত্ন
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              ঢাকার ভিতরে সকল অর্ডার ২৪ থেকে ৪৮ ঘণ্টার মধ্যে অতি দ্রুত হোম ডেলিভারি করা হয়। ঢাকার বাইরে কুরিয়ার পার্টনারের সাহায্যে ২ থেকে ৪ কার্যদিবসের মধ্যে অত্যন্ত বাবল-র‍্যাপ প্রোটেকশনে শতভাগ নিরাপদে পার্সেল পৌঁছানো হয়।
              <br /><br />
              ৩০০০ টাকার বেশি ক্রয় সম্পন্ন করলে ডেলিভারি ফি সম্পূর্ণ ফ্রিতে উপভোগ করতে পারবেন!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-4xl space-y-12 text-left animate-fadeIn">
      <div className="space-y-4 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">Client Safeguards</span>
        <h1 className="text-3xl md:text-5xl font-sans font-extrabold text-stone-100 tracking-tight">ARISAN Support Hub</h1>
        <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-3"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <div className="bg-stone-950 border border-stone-900 rounded-lg p-6 space-y-4">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-stone-900 pb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Exchange & Return Protocols
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            We offer an absolute <strong className="text-stone-100 font-medium">7-day hassle-free exchange</strong> on all non-customized jewelry. If the size does not fit or you wish to trade for a different emerald model, please contact us on WhatsApp at <strong className="text-stone-150">{settings.whatsappNumber}</strong>. 
            <br /><br />
            Our logistics rider will pick up the piece in its original gold foiled visual packaging and deliver your trade item.
          </p>
        </div>

        <div className="bg-stone-950 border border-stone-900 rounded-lg p-6 space-y-4">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-stone-900 pb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Home Delivery Care
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            Dhaka orders are dispatched immediately and delivered within <strong className="text-stone-105">24 to 48 hours</strong>. Outside Dhaka, shipping is handled via trustworthy SA Paribahan or Pathao logistics, taking <strong className="text-stone-200">2 to 4 business days</strong>. 
            <br /><br />
            Orders exceeding 3,000 BDT receive complete waiver on shipping fees! In-transit damage is fully replaced under our brand warranty.
          </p>
        </div>
      </div>
    </div>
  );
};


// --- PRIVACY POLICY ---
export const PrivacyPolicyView: React.FC = () => {
  const { language } = useApp();

  if (language === 'bn') {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-3xl space-y-8 text-left animate-fadeIn">
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold font-mono">আইন ও ডেটা নিরাপত্তা</span>
          <h1 className="text-2xl md:text-4xl font-sans font-extrabold text-stone-100">প্রাইভেসি সুরক্ষিত গ্যারান্টি</h1>
          <div className="w-12 h-0.5 bg-amber-400"></div>
        </div>

        <div className="space-y-6 text-xs md:text-sm text-stone-300 leading-relaxed font-sans">
          <p>সর্বশেষ আপডেটঃ ২৬ মে, ২০২৬</p>
          <p>
            আরেজান বিডিতে আমরা ক্রেতাদের ব্যক্তিগত তথ্যের সুরক্ষায় অত্যন্ত সচেতন। আমরা শুধুমাত্র অর্ডার ডেলিভারি, শিপমেন্ট এবং সঠিক ট্র্যাকিং রেফারেন্স নিশ্চিত করার স্বার্থে আপনার নাম, মোবাইল নম্বর এবং হোম অ্যাড্রেস সংরক্ষণ করে থাকি।
          </p>
          <h3 className="text-sm font-bold text-stone-100 uppercase tracking-wider pt-2">১. ডেটা স্টোরেজ ও ব্যাংক লেনদেন</h3>
          <p>বিকাশ বা নগদ ট্রানজেকশনের সকল ডেটা অত্যন্ত এনক্রিপ্টেড পেমেন্ট গেটওয়ের মাধ্যমে পরিশোধিত হয়। কোনো ক্রেডিট কার্ড বা আর্থিক তথ্যের রিকর্ড আমাদের লোকাল সার্ভারে কখনো জমা রাখা হয় না।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-3xl space-y-8 text-left animate-fadeIn">
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold font-mono">legal and data</span>
        <h1 className="text-2xl md:text-4xl font-sans font-extrabold text-stone-100">Privacy Safeguards</h1>
        <div className="w-12 h-0.5 bg-amber-400"></div>
      </div>

      <div className="space-y-6 text-xs md:text-sm text-stone-300 leading-relaxed font-sans">
        <p>Last Revised: May 25, 2026</p>
        <p>
          At ARISAN BD, we are committed to shielding your personal data. We collect customer names, phone digits, delivery streets, and emails purely to route, pack, and ship your jewellery collections securely across Bangladesh.
        </p>
        <h3 className="text-sm font-bold text-stone-100 uppercase tracking-wider pt-2">1. Data Storage Boundaries</h3>
        <p>No card details or financial passwords are stored on our servers. When using Bkash or Nagad payment options, all transactions pass through verified external visual secure checkout portals complying with bank standards.</p>
        <h3 className="text-sm font-bold text-stone-100 uppercase tracking-wider pt-2">2. Communication and Newsletter Limits</h3>
        <p>If you subscribe to our custom VIP newsletter, we may notify you about new emerald drops and limited festival discounts curated by Md Tarikul Alam Jesan. You can opt-out at any time with a single click.</p>
      </div>
    </div>
  );
};


// --- TERMS AND CONDITIONS ---
export const TermsAndConditionsView: React.FC = () => {
  const { language } = useApp();

  if (language === 'bn') {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-3xl space-y-8 text-left animate-fadeIn">
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold font-mono">ব্র্যান্ড চুক্তি</span>
          <h1 className="text-2xl md:text-4xl font-sans font-extrabold text-stone-100">ব্যবহারের নিয়ম ও শর্তাবলী</h1>
          <div className="w-12 h-0.5 bg-amber-400"></div>
        </div>

        <div className="space-y-6 text-xs md:text-sm text-stone-300 leading-relaxed font-sans">
          <p>কার্যকরী তারিখঃ মে, ২০২৬</p>
          <p>
            আরেজান বিডি থেকে পণ্য বা ফ্যাশন অনুষঙ্গ ক্রয়ের মাধ্যমে আপনি আমাদের নিম্নলিখিত শর্তাবলীর সাথে একমত পোষণ করছেনঃ
          </p>
          <h3 className="text-sm font-bold text-stone-100 uppercase tracking-wider pt-2">১. অর্ডারের সত্যতা ও মূল্য নির্ধারণী</h3>
          <p>আমাদের সকল পণ্যের দাম বাংলাদেশী টাকায় (BDT) হিসেব করা হয়। কারিগরি ক্রটির কারণে পণ্যের দামে অস্বাভাবিক অসঙ্গতি প্রদর্শন করলে কাস্টমার সাপোর্ট অর্ডার বাতিলে সম্পূর্ণ অধিকার সংরক্ষণ করে।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-3xl space-y-8 text-left animate-fadeIn">
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold font-mono">brand agreements</span>
        <h1 className="text-2xl md:text-4xl font-sans font-extrabold text-stone-100">Terms of Curation</h1>
        <div className="w-12 h-0.5 bg-amber-400"></div>
      </div>

      <div className="space-y-6 text-xs md:text-sm text-stone-300 leading-relaxed font-sans">
        <p>Effective Date: May 2026</p>
        <p>
          By browsing or buying jewellery from ARISAN BD, you agree to comply with our commercial terms:
        </p>
        <h3 className="text-sm font-bold text-stone-100 uppercase tracking-wider pt-2">1. Jewelry Pricing Accuracy</h3>
        <p>All prices listed are in BDT (Bangladeshi Taka). While we strive for accuracy, ARISAN BD reserves the right to cancel orders placed under false or erroneous prices due to system cache lag.</p>
        <h3 className="text-sm font-bold text-stone-100 uppercase tracking-wider pt-2">2. Stock and Plating Guarantees</h3>
        <p>We declare inventory stock counts in real-time. Since items are hand-polished in batch groups, some items may display short Low Stock delays. Plated elements should not be exposed to industrial chemicals, fragrances, or extreme saltwater to maintain maximum gloss duration.</p>
      </div>
    </div>
  );
};


// --- FAQ PAGE ---
export const FAQPageView: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { language } = useApp();

  const faqsBn = [
    {
      q: "আরেজান বিডি কি খাঁটি স্বর্ণ বা ডায়মন্ডের জুয়েলারি সরবরাহ করে?",
      a: "আমাদের সকল জুয়েলারি পণ্য চমৎকার ফ্যাশন ডিজাইনে তৈরি গহনা। এগুলির ওপরে আধুনিক ভ্যাকুয়াম কোটিং প্রযুক্তির মাধ্যমে উচ্চ মানের ১৮ ক্যারেট এবং ২২ ক্যারেট গোল্ড প্লেট পলিশ করা হয়, যা দীর্ঘ দিন উজ্জ্বল ও লাক্সারি গ্লস ধরে রাখতে সাহায্য করে।"
    },
    {
      q: "সারাদেশে ডেলিভারি চার্জ কত টাকা?",
      a: "ঢাকার ভিতরে আমাদের এক্সপ্রেস ডোরস্টেপ হোম ডেলিভারি ফি ৮০ টাকা এবং ঢাকার বাইরে কুরিয়ারে ডেলিভারি ফি ১৫০ টাকা flat। তবে আপনার শপিং ব্যাগ বা কার্টের মোট বিল ৩০০০ টাকা বা তার বেশি হলে ডেলিভারি বিল সম্পূর্ণ ফ্রী হয়ে যাবে।"
    },
    {
      q: "ক্যাশ অন ডেলিভারি (COD) পেমেন্ট প্রক্রিয়াটি কেমন?",
      a: "আমাদের নির্ভরযোগ্য কুরিয়ার প্রতিনিধি আপনার ঠিকানায় রয়্যাল গিফট বক্সটি সিলড অবস্থায় পৌঁছে দেবে। আপনি সেটি খুলে গহনার নকশা ও মান যাচাই করে সন্তুষ্ট হয়ে বিলের টাকা পরিশোধ করবেন।"
    },
    {
      q: "অর্ডার ডেলিভারির সম্ভাব্য সময় কত দিন?",
      a: "ঢাকার ভিতরে পণ্য পৌঁছে যায় ২৪ থেকে ৪৮ ঘণ্টায়। ঢাকার বাইরে সাধারণত গ্রাহকদের ঠিকানায় পৌঁছে যেতে ২ থেকে ৪ কার্যদিবসের মত সময় লাগতে পারে।"
    },
    {
      q: "আমি কি বিশেষ গিফট নোট বা চিরকুট লিখতে পারি?",
      a: "অবশ্যই! চেকআউট সম্পূর্ণ হওয়ার পর আপনার অর্ডার আইডি বিস্তারিত জানিয়ে আমাদের হোয়াটসঅ্যাপ নম্বরে যোগাযোগ করুন। আমরা সম্পূর্ণ বিনামূল্যে গিফট চিরকুট আমাদের রাজকীয় বক্সে প্যাক করে দেব।"
    }
  ];

  const faqsEn = [
    {
      q: "Does ARISAN BD provide real gold jewellery?",
      a: "Our items are fashion jewellery designed for a 'Simple Look'. They are intricately plated in durable 18K and 22K solid gold alloys using vacuum techniques which last significantly longer than standard vanity coatings."
    },
    {
      q: "What are the shipping charges in Bangladesh?",
      a: "We charge 80 BDT for Dhaka and 150 BDT flat for express home delivery across all other locations. However, any cart total of 3,000 BDT or more automatically unlocks Free Express Shipping!"
    },
    {
      q: "How does the Cash on Delivery system work?",
      a: "Our third-party logistics rider will deliver the sealed emerald box. You are fully welcome to open, inspect the item craftsmanship, and hand over cash once you are completely content with the jewellery's polish."
    },
    {
      q: "How long does standard delivery take?",
      a: "Dhaka city deliveries take 24 to 48 hours. Outside Dhaka takes 2 to 4 business days depending on client post code coordinates."
    },
    {
      q: "Can I coordinate custom gift notes?",
      a: "Absolutely! After completing checkouts, WhatsApp us your order ID, and MD Tarikul Alam Jesan's assistants will handwritten custom wax-sealed cards inside the package for zero cost."
    }
  ];

  const activeFaqs = language === 'bn' ? faqsBn : faqsEn;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-3xl space-y-12 text-left animate-fadeIn">
      <div className="space-y-4 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
          {language === 'bn' ? 'সাধারণ প্রশ্ন ও উত্তর' : 'Help & Questions'}
        </span>
        <h1 className="text-3xl md:text-5xl font-sans font-extrabold text-stone-100 tracking-tight">
          {language === 'bn' ? 'জিজ্ঞাসিত প্রশ্নাবলী (FAQ)' : 'Frequently Asked FAQ'}
        </h1>
        <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-3"></div>
      </div>

      <div className="space-y-4 pt-6">
        {activeFaqs.map((f, i) => (
          <div key={i} className="bg-stone-950 border border-stone-900 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full text-left p-5 flex justify-between items-center text-sm font-semibold text-stone-200 hover:text-amber-400 transition-colors"
            >
              <span>{f.q}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 shrink-0 ${openIndex === i ? 'rotate-180 text-amber-400' : 'text-stone-500'}`} />
            </button>

            {openIndex === i && (
              <div className="p-5 pt-0 text-xs md:text-sm text-stone-405 leading-relaxed text-stone-300 border-t border-stone-900/40 bg-stone-950/20 font-sans">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


// --- LIVE ORDER TRACKING SYSTEM ---
export const OrdersTrackingView: React.FC = () => {
  const { orders, trackedOrder, trackOrder, currentUser, language } = useApp();
  const [query, setQuery] = useState('');
  const [attempted, setAttempted] = useState(false);
  
  // Tracking navigation state
  const [searchMethod, setSearchMethod] = useState<'id' | 'phone'>('id');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [phoneResults, setPhoneResults] = useState<any[] | null>(null);
  const [deviceOrders, setDeviceOrders] = useState<any[]>([]);

  // Load order history matching device local storage or logged-in user details
  useEffect(() => {
    let savedIds: string[] = [];
    try {
      const stored = localStorage.getItem('arisan_device_order_ids');
      if (stored) {
        savedIds = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error parsing device orders:', e);
    }

    const matched = orders.filter((o) => {
      const isSaved = savedIds.includes(o.id);
      const matchesEmail = currentUser?.email && o.email?.toLowerCase() === currentUser.email.toLowerCase();
      const matchesPhone = currentUser?.phone && o.phone === currentUser.phone;
      return isSaved || matchesEmail || matchesPhone;
    });

    // Remove duplicates
    const unique = Array.from(new Map(matched.map(item => [item.id, item])).values());
    
    // Sort recent first
    unique.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setDeviceOrders(unique);
  }, [orders, currentUser]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    trackOrder(query);
    setAttempted(true);
  };

  const handlePhoneSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneQuery.trim()) return;

    const term = phoneQuery.trim().toLowerCase();
    const results = orders.filter((o) => {
      const cleanOrderPhone = o.phone ? o.phone.replace(/[\s\-\+]/g, '') : '';
      const cleanSearchPhone = term.replace(/[\s\-\+]/g, '');
      
      const phoneMatches = cleanSearchPhone.length >= 6 && cleanOrderPhone.includes(cleanSearchPhone);
      const emailMatches = o.email && o.email.toLowerCase().includes(term);
      const nameMatches = o.customerName && o.customerName.toLowerCase().includes(term);
      
      return phoneMatches || emailMatches || nameMatches;
    });

    setPhoneResults(results);
    setAttempted(false); // Clear the active track details so they see the result list first
  };

  const selectOrderToTrack = (orderId: string) => {
    setQuery(orderId);
    trackOrder(orderId);
    setAttempted(true);
    setSearchMethod('id'); // switch view back to track status detail
    
    // Scroll to tracking visual status indicators smoothly
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-2xl space-y-10 text-left animate-fadeIn">
      <div className="space-y-4 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
          {language === 'bn' ? 'রিয়েল টাইম ট্র্যাকিং' : 'Real-time status'}
        </span>
        <h1 className="text-3xl font-sans font-extrabold text-stone-100 tracking-tight">
          {language === 'bn' ? 'শিপমেন্ট ট্র্যাকিং পোর্টাল' : 'Track Your Jewels'}
        </h1>
        <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-3"></div>
      </div>

      {/* Search Mode Toggles */}
      <div className="flex bg-stone-950 border border-stone-900 rounded p-1 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => {
            setSearchMethod('id');
            setAttempted(false);
          }}
          className={`flex-1 text-center py-2 text-xs font-bold uppercase rounded transition-all cursor-pointer ${
            searchMethod === 'id' 
              ? 'bg-amber-400 text-stone-950' 
              : 'text-stone-400 hover:text-stone-250 hover:bg-stone-900/40'
          }`}
        >
          {language === 'bn' ? '🔍 অর্ডার আইডি খুঁজুন' : '🔍 Order Tracking'}
        </button>
        <button
          type="button"
          onClick={() => {
            setSearchMethod('phone');
            setAttempted(false);
          }}
          className={`flex-1 text-center py-2 text-xs font-bold uppercase rounded transition-all cursor-pointer ${
            searchMethod === 'phone' 
              ? 'bg-amber-400 text-stone-950' 
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/40'
          }`}
        >
          {language === 'bn' ? '📱 মোবাইল দিয়ে খোঁজুন' : '📱 Find by Mobile'}
        </button>
      </div>

      {/* Input Queries Forms depending on active Search Method */}
      {searchMethod === 'id' ? (
        <form onSubmit={handleTrackSubmit} className="bg-stone-950 border border-stone-900 p-6 rounded-lg space-y-4 shadow-xl">
          <label className="block text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">
            {language === 'bn' ? 'প্রদত্ত অর্ডার আইডি বা কুরিয়ার আইডি লিখুন' : 'Enter Order ID or Courier Tracking #'}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="e.g. ARISAN-123456 or TRACK-..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-stone-900 border border-stone-850 rounded px-3.5 py-2.5 text-xs text-stone-200 uppercase tracking-wider focus:outline-none focus:border-amber-400 font-mono"
            />
            <button
              type="submit"
              className="bg-amber-400 text-stone-950 font-bold text-xs uppercase px-5 py-2.5 rounded hover:bg-amber-500 cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{language === 'bn' ? 'অনুসন্ধান' : 'Trace'}</span>
            </button>
          </div>
          <p className="text-[10px] text-stone-500">
            {language === 'bn' 
              ? 'অর্ডার আইডিটি আপনার কনফার্মেশন বিল রশিদে প্রিন্ট করা রয়েছে।' 
              : 'Order IDs are printed inside secure success receipts.'
            }
          </p>
        </form>
      ) : (
        <form onSubmit={handlePhoneSearchSubmit} className="bg-stone-950 border border-stone-900 p-6 rounded-lg space-y-4 shadow-xl">
          <label className="block text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">
            {language === 'bn' ? 'আপনার সচল মোবাইল নম্বর বা নাম লিখুন' : 'Enter Mobile Number or Customer Name'}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="e.g. 017XXXXXXXX"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value)}
              className="flex-1 bg-stone-900 border border-stone-850 rounded px-3.5 py-2.5 text-xs text-stone-250 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="bg-amber-400 text-stone-950 font-bold text-xs uppercase px-5 py-2.5 rounded hover:bg-amber-500 cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{language === 'bn' ? 'খুঁজুন' : 'Find'}</span>
            </button>
          </div>
          <p className="text-[10px] text-stone-500">
            {language === 'bn'
              ? 'অর্ডার করার সময় যে মোবাইল নম্বর বা নাম ব্যবহার করেছিলেন, সেটি দিয়ে আপনার পূর্ববর্তী সকল অর্ডার খুঁজে বের করুন।'
              : 'Search your entire historic order backlog using your ordering metadata.'
            }
          </p>
        </form>
      )}

      {/* PHONE SEARCH LOGICAL RESULTS SCREEN */}
      {searchMethod === 'phone' && phoneResults !== null && (
        <div className="bg-stone-950 border border-stone-900 rounded-lg p-5 space-y-4 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2 border-b border-stone-900/80 pb-3">
            <History className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-stone-300">
              {language === 'bn' ? `সর্বমোট ম্যাচিং বা প্রাপ্ত অর্ডার (${phoneResults.length})` : `Matched Orders Found (${phoneResults.length})`}
            </span>
          </div>

          {phoneResults.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {phoneResults.map((order) => (
                <div key={order.id} className="bg-stone-900/40 border border-stone-905 hover:border-amber-400/40 p-3.5 rounded flex justify-between items-center transition-all">
                  <div className="space-y-1 text-xs text-stone-300 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 select-all">{order.id}</span>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded leading-none ${
                        order.status === 'Approved' || order.status === 'Delivered' || order.status === 'Confirmed' ? 'bg-emerald-950/40 text-emerald-450 border border-emerald-900/35' :
                        order.status === 'Rejected' || order.status === 'Cancelled' ? 'bg-red-950/40 text-red-400 border border-red-900/35' : 'bg-amber-950/30 text-amber-400 border border-amber-900/30'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 font-sans">
                      {new Date(order.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ৳{order.total.toLocaleString()} BDT
                    </p>
                    <p className="text-[10px] text-stone-500 font-sans">
                      {language === 'bn' ? `প্রাপকঃ ${order.customerName} (${order.phone})` : `Recipient: ${order.customerName} (${order.phone})`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectOrderToTrack(order.id)}
                    className="bg-amber-400/10 text-amber-455 text-amber-400 border border-amber-400/20 hover:bg-amber-400 hover:text-stone-950 px-3 py-1.5 rounded text-[10px] font-bold uppercase cursor-pointer transition-all"
                  >
                    {language === 'bn' ? 'ট্র্যাক করুন' : 'Track Status'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <ShieldAlert className="w-8 h-8 text-stone-605 mx-auto mb-2 text-stone-600 animate-pulse" />
              <p className="text-xs text-stone-400">
                {language === 'bn' ? 'মেলে নাই! ঐ নামের বা মোবাইল নম্বরের কোনো অর্ডার ডাটাবেজে পাওয়া যায় নাই।' : 'No matches found using the provided search query.'}
              </p>
              <p className="text-[10px] text-stone-500 mt-1">
                {language === 'bn' ? 'দয়া করে সঠিক নম্বরটি পুনরায় চেক করুন (যেমনঃ 017XXXXXXXX)।' : 'Please verify and attempt the search again.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* DEVICE LOGICAL CACHE HISTORY SECTION LIST */}
      {searchMethod === 'id' && !attempted && deviceOrders.length > 0 && (
        <div className="bg-stone-950/70 border border-stone-900 rounded-lg p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-900 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-405 text-amber-400 animate-pulse" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-stone-300">
                {language === 'bn' ? `আপনার সাম্প্রতিক অর্ডারসমূহ (${deviceOrders.length})` : `Your Recent Ordered History (${deviceOrders.length})`}
              </span>
            </div>
            <span className="text-[9px] text-stone-450 text-stone-400 bg-stone-900 px-2.5 py-0.5 rounded uppercase font-semibold">Your Device Cache</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1 animate-fadeIn">
            {deviceOrders.map((order) => (
              <div key={order.id} className="bg-stone-950/40 border border-stone-900 hover:border-amber-400/30 p-3.5 rounded flex justify-between items-center transition-all">
                <div className="space-y-1 text-xs text-stone-300 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 select-all">{order.id}</span>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded leading-none ${
                        order.status === 'Approved' || order.status === 'Delivered' || order.status === 'Confirmed' ? 'bg-emerald-950/40 text-emerald-450 border border-emerald-900/35' :
                        order.status === 'Rejected' || order.status === 'Cancelled' ? 'bg-red-950/40 text-red-400 border border-red-900/35' : 'bg-amber-950/30 text-amber-400 border border-amber-900/30'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 font-sans">
                    {new Date(order.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ৳{order.total.toLocaleString()} BDT
                  </p>
                  <p className="text-[10px] text-stone-500 font-sans">
                    {language === 'bn' ? `প্রাপকঃ ${order.customerName}` : `Bill To: ${order.customerName}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => selectOrderToTrack(order.id)}
                  className="bg-amber-400 text-stone-950 hover:bg-amber-500 px-3.5 py-1.5 rounded text-[10px] font-bold uppercase cursor-pointer transition-all"
                >
                  {language === 'bn' ? 'ট্র্যাক করুন' : 'Track Status'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Track tracking indicators display */}
      {searchMethod === 'id' && attempted && (
        <div className="bg-stone-950 border border-stone-900 rounded-lg p-6 space-y-8 shadow-xl animate-fadeIn">
          {trackedOrder ? (
            <div className="space-y-6">
              
              <div className="flex justify-between items-baseline border-b border-stone-900 pb-3">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold">{language === 'bn' ? 'অর্ডার আইডি রেফারেন্সঃ' : 'Tracking ID:'}</span>
                  <p className="font-mono text-sm font-bold text-amber-400">{trackedOrder.id}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 uppercase font-bold">{language === 'bn' ? 'ডেলিভারি অবস্থাঃ' : 'Order Status:'}</span>
                  <p className={`text-xs font-bold uppercase ${
                    trackedOrder.status === 'Approved' || trackedOrder.status === 'Delivered' || trackedOrder.status === 'Confirmed' ? 'text-emerald-400' :
                    trackedOrder.status === 'Rejected' || trackedOrder.status === 'Cancelled' ? 'text-red-500' : 'text-amber-400'
                  }`}>{trackedOrder.status}</p>
                </div>
              </div>

              {/* Progress milestones dots horizontal map */}
              <div className="relative pt-6 pb-2">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-900 -translate-y-1/2"></div>
                
                {/* Dynamic colored bar */}
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 transition-all duration-500"
                  style={{
                    width: 
                      trackedOrder.status === 'Pending' ? '15%' :
                      ['Approved', 'Confirmed'].includes(trackedOrder.status) ? '45%' :
                      trackedOrder.status === 'Shipped' ? '75%' :
                      trackedOrder.status === 'Delivered' ? '100%' : '0%'
                  }}
                ></div>

                <div className="relative flex justify-between font-sans">
                  <div className="text-center space-y-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mx-auto border ${
                      !['Cancelled', 'Rejected'].includes(trackedOrder.status) ? 'bg-emerald-500 text-stone-950 border-emerald-500' : 'bg-stone-900 text-stone-400 border-stone-850'
                    }`}>১</span>
                    <span className="block text-[9px] uppercase tracking-wider text-stone-400">{language === 'bn' ? 'জমা হয়েছে' : 'Placed'}</span>
                  </div>
                  <div className="text-center space-y-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mx-auto border ${
                      ['Approved', 'Confirmed', 'Shipped', 'Delivered'].includes(trackedOrder.status) ? 'bg-emerald-500 text-stone-950 border-emerald-500' : 'bg-stone-950 text-stone-400 border-stone-900'
                    }`}>২</span>
                    <span className="block text-[9px] uppercase tracking-wider text-stone-400">{language === 'bn' ? 'অনুমোদিত' : 'Approved'}</span>
                  </div>
                  <div className="text-center space-y-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mx-auto border ${
                      ['Shipped', 'Delivered'].includes(trackedOrder.status) ? 'bg-emerald-500 text-stone-950 border-emerald-500' : 'bg-stone-950 text-stone-400 border-stone-900'
                    }`}>৩</span>
                    <span className="block text-[9px] uppercase tracking-wider text-stone-400">{language === 'bn' ? 'কুরিয়ারে' : 'Shipped'}</span>
                  </div>
                  <div className="text-center space-y-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mx-auto border ${
                      trackedOrder.status === 'Delivered' ? 'bg-emerald-500 text-stone-950 border-emerald-500' : 'bg-stone-950 text-stone-400 border-stone-900'
                    }`}>৪</span>
                    <span className="block text-[9px] uppercase tracking-wider text-stone-400">{language === 'bn' ? 'ডেলিভার্ড' : 'Delivered'}</span>
                  </div>
                </div>

              </div>

              {/* Status explanation */}
              <div className="p-4 bg-stone-900/60 rounded border border-stone-900 text-xs text-stone-350 leading-relaxed space-y-2.5 font-sans">
                <p className="font-semibold text-stone-200">
                  {language === 'bn' ? 'অর্ডারের বর্তমান তথ্যমালার বিবরণী (Milestone Status):' : 'Active tracking status details:'}
                </p>
                {trackedOrder.status === 'Pending' && (
                  <p>{language === 'bn' ? ' must-verify-checkout আপনার অর্ডারটি সফলভাবে জমা হয়েছে। আমাদের অ্যাডমিন প্যানেলে এটি বর্তমানে যাচাইকরণ (Verification) এর জন্য অপেক্ষারত রয়েছে।' : 'Your order has been recorded successfully. Our team is presently verifying standard logistics routes.'}</p>
                )}
                {trackedOrder.status === 'Approved' && (
                  <p className="text-emerald-400 font-semibold">{language === 'bn' ? 'আপনার অর্ডারটি অ্যাডমিন কর্তৃক অনুমোদিত (Approved) হয়েছে! খুব শীঘ্রই আমাদের ডেলিভারি টিম আপনার পছন্দের জুয়েলারি পাঠিয়ে দেবে।' : 'Your order is approved. Standard dispatch starts shortly.'}</p>
                )}
                {trackedOrder.status === 'Rejected' && (
                  <p className="text-red-400 font-semibold">{language === 'bn' ? 'দুঃখিত! পেমেন্ট স্ক্রিনশট বা অন্য কোনো তথ্যের অমিলের কারণে আপনার অর্ডারটি বাতিল/প্রত্যাখ্যাত (Rejected) করা হয়েছে। বিস্তারিত জানতে অনুগ্রহ করে যোগাযোগ করুন।' : 'Order was rejected due to checkout validation mismatch.'}</p>
                )}
                {trackedOrder.status === 'Confirmed' && (
                  <p>{language === 'bn' ? 'অর্ডারটি নিশ্চিত হয়েছে। আপনার জুয়েলারি গিফট বক্সে প্যাকড হয়ে শিপিং এর জন্য প্রস্তুত হচ্ছে।' : 'Your order is fully confirmed and is prepared for secure gold foil bubble wrapped logistics boxing.'}</p>
                )}
                {trackedOrder.status === 'Shipped' && (
                  <p>{language === 'bn' ? `প্যাকেজটি কুরিয়ারে দেওয়া হয়েছে। কুরিয়ার ট্র্যাকিং নম্বর: ${trackedOrder.trackingNumber}` : `Your order package is received by our courier partner. Courier tracking identifier ID: ${trackedOrder.trackingNumber}`}</p>
                )}
                {trackedOrder.status === 'Delivered' && (
                  <p className="text-emerald-500 font-semibold">{language === 'bn' ? 'আপনার অর্ডারটি সফলভাবে ডেলিভারি সম্পন্ন হয়েছে! জুয়েলারি উপভোগ করুন।' : 'Your order delivery is fully completed. Thank you for shopping with ARISAN BD.'}</p>
                )}
                {trackedOrder.status === 'Cancelled' && (
                  <p className="text-red-400">{language === 'bn' ? 'আপনার অর্ডারটি বাতিল করা হয়েছে।' : 'Your order was cancelled.'}</p>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-6 animate-fadeIn">
              <ShieldAlert className="w-8 h-8 text-red-500/45 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-stone-300">Order ID Not Found</h4>
              <p className="text-xs text-stone-500 mt-1">Please verify the order code or tracking number. If you just placed an order, try again in a few seconds or contact live WhatsApp hotline.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
