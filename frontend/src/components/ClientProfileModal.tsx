import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  FileText, 
  Calendar, 
  ChevronRight,
  Gavel,
  Shield,
  Building2,
  Heart,
  Plus,
  Clock
} from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface ClientProfileModalProps {
  clientId: number;
  onClose: () => void;
  onOpenCase: (caseData: any) => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  CIVIL: <Gavel size={16} />,
  CRIMINAL: <Shield size={16} />,
  CONVEYANCING: <Building2 size={16} />,
  COMMERCIAL: <Briefcase size={16} />,
  FAMILY: <Heart size={16} />,
  OTHER: <Plus size={16} />,
};

const statusColors: Record<string, string> = {
  OPEN: 'bg-primary/10 text-primary',
  ACTIVE: 'bg-green-500/10 text-green-600',
  PENDING: 'bg-yellow-500/10 text-yellow-600',
  ON_HOLD: 'bg-orange-500/10 text-orange-600',
  CLOSED: 'bg-muted text-muted-foreground',
};

export default function ClientProfileModal({ clientId, onClose, onOpenCase }: ClientProfileModalProps) {
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await api.get(`/clients/${clientId}`);
        setClient(res.data);
      } catch (error) {
        console.error('Failed to fetch client profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [clientId]);

  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  if (!client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2rem] bg-background shadow-2xl border border-border/50 flex flex-col"
      >
        {/* Header Section */}
        <div className="p-8 border-b border-border/50 bg-muted/20 relative">
          <button onClick={onClose} className="absolute right-6 top-6 p-2 rounded-full hover:bg-muted text-muted-foreground">
            <X size={20} />
          </button>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
            <div className="h-24 w-24 rounded-3xl bg-primary flex items-center justify-center text-4xl font-black text-primary-foreground shadow-xl shadow-primary/20">
              {client.fullName[0]}
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-xs font-mono font-bold tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">
                  {client.clientId}
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  Member since {new Date(client.createdAt).getFullYear()}
                </span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-foreground">{client.fullName}</h2>
              <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground justify-center sm:justify-start">
                <Briefcase size={14} className="text-primary" />
                {client.occupation || 'No occupation specified'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid lg:grid-cols-3 divide-x divide-border/50">
          {/* Sidebar: Personal Info */}
          <div className="p-8 space-y-8 lg:col-span-1">
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Contact Details</h3>
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-muted/50 text-primary">
                    <Phone size={16} />
                  </div>
                  <span className="font-semibold text-foreground/80">{client.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-muted/50 text-primary">
                    <Mail size={16} />
                  </div>
                  <span className="font-semibold text-foreground/80">{client.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-muted/50 text-primary">
                    <MapPin size={16} />
                  </div>
                  <span className="font-semibold text-foreground/80 leading-relaxed">
                    {client.physicalAddress || 'No address on file'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-muted/50 text-primary">
                    <FileText size={16} />
                  </div>
                  <span className="font-semibold text-foreground/80">ID: {client.idNumber || 'N/A'}</span>
                </div>
              </div>
            </section>

            {/* Internal Notes */}
            <section className="space-y-3 p-5 rounded-2xl bg-muted/20 border border-border/50">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Internal Notes</h3>
              <p className="text-xs text-muted-foreground italic leading-relaxed text-center">
                {client.notes || "No special instructions for this client."}
              </p>
            </section>
          </div>

          {/* Main Area: Matters History */}
          <div className="lg:col-span-2 p-8 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Matters History ({client.cases?.length || 0})</h3>
                <div className="h-px flex-1 mx-4 bg-border/50" />
             </div>

             <div className="space-y-4">
                {client.cases && client.cases.length > 0 ? client.cases.map((matter: any) => (
                  <button 
                    key={matter.id}
                    onClick={() => {
                        // Pass matter + client data back to whatever can open CaseDetailsModal
                        onOpenCase({ ...matter, client: { fullName: client.fullName } });
                    } }
                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-background transition-all hover:border-primary hover:shadow-lg group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", statusColors[matter.status])}>
                        {typeIcons[matter.caseType]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-mono font-bold text-primary">{matter.caseNumber}</span>
                           <span className={cn("px-2 py-0.5 rounded text-[8px] font-black", statusColors[matter.status])}>{matter.status}</span>
                        </div>
                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{matter.title}</h4>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                )) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50 border-2 border-dashed border-border rounded-[2rem]">
                    <Clock size={40} className="mb-2" />
                    <p className="font-bold">No active matters</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 bg-muted/20 flex justify-end">
            <button 
              onClick={onClose}
              className="bg-foreground text-background px-8 py-2.5 rounded-xl font-bold text-sm transition-transform active:scale-95 hover:shadow-lg"
            >
              Close Profile
            </button>
        </div>
      </motion.div>
    </div>
  );
}
