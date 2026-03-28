import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  PieChart, 
  ShoppingBag, 
  Home, 
  Car, 
  Coffee, 
  Zap, 
  MoreHorizontal,
  ChevronRight,
  Target,
  CreditCard,
  DollarSign,
  RefreshCw,
  Layout,
  GripVertical,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '../lib/utils';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  icon: any;
  color: string;
}

interface Category {
  name: string;
  icon: any;
  budget: number;
  spent: number;
  color: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Salary', amount: 5000, category: 'Work', date: '2026-03-25', type: 'income', icon: DollarSign, color: 'bg-emerald-500' },
  { id: '2', title: 'Grocery Store', amount: 120.50, category: 'Food', date: '2026-03-24', type: 'expense', icon: ShoppingBag, color: 'bg-orange-500' },
  { id: '3', title: 'Monthly Rent', amount: 1500, category: 'Housing', date: '2026-03-01', type: 'expense', icon: Home, color: 'bg-blue-500' },
  { id: '4', title: 'Gas Station', amount: 45, category: 'Transport', date: '2026-03-22', type: 'expense', icon: Car, color: 'bg-purple-500' },
  { id: '5', title: 'Coffee Shop', amount: 5.50, category: 'Food', date: '2026-03-26', type: 'expense', icon: Coffee, color: 'bg-orange-500' },
  { id: '6', title: 'Electricity Bill', amount: 85, category: 'Utilities', date: '2026-03-15', type: 'expense', icon: Zap, color: 'bg-yellow-500' },
  { id: '7', title: 'Freelance Project', amount: 800, category: 'Work', date: '2026-03-20', type: 'income', icon: DollarSign, color: 'bg-emerald-500' },
];

const CATEGORIES: Category[] = [
  { name: 'Food', icon: Coffee, budget: 500, spent: 320, color: 'bg-orange-500' },
  { name: 'Housing', icon: Home, budget: 1500, spent: 1500, color: 'bg-blue-500' },
  { name: 'Transport', icon: Car, budget: 200, spent: 145, color: 'bg-purple-500' },
  { name: 'Utilities', icon: Zap, budget: 150, spent: 85, color: 'bg-yellow-500' },
  { name: 'Shopping', icon: ShoppingBag, budget: 300, spent: 120, color: 'bg-pink-500' },
];

const CHART_DATA = [
  { day: 'Mon', income: 0, expense: 120 },
  { day: 'Tue', income: 5000, expense: 45 },
  { day: 'Wed', income: 0, expense: 200 },
  { day: 'Thu', income: 800, expense: 5 },
  { day: 'Fri', income: 0, expense: 80 },
  { day: 'Sat', income: 0, expense: 150 },
  { day: 'Sun', income: 0, expense: 30 },
];

const SAVINGS_HISTORY = [
  { month: 'Oct', saved: 15000 },
  { month: 'Nov', saved: 17500 },
  { month: 'Dec', saved: 19000 },
  { month: 'Jan', saved: 21000 },
  { month: 'Feb', saved: 23500 },
  { month: 'Mar', saved: 25000 },
];

