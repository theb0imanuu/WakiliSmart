import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  CreditCard, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Printer,
  X,
  Trash2,
  Mail,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const statusStyles = {
  PAID: 'bg-green-500/10 text-green-600 border-green-200',
  SENT: 'bg-blue-500/10 text-blue-600 border-blue-200',
  PARTIALLY_PAID: 'bg-orange-500/10 text-orange-600 border-orange-200',
  OVERDUE: 'bg-red-500/10 text-red-600 border-red-200',
  DRAFT: 'bg-slate-500/10 text-slate-600 border-slate-200',
  APPROVED: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
  VOIDED: 'bg-gray-500/10 text-gray-500 border-gray-200 text-gray-400',
};

export default function BillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [invoiceableCases, setInvoiceableCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'MPESA',
    reference: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, statsRes] = await Promise.all([
        api.get('/billing'),
        api.get('/billing/stats')
      ]);
      setInvoices(invRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch billing data', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceableCases = async () => {
    try {
      const res = await api.get('/billing/unbilled-cases');
      setInvoiceableCases(res.data);
    } catch (error) {
      console.error('Failed to fetch invoiceable cases:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateInvoice = async () => {
    if (!selectedCaseId) return;
    setIsSubmitting(true);
    try {
      await api.post(`/billing/invoice/${selectedCaseId}`);
      setShowCreateModal(false);
      setSelectedCaseId('');
      fetchData();
    } catch (error) {
      alert('Failed to generate invoice. Please ensure the case has unbilled time or disbursements.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedInvoice?.id || !paymentData.amount) return;
    setIsSubmitting(true);
    try {
      await api.post(`/billing/${selectedInvoice.id}/payment`, {
        ...paymentData,
        amount: parseFloat(paymentData.amount)
      });
      setShowPaymentModal(false);
      setPaymentData({ amount: '', method: 'MPESA', reference: '', notes: '' });
      fetchData();
    } catch (error) {
      alert('Failed to record payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (inv: any) => {
    setSelectedInvoice(inv);
    setShowReceipt(true);
    setActiveMenuId(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleVoid = async (id: number) => {
    if (!window.confirm('Are you sure you want to void this invoice? This action cannot be undone.')) return;
    try {
      await api.patch(`/billing/${id}/status`, { status: 'VOIDED' });
      fetchData();
      setActiveMenuId(null);
    } catch (error) {
      console.error('Failed to void invoice', error);
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = 
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.client?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.case?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const handleExport = () => {
    if (filteredInvoices.length === 0) return;

    const headers = ['Reference', 'Client', 'Matter', 'Total (KES)', 'Paid', 'Balance', 'Status', 'Date'];
    const rows = filteredInvoices.map(inv => [
      inv.invoiceNumber,
      inv.client?.fullName || 'N/A',
      inv.case?.title || 'N/A',
      inv.totalAmount,
      inv.amountPaid,
      inv.balanceDue,
      inv.status,
      new Date(inv.issueDate).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `invoices_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(Number(amount));
  };

  const billingStats = [
    { 
      label: 'Total Revenue', 
      value: stats ? formatCurrency(stats.totalRevenue) : 'KES 0', 
      icon: <TrendingUp />, 
      color: 'text-green-600 bg-green-500/10'
    },
    { 
      label: 'Outstanding', 
      value: stats ? formatCurrency(stats.outstanding) : 'KES 0', 
      icon: <Clock />, 
      color: 'text-orange-600 bg-orange-500/10'
    },
    { 
      label: 'Paid Invoices', 
      value: stats ? stats.paidCount.toString() : '0', 
      icon: <CheckCircle2 />, 
      color: 'text-blue-600 bg-blue-500/10'
    },
    { 
      label: 'Overdue', 
      value: stats ? stats.overdueCount.toString() : '0', 
      icon: <AlertCircle />, 
      color: 'text-red-600 bg-red-500/10'
    },
  ];

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Billing & Invoicing</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage legal fees, track payments, and monitor revenue.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            title="Refresh Data"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-border bg-background text-muted-foreground transition-all hover:bg-muted active:scale-95"
          >
            <RotateCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="flex items-center justify-center gap-3 rounded-2xl border-2 border-border bg-background px-6 h-12 text-sm font-bold text-foreground/80 transition-all hover:bg-muted active:scale-95">
            <CreditCard size={18} /> Record Payment
          </button>
          <button className="flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 h-12 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 active:scale-95">
            <Plus size={22} /> New Invoice
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 print:hidden">
        {billingStats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-[2rem] bg-background p-6 shadow-sm border border-border/50 relative overflow-hidden group hover:border-primary/30 transition-all"
          >
            <div className="relative z-10">
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl transition-all group-hover:shadow-lg", stat.color)}>
                {React.cloneElement(stat.icon as any, { size: 22 })}
              </div>
              <div className="mt-6">
                <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="mt-1 text-2xl font-black text-foreground tabular-nums tracking-tighter">
                  {loading ? '---' : stat.value}
                </p>
              </div>
            </div>
            {/* Ambient Background Icon */}
            <div className="absolute -right-10 -bottom-10 opacity-[0.05] group-hover:opacity-[0.08] transition-all transform group-hover:-rotate-12 group-hover:scale-110">
               {React.cloneElement(stat.icon as any, { size: 140 })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 rounded-[2.5rem] bg-background p-6 shadow-sm border border-border/50 lg:flex-row lg:items-center print:hidden">
        <div className="relative flex-1">
          <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30" />
          <input
            type="text"
            placeholder="Search invoices, clients or case references..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border-2 border-border/50 bg-muted/20 pl-16 pr-6 py-4 text-sm font-bold outline-none transition-all focus:border-primary focus:bg-background focus:ring-[12px] focus:ring-primary/5 placeholder:text-muted-foreground/40"
          />
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 px-8 py-4 text-sm font-black transition-all uppercase tracking-widest",
              statusFilter !== 'ALL' || showFilterMenu
                ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-primary"
            )}
          >
            <Filter size={18} /> {statusFilter === 'ALL' ? 'Filters' : statusFilter.replace(/_/g, ' ')}
          </button>

          <AnimatePresence>
            {showFilterMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowFilterMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute right-0 top-20 z-50 w-64 overflow-hidden rounded-[2rem] border-2 border-border/50 bg-background p-3 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]"
                >
                  <div className="space-y-1">
                    {['ALL', 'PAID', 'SENT', 'PARTIALLY_PAID', 'OVERDUE', 'DRAFT', 'APPROVED', 'VOIDED'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowFilterMenu(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-black transition-all",
                          statusFilter === status
                            ? "bg-primary text-white"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          status === 'ALL' ? "bg-slate-400" : 
                          status === 'PAID' ? "bg-green-500" :
                          status === 'SENT' ? "bg-blue-500" :
                          status === 'OVERDUE' ? "bg-red-500" : "bg-slate-400"
                        )} />
                        {status.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <button 
            onClick={handleExport}
            className="flex items-center gap-3 rounded-2xl border-2 border-border bg-background px-8 py-4 text-sm font-black text-muted-foreground hover:border-primary/50 hover:text-primary transition-all uppercase tracking-widest active:scale-95"
          >
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* Invoice Table container */}
      <div className="overflow-hidden rounded-[3rem] bg-background shadow-xl shadow-muted/20 border border-border/50 print:hidden relative">
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-muted/40">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">Reference</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">Description</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">Issue Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">Invoice Total</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">Outstanding</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-8 py-6 h-16 bg-muted/10"></td>
                  </tr>
                ))
              ) : filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="group hover:bg-primary/[0.02] transition-colors relative">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <FileText size={20} />
                        </div>
                        <div>
                          <span className="text-base font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{inv.invoiceNumber}</span>
                          <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest mt-0.5">Regular Invoice</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-foreground line-clamp-1">{inv.case?.title}</p>
                        <p className="text-xs font-bold text-muted-foreground/70">{inv.client?.fullName}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-muted-foreground/80">
                      {new Date(inv.issueDate).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-foreground tabular-nums">
                      {formatCurrency(inv.totalAmount)}
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] border-2 shadow-sm transition-all group-hover:shadow-md",
                        statusStyles[inv.status as keyof typeof statusStyles]
                      )}>
                        {inv.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-sm font-black text-destructive tabular-nums">
                        {formatCurrency(inv.balanceDue)}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right relative">
                      <div className="flex items-center justify-end">
                         <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === inv.id ? null : inv.id);
                          }}
                          className={cn(
                            "h-12 w-12 flex items-center justify-center rounded-2xl transition-all",
                            activeMenuId === inv.id 
                              ? "bg-primary text-primary-foreground shadow-xl shadow-primary/30" 
                              : "text-muted-foreground/30 hover:bg-muted hover:text-foreground active:scale-95"
                          )}
                        >
                          <MoreVertical size={24} />
                        </button>

                        <AnimatePresence>
                          {activeMenuId === inv.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                className="absolute right-0 top-16 z-50 w-64 overflow-hidden rounded-[2rem] border-2 border-border/50 bg-background p-3 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]"
                              >
                                <div className="space-y-1">
                                  <button 
                                    onClick={() => handleDownload(inv)}
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-black text-foreground hover:bg-primary/5 hover:text-primary transition-all group/item"
                                  >
                                    <Printer size={18} className="text-primary/60 group-hover/item:scale-110 transition-transform" /> Print Receipt
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setSelectedInvoice(inv);
                                      setPaymentData(prev => ({ ...prev, amount: inv.balanceDue.toString() }));
                                      setShowPaymentModal(true);
                                      setActiveMenuId(null);
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-black text-foreground hover:bg-green-50/50 hover:text-green-600 transition-all group/item"
                                  >
                                    <CreditCard size={18} className="text-green-500/60 group-hover/item:scale-110 transition-transform" /> Record Payment
                                  </button>
                                  <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-black text-foreground hover:bg-blue-50/50 hover:text-blue-600 transition-all group/item">
                                    <Mail size={18} className="text-blue-500/60 group-hover/item:scale-110 transition-transform" /> Send via Email
                                  </button>
                                  <div className="mx-2 my-2 border-t border-border/50" />
                                  <button 
                                    onClick={() => handleVoid(inv.id)}
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-black text-destructive hover:bg-destructive/10 transition-all group/item"
                                  >
                                    <Trash2 size={18} className="group-hover/item:scale-110 transition-transform" /> Void Invoice
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                        <FileText size={40} className="text-muted-foreground/20" />
                      </div>
                      <h3 className="font-black text-foreground">No invoices found</h3>
                      <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Branded Receipt Modal */}
      <AnimatePresence>
        {showReceipt && selectedInvoice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:p-0 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 print:hidden" 
              onClick={() => setShowReceipt(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative z-[110] w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[3rem] bg-white p-12 shadow-[0_64px_128px_-24px_rgba(0,0,0,0.3)] border border-border/50 print:m-0 print:border-0 print:p-0 print:shadow-none"
            >
              {/* Modal Controls */}
              <div className="absolute right-10 top-10 flex items-center gap-3 print:hidden">
                  <button 
                    onClick={handlePrint}
                    className="flex items-center gap-3 rounded-2xl bg-primary px-8 py-3.5 text-sm font-black text-white shadow-2xl shadow-primary/40 hover:bg-primary/90 hover:-translate-y-0.5 transition-all active:scale-95"
                  >
                    <Printer size={20} /> PRINT / SAVE PDF
                  </button>
                  <button 
                    onClick={() => setShowReceipt(false)}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all"
                  >
                    <X size={24} />
                  </button>
              </div>

              <div className="print:p-10">
                {/* Firm Header */}
                <div className="flex items-start justify-between border-b-8 border-primary/5 pb-12">
                  <div className="space-y-8">
                    <div className="flex items-center gap-6">
                      <div className="h-20 w-20 flex items-center justify-center shadow-2xl shadow-primary/20">
                         <img src="/logo.svg" alt="Firm Logo" className="h-20 w-20" />
                      </div>
                      <div>
                        <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase leading-tight italic">WakiliSmart</h2>
                        <p className="text-[12px] font-black tracking-[0.4em] text-primary/60 mt-1 uppercase">Legal Professional Systems</p>
                      </div>
                    </div>
                    <div className="text-xs font-black text-muted-foreground/40 space-y-2 uppercase tracking-[0.15em] pl-2 border-l-4 border-primary/10">
                      <p>Upper Hill, Lawyer's Plaza, 3rd Floor</p>
                      <p>P.O Box 4567-00100, Nairobi, Kenya</p>
                      <p className="text-primary/40">E: accounts@wakilismart.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-block px-5 py-2 bg-primary text-white rounded-full mb-8 shadow-xl shadow-primary/20">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em]">Matter Invoice</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">Reference No.</p>
                      <p className="text-4xl font-black text-foreground tracking-tighter tabular-nums">{selectedInvoice.invoiceNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-16 grid grid-cols-2 gap-16">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-1.5 w-8 bg-primary rounded-full" />
                      <p className="text-[11px] font-black text-muted-foreground/40 uppercase tracking-widest">Client Account</p>
                    </div>
                    <h3 className="text-2xl font-black text-foreground leading-tight">{selectedInvoice.client?.fullName}</h3>
                    <p className="text-sm font-bold text-muted-foreground/60 mt-2 tracking-wide">Account Ref: {selectedInvoice.client?.clientId || 'PRV-MAT-001'}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[11px] font-black text-muted-foreground/40 uppercase tracking-widest mb-3">Invoice Summary</p>
                     <div className="space-y-2">
                        <div className="flex justify-end gap-10 text-xs">
                           <span className="font-bold text-muted-foreground/40 uppercase">Issue Date</span>
                           <span className="font-black text-foreground">{new Date(selectedInvoice.issueDate).toLocaleDateString()}</span>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="mt-12 rounded-[2rem] bg-muted/20 p-8 border-2 border-border/50 relative overflow-hidden">
                  <div className="relative z-10 flex items-center justify-between">
                     <div>
                        <p className="text-[11px] font-black text-primary uppercase tracking-widest mb-2">Matter Information</p>
                        <p className="text-xl font-black text-foreground tracking-tight">{selectedInvoice.case?.title}</p>
                     </div>
                     <FileText size={48} className="text-primary/10" />
                  </div>
                </div>

                <div className="mt-16">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-4 border-border/50 text-left">
                        <th className="pb-6 text-[11px] font-black text-muted-foreground/40 uppercase tracking-widest">Detailed Description</th>
                        <th className="pb-6 text-right text-[11px] font-black text-muted-foreground/40 uppercase tracking-widest">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      <tr className="group">
                        <td className="py-8">
                          <p className="text-base font-black text-foreground">Consolidated Legal Services & Disbursements</p>
                          <p className="text-xs font-bold text-muted-foreground/60 mt-1 max-w-md">Itemized professional fees inclusive of research hours, court appearances, and administrative overheads for the referenced matter.</p>
                        </td>
                        <td className="py-8 text-right text-lg font-black text-foreground tabular-nums">
                          {formatCurrency(selectedInvoice.totalAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-16 bg-muted/10 rounded-[2.5rem] p-10 border-2 border-border/30">
                  <div className="ml-auto w-full max-w-md space-y-5">
                    <div className="flex justify-between items-center text-sm font-bold text-muted-foreground/60">
                      <span className="uppercase tracking-widest">Invoice Subtotal</span>
                      <span className="text-foreground font-black">{formatCurrency(selectedInvoice.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-muted-foreground/60">
                      <span className="uppercase tracking-widest">Tax Provision (KES)</span>
                      <span className="text-foreground font-black">KES 0.00</span>
                    </div>
                    <div className="h-px bg-border/50 my-2" />
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">Applied Payments</span>
                      <span className="text-2xl font-black text-primary tracking-tighter">-{formatCurrency(selectedInvoice.amountPaid || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-destructive text-white p-6 rounded-2xl shadow-xl shadow-destructive/20 -mx-2">
                      <span className="text-xs font-black uppercase tracking-[0.25em]">Statement Balance</span>
                      <span className="text-3xl font-black tracking-tighter">{formatCurrency(selectedInvoice.balanceDue)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-24 pt-12 text-center relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-primary/20 rounded-full" />
                  <p className="text-[11px] font-black text-muted-foreground/40 uppercase tracking-[0.4em]">Official WakiliSmart Document</p>
                  <p className="mt-4 text-[10px] font-bold text-muted-foreground/50 max-w-lg mx-auto leading-relaxed">
                    Payments can be made via MPESA Paybill, Bank Transfer, or Cash at our offices. 
                    Please quote the Serial Number {selectedInvoice.invoiceNumber} as your payment reference.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Create Invoice Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60" 
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative z-[110] w-full max-w-xl rounded-[2.5rem] bg-white p-10 shadow-[0_64px_128px_-24px_rgba(0,0,0,0.3)] border border-border/50"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">Generate New Invoice</h3>
                  <p className="text-sm font-bold text-muted-foreground/60 mt-1">Select a matter with unbilled work</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="h-12 w-12 flex items-center justify-center rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2 block ml-1">Matter / Case</label>
                  <select 
                    value={selectedCaseId}
                    onChange={(e) => setSelectedCaseId(e.target.value)}
                    className="w-full h-14 rounded-2xl border-2 border-border/50 bg-muted/20 px-4 font-bold text-foreground focus:border-primary/50 focus:ring-0 transition-all"
                  >
                    <option value="">Select a matter...</option>
                    {invoiceableCases.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.caseNumber} - {c.title} ({c.client.fullName})
                      </option>
                    ))}
                  </select>
                </div>

                {invoiceableCases.length === 0 && (
                  <div className="rounded-2xl bg-orange-50 border-2 border-orange-100 p-4 flex items-start gap-4">
                    <AlertCircle className="text-orange-500 shrink-0" size={20} />
                    <p className="text-xs font-bold text-orange-700 leading-relaxed">
                      No cases found with unbilled time or disbursements. Please ensure work is recorded before generating an invoice.
                    </p>
                  </div>
                )}

                <button 
                  disabled={!selectedCaseId || isSubmitting}
                  onClick={handleCreateInvoice}
                  className="w-full h-16 rounded-2xl bg-primary text-white font-black shadow-2xl shadow-primary/30 hover:bg-primary/90 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap size={20} /> GENERATE INVOICE
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Record Payment Modal */}
        {showPaymentModal && selectedInvoice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60" 
              onClick={() => setShowPaymentModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative z-[110] w-full max-w-xl rounded-[2.5rem] bg-white p-10 shadow-[0_64px_128px_-24px_rgba(0,0,0,0.3)] border border-border/50"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">Record Payment</h3>
                  <p className="text-sm font-bold text-muted-foreground/60 mt-1">Invoice: {selectedInvoice.invoiceNumber}</p>
                </div>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="h-12 w-12 flex items-center justify-center rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2 block ml-1">Amount (KES)</label>
                    <input 
                      type="number"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full h-14 rounded-2xl border-2 border-border/50 bg-muted/20 px-4 font-bold text-foreground focus:border-primary/50 focus:ring-0 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2 block ml-1">Method</label>
                    <select 
                      value={paymentData.method}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                      className="w-full h-14 rounded-2xl border-2 border-border/50 bg-muted/20 px-4 font-bold text-foreground focus:border-primary/50 focus:ring-0 transition-all font-black"
                    >
                      <option value="MPESA">MPESA</option>
                      <option value="CASH">CASH</option>
                      <option value="BANK_TRANSFER">BANK TRANSFER</option>
                      <option value="CHEQUE">CHEQUE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2 block ml-1">Reference / Code</label>
                  <input 
                    type="text"
                    value={paymentData.reference}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e.target.value }))}
                    className="w-full h-14 rounded-2xl border-2 border-border/50 bg-muted/20 px-4 font-bold text-foreground focus:border-primary/50 focus:ring-0 transition-all"
                    placeholder="e.g. MPESA Code or Cheque No."
                  />
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border-2 border-primary/10">
                   <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <CreditCard size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Balance Remaining</p>
                      <p className="text-lg font-black text-foreground tabular-nums">
                        {formatCurrency(Math.max(0, parseFloat(selectedInvoice.balanceDue) - (parseFloat(paymentData.amount) || 0)))}
                      </p>
                   </div>
                </div>

                <button 
                  disabled={!paymentData.amount || isSubmitting}
                  onClick={handleRecordPayment}
                  className="w-full h-16 rounded-2xl bg-green-600 text-white font-black shadow-2xl shadow-green-600/30 hover:bg-green-700 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={20} /> SUBMIT PAYMENT
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
