import React, { useState } from 'react';
import { 
  Search, 
  Globe, 
  Shield, 
  Lock, 
  History, 
  Star, 
  Plus, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  LayoutGrid,
  List as ListIcon,
  Eye,
  EyeOff,
  Zap,
  Download,
  Share2,
  FileText,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export default function PureBrowse() {
  const [url, setUrl] = useState('https://www.google.com');
  const [isPrivate, setIsPrivate] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: 'Google', url: 'https://www.google.com', icon: Globe },
    { title: 'Stirling PDF', url: 'https://stirlingpdf.io', icon: FileText },
    { title: 'Redectio', url: 'https://redectio.app', icon: Shield },
  ];

  const bookmarks = [
    { name: 'GitHub', url: 'github.com', color: 'bg-slate-900' },
    { name: 'Dribbble', url: 'dribbble.com', color: 'bg-rose-500' },
    { name: 'Behance', url: 'behance.net', color: 'bg-blue-600' },
    { name: 'StackOverflow', url: 'stackoverflow.com', color: 'bg-orange-500' },
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Browser Chrome */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-4 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400">
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400">
              <ChevronRight size={18} />
            </button>
            <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400">
              <RotateCcw size={18} />
            </button>
          </div>

          <div className="flex-1 relative group">
            <div className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors",
              isPrivate ? "bg-slate-900 text-white" : "text-slate-400"
            )}>
              {isPrivate ? <Lock size={14} /> : <Globe size={14} />}
            </div>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 bg-slate-100 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <button 
              onClick={() => setIsPrivate(!isPrivate)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 rounded-lg transition-all text-slate-400"
            >
              {isPrivate ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
              <Plus size={18} />
            </button>
            <button className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-2">
          {tabs.map((tab, i) => (
            <button 
              key={i}
              onClick={() => {
                setActiveTab(i);
                setUrl(tab.url);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border",
                activeTab === i 
                  ? "bg-white border-slate-200 shadow-sm text-slate-900" 
                  : "bg-transparent border-transparent text-slate-400 hover:bg-slate-50"
              )}
            >
              <tab.icon size={14} />
              {tab.title}
              {activeTab === i && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
            </button>
          ))}
        </div>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden relative group">
        <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform duration-500">
            <Zap size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Pure Browse Engine</h3>
          <p className="text-slate-500 max-w-md font-medium leading-relaxed">
            Experience the web without tracking, ads, or distractions. 
            Integrated with <span className="text-indigo-600 font-bold">Stirling PDF</span> for seamless document handling.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-2xl">
            {bookmarks.map((bookmark, i) => (
              <button key={i} className="p-4 bg-white rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/5 transition-all group/item">
                <div className={cn("w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-black group-hover/item:scale-110 transition-transform", bookmark.color)}>
                  {bookmark.name[0]}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bookmark.name}</p>
              </button>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-4">
            <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center gap-2">
              <ExternalLink size={18} />
              Open in New Tab
            </button>
            <button className="px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black hover:bg-slate-50 transition-all">
              View History
            </button>
          </div>
        </div>

        {/* Privacy Shield Overlay */}
        <div className="absolute bottom-6 right-6 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center gap-3 animate-bounce">
          <Shield size={20} />
          <span className="text-xs font-black uppercase tracking-widest">Shield Active</span>
        </div>
      </div>
    </div>
  );
}