export default function Budgeted() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budgets'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgetOrder, setWidgetOrder] = useState(['stats', 'main-chart', 'budgets', 'savings', 'subscriptions', 'activity']);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return {
      balance: income - expenses,
      income,
      expenses,
      savingsRate: income > 0 ? ((income - expenses) / income * 100).toFixed(1) : '0'
    };
  }, [transactions]);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleAutoDetect = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Simulate finding a new subscription
      const newSub: Transaction = {
        id: Math.random().toString(),
        title: 'Netflix Subscription',
        amount: 15.99,
        category: 'Entertainment',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        icon: ShoppingBag,
        color: 'bg-rose-500'
      };
      setTransactions(prev => [newSub, ...prev]);
    }, 3000);
  };

  const renderWidget = (id: string) => {
    switch (id) {
      case 'stats':
        return (
          <div key="stats" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-900 dark:bg-indigo-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group"
            >
              {isEditMode && <GripVertical className="absolute top-4 left-4 opacity-50" size={20} />}
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Wallet size={120} />
              </div>
              <p className="text-indigo-100/70 font-bold text-sm uppercase tracking-widest mb-2">Total Balance</p>
              <h3 className="text-5xl font-black tracking-tighter mb-6">${stats.balance.toLocaleString()}</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold backdrop-blur-md">
                  <TrendingUp size={14} className="text-emerald-400" />
                  +12.5%
                </div>
                <p className="text-indigo-100/50 text-xs font-medium">vs last month</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative"
            >
              {isEditMode && <GripVertical className="absolute top-4 left-4 opacity-50" size={20} />}
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                  <TrendingUp size={24} />
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Income</p>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">${stats.income.toLocaleString()}</h4>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="mt-4 text-xs text-slate-500 font-medium">75% of monthly goal reached</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative"
            >
              {isEditMode && <GripVertical className="absolute top-4 left-4 opacity-50" size={20} />}
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl">
                  <TrendingDown size={24} />
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Expenses</p>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">${stats.expenses.toLocaleString()}</h4>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="mt-4 text-xs text-slate-500 font-medium">45% of monthly budget used</p>
            </motion.div>
          </div>
        );
      case 'main-chart':
        return (
          <div key="main-chart" className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative">
            {isEditMode && <GripVertical className="absolute top-4 left-4 opacity-50" size={20} />}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Spending Overview</h3>
                <p className="text-sm text-slate-500 font-medium">Daily income vs expenses</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleAutoDetect}
                  disabled={isScanning}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    isScanning ? "bg-slate-100 text-slate-400" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  )}
                >
                  <RefreshCw size={14} className={cn(isScanning && "animate-spin")} />
                  {isScanning ? "Scanning..." : "Auto-Detect Subscriptions"}
                </button>
                <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-indigo-500/20">
                  <option>This Week</option>
                  <option>Last Week</option>
                  <option>This Month</option>
                </select>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                  <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'budgets':
        return (
          <div key="budgets" className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative">
            {isEditMode && <GripVertical className="absolute top-4 left-4 opacity-50" size={20} />}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Budgets</h3>
              <button className="text-indigo-600 font-bold text-xs hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {CATEGORIES.slice(0, 4).map((cat, i) => {
                const percent = (cat.spent / cat.budget) * 100;
                let barColor = "bg-indigo-500";
                if (percent >= 100) barColor = "bg-rose-500";
                else if (percent >= 85) barColor = "bg-yellow-500";
                else if (percent >= 50) barColor = "bg-indigo-500";
                else barColor = "bg-emerald-500";

                return (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-xl text-white", cat.color)}>
                          <cat.icon size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{cat.name}</span>
                      </div>
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        ${cat.spent} <span className="text-slate-400 font-medium">/ ${cat.budget}</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percent, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn("h-full rounded-full transition-colors duration-500", barColor)}
                      />
                    </div>
                    {percent > 100 && <p className="text-[10px] text-rose-500 font-bold">Over budget by ${(cat.spent - cat.budget).toLocaleString()}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'savings':
        return (
          <div key="savings" className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
            {isEditMode && <GripVertical className="absolute top-4 left-4 opacity-50" size={20} />}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-black tracking-tight mb-2">Savings Goal</h3>
            <p className="text-slate-400 text-sm font-medium mb-8">New Tesla Model 3</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="relative w-full aspect-square">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800 stroke-current"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: "65, 100" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-indigo-500 stroke-current"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black">65%</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Saved</span>
                </div>
              </div>
              <div className="h-full flex flex-col justify-center">
                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SAVINGS_HISTORY}>
                      <Area type="monotone" dataKey="saved" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-2">Projected Completion: Aug 2026</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">$25,000 saved</span>
              <span>$40,000 goal</span>
            </div>
          </div>
        );
      case 'subscriptions':
        return (
          <div key="subscriptions" className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative">
            {isEditMode && <GripVertical className="absolute top-4 left-4 opacity-50" size={20} />}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Active Subscriptions</h3>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <MoreHorizontal size={20} className="text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-black text-lg">N</div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-indigo-600 transition-colors">Netflix</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Next billing: Oct 15</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm tracking-tight text-slate-900 dark:text-white">$15.99</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Monthly</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center font-black text-lg">S</div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-indigo-600 transition-colors">Spotify</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Next billing: Oct 22</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm tracking-tight text-slate-900 dark:text-white">$9.99</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Monthly</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 font-bold text-sm hover:border-indigo-500 hover:text-indigo-500 transition-all">
              Manage Subscriptions
            </button>
          </div>
        );
      case 'activity':
        return (
          <div key="activity" className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm h-full relative">
            {isEditMode && <GripVertical className="absolute top-4 left-4 opacity-50" size={20} />}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Activity</h3>
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button 
                    onClick={() => setFilterType('all')}
                    className={cn("px-3 py-1 text-[10px] font-bold rounded-lg transition-all", filterType === 'all' ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-400")}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setFilterType('income')}
                    className={cn("px-3 py-1 text-[10px] font-bold rounded-lg transition-all", filterType === 'income' ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-400")}
                  >
                    Income
                  </button>
                  <button 
                    onClick={() => setFilterType('expense')}
                    className={cn("px-3 py-1 text-[10px] font-bold rounded-lg transition-all", filterType === 'expense' ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-400")}
                  >
                    Expense
                  </button>
                </div>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <MoreHorizontal size={20} className="text-slate-400" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
              </div>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold px-4 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">Categories</option>
                {Array.from(new Set(transactions.map(t => t.category))).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {filteredTransactions.map((t, i) => (
                  <motion.div 
                    key={t.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("p-3 rounded-2xl text-white shadow-lg shadow-current/10", t.color)}>
                        <t.icon size={20} />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-indigo-600 transition-colors">{t.title}</h5>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.category} • {t.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-black text-sm tracking-tight",
                        t.type === 'income' ? "text-emerald-500" : "text-slate-900 dark:text-white"
                      )}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-bold">
                        <CreditCard size={10} />
                        VISA
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button className="w-full mt-8 py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 font-bold text-sm hover:border-indigo-500 hover:text-indigo-500 transition-all">
              View All Transactions
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Budgeted</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Master your money, one transaction at a time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={cn(
              "p-3 rounded-2xl transition-all shadow-sm flex items-center gap-2 font-bold text-sm",
              isEditMode ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500"
            )}
          >
            <Layout size={20} />
            {isEditMode ? "Save Layout" : "Edit Layout"}
          </button>
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1">
            <button 
              onClick={() => {
                const amount = prompt("Enter income amount:");
                if (amount) {
                  const newIncome: Transaction = {
                    id: Math.random().toString(),
                    title: 'New Income',
                    amount: parseFloat(amount),
                    category: 'Work',
                    date: new Date().toISOString().split('T')[0],
                    type: 'income',
                    icon: DollarSign,
                    color: 'bg-emerald-500'
                  };
                  setTransactions(prev => [newIncome, ...prev]);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform active:scale-95"
            >
              <Plus size={14} />
              Income
            </button>
            <button 
              onClick={() => {
                const amount = prompt("Enter expense amount:");
                if (amount) {
                  const newExpense: Transaction = {
                    id: Math.random().toString(),
                    title: 'New Expense',
                    amount: parseFloat(amount),
                    category: 'Other',
                    date: new Date().toISOString().split('T')[0],
                    type: 'expense',
                    icon: ShoppingBag,
                    color: 'bg-rose-500'
                  };
                  setTransactions(prev => [newExpense, ...prev]);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-rose-500 rounded-xl font-bold text-xs hover:bg-rose-50 transition-all active:scale-95 ml-1"
            >
              <Plus size={14} />
              Expense
            </button>
          </div>
          <button 
            onClick={() => {
              const amount = prompt("Enter transaction amount:");
              if (amount) {
                const type = prompt("Enter type (income/expense):")?.toLowerCase() || 'expense';
                const title = prompt("Enter description:") || 'New Transaction';
                const newTx: Transaction = {
                  id: Math.random().toString(),
                  title,
                  amount: parseFloat(amount),
                  category: 'Other',
                  date: new Date().toISOString().split('T')[0],
                  type: type as 'income' | 'expense',
                  icon: type === 'income' ? DollarSign : ShoppingBag,
                  color: type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'
                };
                setTransactions(prev => [newTx, ...prev]);
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:scale-105 transition-transform active:scale-95"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        </div>
      </div>

      {isEditMode ? (
        <Reorder.Group axis="y" values={widgetOrder} onReorder={setWidgetOrder} className="space-y-8">
          {widgetOrder.map((id) => (
            <Reorder.Item key={id} value={id}>
              {id === 'stats' && renderWidget('stats')}
              {id === 'main-chart' && renderWidget('main-chart')}
              {id === 'budgets' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {renderWidget('budgets')}
                  {renderWidget('savings')}
                </div>
              )}
              {id === 'subscriptions' && renderWidget('subscriptions')}
              {id === 'activity' && renderWidget('activity')}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div className="space-y-8">
          {renderWidget('stats')}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {renderWidget('main-chart')}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderWidget('budgets')}
                {renderWidget('savings')}
              </div>
            </div>
            <div className="space-y-8">
              {renderWidget('subscriptions')}
              {renderWidget('activity')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
