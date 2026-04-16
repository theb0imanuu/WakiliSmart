import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle2, ArrowRight, ArrowLeft, Download, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const bookingSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().regex(/^(?:254|\+254|0)?(7|1)\d{8}$/, 'Invalid Kenyan phone number (e.g., 07XX XXX XXX)'),
  preferredDate: z.string().min(1, 'Please select a date'),
  preferredTime: z.string().min(1, 'Please select a time'),
  caseType: z.string().min(1, 'Please select a case type'),
  description: z.string().min(20, 'Please provide a detailed description (min 20 chars)'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30'
];

export default function BookingPage() {
  const [step, setStep] = React.useState(1);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');
  const [refNumber, setRefNumber] = React.useState('');
  const [availableSlots, setAvailableSlots] = React.useState<string[]>(TIME_SLOTS);
  const [isCheckingAvailability, setIsCheckingAvailability] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState<BookingFormData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: JSON.parse(localStorage.getItem('booking_form_draft') || '{}'),
  });

  const formData = watch();

  // Auto-save to localStorage
  React.useEffect(() => {
    localStorage.setItem('booking_form_draft', JSON.stringify(formData));
  }, [formData]);

  const checkAvailability = async (date: string) => {
    if (!date) return;
    setIsCheckingAvailability(true);
    try {
      const res = await api.get('/appointments/public/availability', { params: { date } });
      const bookedTimes = res.data.map((dtStr: string) => {
        const d = new Date(dtStr);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      });
      setAvailableSlots(TIME_SLOTS.filter(slot => !bookedTimes.includes(slot)));
    } catch (err) {
      console.error('Error checking availability:', err);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  React.useEffect(() => {
    if (formData.preferredDate) {
      checkAvailability(formData.preferredDate);
    }
  }, [formData.preferredDate]);

  const nextStep = async () => {
    const fieldsToValidate = step === 1 ? ['fullName', 'phone', 'email'] : ['preferredDate', 'preferredTime', 'caseType', 'description'];
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = async (data: BookingFormData) => {
    setError('');
    try {
      const bookingData = {
        tempClientName: data.fullName,
        tempClientPhone: data.phone,
        tempClientEmail: data.email || undefined,
        scheduledDate: `${data.preferredDate}T${data.preferredTime}`,
        purpose: `Consultation: ${data.caseType}`,
        notes: data.description,
      };

      const res = await api.post('/appointments/public', bookingData);
      const bookingRef = `APT-${res.data.id?.toString().padStart(4, '0') || Math.floor(1000 + Math.random() * 9000)}`;

      setRefNumber(bookingRef);
      setSubmittedData(data);
      setIsSubmitted(true);
      localStorage.removeItem('booking_form_draft');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError('Failed to book consultation. Please try again later.');
    }
  };

  const downloadICS = () => {
    if (!submittedData) return;
    const { preferredDate, preferredTime, caseType } = submittedData;
    const start = `${preferredDate.replace(/-/g, '')}T${preferredTime.replace(/:/g, '')}00`;
    const end = `${preferredDate.replace(/-/g, '')}T${preferredTime.replace(/:/g, '')}30`;
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:Legal Consultation - ${caseType}`,
      'DESCRIPTION:Consultation with WakiliSmart Advocates',
      'LOCATION:Wakili Plaza, Upper Hill, Nairobi',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `consultation-${refNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReceipt = () => {
    window.print();
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center print:p-0">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl bg-background p-12 shadow-xl print:shadow-none print:border print:border-border"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-600 print:hidden">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="mt-8 text-3xl font-bold text-foreground">Booking Confirmed!</h2>
          <div className="mt-8 space-y-4 text-left border-t border-b border-border/50 py-8">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference Number:</span>
              <span className="font-bold text-primary">{refNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Client Name:</span>
              <span className="font-medium text-foreground">{submittedData?.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium text-foreground">{submittedData?.preferredDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium text-foreground">{submittedData?.preferredTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Matter:</span>
              <span className="font-medium text-foreground">{submittedData?.caseType}</span>
            </div>
          </div>
          
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center print:hidden">
            <button
              onClick={downloadICS}
              className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-bold text-muted-foreground transition-all hover:bg-muted"
            >
              <Download size={18} /> Add to Calendar
            </button>
            <button
              onClick={printReceipt}
              className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-bold text-muted-foreground transition-all hover:bg-muted"
            >
              <Printer size={18} /> Print Receipt
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-16 lg:grid-cols-2">
        {/* Left Side - Info */}
        <div className="hidden lg:block">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Book a <span className="text-primary">Consultation</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Take the first step towards resolving your legal matter. Fill out the form, and our experts will get back to you within 24 hours.
          </p>

          <div className="mt-12 space-y-8">
            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">24/7 Availability</h3>
                <p className="text-muted-foreground">Book your appointment anytime, anywhere at your convenience.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Expert Advocates</h3>
                <p className="text-muted-foreground">Consult with experienced professionals specialized in Kenyan law.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="rounded-3xl bg-background p-8 shadow-xl ring-1 ring-border/50 sm:p-12">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex gap-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-2 w-12 rounded-full transition-all",
                    step >= i ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-muted-foreground">Step {step} of 2</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {step === 1 ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground/80">Full Name</label>
                    <div className="relative mt-2">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                      <input
                        {...register('fullName')}
                        className={cn(
                          "w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                          errors.fullName && "border-destructive"
                        )}
                        placeholder="John Doe"
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
                        placeholder="07XX XXX XXX"
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground/80">Email Address (Optional)</label>
                    <div className="relative mt-2">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                      <input
                        {...register('email')}
                        className={cn(
                          "w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                          errors.email && "border-destructive"
                        )}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
                  >
                    Next Step <ArrowRight size={20} />
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-foreground/80">Preferred Date</label>
                      <div className="relative mt-2">
                        <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                        <input
                          type="date"
                          {...register('preferredDate')}
                          min={new Date().toISOString().split('T')[0]}
                          className={cn(
                            "w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                            errors.preferredDate && "border-destructive"
                          )}
                        />
                      </div>
                      {errors.preferredDate && <p className="mt-1 text-xs text-destructive">{errors.preferredDate.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground/80">Preferred Time</label>
                      <div className="relative mt-2">
                        <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                        <select
                          {...register('preferredTime')}
                          disabled={isCheckingAvailability}
                          className={cn(
                            "w-full appearance-none rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10 disabled:opacity-50",
                            errors.preferredTime && "border-destructive"
                          )}
                        >
                          <option value="">{isCheckingAvailability ? 'Checking...' : 'Select time'}</option>
                          {availableSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                      {errors.preferredTime && <p className="mt-1 text-xs text-destructive">{errors.preferredTime.message}</p>}
                      {availableSlots.length === 0 && !isCheckingAvailability && formData.preferredDate && (
                        <p className="mt-1 text-xs text-amber-600 font-medium">No slots available for this date. Please try another date.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground/80">Case Type</label>
                    <select
                      {...register('caseType')}
                      className={cn(
                        "mt-2 w-full appearance-none rounded-xl border border-border bg-muted/30 px-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                        errors.caseType && "border-destructive"
                      )}
                    >
                      <option value="">Select case type</option>
                      <option value="CIVIL">Civil Litigation</option>
                      <option value="CRIMINAL">Criminal Defense</option>
                      <option value="FAMILY">Family Law</option>
                      <option value="COMMERCIAL">Commercial Law</option>
                      <option value="CONVEYANCING">Conveyancing & Real Estate</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {errors.caseType && <p className="mt-1 text-xs text-destructive">{errors.caseType.message}</p>}
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <label className="block text-sm font-semibold text-foreground/80">Legal Matter Description</label>
                      <span className={cn(
                        "text-xs font-medium",
                        (formData.description?.length || 0) < 20 ? "text-muted-foreground/60" : "text-green-600"
                      )}>
                        {formData.description?.length || 0}/20 min chars
                      </span>
                    </div>
                    <div className="relative mt-2">
                       <MessageSquare size={18} className="absolute left-4 top-4 text-muted-foreground/60" />
                      <textarea
                        {...register('description')}
                        rows={4}
                        className={cn(
                          "w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                          errors.description && "border-destructive"
                        )}
                        placeholder="Please describe your legal matter in detail..."
                      />
                    </div>
                    {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-4 font-bold text-muted-foreground transition-all hover:bg-muted active:scale-95"
                    >
                      <ArrowLeft size={20} /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-70"
                    >
                      {isSubmitting ? "Processing..." : "Confirm Booking"}
                      <CheckCircle2 size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
