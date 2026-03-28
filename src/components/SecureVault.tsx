import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  CreditCard, 
  FileText, 
  User,
  Zap,
  RefreshCcw,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  History,
  Bell,
  Activity,
  Fingerprint,
  ScanFace,
  Settings as SettingsIcon,
  ChevronRight,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";

export default function SecureVault() {
  const [isLocked, setIsLocked] = useState(true);
  const [authMethod, setAuthMethod] = useState<'pin' | 'biometric'>('biometric');
  const [pin, setPin] = useState('');
  const [activeCategory, setActiveCategory] = useState('passwords');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoLockTime, setAutoLockTime] = useState(5); // minutes
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    if (!isLocked) {
      const timer = setTimeout(() => setIsLocked(true), autoLockTime * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [isLocked, autoLockTime]);

  const handleAuth = () => {
    // Simulate biometric auth
    setIsLocked(false);
    setPinError(false);
  };

  const handlePinSubmit = () => {
    if (pin === '1234') { // Mock PIN
      setIsLocked(false);
      setPin('');
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const analyzePasswords = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze these password patterns: Netflix (Medium), Amazon (Weak). 
        Suggest 3 specific, actionable security improvements and suggest a stronger pattern for the weak one. 
        Keep it concise and professional.`,
      });
      setAiAdvice(response.text || null);
    } catch (error) {
      console.error("Failed to analyze passwords", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const subscriptions = [
    { id: '1', name: 'Netflix', price: '$15.99', nextBill: 'Mar 25', status: 'Active', icon: '🎬' },
    { id: '2', name: 'Spotify', price: '$9.99', nextBill: 'Apr 02', status: 'Active', icon: '🎵' },
    { id: '3', name: 'Adobe CC', price: '$52.99', nextBill: 'Mar 28', status: 'Expiring', icon: '🎨' },
  ];

  const stats = [
    { label: 'Passwords', value: '124', icon: Key, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Identities', value: '8', icon: User, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Cards', value: '4', icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Documents', value: '12', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const passwords = [
    { id: '1', site: 'Google', email: 'raseshp8@gmail.com', strength: 'Strong', lastChanged: '2 months ago' },
    { id: '2', site: 'Netflix', email: 'raseshp8@gmail.com', strength: 'Medium', lastChanged: '6 months ago' },
    { id: '3', site: 'GitHub', email: 'rasesh_dev', strength: 'Strong', lastChanged: '1 month ago' },
    { id: '4', site: 'Amazon', email: 'raseshp8@gmail.com', strength: 'Weak', lastChanged: '1 year ago' },
  ];

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] bg-slate-50 dark:bg-slate-950 rounded-[3rem] p-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm text-center"
        >
          <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/40">
            <Lock size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">SecureVault</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-12">Protected by Samsung Pass Security</p>

          {authMethod === 'biometric' ? (
            <div className="space-y-8">
              <button 
                onClick={handleAuth}
                className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-lg hover:scale-110 transition-transform text-indigo-600"
              >
                <Fingerprint size={40} />
              </button>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Touch the sensor to unlock</p>
              <button 
                onClick={() => setAuthMethod('pin')}
                className="text-indigo-600 font-bold text-sm hover:underline"
              >
                Use PIN instead
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className={cn(
                    "w-4 h-4 rounded-full border-2 transition-all",
                    pinError ? "border-rose-500 bg-rose-500" :
                    pin.length > i ? "bg-indigo-600 border-indigo-600" : "border-slate-300 dark:border-slate-700"
                  )} />
                ))}
              </div>
              {pinError && <p className="text-rose-500 text-sm font-bold animate-pulse">Incorrect PIN</p>}
              <div className="grid grid-cols-3 gap-4 max-w-[240px] mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '←'].map((num, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (num === '←') setPin(pin.slice(0, -1));
                      else if (num !== '') setPin(pin + num);
                    }}
                    className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 text-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
                  >
                    {num}
                  </button>
                ))}
              </div>
              {pin.length === 4 && handlePinSubmit()}
              <button 
                onClick={() => setAuthMethod('biometric')}
                className="text-indigo-600 font-bold text-sm hover:underline"
              >
                Use Biometrics
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header with Lock Button */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
            <Shield size={20} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">SecureVault</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsLocked(true)}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <Lock size={18} />
          </button>
          <button className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <SettingsIcon size={18} />
          </button>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center text-center group transition-all hover:shadow-xl hover:shadow-slate-200/50"
          >
            <div className={cn("p-3 rounded-2xl mb-4 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Vault Area */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
              {['passwords', 'identities', 'cards', 'docs'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all",
                    activeCategory === cat ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search vault..." 
                  className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs w-48 focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
              </div>
              <button className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {passwords.map((pw) => (
                <motion.div 
                  key={pw.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/5 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 font-black group-hover:scale-110 transition-transform">
                      {pw.site[0]}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">{pw.site}</h5>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{pw.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                        pw.strength === 'Strong' ? "bg-emerald-100 text-emerald-700" : 
                        pw.strength === 'Medium' ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                      )}>
                        {pw.strength}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold mt-1">Updated {pw.lastChanged}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePassword(pw.id);
                        }}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                      >
                        {showPasswords[pw.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Security Center Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-xl font-black tracking-tight">Security Center</h4>
                <Shield size={24} className="text-indigo-400" />
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-4xl font-black text-white">92<span className="text-indigo-400 text-xl">/100</span></p>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <Zap size={10} /> +5% this week
                    </p>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '92%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    ></motion.div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: '2FA Enabled', status: true },
                    { label: 'Weak Passwords', status: false, count: 2 },
                    { label: 'Breach Monitoring', status: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-xs font-bold text-white/80">{item.label}</span>
                      {item.status ? (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-rose-400">{item.count} issues</span>
                          <AlertCircle size={16} className="text-rose-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={analyzePasswords}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? <Activity size={16} className="animate-spin" /> : <Sparkles size={16} className="text-indigo-600" />}
                  {isAnalyzing ? "Analyzing..." : "AI Security Audit"}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {aiAdvice && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-indigo-200" />
                      <h4 className="text-sm font-black uppercase tracking-widest text-indigo-100">AI Advisor</h4>
                    </div>
                    <button onClick={() => setAiAdvice(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                      <Plus size={14} className="rotate-45" />
                    </button>
                  </div>
                  <p className="text-xs font-medium leading-relaxed text-indigo-50 italic">"{aiAdvice}"</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CreditCard size={20} className="text-slate-900" />
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Subscriptions</h4>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                <Plus size={18} />
              </button>
            </div>
            
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                      {sub.icon}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">{sub.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">{sub.nextBill}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900">{sub.price}</p>
                    <p className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      sub.status === 'Active' ? "text-emerald-500" : "text-rose-500"
                    )}>{sub.status}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-xs font-black hover:border-indigo-300 hover:text-indigo-500 transition-all uppercase tracking-widest">
              Auto-Detect Subscriptions
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
            <h4 className="font-bold text-slate-900 mb-6">Device Management</h4>
            <div className="space-y-4">
              {[
                { name: 'Samsung Galaxy S24', type: 'Primary Device', icon: Smartphone, lastActive: 'Active now' },
                { name: 'MacBook Pro 16"', type: 'Desktop Browser', icon: Smartphone, lastActive: '2 hours ago' },
              ].map((device, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-2.5 bg-white rounded-xl text-slate-600 border border-slate-100">
                    <device.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-slate-800 text-sm truncate">{device.name}</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{device.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">{device.lastActive}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
