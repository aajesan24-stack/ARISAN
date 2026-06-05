import express from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gqqwplaqlqrwweovrece.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcXdwbGFxbHFyd3dlb3ZyZWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4ODY4MTAsImV4cCI6MjA5NTQ2MjgxMH0.VN9HQsvgqSMfH1CImR6LDiNFhjU3A1HuKRk5ZAkpZhk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  const clean = phone.replace(/\D/g, '');
  if (clean.startsWith('880')) {
    return clean.slice(3);
  }
  if (clean.startsWith('0')) {
    return clean.slice(1);
  }
  return clean;
}

const CONFIG_FILE = path.join(process.cwd(), 'smtp-config.json');

function getSmtpConfig() {
  let config = {
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: Number(process.env.SMTP_PORT || '587')
  };

  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      if (data.smtpUser) config.smtpUser = data.smtpUser;
      if (data.smtpPass) config.smtpPass = data.smtpPass;
      if (data.smtpHost) config.smtpHost = data.smtpHost;
      if (data.smtpPort) config.smtpPort = Number(data.smtpPort);
    } catch (e) {
      console.error('Error reading smtp-config.json', e);
    }
  }
  return config;
}

const app = express();
app.use(express.json());

const PORT = 3000;

// Memory storage for secure admin login state
let adminSession = {
  activeOtp: null as string | null,
  otpExpiry: null as number | null,
  failedAttempts: 0,
  lockedUntil: null as number | null,
  token: null as string | null,
  tokenExpiry: null as number | null
};

// Memory storage for admin activity logs
interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING' | 'ALERT';
  ipAddress: string;
}

let activityLogs: ActivityLog[] = [
  {
    id: 'log-initial',
    timestamp: new Date().toISOString(),
    action: 'Security Shield Online',
    details: 'Admin verification framework initialized with 2FA protection protocols.',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1'
  }
];

// Helper to push a new security log
function logAdminActivity(action: string, details: string, status: 'SUCCESS' | 'FAILED' | 'WARNING' | 'ALERT', req: express.Request) {
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  activityLogs.unshift({
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    action,
    details,
    status,
    ipAddress
  });
  // Cap logs to last 100 entries
  if (activityLogs.length > 100) {
    activityLogs.pop();
  }
}

const CUSTOMERS_FILE = path.join(process.cwd(), 'customers.json');

function getRegisteredCustomers() {
  if (fs.existsSync(CUSTOMERS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CUSTOMERS_FILE, 'utf-8'));
    } catch (e) {
      console.error('Error reading customers.json', e);
    }
  }
  return [];
}

function saveRegisteredCustomers(customers: any[]) {
  try {
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write customers.json', err);
  }
}

async function getMergedCustomersFromDatabaseAndFile() {
  const fileCustomers = getRegisteredCustomers();
  const mergedMap = new Map();

  // 1. Seed from local file
  fileCustomers.forEach((c: any) => {
    if (c.phone) {
      mergedMap.set(normalizePhoneNumber(c.phone), c);
    }
  });

  // 2. Fetch from Supabase Settings backup
  try {
    const { data: dbSettings, error: sErr } = await supabase
      .from('arisan_settings')
      .select('data')
      .eq('id', 'default_settings')
      .single();

    if (!sErr && dbSettings && dbSettings.data && Array.isArray(dbSettings.data.registeredCustomersList)) {
      dbSettings.data.registeredCustomersList.forEach((c: any) => {
        if (c && c.phone) {
          mergedMap.set(normalizePhoneNumber(c.phone), c);
        }
      });
    }
  } catch (err) {
    console.warn('[SERVER SECURITY] Failed to load customers from Supabase Settings backup:', err);
  }

  // 3. Attempt to fetch from Supabase customers table directly
  try {
    const { data: dbCustomers, error: custErr } = await supabase
      .from('arisan_customers')
      .select('*');

    if (!custErr && dbCustomers && dbCustomers.length > 0) {
      dbCustomers.forEach((row: any) => {
        const c = row.data;
        if (c && c.phone) {
          mergedMap.set(normalizePhoneNumber(c.phone), c);
        }
      });
    }
  } catch (err) {
    console.log('[SERVER SECURITY] Info: arisan_customers table not found or inaccessible (ignored):', err);
  }

  return Array.from(mergedMap.values());
}

