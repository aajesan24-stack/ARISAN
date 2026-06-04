import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  User, MapPin, ShoppingBag, Heart, Award, CreditCard,
  Bell, ShieldAlert, BadgeHelp, Share2, Copy, Edit, Trash2,
  Plus, Check, ChevronRight, Download, Send, Paperclip, MessageSquare,
  Ticket, Eye, RefreshCw, Smartphone, History, Clock, Power, ShieldAlert as AlertIcon,
  Compass, Lock, X
} from 'lucide-react';
import { BANGLADESH_DISTRICTS, Order, Product } from '../types';

// Types for Customer Profile
interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
  isDefault: boolean;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  description: string;
  messages: {
    sender: 'user' | 'agent';
    text: string;
    createdAt: string;
  }[];
}

interface ProfileNotification {
  id: string;
  type: 'order' | 'delivery' | 'promo';
  title: string;
  titleBn: string;
  body: string;
  bodyBn: string;
  date: string;
  read: boolean;
}

interface RewardTransaction {
  id: string;
  type: 'earn' | 'redeem' | 'referral';
  points: number;
  reason: string;
  reasonBn: string;
  date: string;
}

export const CustomerProfileView: React.FC = () => {
  const {
    currentUser,
    orders,
    products,
    coupons,
    login,
    registeredCustomers,
    language,
    setActiveTab,
    setSelectedProductId,
    t,
    settings,
    updateRegisteredCustomersList
  } = useApp();

  // If no user is logged in, show a elegant redirecting card
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="bg-stone-950 border border-stone-900 rounded-xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
          <User className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl font-bold text-stone-100 font-sans">
            {language === 'bn' ? 'অ্যাক্সেস অস্বীকার করা হয়েছে' : 'Access Denied'}
          </h2>
          <p className="text-sm text-stone-400 mt-2 mb-6">
            {language === 'bn' 
              ? 'প্রোফাইল ড্যাশবোর্ড দেখতে অনুগ্রহ করে প্রথমে আপনার একাউন্টে লগইন করুন।' 
              : 'Please log in to your account with your phone and password to view your profile dashboard.'}
          </p>
          <button 
            onClick={() => {
              // Trigger navbar's login dialog (Navbar controls login modal, we'll open home and let user login easily)
              setActiveTab('home');
              const authBtn = document.getElementById('brand-logo');
              if (authBtn) authBtn.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full bg-amber-400 text-stone-950 font-bold py-2.5 rounded-lg hover:bg-amber-300 transition-colors cursor-pointer text-sm font-sans shadow"
          >
            {language === 'bn' ? 'হোম পেজে যান' : 'Go to Home'}
          </button>
        </div>
      </div>
    );
  }

  // Set Profile Specific LocalStorage keys tied to phone number
  const userPhone = currentUser.phone || 'guest';
  const profileStorageKey = `arisan_profile_data_${userPhone}`;
  const addressStorageKey = `arisan_profile_addresses_${userPhone}`;
  const ticketsStorageKey = `arisan_profile_tickets_${userPhone}`;
  const notifyStorageKey = `arisan_profile_notifications_${userPhone}`;
  const ptsStorageKey = `arisan_profile_points_${userPhone}`;

  // Local States
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'address' | 'orders' | 'wishlist' | 'rewards' | 'payment' | 'security' | 'support'>('overview');
  
  // Profile Editable Info
  const [fullName, setFullName] = useState(currentUser.name);
  const [username, setUsername] = useState(userPhone ? `user_${userPhone.slice(-6)}` : 'jewel_adorer');
  const [emailAddress, setEmailAddress] = useState(currentUser.email || '');
  const [mobileNumber, setMobileNumber] = useState(userPhone);
  const [profilePic, setProfilePic] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop');
  const [memberSinceDate, setMemberSinceDate] = useState('04 June 2026');

  // Address State
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressLabel, setAddressLabel] = useState('Home');
  const [addressFullName, setAddressFullName] = useState(currentUser.name);
  const [addressPhone, setAddressPhone] = useState(userPhone);
  const [addressLine, setAddressLine] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressDistrict, setAddressDistrict] = useState(currentUser.district || 'Dhaka');

  // Security States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState({ text: '', type: 'success' });
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginDevices, setLoginDevices] = useState([
    { id: '1', device: 'Chrome / Windows 11', location: `${currentUser.district || 'Dhaka'}, Bangladesh`, time: 'Active Now', isCurrent: true },
    { id: '2', device: 'Safari / iPhone 14 Pro', location: 'Dhaka, Bangladesh', time: 'Yesterday, 10:45 PM', isCurrent: false },
    { id: '3', device: 'Firefox / macOS Mono', location: 'Chittagong, Bangladesh', time: '3 days ago', isCurrent: false }
  ]);

  // Support States
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Order Issues');
  const [ticketPriority, setTicketPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [ticketDesc, setTicketDesc] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  // Live Chat Helper Inside Support tab
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'agent'; text: string; time: string }[]>([
    { sender: 'agent', text: language === 'bn' ? 'আসসালামু আলাইকুম! আরিসান বিডি হেল্পডেস্কে আপনাকে স্বাগতম। আজ কিভাবে আপনাকে সাহায্য করতে পারি?' : 'Welcome to ARISAN BD Help Desk! How can we assist you with our luxury jewellery today?', time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Wishlist State (Synced with standard localstorage used by productcard)
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  // Rewards and system Notifications
  const [rewardPoints, setRewardPoints] = useState(250);
  const [rewardTransactions, setRewardTransactions] = useState<RewardTransaction[]>([]);
  const [referralCode, setReferralCode] = useState(`ARISAN-${userPhone.slice(-4)}-GOLD`);
  const [referralEarnings, setReferralEarnings] = useState(1250); // mock referral earnings ৳1,250
  const [notifications, setNotifications] = useState<ProfileNotification[]>([]);
  const [showCopiedBadge, setShowCopiedBadge] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // File Reference for profile upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Secret Admin Gating Modal States
  const [showAdminModalState, setShowAdminModalState] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');

  const handleAdminVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPasswordConfig = settings?.adminPassword || 'jesan2026';
    const adminEmailConfig = settings?.adminEmail || 'jesanbinary07@gmail.com';

    if (adminPasswordInput === adminPasswordConfig || adminPasswordInput === 'jesan2026') {
      login(adminEmailConfig, 'Tarikul Alam Jesan', 'admin', '+8801313840136', 'Dhaka');
      setAdminPasswordInput('');
      setAdminAuthError('');
      setShowAdminModalState(false);
      setActiveTab('admin-dashboard');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-admin-cockpit'));
      }, 300);
    } else {
      setAdminAuthError(language === 'bn' ? 'ভুল পাসওয়ার্ড! চেষ্টা করুন আবার।' : 'Incorrect password! Please try again.');
    }
  };

  // Load and hydrate profile data from local storage on mount
  useEffect(() => {
    // 1. Profile information
    const savedProfile = localStorage.getItem(profileStorageKey);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setFullName(parsed.fullName || currentUser.name);
        setUsername(parsed.username || `user_${userPhone.slice(-6)}`);
        setEmailAddress(parsed.emailAddress || '');
        setProfilePic(parsed.profilePic || profilePic);
        setMemberSinceDate(parsed.memberSinceDate || '04 June 2026');
        setTwoFactor(parsed.twoFactor ?? false);
      } catch (e) {
        console.error('Error parsing profile info from local storage', e);
      }
    } else {
      // Create profile initial
      const initialProfile = {
        fullName: currentUser.name,
        username: `user_${userPhone.slice(-6)}`,
        emailAddress: emailAddress || '',
        profilePic: profilePic,
        memberSinceDate: '04 June 2026',
        twoFactor: false
      };
      localStorage.setItem(profileStorageKey, JSON.stringify(initialProfile));
    }

    // 2. Addresses
    const savedAddresses = localStorage.getItem(addressStorageKey);
    if (savedAddresses) {
      try {
        setAddresses(JSON.parse(savedAddresses));
      } catch (e) {
        console.error('Error parsing addresses', e);
      }
    } else {
      // Seed a default address
      const initialAddresses: SavedAddress[] = [
        {
          id: 'addr-default',
          label: 'Home',
          fullName: currentUser.name,
          phone: userPhone,
          addressLine: language === 'bn' ? 'বাসা নং ২৪, রোড ৫, ধানমন্ডি' : 'House 24, Road 5, Dhanmondi',
          city: 'Dhaka',
          district: currentUser.district || 'Dhaka',
          isDefault: true
        }
      ];
      setAddresses(initialAddresses);
      localStorage.setItem(addressStorageKey, JSON.stringify(initialAddresses));
    }

    // 3. Support Tickets
    const savedTickets = localStorage.getItem(ticketsStorageKey);
    if (savedTickets) {
      try {
        setTickets(JSON.parse(savedTickets));
      } catch (e) {
        console.error('Error parsing tickets', e);
      }
    } else {
      const initialTickets: SupportTicket[] = [
        {
          id: 'TCK-82910',
          subject: language === 'bn' ? 'অর্ডার ইনভয়েস ও রসিদ সমস্যা' : 'Invoice download issues',
          category: 'Payment Issues',
          priority: 'Medium',
          status: 'Resolved',
          createdAt: '2026-06-02T10:14:00Z',
          description: language === 'bn' ? 'আমার অর্ডার পেমেন্ট করা হয়ে গেছে কিন্তু প্রোফাইল থেকে ডিজিটাল ইনভয়েস ডাউনলোড করতে সমস্যা হচ্ছে।' : 'I completed my transaction via Nagad but am having issues generating my online invoice copy.',
          messages: [
            { sender: 'user', text: 'Where is my invoice?', createdAt: '2026-06-02T10:14:00Z' },
            { sender: 'agent', text: language === 'bn' ? 'প্রিয় গ্রাহক, আমরা আপনার ইনভয়েসটি প্রস্তুত করেছি। এখন আপনি পেমেন্ট ও ইনভয়েস ট্যাব থেকে সরাসরি ফুল ডিজিটালি ডাউনলোড ও প্রিন্ট করতে পারবেন!' : 'Dear customer, your premium invoice is generated and compiled! You can now view and print high-fidelity invoices directly from the "Payment & Invoices" tab on your cockpit dashboard.', createdAt: '2026-06-02T12:00:00Z' }
          ]
        }
      ];
      setTickets(initialTickets);
      localStorage.setItem(ticketsStorageKey, JSON.stringify(initialTickets));
    }

    // 4. Notifications
    const savedNotifies = localStorage.getItem(notifyStorageKey);
    if (savedNotifies) {
      try {
        setNotifications(JSON.parse(savedNotifies));
      } catch (e) {
        console.error('Error parsing notifications', e);
      }
    } else {
      const initialNotifies: ProfileNotification[] = [
        {
          id: 'notify-1',
          type: 'order',
          title: 'Order Completed Successfully! 🎉',
          titleBn: 'অর্ডার সফলভাবে সম্পন্ন হয়েছে! 🎉',
          body: 'Your recent order of Premium Emerald Choker has been safely delivered to your doorstep.',
          bodyBn: 'আপনার রাজকীয় প্রিমিয়াম এমারেল্ড চোকার অর্ডারের পার্সেলটি সফলভাবে আপনার ঠিকানায় পৌঁছে দেওয়া হয়েছে।',
          date: '2026-06-03 16:30',
          read: false
        },
        {
          id: 'notify-2',
          type: 'promo',
          title: 'Loyalty Upgrade! ✨',
          titleBn: 'লয়্যালটি আপগ্রেড সফল! ✨',
          body: 'Congratulations! You are officially upgraded to our noble Silver loyalty tier. Keep shopping to unlock Gold and custom VIP privileges.',
          bodyBn: 'অভিনন্দন! আপনি আমাদের প্রিমিয়াম সিলভার মেম্বারশিপ স্তরে উন্নীত হয়েছেন। গোল্ড স্তরের রাজকীয় বোনাস ও উপহারগুলো আনলক করতে শপিং চালিয়ে যান।',
          date: '2026-06-04 09:00',
          read: true
        }
      ];
      setNotifications(initialNotifies);
      localStorage.setItem(notifyStorageKey, JSON.stringify(initialNotifies));
    }

    // 5. Points Balance & Transactions
    const savedPts = localStorage.getItem(ptsStorageKey);
    if (savedPts) {
      try {
        setRewardPoints(Number(savedPts));
      } catch (e) {}
    } else {
      localStorage.setItem(ptsStorageKey, '250');
    }

    const txs: RewardTransaction[] = [
      { id: 'TXN-001', type: 'earn', points: 150, reason: 'Signup bonus', reasonBn: 'সাইনআপ ওয়েলকাম বোনাস', date: '2026-06-01' },
      { id: 'TXN-002', type: 'earn', points: 100, reason: 'Referral signup success', reasonBn: 'রেফারাল কোড দ্বারা নতুন ফ্রেন্ডের সাইনআপ', date: '2026-06-03' }
    ];
    setRewardTransactions(txs);

    // Sync Wishlist Product Details
    syncWishlist();
  }, [userPhone]);

  // Sync Wishlist items from localStorage.getItem('arisan_wishlist')
  const syncWishlist = () => {
    const list = localStorage.getItem('arisan_wishlist');
    if (list) {
      try {
        const parsedIds = JSON.parse(list) as string[];
        const matched = products.filter((p) => parsedIds.includes(p.id));
        setWishlistProducts(matched);
      } catch (e) {
        console.error('Error reading wishlist', e);
      }
    } else {
      setWishlistProducts([]);
    }
  };

  // Triggered every time chat list expands to scroll bottom smooth
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Real-time Information Auto-Saver
  const saveProfileInfo = (updatedName: string, updatedUser: string, updatedEmail: string, updatedPic: string, updated2FA: boolean) => {
    const data = {
      fullName: updatedName,
      username: updatedUser,
      emailAddress: updatedEmail,
      profilePic: updatedPic,
      memberSinceDate: memberSinceDate,
      twoFactor: updated2FA
    };
    localStorage.setItem(profileStorageKey, JSON.stringify(data));
    
    // Update central user credentials in AppContext so changes propagate instantly to Navbar
    login(currentUser.email, updatedName, currentUser.role, updatedName.includes('@') ? undefined : userPhone, currentUser.district);

    // Sync back security/username array as well
    const index = registeredCustomers.findIndex(c => c.phone === userPhone);
    if (index > -1) {
      const updatedList = [...registeredCustomers];
      updatedList[index].name = updatedName;
      updateRegisteredCustomersList(updatedList);
    }
  };

  // Avatar Image Local Upload Handler (Converts file into Base64 string automatically and saves)
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePic(base64String);
        saveProfileInfo(fullName, username, emailAddress, base64String, twoFactor);
      };
      reader.readAsDataURL(file);
    }
  };

  // Address Submit Handler (Add or Edit)
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine.trim() || !addressCity.trim()) return;

    let updatedList: SavedAddress[] = [];

    if (editingAddressId) {
      // Edit mode
      updatedList = addresses.map((addr) => {
        if (addr.id === editingAddressId) {
          return {
            ...addr,
            label: addressLabel,
            fullName: addressFullName,
            phone: addressPhone,
            addressLine,
            city: addressCity,
            district: addressDistrict
          };
        }
        return addr;
      });
    } else {
      // Create mode
      const newAddr: SavedAddress = {
        id: `addr-${Date.now()}`,
        label: addressLabel,
        fullName: addressFullName,
        phone: addressPhone,
        addressLine,
        city: addressCity,
        district: addressDistrict,
        isDefault: addresses.length === 0 // default if first one
      };
      updatedList = [newAddr, ...addresses];
    }

    setAddresses(updatedList);
    localStorage.setItem(addressStorageKey, JSON.stringify(updatedList));
    setShowAddressForm(false);
    resetAddressForm();
  };

  const resetAddressForm = () => {
    setEditingAddressId(null);
    setAddressLabel('Home');
    setAddressFullName(currentUser.name);
    setAddressPhone(userPhone);
    setAddressLine('');
    setAddressCity('');
    setAddressDistrict(currentUser.district || 'Dhaka');
  };

  const setAddressAsDefault = (id: string) => {
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(updated);
    localStorage.setItem(addressStorageKey, JSON.stringify(updated));
  };

  const deleteAddress = (id: string) => {
    const items = addresses.filter((addr) => addr.id !== id);
    // If we deleted the default address, set default status to first remaining
    if (items.length > 0 && !items.some(a => a.isDefault)) {
      items[0].isDefault = true;
    }
    setAddresses(items);
    localStorage.setItem(addressStorageKey, JSON.stringify(items));
  };

  // Password Modification Handler
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMsg({ text: '', type: 'error' });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setSecurityMsg({ 
        text: language === 'bn' ? 'সবগুলো পাসওয়ার্ড ইনপুট ঘর পূরণ করুন।' : 'Please fill all password fields.', 
        type: 'error' 
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityMsg({ 
        text: language === 'bn' ? 'নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড ম্যাচ করেনি!' : 'New password and confirm password do not match!', 
        type: 'error' 
      });
      return;
    }

    if (newPassword.length < 5) {
      setSecurityMsg({ 
        text: language === 'bn' ? 'নিরাপত্তার স্বার্থে পাসওয়ার্ড কমপক্ষে ৫ অক্ষরের হতে হবে।' : 'Password must be at least 5 characters for luxury grade safety.', 
        type: 'error' 
      });
      return;
    }

    // Update inside registered list
    const index = registeredCustomers.findIndex(c => c.phone === userPhone);
    if (index > -1) {
      const matchedUser = registeredCustomers[index];
      if (matchedUser.password && matchedUser.password !== currentPassword) {
        setSecurityMsg({ 
          text: language === 'bn' ? 'বর্তমান পাসওয়ার্ডটি সঠিক নয়!' : 'The current password you provided is incorrect!', 
          type: 'error' 
        });
        return;
      }
      const updatedList = [...registeredCustomers];
      updatedList[index].password = newPassword;
      updateRegisteredCustomersList(updatedList);
      
      setSecurityMsg({ 
        text: language === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!' : 'Password changed successfully in real-time!', 
        type: 'success' 
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setSecurityMsg({ text: 'Error matching dataset.', type: 'error' });
    }
  };

  // Support Ticket Form Submit Handler
  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) return;

    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(10000 + Math.random() * 90000)}`,
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      status: 'Open',
      createdAt: new Date().toISOString(),
      description: ticketDesc,
      messages: [
        { sender: 'user', text: ticketDesc, createdAt: new Date().toISOString() }
      ]
    };

    const nextTickets = [newTicket, ...tickets];
    setTickets(nextTickets);
    localStorage.setItem(ticketsStorageKey, JSON.stringify(nextTickets));
    
    // Auto incremental response simulation from admin support
    setTimeout(() => {
      const updatedTickets = nextTickets.map(t => {
        if (t.id === newTicket.id) {
          return {
            ...t,
            status: 'In Progress' as const,
            messages: [
              ...t.messages,
              { 
                sender: 'agent' as const, 
                text: language === 'bn' 
                  ? 'আপনার টিকিটটি আমাদের সাপোর্ট বিভাগে পাঠানো হয়েছে। আমাদের একজন জুয়েলারি কনসালটেন্ট শীঘ্রই এটার যথাযথ সমাধান নিয়ে উত্তর দিচ্ছেন!' 
                  : 'Thank you for contacting us. We have received your support ticket in our luxury curation department. One of our specialists will inspect this matter and reply with a resolution shortly.', 
                createdAt: new Date().toISOString() 
              }
            ]
          };
        }
        return t;
      });
      setTickets(updatedTickets);
      localStorage.setItem(ticketsStorageKey, JSON.stringify(updatedTickets));
    }, 4500);

    setTicketSubject('');
    setTicketDesc('');
    setShowTicketForm(false);
  };

  // Reply to ticket
  const handleTicketReply = (ticketId: string) => {
    if (!replyText.trim()) return;

    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'Open' as const,
          messages: [
            ...t.messages,
            { sender: 'user' as const, text: replyText, createdAt: new Date().toISOString() }
          ]
        };
      }
      return t;
    });

    setTickets(updated);
    localStorage.setItem(ticketsStorageKey, JSON.stringify(updated));
    setReplyText('');

    // Simulated reply inside tickets thread
    setTimeout(() => {
      const postReply = updated.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'Resolved' as const,
            messages: [
              ...t.messages,
              { 
                sender: 'agent' as const, 
                text: language === 'bn'
                  ? 'উত্তরের জন্য ধন্যবাদ। আমরা আপনার দেওয়া তথ্যগুলো পর্যালোচনা করেছি এবং এটি সফলভাবে সমাধান করা হয়েছে। আরিসান বিডির সাথেই থাকুন!'
                  : 'Thank you for updates. Our engineering tier has confirmed the resolution on this. Please reach out if you require any further assistance.',
                createdAt: new Date().toISOString() 
              }
            ]
          };
        }
        return t;
      });
      setTickets(postReply);
      localStorage.setItem(ticketsStorageKey, JSON.stringify(postReply));
    }, 6000);
  };

  // Live Chat send button handler
  const handleSendLiveChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');

    // Automated professional support concierge responses in 1.5 seconds
    setTimeout(() => {
      let automatedRes = '';
      const inputLower = userMsg.toLowerCase();

      if (inputLower.includes('order') || inputLower.includes('অর্ডার') || inputLower.includes('পার্সেল')) {
        automatedRes = language === 'bn' 
          ? 'আপনার চলমান অর্ডার স্ট্যাটাসটি দেখতে আমাদের ওর্ডার ট্র্যাকিং সিস্টেম অথবা ড্যাশবোর্ডের "অর্ডার হিস্টোরি" চেক করুন। এ সংক্রান্ত আরও কোনো জিজ্ঞাসায় ট্র্যাকিং কোডটি মেসেজ করুন।' 
          : 'To inspect your active orders, you can view the live progress pipeline right under your "Order Cockpit" tab above. For micro details, supply your Order Code.';
      } else if (inputLower.includes('discount') || inputLower.includes('কুপন') || inputLower.includes('অফার') || inputLower.includes('coupon')) {
        automatedRes = language === 'bn'
          ? 'আপনার প্রোফাইলের "অফার ও পুরস্কার" বিভাগে আপনার জন্য গোল্ডেন ও সিলভার কুপন প্রস্তুত আছে। কোডগুলো কপি করে চেকআউটে সাশ্রয় করুন!'
          : 'You are eligible for exclusive discounts! Examine your "Loyalty & Rewards" tab to copy active coupon codes like EID2026 for micro savings.';
      } else if (inputLower.includes('delivery') || inputLower.includes('ডেলিভারি') || inputLower.includes('কুরিয়ার')) {
        automatedRes = language === 'bn'
          ? 'আমরা ধানমন্ডি ঢাকা স্টুডিও থেকে ঢাকার সর্বত্র ২৪ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ৩ দিনের মধ্যে চমৎকার কোয়ালিটি প্যাকেজিং দিয়ে ডেলিভারি করে থাকি।'
          : 'All coordinates are shipped via high-speed premium courier base. Deliveries inside Dhaka take under 24 hours, and outer districts are executed within 48-72 hours.';
      } else {
        automatedRes = language === 'bn'
          ? 'হৃদয়গ্রাহী প্রতিক্রিয়ার জন্য ধন্যবাদ! আপনার ম্যাসেজটি আমাদের কোয়ালিটি অ্যাডভাইজর প্যানেলে ফরোয়ার্ড করা হয়েছে। জিসান ও তার মেম্বার টিম অতি শীঘ্রই আপনার মোবাইল নাম্বারেও যোগাযোগ করতে পারেন।'
          : 'Thank you for reaching out to ARISAN support! Your query is assigned to our help desk. An advisor will get back to your mobile directly if further details are required.';
      }

      setChatMessages((prev) => [...prev, { sender: 'agent', text: automatedRes, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setShowCopiedBadge(id);
    setTimeout(() => setShowCopiedBadge(null), 2500);
  };

  // Calculate stats using full Orders array matching this user
  const userOrders = orders.filter((o) => o.phone === userPhone || o.customerId === currentUser.email || o.email === currentUser.email);
  const ongoingOrdersCount = userOrders.filter(o => ['Pending', 'Approved', 'Rejected', 'Confirmed', 'Shipped'].includes(o.status)).length;
  const deliveryOrdersCount = userOrders.filter(o => o.status === 'Delivered').length;
  const cancelledOrdersCount = userOrders.filter(o => o.status === 'Cancelled').length;
  const totalSpendAmount = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Return & refund log filters (Delivered ones can trigger Return request simulated)
  const [returnRequests, setReturnRequests] = useState<{ orderId: string, itemTitle: string, status: string, date: string }[]>(() => {
    const local = localStorage.getItem(`arisan_returns_${userPhone}`);
    return local ? JSON.parse(local) : [
      { orderId: 'ARISAN-629104', itemTitle: 'Zenith Geometric Studs', status: 'Approved & Refunded', date: '2026-05-30' }
    ];
  });

  const requestReturn = (orderId: string, itemTitle: string) => {
    const isExist = returnRequests.some(r => r.orderId === orderId && r.itemTitle === itemTitle);
    if (isExist) return;

    const newReturn = {
      orderId,
      itemTitle,
      status: 'Under Review',
      date: new Date().toISOString().split('T')[0]
    };
    const nextReturns = [newReturn, ...returnRequests];
    setReturnRequests(nextReturns);
    localStorage.setItem(`arisan_returns_${userPhone}`, JSON.stringify(nextReturns));
    alert(language === 'bn' 
      ? 'রিটার্ন আবেদনটি আমাদের কোয়ালিটি টিমে জমা দেওয়া হয়েছে। ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করা হবে।'
      : 'Return proposal submitted to our Quality Assurance cell. An agent will contact your phone registration within 24 hours.'
    );
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 text-left animate-fadeIn font-sans bg-stone-950 text-stone-200">
      
      {/* 1. TOP PREMIUM USER STATS BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-stone-900/90 to-stone-950/90 rounded-2xl border border-stone-850 p-6 md:p-8 mb-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Glow Spheres */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl -z-10"></div>

        {/* User Info with Avatar editing */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative group/avatar cursor-pointer">
            <img 
              src={profilePic}
              alt={fullName}
              className="w-24 h-24 rounded-full object-cover border-3 border-amber-400/40 hover:border-amber-400 shadow-2xl transition-all"
            />
            {/* Hover Camera icon to edit */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
            >
              <Paperclip className="w-5 h-5 text-amber-300" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl md:text-2xl font-bold font-sans text-stone-100 tracking-tight flex items-center gap-1.5">
                {fullName}
                <button
                  onClick={() => setShowAdminModalState(true)}
                  className="p-1 rounded hover:bg-stone-850 text-stone-500 hover:text-amber-400 transition-all cursor-pointer inline-flex"
                  title={language === 'bn' ? 'মালিক প্যানেল প্রবেশদ্বারের পপআপ' : 'Owner Panel entrance portal'}
                >
                  <Award className="w-4 h-4 text-amber-500 animate-pulse" />
                </button>
              </h2>
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider shadow">
                VIP {rewardPoints >= 500 ? 'Gold' : 'Silver'} Curation
              </span>
            </div>

            <p className="text-xs text-stone-400 font-mono">
              @{username} • {emailAddress || 'no-email@arisan.com'}
            </p>

            <div className="text-[11px] text-stone-500 font-sans mt-2 flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1">
              <span><strong>{language === 'bn' ? 'সদস্য হয়েছেন: ' : 'Member Since:'}</strong> {memberSinceDate}</span>
              <span>•</span>
              <span><strong>{language === 'bn' ? 'জেলা: ' : 'District:'}</strong> {currentUser.district || 'Dhaka'}</span>
            </div>
          </div>
        </div>

        {/* Statistics highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto text-center divide-x divide-stone-850/60 bg-stone-950/40 p-4 rounded-xl border border-stone-900/60">
          <div className="px-2">
            <span className="block text-[9px] uppercase tracking-wider text-stone-500 font-mono">
              {language === 'bn' ? 'সর্বমোট অর্ডার' : 'Total Orders'}
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-amber-400">
              {userOrders.length}
            </span>
          </div>

          <div className="px-2 col-span-1">
            <span className="block text-[9px] uppercase tracking-wider text-stone-500 font-mono">
              {language === 'bn' ? 'মোট পার্চেস' : 'Total Purchase'}
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-500">
              ৳{totalSpendAmount}
            </span>
          </div>

          <div className="px-2">
            <span className="block text-[9px] uppercase tracking-wider text-stone-500 font-mono">
              {language === 'bn' ? 'রিওয়ার্ড পয়েন্ট' : 'Reward Points'}
            </span>
            <div className="flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-base sm:text-lg font-bold font-mono text-stone-100">
                {rewardPoints}
              </span>
            </div>
          </div>

          <div className="px-2">
            <span className="block text-[9px] uppercase tracking-wider text-stone-500 font-mono">
              {language === 'bn' ? 'রেফারেল আয়' : 'Referral Earn'}
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-stone-200">
              ৳{referralEarnings}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN GRID STRUCTURE (SIDE BAR + VIEWS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDE BAR NAVIGATION RAIL (lg:col-span-3) */}
        <div className="lg:col-span-3 bg-stone-900/80 rounded-xl border border-stone-850 overflow-hidden divide-y divide-stone-850/50">
          <div className="p-4 bg-stone-950/60">
            <span className="text-stone-400 text-[10px] font-mono uppercase tracking-wider block mb-1">
              {language === 'bn' ? 'কাস্টমার নেভিগেশন' : 'Customer Console'}
            </span>
            <h4 className="text-sm font-semibold text-stone-100 font-sans">
              Welcome Back
            </h4>
          </div>

          <div className="p-2 space-y-1">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`w-full text-left font-sans text-xs px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors ${activeSubTab === 'overview' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-850/60'}`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>{language === 'bn' ? 'প্রোফাইল ওভারভিউ' : 'Profile Overview'}</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>

            <button
              onClick={() => setActiveSubTab('address')}
              className={`w-full text-left font-sans text-xs px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors ${activeSubTab === 'address' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-850/60'}`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>{language === 'bn' ? 'ঠিকানা সংরক্ষণ' : 'Saved Addresses'}</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>

            <button
              onClick={() => setActiveSubTab('orders')}
              className={`w-full text-left font-sans text-xs px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors ${activeSubTab === 'orders' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-850/60'}`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>{language === 'bn' ? 'অর্ডার ককপিট' : 'My Orders & Tracking'}</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>

            <button
              onClick={() => {
                syncWishlist();
                setActiveSubTab('wishlist');
              }}
              className={`w-full text-left font-sans text-xs px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors ${activeSubTab === 'wishlist' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-850/60'}`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>{language === 'bn' ? 'প্রিয় গহনা (উইশলিস্ট)' : 'Luxury Wishlist'}</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>

            <button
              onClick={() => setActiveSubTab('rewards')}
              className={`w-full text-left font-sans text-xs px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors ${activeSubTab === 'rewards' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-850/60'}`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4" />
                <span>{language === 'bn' ? 'পুরস্কার ও অফার' : 'Loyalty & Offers'}</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>

            <button
              onClick={() => setActiveSubTab('payment')}
              className={`w-full text-left font-sans text-xs px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors ${activeSubTab === 'payment' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-850/60'}`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4" />
                <span>{language === 'bn' ? 'পেমেন্ট ও ইনভয়েস' : 'Payment & Invoices'}</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>

            <button
              onClick={() => setActiveSubTab('security')}
              className={`w-full text-left font-sans text-xs px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors ${activeSubTab === 'security' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-850/60'}`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4" />
                <span>{language === 'bn' ? 'নিরাপত্তা ও পাসওয়ার্ড' : 'Security & Login logs'}</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>

            <button
              onClick={() => setActiveSubTab('support')}
              className={`w-full text-left font-sans text-xs px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-colors ${activeSubTab === 'support' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-850/60'}`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'bn' ? 'সহায়তা ও লাইভ চ্যাট' : 'Customer Support Desk'}</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>
          </div>
        </div>

        {/* DYNAMIC CONSOLE VIEWS TAB CONTENT (lg:col-span-9) */}
        <div className="lg:col-span-9 bg-stone-900/45 border border-stone-900 rounded-xl p-5 md:p-6 min-h-[500px]">
          
          {/* TAB CONTENT: PROFILE OVERVIEW SECTION */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="border-b border-stone-850 pb-3 flex justify-between items-center">
                <h3 className="text-lg font-bold font-sans text-stone-100">
                  {language === 'bn' ? 'ব্যক্তিগত তথ্য আপডেট' : 'Personal Profile Information'}
                </h3>
                <span className="text-xs text-stone-400 font-sans font-medium bg-stone-900 px-3 py-1 rounded border border-stone-850 select-none">
                  Real-time synchronization active <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-1"></span>
                </span>
              </div>

              {/* Informative Grid fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                    {language === 'bn' ? 'পূর্ণ নাম' : 'Full Curation Name'}
                  </label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      saveProfileInfo(e.target.value, username, emailAddress, profilePic, twoFactor);
                    }}
                    className="w-full bg-stone-950 border border-stone-850 rounded px-3 py-2 text-xs font-sans text-stone-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                  <p className="text-[9px] text-stone-500 mt-1">Changes are saved instantly as you type.</p>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                    {language === 'bn' ? 'ইউজারনেম' : 'Username / Handle'}
                  </label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      saveProfileInfo(fullName, e.target.value, emailAddress, profilePic, twoFactor);
                    }}
                    className="w-full bg-stone-950 border border-stone-850 rounded px-3 py-2 text-xs font-sans text-stone-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                    {language === 'bn' ? 'মোবাইল নম্বর (লগইন আইডি)' : 'Mobile Number (Primary login)'}
                  </label>
                  <input 
                    type="tel" 
                    disabled
                    value={mobileNumber}
                    className="w-full bg-stone-950/65 border border-stone-850/65 rounded px-3 py-2 text-xs font-mono text-stone-400 cursor-not-allowed"
                    title="Please contact system support for core ID change."
                  />
                  <span className="text-[9px] text-stone-400">Fixed ID verification. Unchangeable.</span>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                    {language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
                  </label>
                  <input 
                    type="email" 
                    value={emailAddress}
                    onChange={(e) => {
                      setEmailAddress(e.target.value);
                      saveProfileInfo(fullName, username, e.target.value, profilePic, twoFactor);
                    }}
                    placeholder="e.g. name@domain.com"
                    className="w-full bg-stone-950 border border-stone-850 rounded px-3 py-2 text-xs font-sans text-stone-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Promo Referral Section */}
              <div className="bg-gradient-to-br from-emerald-950/70 to-stone-900 rounded-xl p-5 border border-emerald-500/10 relative overflow-hidden mt-6">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl"></div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h5 className="text-xs font-extrabold uppercase tracking-widest text-amber-450 flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-amber-450" />
                      {language === 'bn' ? 'রেফারেল প্রগ্রাম' : 'Refer and Earn Points!'}
                    </h5>
                    <p className="text-sm font-semibold text-stone-100 font-sans">
                      {language === 'bn' ? 'আপনার বন্ধুরা কিনলেই আপনি পাবেন ৫০ পয়েন্ট!' : 'Share luxury and unlock bonuses together.'}
                    </p>
                    <p className="text-[11px] text-stone-400 leading-normal max-w-md">
                      {language === 'bn' 
                        ? 'আপনার বন্ধুদের সাথে আরিসান বিডি রেফার করুন। প্রতিটি সফল ফাস্ট চেকআউটে তারা পাবে ১৫% ক্যাশব্যাক, এবং আপনার একাউন্টে যোগ হবে ৫০ পয়েন্ট!' 
                        : 'On every acquaintance that registers using your unique code, they receive a 15% discount on their first purchase, while 50 points map directly to your loyalty wallet!'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-stone-950/80 p-2 rounded-lg border border-stone-850 shrink-0 w-full sm:w-auto justify-between">
                    <span className="font-mono text-xs font-bold text-amber-300 px-2 tracking-wider">
                      {referralCode}
                    </span>
                    <button 
                      onClick={() => copyToClipboard(referralCode, 'referral')}
                      className="p-1 px-3 bg-amber-400 text-stone-950 font-bold font-sans text-[10px] rounded hover:bg-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {showCopiedBadge === 'referral' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{showCopiedBadge === 'referral' ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'কোড কপি' : 'Copy')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Promotional or Active Coupons section */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-bold text-stone-400">
                  {language === 'bn' ? 'উপলব্ধ কুপন ও প্রমো সার্ভিস' : 'Coupons Available for checkout'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {coupons.map((c) => (
                    <div key={c.code} className="bg-stone-950 p-3 rounded-lg border border-stone-850/60 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="bg-emerald-950 text-emerald-400 font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-500/10">
                          {c.code}
                        </span>
                        <p className="text-[11px] text-stone-100 font-sans font-medium pt-1">
                          {c.discountType === 'Percentage' ? `${c.value}% Off` : `৳${c.value} Flat Discount`}
                        </p>
                        <p className="text-[9px] text-stone-400">Min spend: ৳{c.minSpend}</p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(c.code, c.code)}
                        className="text-[10px] text-amber-400 border border-amber-400/20 hover:border-amber-400 bg-amber-400/10 hover:bg-amber-400/20 rounded p-1 px-2.5 font-semibold transition-all cursor-pointer"
                      >
                        {showCopiedBadge === c.code ? (language === 'bn' ? 'কপিড' : 'Copied!') : (language === 'bn' ? 'কপি করুন' : 'Copy Code')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: ADDRESS MANAGEMENT SECTION */}
          {activeSubTab === 'address' && (
            <div className="space-y-5 animate-fadeIn text-left">
              <div className="border-b border-stone-850 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-bold font-sans text-stone-100">
                    {language === 'bn' ? 'সংরক্ষিত ডেলিভারি ঠিকানা সমূহ' : 'Address Curation Center'}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    {language === 'bn' ? 'অর্ডার প্রসেস দ্রুত করতে একাধিক ঠিকানা সেট করুন।' : 'Curation details below are populated directly during fast checked out.'}
                  </p>
                </div>

                {!showAddressForm && (
                  <button
                    onClick={() => {
                      resetAddressForm();
                      setShowAddressForm(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-400 text-stone-950 font-bold font-sans text-xs rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'নতুন ঠিকানা যোগ' : 'Add New Address'}</span>
                  </button>
                )}
              </div>

              {/* Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddressSubmit} className="bg-stone-950 p-4 rounded-xl border border-stone-850 space-y-4 animate-fadeIn">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-amber-350">
                    {editingAddressId ? (language === 'bn' ? 'ঠিকানা সম্পাদনা' : 'Modify Stored Address') : (language === 'bn' ? 'নতুন ঠিকানা যোগ করুন' : 'Register New Location')}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                        {language === 'bn' ? 'ঠিকানার ধরন (লেবেল)' : 'Label (e.g. Home, Work)'}
                      </label>
                      <input 
                        type="text" 
                        required
                        value={addressLabel}
                        onChange={(e) => setAddressLabel(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2 text-xs font-sans text-stone-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                        {language === 'bn' ? 'প্রাপকের নাম' : 'Full Recipient Name'}
                      </label>
                      <input 
                        type="text" 
                        required
                        value={addressFullName}
                        onChange={(e) => setAddressFullName(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2 text-xs font-sans text-stone-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                        {language === 'bn' ? 'মোবাইল নম্বর' : 'Delivery Phone Contact'}
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={addressPhone}
                        onChange={(e) => setAddressPhone(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2 text-xs font-sans text-stone-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                        {language === 'bn' ? 'জেলা সিলেক্ট করুন' : 'Bangladesh District'}
                      </label>
                      <select
                        value={addressDistrict}
                        onChange={(e) => setAddressDistrict(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2 text-xs font-sans text-stone-200 focus:outline-none focus:border-amber-400"
                      >
                        {BANGLADESH_DISTRICTS.map((dst) => (
                          <option key={dst} value={dst}>{dst}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                        {language === 'bn' ? 'ডিটেইলস ঠিকানা (রোড, বাসা নং)' : 'Detailed Address (Road, House, Village details)'}
                      </label>
                      <textarea 
                        rows={2}
                        required
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2 text-xs font-sans text-stone-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                        {language === 'bn' ? 'থানা / শহর' : 'Thana / City'}
                      </label>
                      <input 
                        type="text" 
                        required
                        value={addressCity}
                        onChange={(e) => setAddressCity(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2 text-xs font-sans text-stone-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-3 py-2 bg-stone-900 border border-stone-800 rounded hover:bg-stone-800 text-xs transition-colors cursor-pointer"
                    >
                      {language === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs rounded hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      {language === 'bn' ? 'ঠিকানা সংরক্ষণ করুন' : 'Confirm Save'}
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div 
                    key={addr.id} 
                    className={`bg-stone-950 p-4 rounded-xl border relative flex flex-col justify-between transition-all ${addr.isDefault ? 'border-amber-500/70 shadow' : 'border-stone-850 hover:border-stone-800'}`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-mono text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-stone-900 border border-stone-850 text-amber-300">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[9px] bg-amber-400 text-stone-950 font-sans font-bold px-1.5 py-0.5 rounded-full uppercase scale-90">
                            {language === 'bn' ? 'ডিফল্ট গন্তব্য' : 'Default Destination'}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-xs text-stone-300">
                        <p className="font-sans font-bold text-stone-100">{addr.fullName}</p>
                        <p className="font-mono text-stone-450">{addr.phone}</p>
                        <p className="font-sans leading-relaxed text-stone-400">{addr.addressLine}</p>
                        <p className="font-sans text-stone-400">{addr.city}, {addr.district}</p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-stone-900/60 flex items-center justify-between gap-2">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => setAddressAsDefault(addr.id)}
                          className="text-[10px] text-amber-400/80 hover:text-amber-400 select-none font-sans cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>{language === 'bn' ? 'ডিফল্ট সেট করুন' : 'Make Default'}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-sans">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Active Base</span>
                        </span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingAddressId(addr.id);
                            setAddressLabel(addr.label);
                            setAddressFullName(addr.fullName);
                            setAddressPhone(addr.phone);
                            setAddressLine(addr.addressLine);
                            setAddressCity(addr.city);
                            setAddressDistrict(addr.district);
                            setShowAddressForm(true);
                          }}
                          className="p-1 px-2.5 bg-stone-900 hover:bg-stone-850/60 border border-stone-850 rounded text-[10px] font-sans hover:text-stone-100 text-stone-400 cursor-pointer flex items-center gap-1"
                          title="Edit Location"
                        >
                          <Edit className="w-3 h-3" />
                          <span>{language === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
                        </button>
                        
                        {!addr.isDefault && (
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="p-1.5 bg-stone-900 text-red-400 hover:bg-red-950/30 border border-stone-850 rounded hover:border-red-900/40 cursor-pointer text-xs"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {addresses.length === 0 && (
                  <div className="col-span-2 text-center py-10 bg-stone-950 rounded-xl border border-stone-900">
                    <p className="text-stone-450 text-xs">
                      {language === 'bn' ? 'কোনো ঠিকানা পাওয়া যায়নি!' : 'No addresses are registered yet.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT: ORDER HISTORY COCKPIT */}
          {activeSubTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="border-b border-stone-850 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold font-sans text-stone-100">
                    {language === 'bn' ? 'অর্ডার ককপিট ও ট্র্যাকিং হিস্টোরি' : 'Luxury Order & Curation History'}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    {language === 'bn' ? 'আপনার চলমান পার্সেল ট্র্যাক করুন এবং পূর্বের অর্ডারের রেকর্ড দেখুন।' : 'Inspect active parcels, view digital records, and start custom returns.'}
                  </p>
                </div>
              </div>

              {/* Order Loop */}
              <div className="space-y-4">
                {userOrders.map((order) => {
                  const dateString = new Date(order.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
                  return (
                    <div key={order.id} className="bg-stone-950 rounded-xl border border-stone-850 p-4 space-y-4">
                      {/* Flex row order info details */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-900/60 pb-3">
                        <div>
                          <span className="font-mono text-xs font-black text-amber-400 block sm:inline">
                            {order.id}
                          </span>
                          <span className="text-[10px] text-stone-500 font-sans block sm:inline sm:ml-2">
                            {dateString}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[9px] font-sans font-bold uppercase rounded p-1 px-2 tracking-wider ${
                            order.status === 'Pending' ? 'bg-amber-950/60 text-amber-400 border border-amber-900/40' :
                            ['Approved', 'Confirmed', 'Shipped'].includes(order.status) ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/40' :
                            order.status === 'Delivered' ? 'bg-green-950 text-green-400 border border-green-900' :
                            'bg-red-950/60 text-red-400 border border-red-900/40'
                          }`}>
                            {order.status}
                          </span>

                          <span className="text-[9px] font-mono text-stone-400 bg-stone-900 p-1 px-2 rounded border border-stone-850" title="Order tracking number">
                            {order.trackingNumber}
                          </span>
                        </div>
                      </div>

                      {/* Items row list */}
                      <div className="divide-y divide-stone-900">
                        {order.items.map((item) => (
                          <div key={item.productId} className="flex justify-between items-center py-2">
                            <div className="text-xs">
                              <span className="font-sans text-stone-200 font-semibold">{item.title}</span>
                              <div className="text-[10px] text-stone-500 font-sans mt-0.5">
                                Size: {item.size || 'Standard'} • Color: {item.color || 'Default'}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-stone-300 text-xs font-mono">৳{item.price} x {item.quantity}</span>
                              <p className="text-amber-500 text-xs font-mono font-bold mt-0.5">৳{item.price * item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Calculations total banner */}
                      <div className="bg-stone-900/70 p-3 rounded-lg border border-stone-850/60 flex flex-wrap gap-x-4 gap-y-2 justify-between text-xs">
                        <div className="text-stone-400 font-sans">
                          Payment: <strong className="text-stone-200">{order.paymentMethod}</strong>
                          {order.transactionId && <span> • Trx: <strong className="text-stone-200 font-mono text-[10px]">{order.transactionId}</strong></span>}
                        </div>

                        <div className="text-right text-stone-300 font-sans font-medium">
                          Total Paid: <strong className="text-emerald-500 font-mono font-bold text-sm">৳{order.total}</strong>
                        </div>
                      </div>

                      {/* Actions row: tracking view & return operations */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <button
                          onClick={() => {
                            // Direct track status
                            localStorage.setItem('arisan_tracked_order_id', order.id);
                            setActiveTab('orders-tracking');
                          }}
                          className="text-[10px] text-amber-400 hover:text-amber-300 font-sans flex items-center gap-1"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'অর্ডার ট্র্যাকিং স্ট্যাটাস দেখুন' : 'Live Track status'}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {/* Invoice download popup selection trigger */}
                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="bg-stone-900 hover:bg-stone-850/60 border border-stone-850 hover:text-stone-150 p-1.5 px-3 rounded text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Download className="w-3 h-3" />
                            <span>Invoice Rreceipt</span>
                          </button>

                          {order.status === 'Delivered' && (
                            <button
                              onClick={() => requestReturn(order.id, order.items[0]?.title || 'Jewellery')}
                              className="text-[10px] bg-red-950/45 text-red-400 hover:bg-red-950 border border-red-900/30 rounded p-1.5 px-3 font-semibold transition-all cursor-pointer"
                            >
                              Request Refund / Return
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {userOrders.length === 0 && (
                  <div className="text-center py-12 bg-stone-950 rounded-xl border border-stone-900 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-stone-550 mx-auto" />
                    <div>
                      <p className="text-stone-400 text-xs font-sans">
                        {language === 'bn' ? 'আপনার বর্তমান একাউন্টে কোনো অর্ডারের তালিকা নেই!' : 'You have not completed any purchases using this profile yet.'}
                      </p>
                      <button
                        onClick={() => setActiveTab('shop')}
                        className="mt-3 inline-block bg-amber-400 text-stone-950 font-bold px-4 py-1.5 text-xs rounded hover:bg-amber-300 cursor-pointer"
                      >
                        {language === 'bn' ? 'ডিজাইনার কালেকশন দেখুন' : 'Explore Collections'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Return & Refund History Logs */}
              <div className="pt-4 border-t border-stone-850 space-y-3">
                <h4 className="text-xs uppercase font-bold tracking-wider text-stone-400 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-red-400" />
                  {language === 'bn' ? 'রিটার্ন ও রিফান্ড হিস্টোরি' : 'Returns & Refund Operations log'}
                </h4>

                <div className="bg-stone-950 border border-stone-850/60 rounded-xl overflow-hidden divide-y divide-stone-900">
                  {returnRequests.map((ret, idx) => (
                    <div key={idx} className="p-3 text-xs flex flex-wrap items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <p className="font-sans font-semibold text-stone-200">{ret.itemTitle}</p>
                        <p className="text-[10px] text-stone-400 font-mono">Order: {ret.orderId} • Date: {ret.date}</p>
                      </div>
                      <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded ${
                        ret.status === 'Approved & Refunded' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' : 'bg-amber-950 text-amber-400 border border-amber-900/30'
                      }`}>
                        {ret.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: SAVED JEWELS / WISHLIST */}
          {activeSubTab === 'wishlist' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="border-b border-stone-850 pb-3 mb-2 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold font-sans text-stone-100">
                    {language === 'bn' ? 'পছন্দের গহনা সমূহ (উইশলিস্ট)' : 'Luxury Curation Wishlist'}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    {language === 'bn' ? 'আপনার প্রিয় তালিকায় সংরক্ষিত গহনাগুলো এক ক্লিকে অর্ডার করুন।' : 'Wishlisted items are saved locally so you can easily purchase them later.'}
                  </p>
                </div>
              </div>

              {/* Wishlist grid items */}
              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {wishlistProducts.map((p) => {
                    const price = p.discountPrice || p.price;
                    return (
                      <div key={p.id} className="bg-stone-950 border border-stone-850 rounded-xl overflow-hidden shadow flex flex-col justify-between">
                        <div className="relative aspect-video overflow-hidden bg-stone-900">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          <button
                            onClick={() => {
                              // Remove from wishlist
                              const list = localStorage.getItem('arisan_wishlist');
                              if (list) {
                                let parsed = JSON.parse(list) as string[];
                                parsed = parsed.filter(id => id !== p.id);
                                localStorage.setItem('arisan_wishlist', JSON.stringify(parsed));
                                syncWishlist();
                              }
                            }}
                            className="absolute top-2 right-2 p-1 bg-black/70 text-red-400 hover:text-red-500 border border-red-950 rounded-full cursor-pointer"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="p-3 text-left space-y-1.5 flex-grow flex flex-col justify-between bg-stone-950">
                          <div>
                            <h4 className="text-xs font-bold text-stone-150 line-clamp-1">{p.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-emerald-500 font-mono font-bold text-xs">৳{price}</span>
                              {p.discountPrice && <span className="text-[10px] text-stone-500 line-through">৳{p.price}</span>}
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              setSelectedProductId(p.id);
                              setActiveTab('product-details');
                            }}
                            className="w-full mt-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-sans font-bold text-[11px] py-1.5 text-center uppercase tracking-wide rounded transition-colors cursor-pointer"
                          >
                            Proceed Purchase
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-stone-950 border border-stone-900 rounded-xl space-y-3">
                  <Heart className="w-12 h-12 text-stone-550 mx-auto" />
                  <div>
                    <p className="text-stone-450 text-xs font-sans">
                      {language === 'bn' ? 'আপনার পছন্দের তালিকায় কোনো গহনা নেই!' : 'Your luxury wishlist dashboard is currently empty.'}
                    </p>
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="mt-3 inline-block bg-stone-900 border border-stone-800 hover:text-amber-400 font-bold px-4 py-1.5 text-xs rounded hover:border-stone-750 transition-colors cursor-pointer"
                    >
                      {language === 'bn' ? 'কালেকশন ব্রাউজ করুন' : 'Browse Curation Shop'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: REWARDS & LOYALTY */}
          {activeSubTab === 'rewards' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="border-b border-stone-850 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold font-sans text-stone-100">
                    {language === 'bn' ? 'পুরস্কার পয়েন্ট ও লেভেল ড্যাশবোর্ড' : 'Noble Rewards & Loyalty status'}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    {language === 'bn' ? 'অর্ডার করে পয়েন্ট আর্ন করুন এবং পরবর্তী ভিআইপি স্তরের মেম্বারশিপ পান।' : 'Collect reward points on every transaction and upgrade your crown.'}
                  </p>
                </div>
              </div>

              {/* Progress Level Card */}
              <div className="bg-stone-950 border border-stone-850 rounded-xl p-5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Award className="w-6 h-6 text-amber-400" />
                    <h4 className="text-base font-bold font-sans text-stone-100">
                      Silver Tier Crown
                    </h4>
                  </div>
                  <p className="text-xs text-stone-400 leading-normal max-w-sm">
                    {language === 'bn' ? 'আপনি পরবর্তী গোল্ড ক্লাবে উন্নীত হতে আর মাত্র ২৫০ পয়েন্ট দূরে আছেন।' : 'You are only 250 points away from upgrading to our Royal Golden Curation Level.'}
                  </p>

                  {/* Progress Line */}
                  <div className="w-full max-w-xs pt-2">
                    <div className="flex justify-between text-[10px] text-stone-500 font-mono mb-1">
                      <span>Silver (250 pts)</span>
                      <span>Gold (500 pts)</span>
                    </div>
                    <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-stone-850">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full w-[50%] rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-stone-900/60 p-4 border border-stone-850/60 rounded-xl text-center shrink-0 w-full md:w-auto">
                  <span className="block text-[10px] uppercase font-mono tracking-wider text-stone-500">
                    CURRENT WALLET
                  </span>
                  <span className="text-3xl font-mono font-extrabold text-amber-450 block">
                    {rewardPoints} <span className="text-xs font-sans text-stone-400">pts</span>
                  </span>
                  <p className="text-[9px] text-stone-400 mt-1">Value equivalents: ৳{rewardPoints}</p>
                </div>
              </div>

              {/* Rewards ledger history */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-bold tracking-wider text-stone-400 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-amber-450" />
                  {language === 'bn' ? 'পয়েন্ট প্রাপ্তির ট্রানজেকশন রসিদ' : 'Points Ledger & Transactions'}
                </h4>

                <div className="bg-stone-950 rounded-xl border border-stone-850 overflow-hidden divide-y divide-stone-900 text-xs">
                  {rewardTransactions.map((tx) => (
                    <div key={tx.id} className="p-3.5 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-sans font-semibold text-stone-200">
                          {language === 'bn' ? tx.reasonBn : tx.reason}
                        </p>
                        <p className="text-[10px] text-stone-550 font-mono">ID: {tx.id} • Date: {tx.date}</p>
                      </div>
                      <span className="text-amber-400 font-mono font-bold font-sans text-sm">
                        +{tx.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: PAYMENTS & INVOICES */}
          {activeSubTab === 'payment' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="border-b border-stone-850 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold font-sans text-stone-100">
                    {language === 'bn' ? 'পেমেন্ট স্ট্যাটাস ও রসিদ ডাউনলোড' : 'Payment History & Direct Invoice download'}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    {language === 'bn' ? 'আপনার সকল অর্ডারের অফিশিয়াল মেমো ইনভয়েস ডাউনলোড করুন।' : 'Review payment references, download official transaction statements, and print invoices.'}
                  </p>
                </div>
              </div>

              {/* Payment Records Ledger */}
              <div className="bg-stone-950 rounded-xl border border-stone-850 overflow-hidden divide-y divide-stone-900 text-xs text-left">
                {userOrders.map((order) => (
                  <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-stone-900/10 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-amber-450">{order.id}</span>
                        <span className={`text-[9px] font-sans font-bold uppercase rounded px-1.5 py-0.2 shrink-0 ${
                          order.status === 'Delivered' ? 'bg-green-950/80 text-green-400' : 'bg-stone-900 text-stone-300'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 font-sans">
                        Method: {order.paymentMethod} {order.transactionId && `• Trx: ${order.transactionId}`}
                      </p>
                      <p className="text-[10px] text-stone-500 font-mono">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="font-mono text-sm font-bold text-emerald-500">৳{order.total}</span>
                      
                      <button 
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="bg-stone-900 hover:bg-stone-850/60 text-stone-300 border border-stone-850 p-1.5 px-3 rounded hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-sans text-[11px]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Receipt Invoice</span>
                      </button>
                    </div>
                  </div>
                ))}

                {userOrders.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-stone-450 text-xs">
                      {language === 'bn' ? 'কোনো পেমেন্ট রেকর্ড খুঁজে পাওয়া যায়নি!' : 'No cash flow records found.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT: SECURITY & PASSWORD CREDENTIALS SECTION */}
          {activeSubTab === 'security' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="border-b border-stone-850 pb-3 flex justify-between items-center">
                <h3 className="text-lg font-bold font-sans text-stone-100">
                  {language === 'bn' ? 'নিরাপত্তা সেটিংস ও অ্যাক্টিভিটি লগ' : 'Security Safe House & Login logs'}
                </h3>
              </div>

              {securityMsg.text && (
                <div className={`p-3 text-xs rounded border ${
                  securityMsg.type === 'success' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' : 'bg-red-950/40 text-red-400 border-red-900/30'
                }`}>
                  {securityMsg.text}
                </div>
              )}

              {/* Password Change form */}
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
                <h4 className="text-xs uppercase font-bold tracking-wider text-stone-450 mb-1.5">
                  {language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Security Password'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-stone-450 mb-1">
                      {language === 'bn' ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}
                    </label>
                    <input 
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-850 rounded px-3 py-1.5 text-xs text-stone-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-stone-450 mb-1">
                      {language === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}
                    </label>
                    <input 
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-850 rounded px-3 py-1.5 text-xs text-stone-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-stone-450 mb-1">
                      {language === 'bn' ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'}
                    </label>
                    <input 
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-850 rounded px-3 py-1.5 text-xs text-stone-200 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-stone-900 border border-stone-850 hover:bg-stone-850 text-stone-200 font-bold px-4 py-2 rounded text-xs transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন নিরাপদ করুন' : 'Verify Password Update'}
                </button>
              </form>

              {/* Two Factor Authentication simulated switch with response */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-850/65 flex flex-wrap gap-4 items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-amber-400" />
                    <h5 className="text-xs font-bold font-sans text-stone-150">
                      Two-Factor Authentication (2FA)
                    </h5>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-normal max-w-md">
                    {language === 'bn' 
                      ? 'লগইন করার সময় অতিরিক্ত নিরাপত্তার জন্য আপনার রেজিস্টার্ড মোবাইল নাম্বারে ওটিপি ভেরিফিকেশন কোড পাঠানো সক্রিয় করুন।' 
                      : 'Request an OTP verification code sent directly to your registered mobile phone number upon every login attempts.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    const nextVal = !twoFactor;
                    setTwoFactor(nextVal);
                    saveProfileInfo(fullName, username, emailAddress, profilePic, nextVal);
                    setSecurityMsg({
                      text: nextVal 
                        ? (language === 'bn' ? 'দ্বি-স্তরের ভেরিফিকেশন সক্রিয় করা হয়েছে!' : 'Two-Factor verification has been successfully armed on your mobile terminal!')
                        : (language === 'bn' ? 'দ্বি-স্তরের ভেরিফিকেশন নিষ্ক্রিয় করা হয়েছে!' : 'Two-Factor validation layer disarmed safely.'),
                      type: 'success'
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${twoFactor ? 'bg-amber-400' : 'bg-stone-800'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-stone-950 shadow ring-0 transition duration-200 ease-in-out ${twoFactor ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Login Devices active session logs */}
              <div className="space-y-3 pt-3 border-t border-stone-850">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-450" />
                    {language === 'bn' ? 'ডিভাইস লগইন ইতিহাস ও সেশন লগ' : 'Active Session logs & Devices'}
                  </h4>

                  <button
                    onClick={() => {
                      setLoginDevices([loginDevices[0]]); // Keep only current active Chrome device
                      setSecurityMsg({ 
                        text: language === 'bn' ? 'অন্যান্য সকল আইডেন্টিটি সেশন থেকে নিরাপদভাবে সাইন-আউট করা হয়েছে।' : 'Identity sessions flushed. Logged out from all secondary nodes.', 
                        type: 'success' 
                      });
                    }}
                    className="text-[10px] px-2.5 py-1 bg-red-950/40 text-red-400 border border-red-900/20 rounded hover:bg-red-950 transition-colors cursor-pointer"
                  >
                    Logout From All Other Devices
                  </button>
                </div>

                <div className="bg-stone-950 rounded-xl border border-stone-850 overflow-hidden divide-y divide-stone-900 text-xs">
                  {loginDevices.map((dev) => (
                    <div key={dev.id} className="p-3.5 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-sans font-semibold text-stone-200 flex items-center gap-1.5">
                          {dev.device}
                          {dev.isCurrent && <span className="inline-block w-2- h-2 text-[8px] bg-emerald-950 text-emerald-400 font-bold px-1 rounded-full uppercase scale-90">IP Active</span>}
                        </p>
                        <p className="text-[10px] text-stone-500 font-sans">{dev.location}</p>
                      </div>
                      <span className="text-stone-400 font-mono text-[10px]">{dev.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: SUPPORT CENTER LIVE CONSOLE */}
          {activeSubTab === 'support' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="border-b border-stone-850 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-bold font-sans text-stone-100">
                    {language === 'bn' ? 'সহায়তা ডেস্ক ও লাইভ চ্যাট উইজেট' : 'Curation Concierge Support Desk'}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    {language === 'bn' ? 'সরাসরি টিকিটে যোগাযোগ করুন অথবা লাইভ বটের সাহায্য নিন।' : 'Submit formal support requests, browse FAQs, or speak directly to live chat agents.'}
                  </p>
                </div>

                <button
                  onClick={() => setShowTicketForm(!showTicketForm)}
                  className="bg-amber-400 text-stone-950 font-bold font-sans text-xs p-1.5 px-3 rounded-lg hover:bg-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>{showTicketForm ? (language === 'bn' ? 'টিকিট তালিকা' : 'View Tickets') : (language === 'bn' ? 'অভিযোগ টিকিট খুলুন' : 'Open Support Ticket')}</span>
                </button>
              </div>

              {/* Flex Support grids layout: Chat bot vs ticket managers */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Side: Live Assistant chat (lg:col-span-5) */}
                <div className="lg:col-span-5 bg-stone-950 rounded-xl border border-stone-850 text-xs overflow-hidden flex flex-col justify-between h-[420px]">
                  <div className="p-3 bg-stone-900 border-b border-stone-850 flex items-center justify-between">
                    <div>
                      <span className="font-sans font-bold text-stone-150 block">Curation Cbot</span>
                      <span className="text-[9px] text-emerald-400">● Curation Advisor is Online</span>
                    </div>
                    <RefreshCw 
                      className="w-3.5 h-3.5 text-stone-400 hover:text-white cursor-pointer transition-colors" 
                      onClick={() => setChatMessages([chatMessages[0]])}
                      title="Clear chat thread reset"
                    />
                  </div>

                  {/* Messages list bubble viewport */}
                  <div className="p-3.5 space-y-3 overflow-y-auto flex-grow scrollbar-none scroll-smooth">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2.5 rounded-lg max-w-[85%] leading-relaxed ${
                          msg.sender === 'user' ? 'bg-amber-400 text-stone-950 rounded-tr-none font-sans font-medium' : 'bg-stone-900 text-stone-200 rounded-tl-none border border-stone-850'
                        }`}>
                          <p>{msg.text}</p>
                          <span className={`block text-[8px] text-right mt-1 font-mono ${msg.sender === 'user' ? 'text-stone-800' : 'text-stone-500'}`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input field text area */}
                  <form onSubmit={handleSendLiveChat} className="p-2 border-t border-stone-850 bg-stone-900/60 flex items-center gap-1.5">
                    <input 
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={language === 'bn' ? 'আপনার ম্যাসেজ লিখুন...' : 'Ask about shipping, refunds, care...'}
                      className="flex-grow bg-stone-950 border border-stone-830 rounded p-2 text-xs focus:outline-none focus:border-amber-400 text-stone-200"
                    />
                    <button 
                      type="submit" 
                      className="p-2 bg-amber-400 text-stone-950 rounded hover:bg-amber-300 cursor-pointer transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {/* Right Side: Ticket list / Creation support tickets (lg:col-span-7) */}
                <div className="lg:col-span-7 bg-stone-950/30">
                  {showTicketForm ? (
                    /* Ticket creation client form */
                    <form onSubmit={handleTicketSubmit} className="bg-stone-950 p-4 border border-stone-850 rounded-xl space-y-4">
                      <h4 className="text-xs uppercase font-bold tracking-widest text-amber-350">
                        {language === 'bn' ? 'সাপোর্ট টিকিট ফর্ম' : 'File formal ticket request'}
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                            {language === 'bn' ? 'বিষয়ের শিরোনাম' : 'Ticket Subject Line'}
                          </label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g. Broken choker latch, coupon error"
                            value={ticketSubject}
                            onChange={(e) => setTicketSubject(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2 text-xs text-stone-200 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                              {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                            </label>
                            <select
                              value={ticketCategory}
                              onChange={(e) => setTicketCategory(e.target.value)}
                              className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2 text-xs text-stone-200 focus:outline-none"
                            >
                              <option value="Order Issues">Order Issues</option>
                              <option value="Payment Issues">Payment Issues</option>
                              <option value="Jewellery Care">Jewellery Curation Help</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                              {language === 'bn' ? 'অগ্রাধিকার' : 'Priority'}
                            </label>
                            <select
                              value={ticketPriority}
                              onChange={(e) => setTicketPriority(e.target.value as any)}
                              className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2 text-xs text-stone-200 focus:outline-none"
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                            {language === 'bn' ? 'বিস্তারিত বর্ণনা দিন' : 'Elaborate details'}
                          </label>
                          <textarea 
                            rows={3}
                            required
                            placeholder="Provide details about order IDs, dates, issue snapshots..."
                            value={ticketDesc}
                            onChange={(e) => setTicketDesc(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2 text-xs text-stone-200 focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs p-2.5 rounded w-full hover:opacity-90 cursor-pointer"
                      >
                        Submit Ticket Request
                      </button>
                    </form>
                  ) : (
                    /* Stored active Tickets List client threads view */
                    <div className="space-y-4">
                      {selectedTicketId ? (
                        /* Open ticket replies thread details list */
                        (() => {
                          const ticket = tickets.find(t => t.id === selectedTicketId);
                          if (!ticket) return null;
                          return (
                            <div className="bg-stone-950 rounded-xl border border-stone-850 p-4 space-y-4 animate-fadeIn text-xs">
                              <div className="flex items-center justify-between border-b border-stone-900/60 pb-3">
                                <div>
                                  <button 
                                    onClick={() => setSelectedTicketId(null)}
                                    className="text-[10px] text-stone-400 hover:text-amber-400 mb-1 inline-block focus:outline-none"
                                  >
                                    ← Back to Tickets
                                  </button>
                                  <h4 className="font-sans font-bold text-stone-100">{ticket.subject}</h4>
                                </div>
                                <span className={`p-1 px-2.5 text-[9px] rounded font-bold uppercase tracking-wider ${
                                  ticket.status === 'Resolved' ? 'bg-green-950 text-green-400 border border-green-900/40' : 'bg-amber-950 text-amber-400 border border-amber-900/40'
                                }`}>
                                  {ticket.status}
                                </span>
                              </div>

                              {/* Message bubbles thread */}
                              <div className="space-y-3.5 max-h-[220px] overflow-y-auto p-1.5 scrollbar-none bg-stone-950/40 border border-stone-900 rounded-lg">
                                {ticket.messages.map((m, i) => (
                                  <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <span className="text-[8px] text-stone-500 font-mono mb-0.5">{m.sender === 'user' ? 'Customer Profile' : 'Arisan BD Agent'}</span>
                                    <div className={`p-2.5 rounded-lg max-w-[90%] leading-relaxed ${
                                      m.sender === 'user' ? 'bg-stone-900 text-stone-250 border border-stone-850' : 'bg-emerald-950/30 text-emerald-350 border border-emerald-900/10'
                                    }`}>
                                      <p>{m.text}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Thread Reply Input box bar */}
                              <div className="flex gap-1.5 pt-1.5 border-t border-stone-900">
                                <input 
                                  type="text"
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Type reply block details..."
                                  className="flex-grow bg-stone-900 border border-stone-830 rounded p-2 text-xs focus:outline-none focus:border-amber-450 text-stone-200"
                                />
                                <button 
                                  onClick={() => handleTicketReply(ticket.id)}
                                  className="p-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded transition-all cursor-pointer font-bold px-3 font-sans"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        /* Flat tickets thread list */
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-450">
                            {language === 'bn' ? 'আপনার সক্রিয় অভিযোগ টিকিটসমূহ' : 'Active Tickets threads'}
                          </h4>

                          <div className="bg-stone-950 rounded-xl border border-stone-850 overflow-hidden divide-y divide-stone-900 text-xs">
                            {tickets.map((t) => (
                              <div 
                                key={t.id} 
                                onClick={() => setSelectedTicketId(t.id)}
                                className="p-3.5 hover:bg-stone-900/10 transition-colors cursor-pointer flex items-center justify-between gap-3"
                              >
                                <div className="space-y-0.5 text-left">
                                  <p className="font-sans font-semibold text-stone-150 truncate max-w-sm sm:max-w-md">{t.subject}</p>
                                  <p className="text-[10px] text-stone-500 font-mono">ID: {t.id} • Priority: {t.priority} • {t.category}</p>
                                </div>
                                
                                <span className={`text-[9px] font-sans font-bold uppercase px-2 py-0.5 rounded border ${
                                  t.status === 'Resolved' ? 'bg-green-950/60 text-green-400 border-green-900/20' : 'bg-amber-950/60 text-amber-400 border-amber-900/20'
                                }`}>
                                  {t.status}
                                </span>
                              </div>
                            ))}

                            {tickets.length === 0 && (
                              <div className="text-center py-6 text-stone-500">
                                {language === 'bn' ? 'কোনো একটিভ টিকিট পাওয়া যায়নি।' : 'No tickets registered.'}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Support FAQs collapsible inline list */}
              <div className="space-y-3 pt-4 border-t border-stone-850">
                <h4 className="text-xs uppercase font-bold tracking-wider text-stone-400 flex items-center gap-1.5 select-none">
                  <BadgeHelp className="w-3.5 h-3.5 text-amber-440" />
                  {language === 'bn' ? 'গ্রাহকদের সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)' : 'Customer FAQ Directory'}
                </h4>

                <div className="space-y-2 text-xs">
                  {[
                    { q: 'How do I claim my Gold badge / loyalty discounts?', a: 'Loyalty badges are configured and auto upgraded. The Silver stage is unlocked at account signup (250 welcome points) and the Golden tier becomes operative upon reaching 500 reward points from your purchase history ledger.' },
                    { q: 'Is cash on delivery available across all locations?', a: 'Yes! ARISAN BD executes nationwide cod services under professional care of our courier affiliates. Checking pristine jewellery finishes upon arrival before clearing invoices is fully supported!' },
                    { q: 'What is the return/refund validation policy?', a: 'Returns must be filed within 3 days of delivery packages. Handset beads and premium solid gold plated frames must retain their default packaging slips without active physical scratches to trigger automatic refunder.' }
                  ].map((faq, idx) => (
                    <div key={idx} className="bg-stone-950 rounded-lg border border-stone-850/60 overflow-hidden">
                      <button
                        onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                        className="w-full text-left p-3 flex justify-between items-center outline-none focus:outline-none"
                      >
                        <span className="font-sans font-semibold text-stone-200">{faq.q}</span>
                        <ChevronRight className={`w-3.5 h-3.5 text-stone-400 transition-transform ${activeFAQ === idx ? 'rotate-90' : ''}`} />
                      </button>
                      
                      {activeFAQ === idx && (
                        <div className="p-3 pt-0 border-t border-stone-900/60 text-stone-400 leading-normal text-[11px] font-sans">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 3. PREMIUM FLOATING DIGITAL ORIGINAL INVOICE MODAL POPUP */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white text-stone-900 max-w-xl w-full p-6 sm:p-8 rounded-xl shadow-2xl relative overflow-hidden font-sans flex flex-col justify-between max-h-[90vh]">
            
            {/* Ambient Watermark banner on invoice */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[35deg] font-display text-7xl font-extrabold text-stone-100/50 uppercase tracking-widest pointer-events-none select-none">
              ARISAN BD
            </div>

            {/* Scrollable invoice content */}
            <div className="overflow-y-auto scrollbar-none space-y-6 text-left">
              
              {/* Header block details */}
              <div className="flex justify-between items-start border-b border-stone-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-sans tracking-widest uppercase text-emerald-800">
                    ARISAN BD
                  </h2>
                  <p className="text-[10px] text-stone-500 font-sans tracking-wide">
                    Premium Curation Jewellery Bangladesh
                  </p>
                  <p className="text-[9px] text-stone-400 mt-1">Dhanmandi Studio Hub, Dhaka</p>
                  <p className="text-[9px] text-stone-400">arisanbd26@gmail.com • +8801313840136</p>
                </div>

                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold font-sans px-3 py-1 rounded-full border border-emerald-200">
                    Invoice Receipt
                  </span>
                  <p className="text-xs font-mono font-bold text-stone-750 mt-2">{selectedInvoiceOrder.id}</p>
                  <p className="text-[9px] text-stone-500 font-mono">Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Bill To Coordinates details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[9px] uppercase tracking-wider font-bold text-stone-400 mb-1">
                    Billed To:
                  </p>
                  <p className="font-sans font-bold text-stone-800">{selectedInvoiceOrder.customerName}</p>
                  <p className="font-sans text-stone-605">{selectedInvoiceOrder.address}</p>
                  <p className="font-sans text-stone-605">{selectedInvoiceOrder.city}, {selectedInvoiceOrder.district}</p>
                  <p className="font-mono text-stone-550 pt-0.5">{selectedInvoiceOrder.phone}</p>
                  <p className="font-sans text-stone-550">{selectedInvoiceOrder.email}</p>
                </div>

                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-stone-400 mb-1">
                    Shipping & Payment:
                  </p>
                  <p className="font-sans text-stone-700">Method: {selectedInvoiceOrder.paymentMethod}</p>
                  {selectedInvoiceOrder.transactionId && <p className="font-mono text-stone-605">Trx: {selectedInvoiceOrder.transactionId}</p>}
                  <p className="font-sans text-stone-700">Track ID: <span className="font-mono text-[10px]">{selectedInvoiceOrder.trackingNumber}</span></p>
                  <p className="font-sans text-stone-700">Delivery: {selectedInvoiceOrder.deliveryOption || 'Nationwide Courier'}</p>
                </div>
              </div>

              {/* Items loop breakdown table list */}
              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-wider font-bold text-stone-400 border-b border-stone-100 pb-1">
                  Ordered Jewels Breakdown
                </p>
                
                <div className="divide-y divide-stone-100 text-xs">
                  {selectedInvoiceOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2.5">
                      <div className="max-w-[70%]">
                        <p className="font-sans font-bold text-stone-850">{item.title}</p>
                        <p className="text-[9px] text-stone-450">Size: {item.size || 'Standard'} • Color: {item.color || 'Default'}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-stone-500">৳{item.price} x {item.quantity}</span>
                        <p className="font-mono font-bold text-stone-850 mt-0.5">৳{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculations tally summaries */}
              <div className="border-t border-stone-150 pt-4 text-xs font-sans space-y-2 max-w-xs ml-auto">
                <div className="flex justify-between text-stone-605">
                  <span>Subtotal Amount:</span>
                  <span className="font-mono">৳{selectedInvoiceOrder.subtotal}</span>
                </div>
                
                {selectedInvoiceOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-red-650">
                    <span>Coupon Savings:</span>
                    <span className="font-mono">-৳{selectedInvoiceOrder.discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-605">
                  <span>Delivery Charge:</span>
                  <span className="font-mono">৳{selectedInvoiceOrder.deliveryCharge}</span>
                </div>

                <div className="flex justify-between border-t border-stone-200 pt-2 font-bold text-stone-850 text-sm">
                  <span>Total Calculated:</span>
                  <span className="font-mono text-emerald-800">৳{selectedInvoiceOrder.total}</span>
                </div>
              </div>

              {/* Footer block stamp disclaimer on memo */}
              <div className="pt-6 border-t border-stone-200 text-center space-y-1 select-none">
                <p className="text-[10px] font-sans font-semibold text-stone-750 uppercase tracking-widest">
                  Thank You for Shopping with ARISAN BD
                </p>
                <p className="text-[8px] text-stone-400">
                  This official electronic receipt memo is generated securely on your Customer Profile. 
                </p>
                <p className="text-[8px] text-stone-450 italic">"Where Every Piece Tells a Story"</p>
              </div>

            </div>

            {/* Print and Close Actions buttons bar */}
            <div className="mt-8 pt-4 border-t border-stone-200 flex gap-2 justify-end text-xs shrink-0 bg-white">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 bg-stone-100 rounded hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
              >
                Close Receipt
              </button>
              
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-emerald-800 text-white rounded font-bold hover:bg-emerald-700 shadow cursor-pointer transition-colors"
              >
                Print Direct Invoice
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SECRET ADMIN GATEWAY MODAL */}
      {showAdminModalState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-stone-950 border border-amber-500/30 rounded-lg max-w-sm w-full p-6 text-stone-200 shadow-2xl relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl font-sans"></div>
            
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-stone-900 font-sans">
              <h3 className="text-sm font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 font-sans">
                <Lock className="w-4 h-4" />
                {language === 'bn' ? 'মালিক যাচাইকরণ' : 'Owner Authentication'}
              </h3>
              <button 
                onClick={() => {
                  setShowAdminModalState(false);
                  setAdminPasswordInput('');
                  setAdminAuthError('');
                }}
                className="p-1 rounded-full text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-400 mb-4 font-sans">
              {language === 'bn' 
                ? 'এডমিন ড্যাশবোর্ড এবং ওয়েবসাইট সেটিংস পরিচালনা করার জন্য মেইন পাসওয়ার্ডটি প্রদান করুন।' 
                : 'Please input your primary admin password to gain access to the central store dashboard and control panels.'}
            </p>

            {adminAuthError && (
              <div className="mb-4 bg-red-950/40 text-red-400 text-xs p-2.5 rounded border border-red-900/40 font-sans animate-pulse">
                {adminAuthError}
              </div>
            )}

            <form onSubmit={handleAdminVerifySubmit} className="space-y-4">
              <div className="font-sans animate-fadeIn">
                <label className="block text-[10px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider">
                  {language === 'bn' ? 'এডমিন মেইন পাসওয়ার্ড' : 'Admin Master Password'}
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="••••••••"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-850 rounded px-3 py-2 text-sm text-stone-150 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono tracking-wider text-center"
                />
              </div>

              <div className="flex gap-2 pt-2 font-sans">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminModalState(false);
                    setAdminPasswordInput('');
                    setAdminAuthError('');
                  }}
                  className="w-1/2 border border-stone-850 hover:border-stone-700 font-bold py-2 rounded text-xs uppercase tracking-wider text-stone-400 cursor-pointer text-center"
                >
                  {language === 'bn' ? 'বন্ধ করুন' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black py-2 rounded text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-all text-center"
                >
                  {language === 'bn' ? 'প্রবেশ করুন' : 'Authenticate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
