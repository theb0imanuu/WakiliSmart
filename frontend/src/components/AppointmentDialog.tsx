import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Calendar as CalendarIcon, Clock, User, Briefcase, FileText, MapPin, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const appointmentSchema = z.object({
  scheduledDate: z.string().min(1, 'Date and time are required'),
  durationMinutes: z.coerce.number().min(5, 'Duration must be at least 5 minutes'),
  purpose: z.string().min(3, 'Purpose must be at least 3 characters'),
  clientId: z.string().optional(),
  caseId: z.string().optional(),
  isCourtDate: z.boolean().default(false),
  courtName: z.string().optional(),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentDialogProps {
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: Date;
}

export default function AppointmentDialog({ onClose, onSuccess, initialDate }: AppointmentDialogProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      scheduledDate: initialDate ? initialDate.toISOString().slice(0, 16) : '',
      durationMinutes: 60,
      isCourtDate: false,
    }
  });

  const isCourtDate = watch('isCourtDate');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [clientsRes, casesRes] = await Promise.all([
          api.get('/clients'),
          api.get('/cases')
        ]);
        setClients(clientsRes.data);
        setCases(casesRes.data);
      } catch (error) {
        console.error('Failed to fetch related data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      await api.post('/appointments', {
        ...data,
        clientId: data.clientId ? Number(data.clientId) : null,
        caseId: data.caseId ? Number(data.caseId) : null,
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create appointment', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-background shadow-2xl border border-border/50">
        <div className="flex items-center justify-between border-b border-border/50 px-8 py-6 bg-muted/20">
          <div>
            <h2 className="text-xl font-bold text-foreground">Schedule Practice Event</h2>
            <p className="text-sm text-muted-foreground">Manage court dates, client meetings, and consultations.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground/60 hover:bg-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-h-[70vh] overflow-y-auto p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-foreground/70 uppercase tracking-widest px-1">Event Purpose / Title</label>
              <div className="relative mt-2">
                <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
                <input
                  {...register('purpose')}
                  className={cn(
                    "w-full rounded-2xl border border-border bg-muted/30 pl-12 pr-4 py-3.5 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10 font-medium",
                    errors.purpose && "border-destructive"
                  )}
                  placeholder="e.g. Initial Strategy Session"
                />
              </div>
              {errors.purpose && <p className="mt-1 text-xs text-destructive px-1">{errors.purpose.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground/70 uppercase tracking-widest px-1">Date & Time</label>
              <div className="relative mt-2">
                <CalendarIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
                <input
                  type="datetime-local"
                  {...register('scheduledDate')}
                  className={cn(
                    "w-full rounded-2xl border border-border bg-muted/30 pl-12 pr-4 py-3.5 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10 font-medium",
                    errors.scheduledDate && "border-destructive"
                  )}
                />
              </div>
              {errors.scheduledDate && <p className="mt-1 text-xs text-destructive px-1">{errors.scheduledDate.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground/70 uppercase tracking-widest px-1">Duration (Min)</label>
              <div className="relative mt-2">
                <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
                <input
                  type="number"
                  {...register('durationMinutes')}
                  className={cn(
                    "w-full rounded-2xl border border-border bg-muted/30 pl-12 pr-4 py-3.5 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10 font-medium",
                    errors.durationMinutes && "border-destructive"
                  )}
                />
              </div>
              {errors.durationMinutes && <p className="mt-1 text-xs text-destructive px-1">{errors.durationMinutes.message}</p>}
            </div>

            <div className="md:col-span-2">
               <div className="flex items-center gap-2 p-1">
                  <input 
                    type="checkbox"
                    id="isCourtDate"
                    {...register('isCourtDate')}
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="isCourtDate" className="text-sm font-bold text-foreground text-primary uppercase tracking-widest">Mark as Court Appearance</label>
               </div>
            </div>

            {isCourtDate && (
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-foreground/70 uppercase tracking-widest px-1">Court Name / Location</label>
                <div className="relative mt-2">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
                  <input
                    {...register('courtName')}
                    className="w-full rounded-2xl border border-border bg-muted/30 pl-12 pr-4 py-3.5 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10 font-medium"
                    placeholder="e.g. Milimani Law Courts, Room 4"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-foreground/70 uppercase tracking-widest px-1">Related Client</label>
              <div className="relative mt-2">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
                <select
                  {...register('clientId')}
                  className="w-full appearance-none rounded-2xl border border-border bg-muted/30 pl-12 pr-10 py-3.5 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10 font-medium"
                >
                  <option value="">No linked client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.fullName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground/70 uppercase tracking-widest px-1">Related Case</label>
              <div className="relative mt-2">
                <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
                <select
                  {...register('caseId')}
                  className="w-full appearance-none rounded-2xl border border-border bg-muted/30 pl-12 pr-10 py-3.5 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10 font-medium"
                >
                  <option value="">No linked case...</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-foreground/70 uppercase tracking-widest px-1">Internal Notes</label>
              <div className="relative mt-2">
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full rounded-2xl border border-border bg-muted/30 p-4 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10 font-medium"
                  placeholder="Internal preparation notes..."
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-border py-4 font-black uppercase tracking-widest text-muted-foreground transition-all hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-primary py-4 font-black uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-xl active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
