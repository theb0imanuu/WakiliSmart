import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  FolderOpen, 
  Clock, 
  CreditCard, 
  Plus, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight
} from 'lucide-react';
import { collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/firebase';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/AuthProvider';
import ClientIntakeForm from '@/components/ClientIntakeForm';
import CaseCreationForm from '@/components/CaseCreationForm';

const getFontSize = (text: string) => {
  if (text.length > 18) return 'text-sm';
  if (text.length > 15) return 'text-base';
  if (text.length > 12) return 'text-lg';
  return 'text-xl';
};

export default function SecretaryDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { label: 'Active Cases', value: '0', icon: <FolderOpen />, trend: '0', trendUp: true },
    { label: 'Pending Bookings', value: '0', icon: <Calendar />, trend: '0', trendUp: true },
    { label: 'Today\'s Revenue', value: 'KES 0', icon: <CreditCard />, trend: '0%', trendUp: true },
    { label: 'New Clients', value: '0', icon: <Users />, trend: '0', trendUp: true },
  ]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isCaseFormOpen, setIsCaseFormOpen] = useState(false);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/secretary-summary');
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch secretary summary', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!data) return;
    
    setStats([
      { label: 'Active Cases', value: data.stats.activeCases.toString(), icon: <FolderOpen />, trend: '+3', trendUp: true },
      { label: 'Pending Bookings', value: data.stats.pendingBookings.toString(), icon: <Calendar />, trend: '-2', trendUp: false },
      { label: 'Today\'s Revenue', value: new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(data.stats.todayRevenue), icon: <CreditCard />, trend: '100%', trendUp: true },
      { label: 'New Clients', value: data.stats.newClients.toString(), icon: <Users />, trend: '+5', trendUp: true },
    ]);
    
    setAppointments(data.appointments);
    setActivities([]); // TODO: Implement recent activity on backend if needed
  }, [data]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.fullName?.split(' ')[0] || 'User'}</h1>
          <p className="text-muted-foreground">Here's what's happening in the practice today.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsClientFormOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-muted"
          >
            <Plus size={18} /> New Client
          </button>
          <button 
            onClick={() => setIsCaseFormOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            <Plus size={18} /> New Case
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl bg-background p-6 shadow-sm border border-border/50"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-primary/10 rounded-xl text-primary shadow-sm shadow-primary/5">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 overflow-hidden">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className={cn("mt-1 font-bold text-foreground transition-all", getFontSize(stat.value))}>
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Today's Schedule</h3>
            <button className="text-sm font-semibold text-primary hover:underline">View Calendar</button>
          </div>
          <div className="rounded-2xl bg-background shadow-sm border border-border/50 overflow-hidden">
            <div className="divide-y divide-border/50">
              {appointments.length > 0 ? appointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-6 p-6 hover:bg-muted/30 transition-colors">
                  <div className="w-20 text-sm font-bold text-foreground">
                    {new Date(apt.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{apt.client?.fullName || apt.tempClientName || 'Unknown Client'}</p>
                    <p className="text-sm text-muted-foreground">{apt.case?.title || apt.purpose || 'Consultation'}</p>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    apt.status === 'CONFIRMED' ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  )}>
                    {apt.status}
                  </div>
                  <button className="p-2 text-muted-foreground/60 hover:text-foreground">
                    <ChevronRight size={20} />
                  </button>
                </div>
              )) : (
                <div className="p-12 text-center text-muted-foreground">No appointments scheduled for today.</div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
          <div className="rounded-2xl bg-background p-6 shadow-sm border border-border/50">
            <div className="space-y-6">
              {activities.length > 0 ? activities.map((activity, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {activity.user[0]}
                    </div>
                    {idx !== activities.length - 1 && (
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-6 bg-border/50"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-bold text-primary">{activity.entity}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-muted-foreground py-4">No recent activity.</div>
              )}
            </div>
            <button className="mt-8 w-full rounded-xl border border-border py-2 text-sm font-semibold text-muted-foreground hover:bg-muted">
              View All Activity
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isClientFormOpen && (
          <ClientIntakeForm 
            onClose={() => setIsClientFormOpen(false)} 
            onSuccess={() => setIsClientFormOpen(false)} 
          />
        )}
        {isCaseFormOpen && (
          <CaseCreationForm 
            onClose={() => setIsCaseFormOpen(false)} 
            onSuccess={() => setIsCaseFormOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}


