import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Lock, 
  FileText, 
  Globe, 
  Cpu, 
  Plane,
  Target,
  Settings as SettingsIcon,
  Bell,
  Search,
  Menu,
  X,
  Sparkles,
  Moon,
  Sun,
  Zap,
  Plus,
  MessageSquare,
  ShieldCheck,
  Wallet,
  Calculator,
  BookOpen,
  FileBox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { AppModule, Language } from './types';
import { translations } from './translationService';
import NirnayCalendar from './components/NirnayCalendar';
import SecureVault from './components/SecureVault';
import OfficeHub from './components/OfficeHub';
import AINexus from './components/AINexus';
import PureBrowse from './components/PureBrowse';
import GlobeTrot from './components/GlobeTrot';
import SuperDashboard from './components/SuperDashboard';
import Settings from './components/Settings';
import CRMHub from './components/CRMHub';
import Budgeted from './components/Budgeted';
import CalculatorModule from './components/CalculatorModule';
import SpiritualHub from './components/SpiritualHub';
import PDFTools from './components/PDFTools';
import { performAISearch, SearchResult } from './services/aiSearchService';

import GlobalSearch from './components/GlobalSearch';
import { Home, LayoutGrid, Search as SearchIcon, User } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState<AppModule>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [highlightedSetting, setHighlightedSetting] = useState<string | null>(null);

  const t = translations[language];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const quickActions = [
    { name: 'New Document', icon: FileText, module: 'office', color: 'text-emerald-500' },
    { name: 'Add Entry', icon: ShieldCheck, module: 'vault', color: 'text-blue-500' },
    { name: 'New Chat', icon: MessageSquare, module: 'nexus', color: 'text-indigo-500' },
    { name: 'Add Lead', icon: Target, module: 'crm', color: 'text-rose-500' },
    { name: 'Add Transaction', icon: Wallet, module: 'budgeted', color: 'text-emerald-500' },
  ];

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 3) {
      setIsSearching(true);
      const results = await performAISearch(query);
      setAiSearchResults(results);
      setIsSearching(false);
    } else {
      setAiSearchResults([]);
    }
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const modules = [
    { id: 'dashboard', name: t.dashboard || 'Dashboard', icon: Sparkles, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'nirnay', name: t.nirnay || 'Nirnay Pro (Gujarati Calendar)', icon: CalendarIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'vault', name: t.vault || 'SecureVault', icon: Lock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'office', name: t.office || 'OfficeHub', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'browser', name: t.browser || 'PureBrowse', icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'nexus', name: t.nexus || 'AI Nexus', icon: Cpu, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'crm', name: t.crm || 'CRM Hub', icon: Target, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'globetrot', name: t.globetrot || 'GlobeTrot', icon: Plane, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'budgeted', name: 'Budgeted', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'calculator', name: 'Calculator', icon: Calculator, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'spiritual', name: 'Spiritual Hub', icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'pdf', name: 'PDF Tools', icon: FileBox, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className={cn(
      "flex h-screen font-sans relative animate-gradient transition-colors duration-500",
      darkMode ? "dark bg-slate-950 text-slate-100" : "bg-[#F8FAFC] text-slate-900",
      "bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950"
    )}>
      {/* Background Gradient Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-rose-500/5 blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-emerald-500/5 blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Global Search Component */}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={setActiveModule}
        darkMode={darkMode}
      />

      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 768 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar (Android Drawer Style) */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : 0,
          x: isSidebarOpen ? 0 : -280
        }}
        className={cn(
          "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 shadow-2xl shadow-slate-200/50 dark:shadow-none h-full fixed left-0 top-0"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                  <Sparkles size={24} />
                </div>
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">SUPER APP</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => {
                setActiveModule(mod.id as AppModule);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group relative",
                activeModule === mod.id 
                  ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xl shadow-slate-900/10 dark:shadow-indigo-600/20" 
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                activeModule === mod.id ? "bg-white/10" : (darkMode ? "bg-slate-800" : mod.bg),
                mod.color
              )}>
                <mod.icon size={20} />
              </div>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-bold text-sm tracking-tight"
                >
                  {mod.name}
                </motion.span>
              )}
              {activeModule === mod.id && isSidebarOpen && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
          >
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          <button 
            onClick={() => {
              setActiveModule('settings');
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group",
              activeModule === 'settings' 
                ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xl shadow-slate-900/10 dark:shadow-indigo-600/20" 
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-colors",
              activeModule === 'settings' ? "bg-white/10" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            )}>
              <SettingsIcon size={20} />
            </div>
            {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{t.settings || 'Settings'}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight capitalize">
              {activeModule === 'settings' ? (t.settings || 'Settings') : modules.find(m => m.id === activeModule)?.name}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm w-40 md:w-64 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-medium text-slate-400"
            >
              <SearchIcon size={18} />
              <span className="hidden md:inline">{t.search || "Search..."}</span>
              <kbd className="hidden md:inline-flex ml-auto px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold text-slate-500 shadow-sm">Ctrl K</kbd>
            </button>

            {/* Quick Actions */}
            <div className="relative">
              <button 
                onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
                className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20 hover:scale-105 transition-transform"
              >
                <Plus size={20} />
              </button>
              <AnimatePresence>
                {isQuickActionsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsQuickActionsOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50"
                    >
                      <div className="p-2">
                        <p className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Actions</p>
                        {quickActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setActiveModule(action.module as AppModule);
                              setIsQuickActionsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                          >
                            <div className={cn("p-2 rounded-lg bg-slate-100 dark:bg-slate-800", action.color)}>
                              <action.icon size={16} />
                            </div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white">{action.name}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-black text-slate-900 dark:text-white">Rasesh P.</p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Pro Member</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-105 transition-transform">
                RP
              </div>
            </div>
          </div>
        </header>

        {/* Module Content */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 overflow-y-auto p-4 md:p-8 scroll-smooth flex flex-col"
            >
              {activeModule === 'dashboard' && <SuperDashboard onNavigate={setActiveModule} />}
              {activeModule === 'nirnay' && <NirnayCalendar language={language} />}
              {activeModule === 'vault' && <SecureVault />}
              {activeModule === 'office' && <OfficeHub />}
              {activeModule === 'nexus' && <AINexus />}
              {activeModule === 'crm' && <CRMHub />}
              {activeModule === 'browser' && <PureBrowse />}
              {activeModule === 'globetrot' && <GlobeTrot />}
              {activeModule === 'budgeted' && <Budgeted />}
              {activeModule === 'calculator' && <CalculatorModule />}
              {activeModule === 'spiritual' && <SpiritualHub />}
              {activeModule === 'pdf' && <PDFTools />}
              {activeModule === 'settings' && <Settings language={language} onLanguageChange={setLanguage} darkMode={darkMode} onDarkModeChange={setDarkMode} highlightedSetting={highlightedSetting} />}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Bottom Navigation (Mobile Only) */}
        <nav className="md:hidden h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-4 sticky bottom-0 z-40">
          {[
            { id: 'dashboard', name: 'Home', icon: Home },
            { id: 'nirnay', name: 'Calendar', icon: CalendarIcon },
            { id: 'search', name: 'Search', icon: SearchIcon, action: () => setIsSearchOpen(true) },
            { id: 'apps', name: 'Apps', icon: LayoutGrid, action: () => setIsSidebarOpen(true) },
            { id: 'settings', name: 'Settings', icon: SettingsIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  setActiveModule(item.id as AppModule);
                }
              }}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                activeModule === item.id ? "text-indigo-600 scale-110" : "text-slate-400"
              )}
            >
              <item.icon size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
