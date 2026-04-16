import React from 'react';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, User, Phone, Mail, MapPin, CreditCard, Briefcase, Calendar, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';


const clientSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  idNumber: z.string().min(5, 'ID number is required'),
  address: z.string().min(5, 'Address is required'),
  occupation: z.string().optional(),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientIntakeFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  isEdit?: boolean;
}

export default function ClientIntakeForm({ onClose, onSuccess, initialData, isEdit }: ClientIntakeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData ? {
      fullName: initialData.fullName,
      phone: initialData.phoneNumber,
      email: initialData.email || '',
      idNumber: initialData.idNumber || '',
      address: initialData.physicalAddress || '',
      occupation: initialData.occupation || '',
      notes: initialData.notes || '',
    } : undefined,
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (isEdit && initialData?.id) {
        await api.patch(`/clients/${initialData.id}`, {
          ...data,
          physicalAddress: data.address,
        });
      } else {
        await api.post('/clients', {
          ...data,
          physicalAddress: data.address,
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save client', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/50 px-8 py-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">New Client Intake</h2>
            <p className="text-sm text-muted-foreground">Register a new client in the system.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground/60 hover:bg-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-h-[70vh] overflow-y-auto p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground/80">Full Name</label>
              <div className="relative mt-2">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  {...register('fullName')}
                  className={cn(
                    "w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                    errors.fullName && "border-destructive"
                  )}
                  placeholder="Client's full name"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground/80">Phone Number</label>
              <div className="relative mt-2">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  {...register('phone')}
                  className={cn(
                    "w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                    errors.phone && "border-destructive"
                  )}
                  placeholder="+254..."
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground/80">Email Address</label>
              <div className="relative mt-2">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  {...register('email')}
                  className={cn(
                    "w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                    errors.email && "border-destructive"
                  )}
                  placeholder="client@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground/80">ID / Passport Number</label>
              <div className="relative mt-2">
                <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  {...register('idNumber')}
                  className={cn(
                    "w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                    errors.idNumber && "border-destructive"
                  )}
                  placeholder="ID Number"
                />
              </div>
              {errors.idNumber && <p className="mt-1 text-xs text-destructive">{errors.idNumber.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground/80">Occupation</label>
              <div className="relative mt-2">
                <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  {...register('occupation')}
                  className="w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
                  placeholder="e.g. Business Owner"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground/80">Physical Address</label>
              <div className="relative mt-2">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  {...register('address')}
                  className={cn(
                    "w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                    errors.address && "border-destructive"
                  )}
                  placeholder="Street, City, County"
                />
              </div>
              {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground/80">Additional Notes</label>
              <div className="relative mt-2">
                <FileText size={18} className="absolute left-4 top-4 text-muted-foreground/60" />
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
                  placeholder="Any other relevant information..."
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
              {isSubmitting ? "Saving..." : "Save Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
