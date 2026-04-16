import React from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Mail, 
  Save,
  Building2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { useAuth } from '@/components/AuthProvider';
import api from '@/lib/api';

export default function SettingsPage() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = React.useState('general');
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Profile Form State
  const [profileData, setProfileData] = React.useState({
    fullName: user?.fullName || '',
    phone: (user as any)?.phone || ''
  });

  // Security Form State
  const [securityData, setSecurityData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification Form State
  const [notificationSettings, setNotificationSettings] = React.useState({
    emailCaseUpdates: user?.settings?.emailCaseUpdates ?? true,
    emailAppointments: user?.settings?.emailAppointments ?? true,
    smsUrgent: user?.settings?.smsUrgent ?? false,
    appAlerts: user?.settings?.appAlerts ?? true,
    securityAlerts: user?.settings?.securityAlerts ?? true,
  });

  React.useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName,
        phone: (user as any).phone || ''
      });
      if (user.settings) {
        setNotificationSettings({
          emailCaseUpdates: user.settings.emailCaseUpdates ?? true,
          emailAppointments: user.settings.emailAppointments ?? true,
          smsUrgent: user.settings.smsUrgent ?? false,
          appAlerts: user.settings.appAlerts ?? true,
          securityAlerts: user.settings.securityAlerts ?? true,
        });
      }
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await api.patch('/users/profile', profileData);
      login(response.data, response.data.role);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await api.patch('/users/change-password', { newPassword: securityData.newPassword });
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await api.patch('/users/profile', {
        settings: {
          ...user?.settings,
          ...notificationSettings
        }
      });
      login(response.data, response.data.role);
      setMessage({ type: 'success', text: 'Notification preferences updated!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update notifications' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: <Building2 size={18} />, adminOnly: true },
    { id: 'profile', name: 'My Profile', icon: <User size={18} />, adminOnly: false },
    { id: 'billing', name: 'Billing & Rates', icon: <CreditCard size={18} />, adminOnly: true },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} />, adminOnly: false },
    { id: 'security', name: 'Security', icon: <Shield size={18} />, adminOnly: false },
  ];

  const filteredTabs = tabs.filter(tab => user?.role === 'ADMIN' || !tab.adminOnly);

  React.useEffect(() => {
    if (user && user.role !== 'ADMIN' && activeTab === 'general') {
      setActiveTab('profile');
    }
  }, [user, activeTab]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground">Manage your personal preferences and firm configurations.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-1">
          {filteredTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMessage(null);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-background hover:text-foreground"
              )}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl bg-background p-8 shadow-sm border border-border/50"
          >
            {message && (
              <div className={cn(
                "mb-6 rounded-xl p-4 text-sm font-bold flex items-center gap-2",
                message.type === 'success' ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}>
                {message.type === 'success' ? <Save size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </div>
            )}

            {activeTab === 'general' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Firm Information</h3>
                  <p className="text-sm text-muted-foreground">This information will appear on your invoices and letterheads.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Firm Name</label>
                    <input type="text" defaultValue="WakiliSmart Legal Advocates" className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-background" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Registration Number</label>
                    <input type="text" defaultValue="LSK/2026/0042" className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-background" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-foreground/80">Physical Address</label>
                    <textarea rows={3} className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-background">Suite 402, Upper Hill Chambers, Nairobi, Kenya</textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Primary Phone</label>
                    <input type="text" defaultValue="+254 700 000 000" className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-background" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Primary Email</label>
                    <input type="email" defaultValue="info@wakilismart.co.ke" className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-background" />
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <h3 className="text-lg font-bold text-foreground">Operational Settings</h3>
                  <div className="mt-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Clock size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">Business Hours</p>
                          <p className="text-xs text-muted-foreground">Set your firm's working hours for bookings.</p>
                        </div>
                      </div>
                      <button className="text-sm font-bold text-primary hover:underline">Configure</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Globe size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">Timezone & Currency</p>
                          <p className="text-xs text-muted-foreground">Africa/Nairobi (EAT), KES (Shillings)</p>
                        </div>
                      </div>
                      <button className="text-sm font-bold text-primary hover:underline">Change</button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground hover:bg-primary/90 shadow-lg transition-all active:scale-95">
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSave} className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-foreground">My Profile</h3>
                  <p className="text-sm text-muted-foreground">Manage your personal identification and contact details.</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                    {user?.fullName?.[0] || 'U'}
                  </div>
                  <div>
                    <button type="button" className="text-sm font-bold text-primary hover:underline">Change Photo</button>
                    <p className="text-xs text-muted-foreground mt-1">Recommended: Square, min 400x400px.</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.fullName} 
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-background" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Email (Read-only)</label>
                    <input 
                      type="email" 
                      value={user?.email || ''} 
                      disabled 
                      className="w-full rounded-xl border border-border/50 bg-muted/10 px-4 py-2.5 text-sm outline-none opacity-60 cursor-not-allowed" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Phone Number</label>
                    <input 
                      type="text" 
                      value={profileData.phone} 
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-background" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">System Role</label>
                    <input 
                      type="text" 
                      value={user?.role || ''} 
                      disabled 
                      className="w-full rounded-xl border border-border/50 bg-muted/10 px-4 py-2.5 text-sm outline-none opacity-60 cursor-not-allowed uppercase" 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button 
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground hover:bg-primary/90 shadow-lg transition-all active:scale-95 disabled:opacity-70"
                  >
                    {loading ? "Saving..." : <><Save size={18} /> Update Profile</>}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordUpdate} className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Security Settings</h3>
                  <p className="text-sm text-muted-foreground">Keep your account secure by updating your access credentials.</p>
                </div>

                <div className="max-w-md space-y-6">
                  <div className="space-y-2 text-muted-foreground/60 italic text-xs">
                    * You will not be logged out after changing your password.
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">New Password</label>
                    <input 
                      type="password" 
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                      className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-background" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/80">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                      className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-background" 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button 
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground hover:bg-primary/90 shadow-lg transition-all active:scale-95 disabled:opacity-70"
                  >
                    {loading ? "Updating..." : <><Shield size={18} /> Change Password</>}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <form onSubmit={handleNotificationSave} className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">Choose how you want to be notified about activity in WakiliSmart.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Email Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between rounded-2xl border border-border/50 bg-muted/20 p-4 transition-all hover:bg-muted/30 cursor-pointer">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-foreground">Case Updates</p>
                          <p className="text-xs text-muted-foreground">Receive emails when cases you're assigned to are updated.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.emailCaseUpdates}
                          onChange={(e) => setNotificationSettings({...notificationSettings, emailCaseUpdates: e.target.checked})}
                          className="h-5 w-5 rounded border-border bg-background text-primary focus:ring-primary/20"
                        />
                      </label>
                      <label className="flex items-center justify-between rounded-2xl border border-border/50 bg-muted/20 p-4 transition-all hover:bg-muted/30 cursor-pointer">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-foreground">Appointment Reminders</p>
                          <p className="text-xs text-muted-foreground">Get reminded about upcoming hearings and client meetings.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.emailAppointments}
                          onChange={(e) => setNotificationSettings({...notificationSettings, emailAppointments: e.target.checked})}
                          className="h-5 w-5 rounded border-border bg-background text-primary focus:ring-primary/20"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Mobile & SMS</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between rounded-2xl border border-border/50 bg-muted/20 p-4 transition-all hover:bg-muted/30 cursor-pointer">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-foreground">Urgent SMS Alerts</p>
                          <p className="text-xs text-muted-foreground">SMS notifications for court dates and emergency changes.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.smsUrgent}
                          onChange={(e) => setNotificationSettings({...notificationSettings, smsUrgent: e.target.checked})}
                          className="h-5 w-5 rounded border-border bg-background text-primary focus:ring-primary/20"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">System Alerts</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between rounded-2xl border border-border/50 bg-muted/20 p-4 transition-all hover:bg-muted/30 cursor-pointer">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-foreground">In-App Notifications</p>
                          <p className="text-xs text-muted-foreground">Show alerts in the system header bell icon.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.appAlerts}
                          onChange={(e) => setNotificationSettings({...notificationSettings, appAlerts: e.target.checked})}
                          className="h-5 w-5 rounded border-border bg-background text-primary focus:ring-primary/20"
                        />
                      </label>
                      <label className="flex items-center justify-between rounded-2xl border border-border/50 bg-muted/20 p-4 transition-all hover:bg-muted/30 cursor-pointer">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-foreground">Security Alerts</p>
                          <p className="text-xs text-muted-foreground">Notify me about logins from new devices.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.securityAlerts}
                          onChange={(e) => setNotificationSettings({...notificationSettings, securityAlerts: e.target.checked})}
                          className="h-5 w-5 rounded border-border bg-background text-primary focus:ring-primary/20"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button 
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground hover:bg-primary/90 shadow-lg transition-all active:scale-95 disabled:opacity-70"
                  >
                    {loading ? "Saving..." : <><Save size={18} /> Save Preferences</>}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'billing' && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground/60 mb-4">
                  <SettingsIcon size={32} />
                </div>
                <h3 className="text-lg font-bold text-foreground">Billing & Rates Settings</h3>
                <p className="text-muted-foreground mt-2">This section is coming soon in the next update.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
