import React, { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  ChevronRight, 
  Gavel, 
  Building2, 
  Shield, 
  Briefcase, 
  Heart,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

import CaseCreationForm from '@/components/CaseCreationForm';
import CaseDetailsModal from '@/components/CaseDetailsModal';

const typeIcons = {
  CIVIL: <Gavel size={16} />,
  CRIMINAL: <Shield size={16} />,
  CONVEYANCING: <Building2 size={16} />,
  COMMERCIAL: <Briefcase size={16} />,
  FAMILY: <Heart size={16} />,
  OTHER: <Plus size={16} />,
};

const statusColors = {
  OPEN: 'bg-primary/10 text-primary',
  ACTIVE: 'bg-green-500/10 text-green-600',
  PENDING: 'bg-yellow-500/10 text-yellow-600',
  ON_HOLD: 'bg-orange-500/10 text-orange-600',
  CLOSED: 'bg-muted text-muted-foreground',
};

const priorityColors = {
  LOW: 'text-muted-foreground/60',
  NORMAL: 'text-primary/60',
  HIGH: 'text-orange-500',
  URGENT: 'text-destructive',
};

export default function CaseRegistry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cases');
      setCases(res.data);
    } catch (error) {
      console.error('Failed to fetch cases', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesSearch = 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.client?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.courtTribunal?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [cases, searchTerm, statusFilter]);

  const exportToCSV = () => {
    const headers = ['Case Number', 'Title', 'Client', 'Type', 'Status', 'Priority', 'Court', 'Date Opened'];
    const rows = filteredCases.map(c => [
      c.caseNumber,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.client?.fullName?.replace(/"/g, '""') || 'N/A'}"`,
      c.caseType,
      c.status,
      c.priority,
      `"${c.courtTribunal?.replace(/"/g, '""') || 'N/A'}"`,
      new Date(c.dateOpened).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wakilismart_cases_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Case Registry</h1>
          <p className="text-muted-foreground">Track and manage all legal matters and court proceedings.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
        >
          <Plus size={18} /> New Case
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-2xl bg-background p-4 shadow-sm border border-border/50 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search by case #, title, client or court..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-border/50 bg-muted/30 pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-xl border border-border/50 bg-background pl-10 pr-8 py-2.5 text-sm font-semibold text-muted-foreground outline-none transition-all hover:bg-muted focus:border-primary"
            >
              <option value="ALL">All Statuses</option>
              {Object.keys(statusColors).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/60">
              <ChevronRight size={14} className="rotate-90" />
            </div>
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 rounded-xl border border-border/50 bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted"
          >
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* Case Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">Loading cases...</div>
      ) : filteredCases.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCases.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative flex flex-col rounded-2xl bg-background p-6 shadow-sm border border-border/50 transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary")}>
                  {typeIcons[item.caseType as keyof typeof typeIcons]}
                </div>
                <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", statusColors[item.status as keyof typeof statusColors])}>
                  {item.status}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-mono font-bold text-primary">{item.caseNumber}</p>
                <h3 className="mt-1 text-lg font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Client: <span className="font-semibold text-foreground/80">{item.client?.fullName || 'N/A'}</span></p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/50 pt-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Court</p>
                  <p className="text-xs font-semibold text-foreground/80 truncate">{item.courtTribunal || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Date Opened</p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-foreground/80">
                    <Clock size={12} className="text-primary" /> {new Date(item.dateOpened).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <AlertCircle size={14} className={priorityColors[item.priority as keyof typeof priorityColors]} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.priority} Priority</span>
                </div>
                <button 
                  onClick={() => setSelectedCase(item)}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline hover:scale-105 transition-transform"
                >
                  View Details <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center text-muted-foreground">No cases found.</div>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <CaseCreationForm 
            onClose={() => setIsFormOpen(false)} 
            onSuccess={() => {
              setIsFormOpen(false);
              fetchCases();
            }} 
          />
        )}
        {selectedCase && (
          <CaseDetailsModal 
            caseData={selectedCase} 
            onClose={() => setSelectedCase(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

