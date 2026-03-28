import { useState, useEffect } from 'react';
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
  Plus,
  MoreVertical,
  CreditCard,
  Globe,
  GripVertical,
  Trash2,
  Layout,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { cn } from '../lib/utils';
import { AppModule } from '../types';
import NirnayWidget from './NirnayWidget';

interface Widget {
  id: string;
  type: 'ai' | 'panchang' | 'alerts' | 'docs' | 'timeline' | 'clocks' | 'vault';
  title: string;
  size: 'small' | 'medium' | 'large';
}

interface SuperDashboardProps {
  onNavigate?: (module: AppModule) => void;
}

export default function SuperDashboard({ onNavigate }: SuperDashboardProps) {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const saved = localStorage.getItem('super-app-widgets');
    return saved ? JSON.parse(saved) : [
      { id: 'w1', type: 'ai', title: 'AI Nexus Insight', size: 'medium' },
      { id: 'w2', type: 'panchang', title: 'Nirnay Pro', size: 'medium' },
      { id: 'w3', type: 'alerts', title: 'Intelligent Alerts', size: 'large' },
      { id: 'w4', type: 'timeline', title: 'Today\'s Timeline', size: 'medium' },
      { id: 'w5', type: 'clocks', title: 'Travel Clocks', size: 'medium' },
      { id: 'w6', type: 'vault', title: 'Vault Health', size: 'medium' },
      { id: 'w7', type: 'docs', title: 'Recent Documents', size: 'large' },
    ];
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [showWidgetGallery, setShowWidgetGallery] = useState(false);

  const availableWidgets: { type: Widget['type'], title: string, desc: string, icon: any }[] = [
    { type: 'ai', title: 'AI Nexus', desc: 'Intelligent insights and travel assistance.', icon: Sparkles },
    { type: 'panchang', title: 'Nirnay Pro', desc: 'Gujarati calendar, panchang, and spiritual tools.', icon: Calendar },
    { type: 'alerts', title: 'Alerts', desc: 'Security, travel, and spiritual notifications.', icon: AlertCircle },
    { type: 'timeline', title: 'Timeline', desc: 'Your daily schedule and upcoming events.', icon: Clock },
    { type: 'clocks', title: 'Travel Clocks', desc: 'World clocks for your favorite cities.', icon: Globe },
    { type: 'vault', title: 'Vault Health', desc: 'Monitor your digital security status.', icon: Shield },
    { type: 'docs', title: 'Documents', desc: 'Quick access to your recent files.', icon: FileText },
  ];

  useEffect(() => {
    localStorage.setItem('super-app-widgets', JSON.stringify(widgets));
  }, [widgets]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setWidgets(items);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const addWidget = (type: Widget['type']) => {
    const newWidget: Widget = {
      id: `w-${Date.now()}`,
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      size: type === 'alerts' || type === 'docs' ? 'large' : 'medium'
    };
    setWidgets([...widgets, newWidget]);
  };

  const [alerts, setAlerts] = useState([
    { type: 'warning', title: 'Passport Expiring', desc: 'Your passport expires in 6 months. Auspicious day to apply: Mar 25.', icon: Plane, color: 'text-rose-600', bg: 'bg-rose-50' },
    { type: 'info', title: 'Ekadashi Tomorrow', desc: 'Vrat katha and timings available in Nirnay Pro.', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
    { type: 'success', title: 'Security Scan Complete', desc: 'No new breaches detected. Privacy score: 92/100.', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]);

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case 'ai':
        return (
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group h-full flex flex-col justify-between">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all"></div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-indigo-400" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">AI Nexus Insight</h4>
              </div>
              <p className="text-base font-medium leading-relaxed">
                "Based on your upcoming India trip, I've prepared a travel checklist and currency conversion shortcuts in GlobeTrot."
              </p>
            </div>
            <button 
              onClick={() => onNavigate?.('globetrot')}
              className="mt-4 flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View Checklist <ArrowUpRight size={16} />
            </button>
          </div>
        );
      case 'panchang':
        return <NirnayWidget onNavigate={onNavigate} />;
      case 'alerts':
        return (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden h-full">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <AlertCircle size={18} className="text-slate-400" />
                Intelligent Alerts
              </h4>
              <button onClick={() => setAlerts([])} className="text-[10px] font-bold text-slate-400 hover:text-slate-600">Clear All</button>
            </div>
            <div className="divide-y divide-slate-50 overflow-y-auto max-h-[200px]">
              {alerts.map((alert, i) => (
                <div key={i} className="p-4 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className={cn("p-2 rounded-xl shrink-0 transition-transform group-hover:scale-110", alert.bg, alert.color)}>
                    <alert.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-800 text-xs truncate">{alert.title}</h5>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">2m ago</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'timeline':
        return (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                Today's Timeline
              </h4>
              <button onClick={() => onNavigate?.('nirnay')} className="text-[10px] font-bold text-indigo-600">View All</button>
            </div>
            <div className="space-y-4 overflow-y-auto">
              {[
                { time: '09:00 AM', title: 'Netflix Renewal', icon: CreditCard },
                { time: '02:30 PM', title: 'Mom\'s Birthday', icon: Plane },
                { time: '06:00 PM', title: 'Satsang Sabha', icon: Calendar },
              ].map((event, i) => (
                <div key={i} className="flex gap-3 group cursor-pointer">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase whitespace-nowrap">{event.time}</span>
                    <div className="w-0.5 flex-1 bg-slate-100 group-last:hidden"></div>
                  </div>
                  <div className="flex-1 pb-3 group-last:pb-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-800 text-xs">{event.title}</h5>
                      <event.icon size={12} className="text-slate-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'clocks':
        return (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Globe size={16} className="text-slate-400" />
                Travel Clocks
              </h4>
              <button onClick={() => onNavigate?.('globetrot')} className="text-[10px] font-bold text-indigo-600">GlobeTrot</button>
            </div>
            <div className="space-y-3">
              {[
                { city: 'Ahmedabad', time: '07:04 AM', active: true },
                { city: 'New York', time: '09:34 PM', active: false },
              ].map((clock, i) => (
                <div key={i} className={cn(
                  "p-3 rounded-2xl flex items-center justify-between transition-all",
                  clock.active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-slate-50 text-slate-800"
                )}>
                  <h5 className="font-bold text-xs">{clock.city}</h5>
                  <p className="text-sm font-black tracking-tighter">{clock.time}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'vault':
        return (
          <div className="bg-emerald-600 rounded-3xl shadow-lg p-6 text-white overflow-hidden relative group h-full flex flex-col justify-between">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-sm">Vault Health</h4>
              <CheckCircle2 size={18} className="text-emerald-200" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-black">92%</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Security Score</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[92%] rounded-full"></div>
              </div>
            </div>
          </div>
        );
      case 'docs':
        return (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden h-full">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileText size={18} className="text-slate-400" />
                Recent Documents
              </h4>
              <button onClick={() => onNavigate?.('office')} className="text-[10px] font-bold text-indigo-600">View All</button>
            </div>
            <div className="p-2 grid grid-cols-2 gap-2">
              {[
                { name: 'Wedding_Invite.pdf', type: 'PDF' },
                { name: 'Q1_Expenses.xlsx', type: 'Excel' },
              ].map((file, i) => (
                <div key={i} className="p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 mb-2 group-hover:bg-white group-hover:shadow-sm">
                    <FileText size={16} />
                  </div>
                  <h5 className="font-bold text-slate-800 text-[10px] truncate">{file.name}</h5>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">Jay Swaminarayan, Rasesh</h3>
          <p className="text-slate-500 mt-1 font-medium">Here's what's happening in your digital ecosystem today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={cn(
              "p-2.5 rounded-2xl shadow-lg transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest",
              isEditMode 
                ? "bg-emerald-600 text-white shadow-emerald-600/20" 
                : "bg-white text-slate-600 border border-slate-200 shadow-sm hover:bg-slate-50"
            )}
          >
            <Layout size={18} />
            {isEditMode ? 'Save Layout' : 'Edit Widgets'}
          </button>
          {isEditMode && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowWidgetGallery(true)}
                className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20 hover:scale-105 transition-transform flex items-center gap-2 px-4"
              >
                <Plus size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Add Widget</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Widget Gallery Modal */}
      <AnimatePresence>
        {showWidgetGallery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-800">Widget Gallery</h3>
                  <p className="text-sm font-medium text-slate-500">Personalize your dashboard with intelligent tools.</p>
                </div>
                <button onClick={() => setShowWidgetGallery(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableWidgets.map((w) => (
                  <button
                    key={w.type}
                    onClick={() => {
                      addWidget(w.type);
                      setShowWidgetGallery(false);
                    }}
                    className="flex items-start gap-4 p-5 rounded-3xl border-2 border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all text-left group"
                  >
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-indigo-600 group-hover:scale-110 transition-transform">
                      <w.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{w.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{w.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dashboard-widgets" direction="horizontal">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {widgets.map((widget, index) => (
                <Draggable 
                  key={widget.id} 
                  draggableId={widget.id} 
                  index={index}
                  isDragDisabled={!isEditMode}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "relative group",
                        widget.size === 'large' ? "md:col-span-2 lg:col-span-2" : "col-span-1",
                        snapshot.isDragging ? "z-50" : ""
                      )}
                    >
                      {isEditMode && (
                        <div className="absolute -top-3 -right-3 z-20 flex gap-2">
                          <div 
                            {...provided.dragHandleProps}
                            className="p-2 bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical size={14} />
                          </div>
                          <button 
                            onClick={() => removeWidget(widget.id)}
                            className="p-2 bg-white rounded-full shadow-lg border border-slate-100 text-rose-500 hover:bg-rose-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                      <motion.div
                        layout
                        className={cn(
                          "h-full transition-all",
                          isEditMode ? "scale-[0.98] ring-2 ring-indigo-500/20 rounded-[2.5rem]" : ""
                        )}
                      >
                        {renderWidgetContent(widget)}
                      </motion.div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
