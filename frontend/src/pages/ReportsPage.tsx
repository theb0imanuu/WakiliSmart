import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  Download, 
  Filter, 
  Calendar, 
  TrendingUp, 
  Users, 
  FolderOpen, 
  Clock 
} from 'lucide-react';
import { cn } from '@/lib/utils';



export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/analytics');
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(Number(amount));
  };

  const reportStats = [
    { label: 'Total Billed', value: data ? formatCurrency(data.stats.totalBilled) : 'KES 0', icon: <TrendingUp />, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Collected', value: data ? formatCurrency(data.stats.totalCollected) : 'KES 0', icon: <CheckCircle2 />, color: 'text-green-600', bg: 'bg-green-500/10' },
    { label: 'Active Cases', value: data ? data.stats.activeCases.toString() : '0', icon: <FolderOpen />, color: 'text-purple-600', bg: 'bg-purple-500/10' },
    { label: 'Billable Hours', value: data ? data.stats.billableHours.toLocaleString() : '0', icon: <Clock />, color: 'text-orange-600', bg: 'bg-orange-500/10' },
  ];

  if (loading) {
     return (
       <div className="flex h-[60vh] items-center justify-center">
         <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
       </div>
     );
  }

  const exportPDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Add Header (Logo & Title)
    // Logo can be added if available in base64, else we just do text. Since we can't easily fetch and convert logo.svg safely here, we will just draw text header.
    // Let's add a styled header
    doc.setFillColor(30, 58, 138); // bg-primary
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('WakiliSmart', 14, 20);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'italic');
    doc.text('Analytics & Performance Report', 14, 30);

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 14, 25, { align: 'right' });

    // 2. Executive Summary Metrics
    let currentY = 50;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', 14, currentY);
    
    currentY += 10;
    
    // Format metrics into a table
    const statsData = [
      ['Total Billed', formatCurrency(data.stats.totalBilled)],
      ['Total Collected', formatCurrency(data.stats.totalCollected)],
      ['Active Cases', data.stats.activeCases.toString()],
      ['Billable Hours', data.stats.billableHours.toLocaleString()],
    ];

    autoTable(doc, {
      startY: currentY,
      head: [['Metric', 'Value']],
      body: statsData,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138] },
      alternateRowStyles: { fillColor: [240, 244, 248] },
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;

    // 3. Revenue vs Expenses
    if (data.revenueData && data.revenueData.length > 0) {
      if (currentY > 250) { doc.addPage(); currentY = 20; }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Revenue vs Expenses Overview', 14, currentY);
      
      const revExpData = data.revenueData.map((item: any) => [
        item.name, 
        formatCurrency(item.revenue), 
        formatCurrency(item.expenses)
      ]);
      
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Period', 'Revenue', 'Expenses']],
        body: revExpData,
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138] }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    // 4. Case Distribution
    if (data.caseData && data.caseData.length > 0) {
      if (currentY > 250) { doc.addPage(); currentY = 20; }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Case Distribution By Area', 14, currentY);
      
      const caseDistData = data.caseData.map((item: any) => [item.name, item.value.toString()]);
      
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Practice Area', 'Number of Cases']],
        body: caseDistData,
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138] }
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    // 5. Time Tracking
    if (data.timeData && data.timeData.length > 0) {
      if (currentY > 250) { doc.addPage(); currentY = 20; }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Weekly Billable Hours', 14, currentY);
      
      const timeDistData = data.timeData.map((item: any) => [item.name, `${item.hours} hours`]);
      
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Week', 'Billable Hours']],
        body: timeDistData,
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138] }
      });
    }

    // Save and download
    doc.save('WakiliSmart_Detailed_Report.pdf');
  };

  return (
    <div className="space-y-8 bg-background p-4 rounded-xl" id="report-container">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Comprehensive insights into firm performance and operations.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted">
            <Calendar size={18} /> Last 6 Months
          </button>
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-lg"
          >
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reportStats.map((stat, idx) => (
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
            <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Revenue vs Expenses */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">Revenue vs Expenses</h3>
          <div className="h-[350px] w-full rounded-2xl bg-background p-6 shadow-sm border border-border/50">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--color-muted-foreground)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--color-muted-foreground)'}} tickFormatter={(v) => `K${v/1000}k`} />
                <Tooltip cursor={{fill: 'var(--color-muted)'}} contentStyle={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Bar dataKey="revenue" name="Revenue" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#64748b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Case Distribution */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">Case Distribution</h3>
          <div className="h-[350px] w-full rounded-2xl bg-background p-6 shadow-sm border border-border/50 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.caseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data?.caseData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', borderRadius: '12px', border: '1px solid var(--color-border)' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Analysis */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Weekly Billable Hours</h3>
          <div className="h-[300px] w-full rounded-2xl bg-background p-6 shadow-sm border border-border/50">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.timeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--color-muted-foreground)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--color-muted-foreground)'}} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', borderRadius: '12px', border: '1px solid var(--color-border)' }} />
                <Line type="monotone" dataKey="hours" stroke="#1e3a8a" strokeWidth={3} dot={{ r: 6, fill: '#1e3a8a', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
