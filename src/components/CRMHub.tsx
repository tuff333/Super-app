import React, { useState } from 'react';
import { 
  Users, 
  Target, 
  Mail, 
  BarChart3, 
  Layout, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  Zap, 
  TrendingUp, 
  MessageSquare, 
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  UserPlus,
  Briefcase,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { cn } from '../lib/utils';

type CRMTab = 'contacts' | 'campaigns' | 'pipelines' | 'analytics';

interface Deal {
  id: string;
  title: string;
  company: string;
  value: string;
  stage: string;
}

const INITIAL_DEALS: Deal[] = [
  { id: 'deal-1', title: 'Enterprise License', company: 'Global Tech', value: '$25,000', stage: 'Lead' },
  { id: 'deal-2', title: 'Cloud Migration', company: 'DataFlow', value: '$12,000', stage: 'Lead' },
  { id: 'deal-3', title: 'Security Audit', company: 'SafeBank', value: '$8,500', stage: 'Qualified' },
  { id: 'deal-4', title: 'Custom ERP', company: 'BuildIt', value: '$45,000', stage: 'Proposal' },
  { id: 'deal-5', title: 'Mobile App', company: 'Appify', value: '$18,000', stage: 'Negotiation' },
];

const STAGES = [
  { id: 'Lead', name: 'Lead', color: 'bg-indigo-500' },
  { id: 'Qualified', name: 'Qualified', color: 'bg-blue-500' },
  { id: 'Proposal', name: 'Proposal', color: 'bg-orange-500' },
  { id: 'Negotiation', name: 'Negotiation', color: 'bg-purple-500' },
  { id: 'Closed', name: 'Closed', color: 'bg-emerald-500' },
];

export default function CRMHub() {
  const [activeTab, setActiveTab] = useState<CRMTab>('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newDeals: Deal[] = Array.from(deals);
    const dealIndex = newDeals.findIndex((d: Deal) => d.id === draggableId);
    if (dealIndex !== -1) {
      newDeals[dealIndex].stage = destination.droppableId;
      setDeals(newDeals);
    }
  };

  const contacts = [
    { id: 1, name: 'Rasesh Patel', email: 'raseshp8@gmail.com', company: 'SuperApp Inc.', status: 'Active', value: '$12,500', lastContact: '2h ago' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@techflow.io', company: 'TechFlow', status: 'Lead', value: '$5,000', lastContact: '1d ago' },
    { id: 3, name: 'Michael Chen', email: 'm.chen@global.com', company: 'Global Logistics', status: 'Opportunity', value: '$45,000', lastContact: '3h ago' },
    { id: 4, name: 'Elena Rodriguez', email: 'elena@creative.co', company: 'Creative Co.', status: 'Active', value: '$8,200', lastContact: '5h ago' },
  ];

  const filteredContacts = contacts
    .filter(c => filterStatus === 'All' || c.status === filterStatus)
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.company.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      let aVal = (a as any)[key];
      let bVal = (b as any)[key];
      if (key === 'value') {
        aVal = parseFloat(aVal.replace(/[^0-9.-]+/g,""));
        bVal = parseFloat(bVal.replace(/[^0-9.-]+/g,""));
      }
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const campaigns = [
    { id: 1, name: 'Spring Product Launch', status: 'Running', leads: 1240, conversion: '4.2%', color: 'bg-indigo-500' },
    { id: 2, name: 'Re-engagement Email', status: 'Paused', leads: 850, conversion: '2.1%', color: 'bg-orange-500' },
    { id: 3, name: 'Newsletter Weekly', status: 'Scheduled', leads: 3200, conversion: '-', color: 'bg-emerald-500' },
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      {/* CRM Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Contacts', value: '12,840', change: '+12%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Active Campaigns', value: '24', change: '+3', icon: Target, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Pipeline Value', value: '$1.2M', change: '+18%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg. Conversion', value: '3.8%', change: '+0.4%', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main CRM Interface */}
      <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        {/* Navigation Tabs */}
        <div className="px-8 pt-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
            {[
              { id: 'contacts', name: 'Contacts', icon: Users },
              { id: 'campaigns', name: 'Marketing', icon: Mail },
              { id: 'pipelines', name: 'Sales', icon: Briefcase },
              { id: 'analytics', name: 'Insights', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CRMTab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <tab.icon size={16} />
                {tab.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search CRM..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-48 md:w-64 focus:ring-2 focus:ring-indigo-500/20 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          <AnimatePresence mode="wait">
            {activeTab === 'contacts' && (
              <motion.div 
                key="contacts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-black text-slate-900 tracking-tight">Active Contacts</h4>
                  <div className="flex items-center gap-2">
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all border-none focus:ring-0 cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Lead">Lead</option>
                      <option value="Opportunity">Opportunity</option>
                    </select>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all">
                      <Layers size={14} />
                      Segments
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="px-4 py-2 cursor-pointer hover:text-slate-600" onClick={() => handleSort('name')}>Contact {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                        <th className="px-4 py-2 cursor-pointer hover:text-slate-600" onClick={() => handleSort('company')}>Company {sortConfig?.key === 'company' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                        <th className="px-4 py-2 cursor-pointer hover:text-slate-600" onClick={() => handleSort('status')}>Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                        <th className="px-4 py-2 cursor-pointer hover:text-slate-600" onClick={() => handleSort('value')}>Deal Value {sortConfig?.key === 'value' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                        <th className="px-4 py-2 cursor-pointer hover:text-slate-600" onClick={() => handleSort('lastContact')}>Last Activity {sortConfig?.key === 'lastContact' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((contact) => (
                        <tr key={contact.id} className="bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer">
                          <td className="px-4 py-4 rounded-l-2xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-xs">
                                {contact.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{contact.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{contact.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-slate-600">{contact.company}</td>
                          <td className="px-4 py-4">
                            <span className={cn(
                              "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                              contact.status === 'Active' ? "bg-emerald-100 text-emerald-700" : 
                              contact.status === 'Lead' ? "bg-indigo-100 text-indigo-700" : "bg-orange-100 text-orange-700"
                            )}>
                              {contact.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm font-black text-slate-900">{contact.value}</td>
                          <td className="px-4 py-4 text-xs font-bold text-slate-400">{contact.lastContact}</td>
                          <td className="px-4 py-4 rounded-r-2xl text-right">
                            <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'campaigns' && (
              <motion.div 
                key="campaigns"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn("p-3 rounded-2xl text-white shadow-lg", campaign.color)}>
                        <Mail size={20} />
                      </div>
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        campaign.status === 'Running' ? "bg-emerald-100 text-emerald-700" : 
                        campaign.status === 'Paused' ? "bg-orange-100 text-orange-700" : "bg-indigo-100 text-indigo-700"
                      )}>
                        {campaign.status}
                      </span>
                    </div>
                    <h5 className="text-lg font-black text-slate-900 tracking-tight mb-2">{campaign.name}</h5>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leads</p>
                        <p className="text-xl font-black text-slate-900">{campaign.leads}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conversion</p>
                        <p className="text-xl font-black text-slate-900">{campaign.conversion}</p>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>
                        ))}
                      </div>
                      <button className="text-indigo-600 font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
                        View Details <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Create New Campaign Card */}
                <button className="bg-white rounded-[2rem] p-6 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center text-center group">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-white group-hover:text-indigo-600 transition-all mb-4">
                    <Plus size={24} />
                  </div>
                  <h5 className="font-bold text-slate-800">New Campaign</h5>
                  <p className="text-xs text-slate-400 mt-1">Automate your marketing</p>
                </button>
              </motion.div>
            )}

            {activeTab === 'pipelines' && (
              <motion.div 
                key="pipelines"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="flex gap-6 overflow-x-auto pb-6 h-full scrollbar-hide">
                    {STAGES.map((stage) => (
                      <div key={stage.id} className="w-72 shrink-0 flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", stage.color)}></div>
                            <h6 className="font-black text-slate-900 text-sm tracking-tight">{stage.name}</h6>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              {deals.filter(d => d.stage === stage.id).length}
                            </span>
                          </div>
                        </div>
                        
                        <Droppable droppableId={stage.id}>
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={cn(
                                "flex-1 space-y-3 p-2 rounded-2xl transition-colors min-h-[200px]",
                                snapshot.isDraggingOver ? "bg-slate-50" : "bg-transparent"
                              )}
                            >
                              {deals
                                .filter(deal => deal.stage === stage.id)
                                .map((deal, index) => (
                                  <div key={deal.id}>
                                    <Draggable draggableId={deal.id} index={index}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={cn(
                                            "bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing",
                                            snapshot.isDragging ? "shadow-2xl ring-2 ring-indigo-500/20" : ""
                                          )}
                                        >
                                          <h6 className="font-bold text-slate-800 text-sm mb-1">{deal.title}</h6>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">{deal.company}</p>
                                          <div className="flex justify-between items-center">
                                            <span className="text-xs font-black text-slate-900">{deal.value}</span>
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                              {deal.company[0]}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  </div>
                                ))}
                              {provided.placeholder}
                              <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all text-xs font-bold">
                                + Add Deal
                              </button>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    ))}
                  </div>
                </DragDropContext>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div 
                key="analytics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100">
                  <div className="flex justify-between items-center mb-8">
                    <h5 className="font-black text-slate-900 tracking-tight">Revenue Growth</h5>
                    <select className="bg-white border-none rounded-xl text-xs font-bold p-2 shadow-sm">
                      <option>Last 30 Days</option>
                      <option>Last 6 Months</option>
                    </select>
                  </div>
                  <div className="h-64 flex items-end gap-3">
                    {[40, 60, 45, 90, 65, 80, 100].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          className="w-full bg-indigo-500 rounded-t-xl group-hover:bg-indigo-600 transition-colors relative"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            ${h}k
                          </div>
                        </motion.div>
                        <span className="text-[10px] font-bold text-slate-400">Day {i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10">
                      <h5 className="text-xl font-black mb-2">AI Sales Predictor</h5>
                      <p className="text-slate-400 text-sm font-medium mb-6">Based on current pipeline, you are expected to close $450k in the next 30 days.</p>
                      <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition-all flex items-center gap-2">
                        <Zap size={16} />
                        View Forecast
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Win Rate</p>
                      <p className="text-2xl font-black text-slate-900">64%</p>
                      <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[64%] h-full bg-emerald-500"></div>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Churn Rate</p>
                      <p className="text-2xl font-black text-slate-900">2.4%</p>
                      <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[12%] h-full bg-rose-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
