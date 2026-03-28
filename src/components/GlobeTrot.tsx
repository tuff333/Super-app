import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Clock, 
  Calendar as CalendarIcon, 
  MapPin, 
  Plus, 
  MoreHorizontal, 
  Sun, 
  CloudRain, 
  Wind,
  Navigation,
  Ticket,
  CreditCard,
  User,
  Timer,
  History,
  Bell,
  AlarmClock,
  Globe,
  ChevronRight,
  Trash2,
  Moon
} from 'lucide-react';
import { format, addHours, addMinutes } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchExchangeRates } from '../services/exchangeService';
import { cn } from '../lib/utils';

type ClockTab = 'world' | 'alarm' | 'stopwatch' | 'timer';

export default function GlobeTrot() {
  const [activeTab, setActiveTab] = useState<ClockTab>('world');
  const [time, setTime] = useState(new Date());
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [timerTime, setTimerTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [rates, setRates] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const loadRates = async () => {
      const r = await fetchExchangeRates('INR');
      setRates(r);
    };
    loadRates();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isStopwatchRunning) {
      interval = setInterval(() => setStopwatchTime(prev => prev + 10), 10);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerTime > 0) {
      interval = setInterval(() => setTimerTime(prev => prev - 1), 1000);
    } else if (timerTime === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerTime]);

  const locations = [
    { city: 'New York', country: 'USA', timezone: 'America/New_York', temp: '12°C', icon: CloudRain, offset: '-10h', currency: 'USD' },
    { city: 'London', country: 'UK', timezone: 'Europe/London', temp: '8°C', icon: CloudRain, offset: '-5h 30m', currency: 'GBP' },
    { city: 'Ahmedabad', country: 'India', timezone: 'Asia/Kolkata', temp: '32°C', icon: Sun, offset: 'Local', currency: 'INR' },
    { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', temp: '15°C', icon: Wind, offset: '+3h 30m', currency: 'JPY' },
  ];

  const alarms = [
    { id: '1', time: '06:30', days: 'Mon, Tue, Wed, Thu, Fri', label: 'Morning Aarti', enabled: true, tithi: 'Sud 7' },
    { id: '2', time: '08:00', days: 'Sat, Sun', label: 'Weekend Puja', enabled: false },
    { id: '3', time: '12:00', days: 'Daily', label: 'Choghadiya Alert', enabled: true, type: 'choghadiya' },
  ];

  const getTimeForZone = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone,
    }).format(time);
  };

  const formatStopwatch = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const msec = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${msec.toString().padStart(2, '0')}`;
  };

  const formatTimer = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 rounded-[3rem] overflow-hidden border border-slate-200 dark:border-slate-800">
      {/* Tabs */}
      <div className="flex items-center justify-around p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        {(['world', 'alarm', 'stopwatch', 'timer'] as ClockTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeTab === tab ? "text-indigo-600 scale-110" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab === 'world' && <Globe size={24} />}
            {tab === 'alarm' && <AlarmClock size={24} />}
            {tab === 'stopwatch' && <History size={24} />}
            {tab === 'timer' && <Timer size={24} />}
            <span className="text-[10px] font-black uppercase tracking-widest">{tab}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        <AnimatePresence mode="wait">
          {activeTab === 'world' && (
            <motion.div 
              key="world"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">World Clock</h3>
                <button className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20">
                  <Plus size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locations.map((loc, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:shadow-xl transition-all">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{loc.city}, {loc.country}</p>
                      <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {getTimeForZone(loc.timezone)}
                      </h4>
                      <p className="text-[10px] font-bold text-indigo-500 mt-1">{loc.offset} from local</p>
                    </div>
                    <div className="text-right">
                      <loc.icon size={24} className="text-slate-300 group-hover:text-indigo-500 transition-colors ml-auto mb-2" />
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{loc.temp}</p>
                      {rates && loc.currency !== 'INR' && (
                        <p className="text-[10px] font-black text-emerald-500 mt-1">
                          1 {loc.currency} = {(1 / rates[loc.currency]).toFixed(2)} INR
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'alarm' && (
            <motion.div 
              key="alarm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Alarms</h3>
                <button className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20">
                  <Plus size={24} />
                </button>
              </div>
              <div className="space-y-4">
                {alarms.map((alarm) => (
                  <div key={alarm.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className={cn("text-4xl font-black tracking-tighter", alarm.enabled ? "text-slate-900 dark:text-white" : "text-slate-300 dark:text-slate-700")}>
                          {alarm.time}
                        </h4>
                        {alarm.tithi && (
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-[10px] font-black rounded-lg uppercase">
                            {alarm.tithi}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-400">{alarm.label} • {alarm.days}</p>
                    </div>
                    <button 
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-all",
                        alarm.enabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                        alarm.enabled ? "right-1" : "left-1"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'stopwatch' && (
            <motion.div 
              key="stopwatch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full py-12"
            >
              <div className="text-7xl font-black text-slate-900 dark:text-white font-mono tracking-tighter mb-12">
                {formatStopwatch(stopwatchTime)}
              </div>
              <div className="flex gap-6">
                <button 
                  onClick={() => setStopwatchTime(0)}
                  className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold flex items-center justify-center"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                  className={cn(
                    "w-20 h-20 rounded-full font-bold flex items-center justify-center shadow-xl transition-all",
                    isStopwatchRunning ? "bg-rose-600 text-white shadow-rose-600/20" : "bg-indigo-600 text-white shadow-indigo-600/20"
                  )}
                >
                  {isStopwatchRunning ? 'Stop' : 'Start'}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'timer' && (
            <motion.div 
              key="timer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full py-12"
            >
              {!isTimerRunning && timerTime === 0 ? (
                <div className="grid grid-cols-3 gap-8 mb-12">
                  {['Hours', 'Minutes', 'Seconds'].map((label) => (
                    <div key={label} className="flex flex-col items-center">
                      <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">00</div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-7xl font-black text-slate-900 dark:text-white font-mono tracking-tighter mb-12">
                  {formatTimer(timerTime)}
                </div>
              )}
              <div className="flex gap-6">
                <button 
                  onClick={() => { setTimerTime(0); setIsTimerRunning(false); }}
                  className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold flex items-center justify-center"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (timerTime === 0) setTimerTime(300); // Default 5 mins
                    setIsTimerRunning(!isTimerRunning);
                  }}
                  className={cn(
                    "w-20 h-20 rounded-full font-bold flex items-center justify-center shadow-xl transition-all",
                    isTimerRunning ? "bg-rose-600 text-white shadow-rose-600/20" : "bg-indigo-600 text-white shadow-indigo-600/20"
                  )}
                >
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
