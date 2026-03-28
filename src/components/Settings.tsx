import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Eye, 
  Globe, 
  Smartphone, 
  Shield, 
  HelpCircle,
  ChevronRight,
  Moon,
  Sun,
  Palette,
  Languages,
  Database,
  Cloud,
  Check,
  Camera,
  Briefcase,
  Mail,
  Smartphone as InApp,
  X,
  Calendar as CalendarIcon,
  Target,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Language } from '../types';
import { translations } from '../translationService';

interface SettingsProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onDarkModeChange: (dark: boolean) => void;
  highlightedSetting?: string | null;
}

export default function Settings({ language, onLanguageChange, darkMode, onDarkModeChange, highlightedSetting }: SettingsProps) {
  const [notifications, setNotifications] = useState(true);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [displayName, setDisplayName] = useState('Rasesh P.');
  const [professionalTitle, setProfessionalTitle] = useState('Senior Architect');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    nirnay: { inApp: true, email: true },
    crm: { inApp: true, email: false },
    nexus: { inApp: true, email: true },
  });

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setAvatar(dataUrl);
        stopCamera();
      }
    }
  };

  const t = translations[language];

  const languages: { code: Language; name: string; native: string }[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'ru', name: 'Russian', native: 'Русский' },
  ];

  const sections = [
    {
      title: t.accountProfile || 'Account & Profile',
      items: [
        { name: t.profileInfo || 'Profile Information', icon: User, description: t.profileDesc || 'Name, email, and avatar' },
        { name: t.security || 'Security', icon: Lock, description: t.securityDesc || 'Password and 2FA' },
        { name: t.privacy || 'Privacy', icon: Eye, description: t.privacyDesc || 'Manage your data visibility' },
      ]
    },
    {
      title: t.appSettings || 'App Settings',
      items: [
        { name: t.notifications || 'Notifications', icon: Bell, description: t.notificationsDesc || 'Push and email alerts', toggle: true, value: notifications, setter: setNotifications },
        { name: t.appearance || 'Appearance', icon: Palette, description: t.appearanceDesc || 'Themes and colors', toggle: true, value: darkMode, setter: onDarkModeChange, toggleIcon: darkMode ? Moon : Sun },
        { 
          name: t.language || 'Language', 
          icon: Languages, 
          description: languages.find(l => l.code === language)?.name || 'English',
          onClick: () => setShowLanguagePicker(!showLanguagePicker)
        },
      ]
    },
    {
      title: t.systemData || 'System & Data',
      items: [
        { name: t.cloudSync || 'Cloud Sync', icon: Cloud, description: t.cloudSyncDesc || 'Backup and restore' },
        { name: t.storageManagement || 'Storage Management', icon: Database, description: t.storageDesc || 'Clear cache and local data' },
        { name: t.connectedDevices || 'Connected Devices', icon: Smartphone, description: t.devicesDesc || 'Manage active sessions' },
      ]
    },
    {
      title: t.support || 'Support',
      items: [
        { name: t.helpCenter || 'Help Center', icon: HelpCircle, description: t.helpDesc || 'FAQs and guides' },
        { name: t.about || 'About', icon: Shield, description: t.aboutDesc || 'Version 2.4.0 (Stable)' },
      ]
    }
  ];

  React.useEffect(() => {
    if (highlightedSetting) {
      const el = document.getElementById(`setting-${highlightedSetting}`);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [highlightedSetting]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.settings || 'Settings'}</h2>
        <p className="text-slate-500 font-medium">{t.settingsDesc || 'Manage your preferences and system configuration'}</p>
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {isCameraOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden max-w-md w-full"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-black text-slate-900 dark:text-white">Take a Photo</h3>
                <button onClick={stopCamera} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                  <X size={20} />
                </button>
              </div>
              <div className="relative aspect-video bg-black">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="p-6 flex justify-center">
                <button 
                  onClick={capturePhoto}
                  className="w-16 h-16 bg-white border-4 border-indigo-600 rounded-full shadow-xl hover:scale-110 transition-transform"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 text-center">
            <div className="relative group mx-auto mb-4 w-24 h-24">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-xl" />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-500/20">
                  {displayName.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <button 
                onClick={startCamera}
                className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera size={16} />
              </button>
            </div>
            <div className="space-y-1">
              <input 
                type="text" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full text-center font-bold text-slate-900 dark:text-white text-lg bg-transparent border-none focus:ring-0 p-0"
              />
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <Briefcase size={14} />
                <input 
                  type="text" 
                  value={professionalTitle} 
                  onChange={(e) => setProfessionalTitle(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 p-0 text-center w-full"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">raseshp8@gmail.com</p>
          </div>

          <div className="bg-indigo-600 rounded-3xl shadow-lg p-6 text-white overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h4 className="font-bold mb-2">{t.proSubscription || 'Pro Subscription'}</h4>
            <p className="text-xs text-indigo-100 mb-4">{t.proDesc || 'Unlock OCR, advanced redaction, and 100GB cloud storage.'}</p>
            <button className="w-full py-2 bg-white text-indigo-600 rounded-lg font-bold text-xs hover:bg-indigo-50 transition-all">
              {t.upgradeNow || 'Upgrade Now'}
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{section.title}</h4>
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {section.items.map((item, i) => (
                  <React.Fragment key={i}>
                    <div 
                      id={`setting-${item.name}`}
                      onClick={() => item.onClick?.()}
                      className={cn(
                        "flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer",
                        (i !== section.items.length - 1 || (item.name === 'Language' && showLanguagePicker)) && "border-b border-slate-100 dark:border-slate-800",
                        highlightedSetting === item.name && "bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-l-indigo-500"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-800 dark:text-white text-sm">{item.name}</h5>
                          <p className="text-[10px] text-slate-400 font-medium">{item.description}</p>
                        </div>
                      </div>
                      
                      {item.toggle ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            item.setter?.(!item.value);
                          }}
                          className={cn(
                            "w-12 h-6 rounded-full transition-all relative p-1",
                            item.value ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                          )}
                        >
                          <div className={cn(
                            "w-4 h-4 bg-white rounded-full transition-all flex items-center justify-center",
                            item.value ? "translate-x-6" : "translate-x-0"
                          )}>
                            {item.toggleIcon && <item.toggleIcon size={10} className={item.value ? "text-indigo-600" : "text-slate-400"} />}
                          </div>
                        </button>
                      ) : (
                        <ChevronRight size={18} className={cn("text-slate-300 transition-transform", item.name === 'Language' && showLanguagePicker && "rotate-90")} />
                      )}
                    </div>

                    {item.name === 'Notifications' && notifications && (
                      <div className="bg-slate-50 dark:bg-slate-950/50 p-6 space-y-6 border-b border-slate-100 dark:border-slate-800">
                        {[
                          { id: 'nirnay', name: 'Nirnay Calendar', icon: CalendarIcon },
                          { id: 'crm', name: 'CRM Hub', icon: Target },
                          { id: 'nexus', name: 'AI Nexus', icon: Cpu },
                        ].map((module) => (
                          <div key={module.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-500">
                                <module.icon size={16} />
                              </div>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{module.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => setNotificationSettings(prev => ({
                                  ...prev,
                                  [module.id]: { ...prev[module.id as keyof typeof prev], inApp: !prev[module.id as keyof typeof prev].inApp }
                                }))}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all",
                                  notificationSettings[module.id as keyof typeof notificationSettings].inApp 
                                    ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" 
                                    : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                                )}
                              >
                                <InApp size={12} /> IN-APP
                              </button>
                              <button 
                                onClick={() => setNotificationSettings(prev => ({
                                  ...prev,
                                  [module.id]: { ...prev[module.id as keyof typeof prev], email: !prev[module.id as keyof typeof prev].email }
                                }))}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all",
                                  notificationSettings[module.id as keyof typeof notificationSettings].email 
                                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" 
                                    : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                                )}
                              >
                                <Mail size={12} /> EMAIL
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {item.name === 'Language' && showLanguagePicker && (
                      <div className="bg-slate-50 p-4 grid grid-cols-2 gap-2 border-b border-slate-100">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              onLanguageChange(lang.code);
                              setShowLanguagePicker(false);
                            }}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-xl border-2 transition-all",
                              language === lang.code 
                                ? "bg-indigo-600 border-indigo-600 text-white" 
                                : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200"
                            )}
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-xs font-bold">{lang.name}</span>
                              <span className="text-[10px] opacity-70">{lang.native}</span>
                            </div>
                            {language === lang.code && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
