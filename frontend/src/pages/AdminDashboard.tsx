import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  FolderOpen, 
  AlertCircle, 
  CheckCircle2, 
  BarChart3, 
  ShieldCheck, 
  Activity,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';

import { collection, query, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/firebase';
import { generateFullReport } from '@/lib/reportUtility';
import { Loader2 } from 'lucide-react';



const pendingApprovals = [
  { id: 'INV-2026-046', type: 'Invoice', entity: 'TechCorp Merger', amount: 'KES 85,000', user: 'Jane Wambui' },
  { id: 'EXP-2026-012', type: 'Expense', entity: 'Court Filing Fees', amount: 'KES 5,000', user: 'Jane Wambui' },
  { id: 'BLOG-004', type: 'Blog Post', entity: 'New Land Act 2026', amount: 'N/A', user: 'Mark Macharia' },
];

export default function AdminDashboard() {
  const [blogCount, setBlogCount] = useState(0);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!data) return;
    setIsGenerating(true);
    try {
      await generateFullReport(data);
    } catch (error) {
      console.error('Report generation failed', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/admin-summary');
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'blog_posts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBlogCount(snapshot.size);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'blog_posts'));

    return () => unsubscribe();
  }, []);

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(Number(amount));
  };

  const getFontSize = (text: string) => {
    if (text.length > 18) return 'text-sm';
    if (text.length > 15) return 'text-base';
    if (text.length > 12) return 'text-lg';
    return 'text-xl';
  };

  const adminStats = [
    { label: 'Total Billed (YTD)', value: data ? formatCurrency(data.stats.totalBilled) : 'KES 0', trend: '+12.5%', trendUp: true, icon: <TrendingUp size={22} />, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Collected', value: data ? formatCurrency(data.stats.totalCollected) : 'KES 0', trend: '+8.2%', trendUp: true, icon: <CheckCircle2 size={22} />, color: 'text-green-600', bg: 'bg-green-500/10' },
    { label: 'Active Cases', value: data ? data.stats.activeCases.toString() : '0', trend: '+4.3%', trendUp: true, icon: <FolderOpen size={22} />, color: 'text-purple-600', bg: 'bg-purple-500/10' },
    { label: 'Collection Rate', value: data && data.stats.totalBilled > 0 
        ? `${Math.round((data.stats.totalCollected / data.stats.totalBilled) * 100)}%`
        : '0%', trend: '-2.1%', trendUp: false, icon: <Activity size={22} />, color: 'text-rose-600', bg: 'bg-rose-500/10' },
    { label: 'Billable Hours', value: data ? data.stats.billableHours.toLocaleString() : '0', trend: '+14.2%', trendUp: true, icon: <Clock size={22} />, color: 'text-orange-600', bg: 'bg-orange-500/10' },
  ];
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Firm Overview</h1>
          <p className="text-muted-foreground">Strategic insights and administrative controls for WakiliSmart.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/dashboard/admin/blog"
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-muted"
          >
            <FileText size={18} /> Manage Blog
          </Link>
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating || !data}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <BarChart3 size={18} />
            )}
            {isGenerating ? 'Generating...' : 'Generate Full Report'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {adminStats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl bg-background p-6 shadow-sm border border-border/50"
          >
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl mb-4", stat.bg, stat.color)}>
              {stat.icon}
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <p className={cn("mt-1 font-bold text-foreground transition-all", getFontSize(stat.value))}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Revenue Trends</h3>
            <select className="text-sm border-none bg-transparent font-semibold text-primary outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[350px] w-full rounded-2xl bg-background p-6 shadow-sm border border-border/50">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--color-muted-foreground)'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--color-muted-foreground)'}} tickFormatter={(value) => `K${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid var(--color-border)', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)'
                  }}
                  itemStyle={{ color: 'var(--color-primary)' }}
                  formatter={(value: number) => [`KES ${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-foreground">Pending Approvals</h3>
          <div className="rounded-2xl bg-background shadow-sm border border-border/50 overflow-hidden">
            <div className="divide-y divide-border/50">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {item.type}
                    </span>
                    <span className="text-xs text-muted-foreground/60">{item.user}</span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-foreground">{item.entity}</h4>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted-foreground">{item.amount}</span>
                    <div className="flex gap-2">
                      <button className="rounded-lg bg-muted p-1.5 text-muted-foreground hover:bg-muted/80">
                        <ChevronRight size={16} />
                      </button>
                      <button className="rounded-lg bg-primary p-1.5 text-primary-foreground hover:bg-primary/90">
                        <CheckCircle2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-3 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors">
              View All Approvals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