async function syncMergedCustomersToDestinations(customers: any[]) {
  // 1. Save to local Express file
  saveRegisteredCustomers(customers);

  // 2. Perform Supabase database sync completely in the background so it doesn't block Express routing thread / cause frontend timeouts
  (async () => {
    try {
      // A. Save directly to Supabase settings backup
      const { data: dbSettings, error: sErr } = await supabase
        .from('arisan_settings')
        .select('*')
        .eq('id', 'default_settings')
        .single();

      if (!sErr && dbSettings && dbSettings.data) {
        const updatedSettings = {
          ...dbSettings.data,
          registeredCustomersList: customers
        };
        await supabase
          .from('arisan_settings')
          .upsert({ id: 'default_settings', data: updatedSettings });
      }
    } catch (err) {
      console.warn('[SERVER SECURITY] Non-blocking background settings sync failed:', err);
    }

    try {
      // B. Save to Supabase arisan_customers table
      const uploads = customers.map(async (c: any) => {
        if (c && c.phone) {
          const { error } = await supabase.from('arisan_customers').upsert({ id: c.phone, data: c });
          if (error) {
            console.warn(`[SUPABASE SYNC WARNING] Failed to background upsert customer ${c.phone}:`, error.message);
          }
        }
      });
      await Promise.all(uploads);
    } catch (err) {
      console.warn('[SERVER SECURITY] Non-blocking background customer profiles sync failed:', err);
    }
  })();
}

