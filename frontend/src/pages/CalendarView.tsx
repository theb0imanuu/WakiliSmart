import React, { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'motion/react';
import AppointmentDialog from '@/components/AppointmentDialog';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Plus, Filter, ChevronLeft, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});



const eventStyleGetter = (event: any) => {
  let backgroundColor = 'var(--color-primary)'; 
  let color = 'white';
  let border = 'none';

  if (event.type === 'COURT') backgroundColor = 'var(--color-destructive)';
  else if (event.type === 'MEETING') backgroundColor = '#10b981'; // Success
  else if (event.type === 'CONSULTATION') backgroundColor = '#f59e0b'; // Warning

  if (event.resource?.status === 'PENDING') {
    backgroundColor = '#ffedd5'; // Light orange background
    color = '#ea580c'; // Dark orange text
    border = '2px dashed #ea580c'; // Dashed orange border for unapproved 
  }

  return {
    style: {
      backgroundColor,
      borderRadius: '8px',
      opacity: 0.9,
      color,
      border,
      display: 'block',
      fontSize: '12px',
      fontWeight: 'bold',
      padding: '4px 8px',
    },
  };
};

export default function CalendarView() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<any>(Views.WEEK);
  const [filterType, setFilterType] = useState('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const events = useMemo(() => {
    let filtered = appointments;
    if (filterType !== 'ALL') {
      filtered = appointments.filter(apt => {
        if (filterType === 'COURT') return apt.isCourtDate;
        if (filterType === 'CONSULTATION') return apt.purpose?.toLowerCase().includes('consultation');
        if (filterType === 'DEPOSITION') return apt.purpose?.toLowerCase().includes('deposition');
        if (filterType === 'MEETING') return !apt.isCourtDate && !apt.purpose?.toLowerCase().includes('consultation') && !apt.purpose?.toLowerCase().includes('deposition');
        return true;
      });
    }

    return filtered.map(apt => {
      const start = new Date(apt.scheduledDate);
      const end = new Date(start.getTime() + (apt.durationMinutes || 30) * 60000);
      
      let type = 'MEETING';
      if (apt.isCourtDate) type = 'COURT';
      else if (apt.purpose?.toLowerCase().includes('consultation')) type = 'CONSULTATION';
      else if (apt.purpose?.toLowerCase().includes('deposition')) type = 'DEPOSITION';

      return {
        id: apt.id,
        title: apt.client?.fullName || apt.tempClientName || apt.purpose || 'Appointment',
        start,
        end,
        type,
        resource: apt
      };
    });
  }, [appointments, filterType]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Practice Calendar</h1>
          <p className="text-muted-foreground">Manage appointments, court dates, and deadlines.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-bold transition-all hover:bg-muted",
                filterType !== 'ALL' ? "border-primary text-primary" : "text-muted-foreground"
              )}
            >
              <Filter size={18} /> 
              {filterType === 'ALL' ? 'Filters' : filterType}
            </button>
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full z-20 mt-2 w-48 rounded-2xl border border-border bg-background p-1.5 shadow-xl shadow-primary/5"
                >
                  {['ALL', 'COURT', 'MEETING', 'CONSULTATION', 'DEPOSITION'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type);
                        setIsFilterOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
                        filterType === type ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
          >
            <Plus size={18} /> New Event
          </button>
        </div>
      </div>

      {/* Calendar Container - Fixed Height for Layout Stability */}
      <div className="h-[750px] rounded-[2.5rem] bg-background p-8 shadow-2xl border border-border/50 overflow-hidden relative">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          date={currentDate}
          view={currentView}
          onNavigate={(date) => setCurrentDate(date)}
          onView={(view) => setCurrentView(view)}
          onSelectEvent={(event) => setSelectedEvent(event)}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <AppointmentDialog 
            onClose={() => setIsFormOpen(false)} 
            onSuccess={() => {
              setIsFormOpen(false);
              fetchAppointments();
            }} 
          />
        )}
        {selectedEvent && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onApprove={async () => {
              try {
                await api.patch(`/appointments/${selectedEvent.id}/approve`);
                setSelectedEvent(null);
                fetchAppointments();
              } catch (error) {
                console.error("Failed to approve appointment", error);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EventDetailsModal({ event, onClose, onApprove }: { event: any; onClose: () => void; onApprove: () => void }) {
  const [isApproving, setIsApproving] = useState(false);
  const res = event.resource;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md overflow-hidden rounded-[2.5rem] bg-background shadow-2xl border border-border/50"
      >
        <div className="flex items-center justify-between border-b border-border/50 px-8 py-6 bg-muted/20">
          <div>
            <h2 className="text-xl font-bold text-foreground">Event Details</h2>
            <span className={cn(
              "text-xs font-black uppercase tracking-widest px-2 py-1 rounded-md mt-1 inline-block",
              res.status === 'PENDING' ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary"
            )}>
              {res.status}
            </span>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground/60 hover:bg-muted hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Title</p>
            <p className="font-medium text-foreground mt-1">{event.title}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Time</p>
            <p className="font-medium text-foreground mt-1">
              {format(event.start, 'MMM d, yyyy h:mm a')} - {format(event.end, 'h:mm a')}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Contact Information</p>
            <div className="mt-1 font-medium text-foreground">
              <p>{res.client?.fullName || res.tempClientName || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">{res.client?.phoneNumber || res.tempClientPhone}</p>
              <p className="text-sm text-muted-foreground">{res.client?.email || res.tempClientEmail}</p>
            </div>
          </div>
          {res.notes && (
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Notes</p>
              <p className="font-medium text-foreground mt-1 text-sm bg-muted/30 p-4 rounded-2xl border border-border/50">{res.notes}</p>
            </div>
          )}
          
          <div className="pt-6 flex gap-4">
            {res.status === 'PENDING' && (
              <button
                onClick={async () => {
                  setIsApproving(true);
                  await onApprove();
                  setIsApproving(false);
                }}
                disabled={isApproving}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-4 font-black uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-70"
              >
                {isApproving ? "Approving..." : (
                  <>
                    <CheckCircle2 size={18} /> Approve Booking
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-4 font-black uppercase tracking-widest text-muted-foreground transition-all hover:bg-muted"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CustomToolbar(toolbar: any) {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  const label = () => {
    const date = toolbar.date;
    const view = toolbar.view;

    if (view === 'month') return <span className="text-lg font-bold text-foreground">{format(date, 'MMMM yyyy')}</span>;
    if (view === 'week') {
      const start = startOfWeek(date);
      const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
      return (
        <span className="text-lg font-bold text-foreground">
          {format(start, 'MMM d')} - {format(end, 'MMM d, yyyy')}
        </span>
      );
    }
    return <span className="text-lg font-bold text-foreground">{format(date, 'MMMM d, yyyy')}</span>;
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <button
          onClick={goToBack}
          className="p-2 rounded-lg border border-border/50 hover:bg-muted text-muted-foreground"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={goToCurrent}
          className="px-4 py-2 rounded-lg border border-border/50 hover:bg-muted text-sm font-bold text-muted-foreground"
        >
          Today
        </button>
        <button
          onClick={goToNext}
          className="p-2 rounded-lg border border-border/50 hover:bg-muted text-muted-foreground"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {label()}

      <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border/50">
        {['month', 'week', 'day', 'agenda'].map((view) => (
          <button
            key={view}
            onClick={() => toolbar.onView(view)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
              toolbar.view === view 
                ? "bg-background text-primary shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  );
}
