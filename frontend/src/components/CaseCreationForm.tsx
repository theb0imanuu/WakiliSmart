import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, FolderOpen, User, Briefcase, Scale, AlertCircle, FileText, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useAuth } from '@/components/AuthProvider';

const caseSchema = z.object({
  title: z.string().min(3, 'Case title must be at least 3 characters'),
  clientId: z.string().min(1, 'Please select a client'),
  caseType: z.enum(['CIVIL', 'CRIMINAL', 'CONVEYANCING', 'COMMERCIAL', 'FAMILY', 'OTHER']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
  opposingParty: z.string().optional(),
  court: z.string().optional(),
  description: z.string().optional(),
});

type CaseFormData = z.infer<typeof caseSchema>;

interface CaseCreationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CaseCreationForm({ onClose, onSuccess }: CaseCreationFormProps) {
  const { user } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [clientSearch, setClientSearch] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      priority: 'NORMAL',
      caseType: 'CIVIL',
    }
  });

  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const res = await api.get('/clients');
        setClients(res.data);
      } catch (error) {
        console.error('Failed to fetch clients', error);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = clients.filter(c => 
    c.fullName.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.clientNumber.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const onSubmit = async (data: CaseFormData) => {
    if (!user) return;
    try {
      await api.post('/cases', {
        ...data,
        courtTribunal: data.court || 'Milimani Law Courts',
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to open case', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/50 px-8 py-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">New Case Matter</h2>
            <p className="text-sm text-muted-foreground">Open a new legal matter for a client.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground/60 hover:bg-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-h-[70vh] overflow-y-auto p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground/80">Case Title</label>
              <div className="relative mt-2">
                <FolderOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  {...register('title')}
                  className={cn(
                    "w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                    errors.title && "border-destructive"
                  )}
                  placeholder="e.g. John Doe vs. XYZ Ltd"
                />
              </div>
              {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground/80">Select Client</label>
              <div className="relative mt-2">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <select
                  {...register('clientId')}
                  className={cn(
                    "w-full appearance-none rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                    errors.clientId && "border-destructive"
                  )}
                >
                  <option value="">Select a client...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.fullName} ({client.clientNumber})
                    </option>
                  ))}
                </select>
                {loadingClients && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                )}
              </div>
              {errors.clientId && <p className="mt-1 text-xs text-destructive">{errors.clientId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground/80">Case Type</label>
              <div className="relative mt-2">
                <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <select
                  {...register('caseType')}
                  className="w-full appearance-none rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
                >
                  <option value="CIVIL">Civil Litigation</option>
                  <option value="CRIMINAL">Criminal Defense</option>
                  <option value="CONVEYANCING">Conveyancing</option>
                  <option value="COMMERCIAL">Commercial Law</option>
                  <option value="FAMILY">Family Law</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground/80">Priority</label>
              <div className="relative mt-2">
                <AlertCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <select
                  {...register('priority')}
                  className="w-full appearance-none rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground/80">Opposing Party</label>
              <div className="relative mt-2">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  {...register('opposingParty')}
                  className="w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
                  placeholder="Name of opposing party"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground/80">Court / Tribunal</label>
              <div className="relative mt-2">
                <Scale size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  {...register('court')}
                  className="w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
                  placeholder="e.g. Milimani Law Courts"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground/80">Case Description</label>
              <div className="relative mt-2">
                <FileText size={18} className="absolute left-4 top-4 text-muted-foreground/60" />
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
                  placeholder="Brief summary of the matter..."
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-3 font-bold text-muted-foreground transition-all hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-primary py-3 font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95 disabled:opacity-70"
            >
              {isSubmitting ? "Opening Case..." : "Open Case"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