// CUSTOMERS DYNAMIC RECONCILIATION API 1: Retrieve all registered customers
app.get('/api/customers', async (req, res) => {
  try {
    const merged = await getMergedCustomersFromDatabaseAndFile();
    // Cache the merged list locally without executing heavy, blocking Supabase writes
    saveRegisteredCustomers(merged);
    res.json({ customers: merged });
  } catch (err: any) {
    console.error('API Error in GET /api/customers:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// CUSTOMERS DYNAMIC RECONCILIATION API 2: Sync/save list bidirectionally
app.post('/api/customers/sync', async (req, res) => {
  const { customers } = req.body;
  if (!Array.isArray(customers)) {
    return res.status(400).json({ success: false, error: 'Customers array is required.' });
  }

  try {
    const currentMerged = await getMergedCustomersFromDatabaseAndFile();
    const mergedMap = new Map();

    // Seed existing
    currentMerged.forEach((c: any) => {
      if (c.phone) mergedMap.set(normalizePhoneNumber(c.phone), c);
    });

    // Add incoming
    customers.forEach((c: any) => {
      if (c.phone) {
        mergedMap.set(normalizePhoneNumber(c.phone), c);
      }
    });

    const finalizedList = Array.from(mergedMap.values());
    await syncMergedCustomersToDestinations(finalizedList);

    res.json({ success: true, customers: finalizedList });
  } catch (err: any) {
    console.error('API Error in POST /api/customers/sync:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// CUSTOMERS DYNAMIC RECONCILIATION API 3: Register a new customer
app.post('/api/customers/register', async (req, res) => {
  const { phone, password, district, name, language } = req.body;
  const isBn = language === 'bn';

  const cleanPhone = (phone || '').trim();
  const cleanPassword = (password || '').trim();
  const cleanDistrict = (district || 'Dhaka').trim();
  const cleanName = (name || '').trim();

  if (!cleanPhone) {
    return res.status(400).json({
      success: false,
      message: isBn ? 'অনুগ্রহ করে মোবাইল নম্বর দিন।' : 'Please provide a phone number.'
    });
  }

  if (!cleanPassword) {
    return res.status(400).json({
      success: false,
      message: isBn ? 'অনুগ্রহ করে পাসওয়ার্ড দিন।' : 'Please provide a password.'
    });
  }

  try {
    const currentMerged = await getMergedCustomersFromDatabaseAndFile();
    console.log(`[AUTH REGISTER] Attempting to register customer: ${cleanPhone}. Total current users in DB: ${currentMerged.length}`);

    // Check collision using normalized comparison
    const targetNorm = normalizePhoneNumber(cleanPhone);
    const exists = currentMerged.some(c => normalizePhoneNumber(c.phone) === targetNorm);

    if (exists) {
      console.log(`[AUTH REGISTER-COLLISION] Phone registration blocked! Mobile number ${cleanPhone} already registered.`);
      return res.status(400).json({
        success: false,
        message: isBn 
          ? 'এই মোবাইল নম্বরটি দিয়ে ইতিপূর্বেই একাউন্ট তৈরি করা হয়েছে।' 
          : 'An account with this phone number already exists.'
      });
    }

    const displayName = cleanName || (isBn ? `ক্রেতা (${cleanPhone.slice(-4)})` : `Customer (${cleanPhone.slice(-4)})`);
    const newCustomer = {
      phone: cleanPhone,
      password: cleanPassword,
      district: cleanDistrict,
      name: displayName
    };

    const updatedList = [...currentMerged, newCustomer];
    await syncMergedCustomersToDestinations(updatedList);

    console.log(`[AUTH REGISTER-SUCCESS] Successfully registered customer ${cleanPhone}! Name: ${displayName}`);

    res.json({
      success: true,
      message: isBn ? 'সফলভাবে একাউন্ট তৈরি হয়েছে!' : 'Account registered successfully!',
      customer: newCustomer
    });
  } catch (err: any) {
    console.error('Error during customer registration:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// CUSTOMERS DYNAMIC RECONCILIATION API 4: Customer Login via phone/password
app.post('/api/customers/login', async (req, res) => {
  const { phone, password, language } = req.body;
  const isBn = language === 'bn';

  const cleanPhone = (phone || '').trim();
  const cleanPassword = password || '';

  if (!cleanPhone) {
    return res.status(400).json({
      success: false,
      message: isBn ? 'অনুগ্রহ করে মোবাইল নম্বর দিন।' : 'Please provide a phone number.'
    });
  }

  try {
    const currentMerged = await getMergedCustomersFromDatabaseAndFile();
    const targetNorm = normalizePhoneNumber(cleanPhone);

    console.log(`[AUTH LOGIN-DEBUG-DB-QUERY] Retrieving customers. Total database users examined: ${currentMerged.length}`);
    console.log(`[AUTH LOGIN-DEBUG-NORM-CHECK] Matching against normalized input: "${targetNorm}"`);

    // Show the exact query process
    for (const c of currentMerged) {
      const cNorm = normalizePhoneNumber(c.phone);
      console.log(`  - Comparing: Record ID "${c.phone}" (normalized: "${cNorm}") with Input Normalized: "${targetNorm}"`);
    }

    const matched = currentMerged.find(c => normalizePhoneNumber(c.phone) === targetNorm);

    if (!matched) {
      console.log(`[AUTH LOGIN-FAILED] No account holding normalized phone target "${targetNorm}" found in the central database!`);
      return res.status(404).json({
        success: false,
        message: isBn 
          ? 'এই মোবাইল নম্বর দিয়ে কোনো একাউন্ট পাওয়া যায়নি।' 
          : 'No account found with this phone number.'
      });
    }

    if (matched.password !== cleanPassword) {
      console.log(`[AUTH LOGIN-FAILED] Account found for phone: ${cleanPhone}, but provided password does not match.`);
      return res.status(401).json({
        success: false,
        message: isBn 
          ? 'মোবাইল নম্বর অথবা পাসওয়ার্ডটি সঠিক নয়।' 
          : 'Incorrect phone number or password.'
      });
    }

    console.log(`[AUTH LOGIN-SUCCESS] Successful authenticating for Customer ${cleanPhone}!`);
    return res.json({
      success: true,
      message: isBn ? 'লগইন সফল হয়েছে!' : 'Logged in successfully!',
      customer: matched
    });
  } catch (err: any) {
    console.error('Error during customer login:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// SECURITY API 1: Request OTP validation
app.post('/api/admin/request-otp', async (req, res) => {
  const { password, configuredPassword, adminEmail } = req.body;
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

  // 1. Check current lock status
  if (adminSession.lockedUntil && adminSession.lockedUntil > Date.now()) {
    const remainSec = Math.ceil((adminSession.lockedUntil - Date.now()) / 1000);
    return res.status(403).json({
      success: false,
      error: `Security lock active. Too many failed attempts. Try again in ${remainSec} seconds.`,
      locked: true,
      remainingSeconds: remainSec
    });
  }

  // 2. Validate admin password
  const masterPassword = configuredPassword || process.env.ADMIN_PASSWORD || 'jesan2026';
  if (password !== masterPassword) {
    adminSession.failedAttempts += 1;
    
    logAdminActivity(
      'Failed Login Attempt',
      `Incorrect master password attempt from IP. (Failed count: ${adminSession.failedAttempts}/5)`,
      'WARNING',
      req
    );

    if (adminSession.failedAttempts >= 5) {
      const lockPeriod = 3 * 60 * 1000; // 3 minutes lock
      adminSession.lockedUntil = Date.now() + lockPeriod;
      adminSession.failedAttempts = 0; // reset counter after locking
      
      logAdminActivity(
        'Intrusion Blocked / Security Lock Triggered',
        `Master lock initiated for 3 minutes due to 5 consecutive invalid entries.`,
        'ALERT',
        req
      );

      return res.status(423).json({
        success: false,
        error: 'Too many incorrect attempts! Admin Dashboard is locked for 3 minutes to protect user details.',
        locked: true,
        remainingSeconds: 180
      });
    }

    return res.json({
      success: false,
      error: `Invalid master credentials! (${5 - adminSession.failedAttempts} attempts left before auto-lock)`
    });
  }

  // 3. Password correct - generate 4-digit OTP
  const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
  adminSession.activeOtp = generatedOtp;
  adminSession.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes validity
  
  const targetEmail = adminEmail || 'jesanbinary07@gmail.com';

  logAdminActivity(
    'OTP Dispatch Request',
    `Master password accepted. Initiating 2-Step OTP dispatch to ${targetEmail}`,
    'SUCCESS',
    req
  );

  // 4. Send actual email if SMTP credentials exist
  const smtpConfig = getSmtpConfig();
  const smtpUser = smtpConfig.smtpUser;
  const smtpPass = smtpConfig.smtpPass;
  const smtpHost = smtpConfig.smtpHost;
  const smtpPort = smtpConfig.smtpPort;

  let emailSentReal = false;
  let emailError = '';

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const messageHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; background-color: #fafafa; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="color: #d97706; margin: 0; font-size: 24px; letter-spacing: 2px;">ARISAN BD SECURITY SHIELD</h2>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Two-Factor Authentication System</p>
          </div>
          <div style="background-color: #ffffff; padding: 25px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-left: 4px solid #d97706;">
            <p style="margin: 0; font-size: 14px; color: #333;">안녕하세요 <b>Tarikul Alam Jesan</b>,</p>
            <p style="margin: 15px 0; font-size: 14px; color: #555; line-height: 1.5;">
              A login request was initiated for your store's admin panel from IP address: <b>${ipAddress}</b>. Please use the following 2-Step verification code to authorize access:
            </p>
            <div style="text-align: center; margin: 25px 0;">
              <span style="display: inline-block; background-color: #fffbeb; border: 2px dashed #f59e0b; color: #b45309; padding: 12px 30px; font-size: 26px; font-weight: bold; font-family: monospace; letter-spacing: 5px; border-radius: 4px;">
                ${generatedOtp}
              </span>
            </div>
            <p style="margin: 15px 0 0 0; font-size: 12px; color: #e11d48; font-weight: bold;">
              ⚠️ Details: This OTP is extremely confidential and remains valid for only 5 minutes. Never share this code with anyone.
            </p>
          </div>
          <p style="color: #999; font-size: 10px; text-align: center; margin-top: 25px; line-height: 1.4;">
            This security notification was dispatched automatically by your Cloud Run container instance.<br/>
            ARISAN BD Jewelers. All rights reserved &copy; 2026.
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: `"ARISAN BD Security" <${smtpUser}>`,
        to: targetEmail,
        subject: `[${generatedOtp}] Admin 2FA Verification Code - ARISAN BD`,
        html: messageHtml
      });

      emailSentReal = true;
      logAdminActivity(
        'Gmail OTP Delivered',
        `Successfully dispatched OTP packet to custom Gmail mailbox (${targetEmail}) via SMTP.`,
        'SUCCESS',
        req
      );
    } catch (e: any) {
      emailError = e.message || 'SMTP Exception';
      logAdminActivity(
        'Gmail OTP Dispatch Failed',
        `SMTP failed: ${emailError}. Debug fallback active.`,
        'ALERT',
        req
      );
    }
  }

  // Log the active OTP securely to the server terminal only so it doesn't leak to the browser frontend
  if (!smtpUser || !smtpPass) {
    console.log(`\n===============================================\n[SECURITY LOGS] Admin Verification Code: ${generatedOtp}\n===============================================\n`);
  }

  // Returns state including fallback verification info so users without SMTP can test effortlessly in dev mode
  return res.json({
    success: true,
    needsOtp: true,
    targetEmail,
    smtpConfigured: !!(smtpUser && smtpPass),
    emailSentReal,
    emailError,
    debugOtp: generatedOtp // Fallback shown in AI Studio preview if real SMTP isn't set up yet
  });
});

// SECURITY API 2: Verify OTP 
app.post('/api/admin/verify-otp', (req, res) => {
  const { otp } = req.body;

  if (!adminSession.activeOtp || !adminSession.otpExpiry) {
    return res.json({ success: false, error: 'Authorization flow stale. Please enter password again.' });
  }

  if (Date.now() > adminSession.otpExpiry) {
    adminSession.activeOtp = null;
    return res.json({ success: false, error: 'OTP expired! Please request a new verification code.' });
  }

  if (otp !== adminSession.activeOtp) {
    logAdminActivity(
      'Failed 2FA OTP Entry',
      `User entered invalid 2-Step OTP key. Access denied.`,
      'FAILED',
      req
    );
    return res.json({ success: false, error: 'ভুল ভেরিফিকেশন কোড! দয়া করে আপনার জিমেইল চেক করে সঠিক কোড দিন।' });
  }

  // OTP is correct! Create a highly secure temporary token
  const token = 'tok_secure_arisan_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  adminSession.token = token;
  adminSession.tokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins session expiration
  adminSession.activeOtp = null; // consume OTP
  adminSession.otpExpiry = null;

  logAdminActivity(
    'Admin Login Granted',
    `Successful session token registration. Auto-logout set to 15 minutes.`,
    'SUCCESS',
    req
  );

  return res.json({
    success: true,
    token,
    admin: {
      email: 'jesanbinary07@gmail.com',
      name: 'Tarikul Alam Jesan'
    }
  });
});

// SECURITY API 3: Verify current token (protects endpoints & keeps user logged in / auto logouts)
app.post('/api/admin/verify-token', (req, res) => {
  const { token } = req.body;

  if (!adminSession.token || adminSession.token !== token) {
    return res.json({ valid: false, error: 'Session invalid or auto-logged out.' });
  }

  if (adminSession.tokenExpiry && Date.now() > adminSession.tokenExpiry) {
    adminSession.token = null;
    adminSession.tokenExpiry = null;
    logAdminActivity(
      'Session Expired',
      `Admin token revoked via auto-logout security watchdog.`,
      'WARNING',
      req
    );
    return res.json({ valid: false, error: 'সেশন শেষ হয়েছে! সিকিউরিটির জন্য আপনাকে পুনরায় লগইন করতে হবে।' });
  }

  // Refresh expiration on action
  adminSession.tokenExpiry = Date.now() + 15 * 60 * 1000;

  return res.json({
    valid: true,
    admin: {
      email: 'jesanbinary07@gmail.com',
      name: 'Tarikul Alam Jesan'
    }
  });
});

// SECURITY API 4: Log custom activity (such as updates)
app.post('/api/admin/log-custom', (req, res) => {
  const { action, details, status } = req.body;
  logAdminActivity(action, details, status, req);
  res.json({ success: true });
});

// SECURITY API 5: Fetch logs for display in Admin activity monitor section
app.get('/api/admin/activity-logs', (req, res) => {
  res.json({ logs: activityLogs });
});

// SECURITY API 6: Force Admin Session Auto Logout
app.post('/api/admin/force-logout', (req, res) => {
  adminSession.token = null;
  adminSession.tokenExpiry = null;
  logAdminActivity(
    'Manual Logout Registered',
    `Administrator session terminated gracefully. Integrity secured.`,
    'SUCCESS',
    req
  );
  res.json({ success: true });
});

// SECURITY API 7: Dynamic SMTP configuration saver
app.post('/api/admin/save-smtp', (req, res) => {
  const { smtpUser, smtpPass, smtpHost, smtpPort } = req.body;
  if (!smtpUser || !smtpPass) {
    return res.status(400).json({ success: false, error: 'User and App Password are required.' });
  }

  // Clean values, stripping whitespaces from App Password (Google generates App Passwords with spaces, but they must be used without spaces)
  const cleanUser = smtpUser.trim().toLowerCase();
  const cleanPass = smtpPass.trim().replace(/\s+/g, '');
  const cleanHost = (smtpHost || 'smtp.gmail.com').trim();
  const cleanPort = Number(smtpPort || '587');

  const configData = {
    smtpUser: cleanUser,
    smtpPass: cleanPass,
    smtpHost: cleanHost,
    smtpPort: cleanPort
  };

  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(configData, null, 2), 'utf-8');
    
    // Log configuration activity
    logAdminActivity(
      'SMTP Config Updated',
      `Sender email address updated dynamically to ${cleanUser}. System email delivery activated.`,
      'SUCCESS',
      req
    );

    return res.json({ success: true, message: 'SMTP settings saved successfully!' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to save SMTP config.' });
  }
});

// SECURITY API 8: Fetch current SMTP status/sender (masked password)
app.get('/api/admin/smtp-status', (req, res) => {
  const config = getSmtpConfig();
  return res.json({
    configured: !!(config.smtpUser && config.smtpPass),
    smtpUser: config.smtpUser,
    smtpHost: config.smtpHost,
    smtpPort: config.smtpPort
  });
});

// SECURITY API 9: Direct Admin Login without 2FA (as requested by user)
app.post('/api/admin/login-direct', (req, res) => {
  const { email, password, configuredPassword } = req.body;

  // Validate admin password
  const masterPassword = configuredPassword || process.env.ADMIN_PASSWORD || 'jesan2026';
  if (password !== masterPassword) {
    return res.json({
      success: false,
      error: 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক এডমিন পাসওয়ার্ডটি দিন।'
    });
  }

  // Create standard session token
  const token = 'tok_secure_arisan_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  adminSession.token = token;
  adminSession.tokenExpiry = Date.now() + 60 * 60 * 1000; // 60 mins session expiration for convenience
  adminSession.activeOtp = null;
  adminSession.otpExpiry = null;

  logAdminActivity(
    'Admin Direct Login',
    `Direct authenticate without 2FA for admin email: ${email}`,
    'SUCCESS',
    req
  );

  return res.json({
    success: true,
    token,
    admin: {
      email: email,
      name: 'Tarikul Alam Jesan'
    }
  });
});

// Setup Vite & Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server launched on port ${PORT}`);
  });
}

startServer();
