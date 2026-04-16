import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gavel, Building2, Shield, Briefcase, Heart, Plus, Clock, AlertCircle, Scale, User, MapPin, Calendar, FileText } from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface CaseDetailsModalProps {
  caseData: any;
  onClose: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  CIVIL: <Gavel size={20} />,
  CRIMINAL: <Shield size={20} />,
  CONVEYANCING: <Building2 size={20} />,
  COMMERCIAL: <Briefcase size={20} />,
  FAMILY: <Heart size={20} />,
  OTHER: <Plus size={20} />,
};

const statusColors: Record<string, string> = {
  OPEN: 'bg-primary/10 text-primary',
  ACTIVE: 'bg-green-500/10 text-green-600',
  PENDING: 'bg-yellow-500/10 text-yellow-600',
  ON_HOLD: 'bg-orange-500/10 text-orange-600',
  CLOSED: 'bg-muted text-muted-foreground',
};

const priorityColors: Record<string, string> = {
  LOW: 'bg-muted/30 text-muted-foreground/80',
  NORMAL: 'bg-primary/5 text-primary/80',
  HIGH: 'bg-orange-500/10 text-orange-600',
  URGENT: 'bg-destructive/10 text-destructive',
};

export default function CaseDetailsModal({ caseData, onClose }: CaseDetailsModalProps) {
  const [status, setStatus] = React.useState(caseData.status);
  const [updating, setUpdating] = React.useState(false);

  if (!caseData) return null;

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await api.patch(`/cases/${caseData.id}`, { status: newStatus });
      setStatus(newStatus);
    } catch (error) {
      console.error('Failed to update case status', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] bg-background shadow-2xl border border-border/50"
      >
        {/* Header */}
        <div className="relative border-b border-border/50 p-8">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full bg-muted/50 p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase bg-primary/5 px-2 py-1 rounded">
                  {caseData.caseNumber}
                </span>
                <div className="relative group/status">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2",
                    statusColors[status],
                    updating && "opacity-50"
                  )}>
                    {status}
                    <Clock size={10} className="animate-spin opacity-0 group-[.updating]/status:opacity-100" />
                  </div>
                  
                  <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updating}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {Object.keys(statusColors).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                {caseData.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="p-1.5 rounded-lg bg-muted text-primary">
                    {typeIcons[caseData.caseType]}
                  </span>
                  <span className="font-bold">{caseData.caseType} Matter</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  <span>Opened {new Date(caseData.dateOpened).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className={cn("inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black uppercase tracking-[0.15em]", priorityColors[caseData.priority])}>
              <AlertCircle size={14} />
              {caseData.priority} Priority
            </div>
          </div>
        </div>

        <div className="grid h-[50vh] overflow-y-auto lg:grid-cols-5 divide-x divide-border/50">
          {/* Main Content */}
          <div className="col-span-3 p-8 space-y-10">
            {/* Description */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-primary" />
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground/40">Case Overview</h3>
              </div>
              <p className="text-lg leading-relaxed text-foreground/80 font-medium">
                {caseData.description || "No detailed description provided for this matter."}
              </p>
            </section>

            {/* Legal Issues & Outcome */}
            <div className="grid gap-8 sm:grid-cols-2">
              <section className="space-y-4 rounded-3xl bg-muted/30 p-6 border border-border/30">
                <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                  <Scale size={14} /> Legal Issues
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {caseData.legalIssues || "Specific legal issues have not been documented yet."}
                </p>
              </section>
              <section className="space-y-4 rounded-3xl bg-primary/5 p-6 border border-primary/10">
                <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                  <Heart size={14} /> Desired Outcome
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {caseData.desiredOutcome || "The desired strategic outcome is not defined."}
                </p>
              </section>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="col-span-2 p-8 space-y-8 bg-muted/10">
            {/* Client Card */}
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40">Primary Client</h3>
              <div className="group flex items-center gap-4 rounded-3xl border border-border/50 bg-background p-4 transition-all hover:border-primary hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl font-black text-primary">
                  {caseData.client?.fullName?.[0] || <User size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{caseData.client?.fullName || 'N/A'}</h4>
                  <p className="text-xs text-muted-foreground">Lead Litigant</p>
                </div>
              </div>
            </section>

            {/* Court Meta */}
            <section className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40">Court Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <MapPin size={18} className="text-primary/60" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Tribunal / Station</p>
                    <p className="font-bold text-foreground/80">{caseData.courtTribunal}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <FileText size={18} className="text-primary/60" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Court Case Number</p>
                    <p className="font-mono font-bold text-foreground/80">{caseData.courtCaseNumber || 'NOT YET FILED'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <Scale size={18} className="text-primary/60" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Opposing Party</p>
                    <p className="font-bold text-foreground/80">{caseData.opposingParty || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 bg-muted/20 p-6 flex justify-between items-center px-8">
           <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
             <Clock size={14} />
             <span>Matter logged by Registrar on {new Date(caseData.dateOpened).toLocaleTimeString()}</span>
           </div>
           <button 
             onClick={onClose}
             className="rounded-2xl bg-foreground px-8 py-3 text-sm font-bold text-background transition-all hover:scale-105 active:scale-95"
           >
             Close File
           </button>
        </div>
      </motion.div>
    </div>
  );
}
