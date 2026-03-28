import { useState } from 'react';
import { 
  Calendar, 
  Shield, 
  FileText, 
  Sparkles, 
  Plane, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  Search,
  Plus,
  MoreVertical,
  ExternalLink,
  CreditCard,
  History,
  Globe
} from 'lucide-react';
import { cn } from '../lib/utils';

import { AppModule } from '../types';

interface SuperDashboardProps {
  onNavigate?: (module: AppModule) => void;
}

export default function SuperDashboard({ onNavigate }: SuperDashboardProps) {
  const [alerts, setAlerts] = useState([
    { type: 'warning', title: 'Passport Expiring', desc: 'Your passport expires in 6 months. Auspicious day to apply: Mar 25.', icon: Plane, color: 'text-rose-600', bg: 'bg-rose-50' },
    { type: 'info', title: 'Ekadashi Tomorrow', desc: 'Vrat katha and timings available in Nirnay Pro.', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
    { type: 'success', title: 'Security Scan Complete', desc: 'No new breaches detected. Privacy score: 92/100.', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]);

  const upcomingEvents = [
    { time: '09:00 AM', title: 'Netflix Renewal', category: 'Finance', icon: CreditCard },
    { time: '02:30 PM', title: 'Mom\'s Birthday (NYC)', category: 'Family', icon: Plane },
    { time: '06:00 PM', title: 'Satsang Sabha', category: 'Spiritual', icon: Calendar },
  ];

  const recentFiles = [
    { name: 'Wedding_Invite_Draft.pdf', type: 'PDF', size: '2.4 MB', date: '2h ago' },
    { name: 'Q1_Expenses.xlsx', type: 'Excel', size: '1.1 MB', date: '5h ago' },
    { name: 'Travel_Itinerary.docx', type: 'Word', size: '850 KB', date: 'Yesterday' },
  ];

  const travelClocks = [
    { city: 'Ahmedabad', time: '07:04 AM', offset: '+5:30', active: true },
    { city: 'New York', time: '09:34 PM', offset: '-4:00', active: false },
    { city: 'London', time: '01:34 AM', offset: '+1:00', active: false },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">Jay Swaminarayan, Rasesh</h3>
          <p className="text-slate-500 mt-1 font-medium">Here's what's happening in your digital ecosystem today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">All Systems Secure</span>
          </div>
          <button className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20 hover:scale-105 transition-transform">
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Alerts & Integration */}
        <div className="lg:col-span-2 space-y-8">
          {/* AI & Panchang Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all"></div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-indigo-400" />
                <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-400">AI Nexus Insight</h4>
              </div>
              <p className="text-lg font-medium leading-relaxed">
                "Based on your upcoming India trip, I've prepared a travel checklist and currency conversion shortcuts in GlobeTrot."
              </p>
              <button 
                onClick={() => onNavigate?.('globetrot')}
                className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View Checklist <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="bg-orange-600 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-orange-200" />
                <h4 className="text-sm font-bold uppercase tracking-widest text-orange-200">Nirnay Pro</h4>
              </div>
              <p className="text-lg font-medium leading-relaxed">
                Today is <span className="font-black">Sud 7</span>. Auspicious Muhurat for financial decisions starts at 09:45 AM.
              </p>
              <button 
                onClick={() => onNavigate?.('nirnay')}
                className="mt-6 flex items-center gap-2 text-sm font-bold text-orange-200 hover:text-white transition-colors"
              >
                Open Calendar <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          {/* Intelligent Alerts */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <AlertCircle size={20} className="text-slate-400" />
                Intelligent Alerts
              </h4>
              <button 
                onClick={() => setAlerts([])}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {alerts.map((alert, i) => (
                <div key={i} className="p-6 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className={cn("p-3 rounded-2xl shrink-0 transition-transform group-hover:scale-110", alert.bg, alert.color)}>
                    <alert.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-800">{alert.title}</h5>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">2m ago</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Documents */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText size={20} className="text-slate-400" />
                Recent Documents
              </h4>
              <button 
                onClick={() => onNavigate?.('office')}
                className="text-xs font-bold text-indigo-600"
              >
                View OfficeHub
              </button>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {recentFiles.map((file, i) => (
                  <div key={i} className="p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 mb-3 group-hover:bg-white group-hover:shadow-sm transition-all">
                      <FileText size={20} />
                    </div>
                    <h5 className="font-bold text-slate-800 text-sm truncate">{file.name}</h5>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{file.type} • {file.size}</span>
                      <span className="text-[10px] font-medium text-slate-400">{file.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Schedule & Stats */}
        <div className="space-y-8">
          {/* Today's Timeline */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <Clock size={18} className="text-slate-400" />
                Today's Timeline
              </h4>
              <button 
                onClick={() => onNavigate?.('nirnay')}
                className="text-xs font-bold text-indigo-600"
              >
                View All
              </button>
            </div>
            <div className="space-y-6">
              {upcomingEvents.map((event, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">{event.time}</span>
                    <div className="w-0.5 flex-1 bg-slate-100 group-last:hidden"></div>
                  </div>
                  <div className="flex-1 pb-6 group-last:pb-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-800 text-sm">{event.title}</h5>
                      <event.icon size={14} className="text-slate-300" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{event.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Clocks */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <Globe size={18} className="text-slate-400" />
                Travel Clocks
              </h4>
              <button 
                onClick={() => onNavigate?.('globetrot')}
                className="text-xs font-bold text-indigo-600"
              >
                GlobeTrot
              </button>
            </div>
            <div className="space-y-4">
              {travelClocks.map((clock, i) => (
                <div key={i} className={cn(
                  "p-4 rounded-2xl flex items-center justify-between transition-all",
                  clock.active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-slate-50 text-slate-800"
                )}>
                  <div>
                    <h5 className="font-bold text-sm">{clock.city}</h5>
                    <p className={cn("text-[10px] font-bold uppercase tracking-widest", clock.active ? "text-indigo-200" : "text-slate-400")}>
                      GMT {clock.offset}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black tracking-tighter">{clock.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vault Health */}
          <div className="bg-emerald-600 rounded-3xl shadow-lg p-6 text-white overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold">Vault Health</h4>
              <CheckCircle2 size={20} className="text-emerald-200" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-black">92%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Security Score</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">+5%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">This Month</p>
                </div>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[92%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h4 className="font-bold text-slate-800 mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Scan Doc', icon: FileText, color: 'bg-emerald-50 text-emerald-600' },
                { name: 'Add Pass', icon: Shield, color: 'bg-blue-50 text-blue-600' },
                { name: 'New Note', icon: Calendar, color: 'bg-orange-50 text-orange-600' },
                { name: 'Ask AI', icon: Sparkles, color: 'bg-indigo-50 text-indigo-600', action: 'search' },
              ].map((action, i) => (
                <button 
                  key={i} 
                  onClick={() => {
                    if (action.action === 'search') {
                      // Trigger search in App.tsx (simulated)
                      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                      if (searchInput) {
                        searchInput.focus();
                        searchInput.value = "Ask AI: ";
                      }
                    }
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-50 hover:border-slate-200 transition-all group"
                >
                  <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", action.color)}>
                    <action.icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{action.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
