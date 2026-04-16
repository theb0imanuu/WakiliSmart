import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Shield, 
  UserCheck, 
  UserMinus,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'ADVOCATE' | 'SECRETARY';
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersManagement() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('ALL');
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
  
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [activeMenuId, setActiveMenuId] = React.useState<number | null>(null);
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    role: 'ADVOCATE' as any,
    phone: '',
    password: ''
  });

  const [resetPassword, setResetPassword] = React.useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/users', formData);
      setSuccess('User created successfully!');
      setFormData({
        fullName: '',
        email: '',
        role: 'ADVOCATE',
        phone: '',
        password: ''
      });
      setTimeout(() => {
        setIsAddModalOpen(false);
        setSuccess('');
        fetchUsers();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await api.patch(`/users/${selectedUser.id}`, {
        fullName: formData.fullName,
        role: formData.role,
        phone: formData.phone
      });
      setSuccess('User updated successfully!');
      setTimeout(() => {
        setIsEditModalOpen(false);
        fetchUsers();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await api.patch(`/users/${user.id}`, { isActive: !user.isActive });
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await api.post(`/users/${selectedUser.id}/reset-password`, { newPassword: resetPassword });
      setSuccess('Password reset successfully!');
      setTimeout(() => {
        setIsResetModalOpen(false);
        setResetPassword('');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm));
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && user.isActive) || 
      (statusFilter === 'INACTIVE' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Admin</span>;
      case 'ADVOCATE':
        return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Advocate</span>;
      case 'SECRETARY':
        return <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Secretary</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{role}</span>;
    }
  };

  return (
    <div className="space-y-8" onClick={() => setActiveMenuId(null)}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground">Manage firm members, roles, and system access.</p>
        </div>
        <button 
          onClick={() => {
            setError(''); setSuccess('');
            setFormData({ fullName: '', email: '', role: 'ADVOCATE', phone: '', password: '' });
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
        >
          <UserPlus size={18} /> Add New Staff
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold outline-none hover:bg-muted"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admins</option>
            <option value="ADVOCATE">Advocates</option>
            <option value="SECRETARY">Secretaries</option>
          </select>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold outline-none hover:bg-muted"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 font-bold text-foreground">User</th>
                <th className="px-6 py-4 font-bold text-foreground">Role</th>
                <th className="px-6 py-4 font-bold text-foreground">Status</th>
                <th className="px-6 py-4 font-bold text-foreground">Joined At</th>
                <th className="px-6 py-4 font-bold text-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-muted rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-muted rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-muted rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-muted rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-8 float-right bg-muted rounded"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {user.fullName[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{user.fullName}</p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail size={12} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "h-2 w-2 rounded-full",
                          user.isActive ? "bg-green-500" : "bg-red-500"
                        )}></span>
                        <span className="text-xs font-medium">{user.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setActiveMenuId(activeMenuId === user.id ? null : user.id);
                         }}
                         className="text-muted-foreground hover:text-foreground p-1 transition-colors rounded-lg hover:bg-muted"
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      {/* Action Dropdown */}
                      <AnimatePresence>
                        {activeMenuId === user.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-6 top-12 z-40 w-48 rounded-2xl border border-border bg-background p-2 shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              onClick={() => {
                                setSelectedUser(user);
                                setFormData({ ...formData, fullName: user.fullName, role: user.role, phone: user.phone || '' });
                                setIsEditModalOpen(true);
                                setActiveMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold hover:bg-muted"
                            >
                              <Shield size={14} className="text-blue-500" /> Edit Profile & Role
                            </button>
                            <button 
                              onClick={() => {
                                handleToggleStatus(user);
                                setActiveMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold hover:bg-muted"
                            >
                              {user.isActive ? (
                                <><UserMinus size={14} className="text-orange-500" /> Deactivate Account</>
                              ) : (
                                <><UserCheck size={14} className="text-green-500" /> Activate Account</>
                              )}
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedUser(user);
                                setResetPassword('');
                                setIsResetModalOpen(true);
                                setActiveMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold hover:bg-muted"
                            >
                              <Mail size={14} className="text-primary" /> Reset Password
                            </button>
                            <div className="my-1 border-t border-border/50"></div>
                            <button 
                              onClick={() => {
                                handleDelete(user.id);
                                setActiveMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-red-500 hover:bg-red-50/50"
                            >
                              <X size={14} /> Delete Staff
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                       <Shield size={32} className="opacity-20" />
                       <p>No staff members found matching filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal (Unified logic) */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg rounded-3xl border border-border bg-background p-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">{isEditModalOpen ? 'Edit Staff Profile' : 'Register New Staff'}</h2>
                <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="rounded-full p-2 text-muted-foreground hover:bg-muted"><X size={20} /></button>
              </div>

              <form onSubmit={isEditModalOpen ? handleUpdateUser : handleAddUser} className="mt-8 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <input required type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2 text-sm outline-none focus:border-primary" />
                </div>

                {!isEditModalOpen && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</label>
                    <select required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as any})} className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2 text-sm outline-none focus:border-primary">
                      <option value="ADVOCATE">Advocate</option>
                      <option value="SECRETARY">Secretary</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone</label>
                    <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                </div>

                {!isEditModalOpen && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Temporary Password</label>
                    <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                )}

                {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2"><AlertCircle size={14} /> {error}</div>}
                {success && <div className="p-3 bg-green-50 text-green-600 rounded-xl text-xs font-bold flex items-center gap-2"><CheckCircle2 size={14} /> {success}</div>}

                <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50">
                  {isSubmitting ? 'Processing...' : isEditModalOpen ? 'Update Staff Member' : 'Register Team Member'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {isResetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsResetModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm rounded-3xl border border-border bg-background p-8 shadow-2xl">
              <h2 className="text-xl font-bold text-foreground">Reset Password</h2>
              <p className="text-sm text-muted-foreground mt-2">Set a new temporary password for <b>{selectedUser?.fullName}</b></p>
              
              <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
                <input 
                  required 
                  type="password" 
                  placeholder="New password" 
                  value={resetPassword} 
                  onChange={(e) => setResetPassword(e.target.value)} 
                  className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 outline-none focus:border-primary"
                />
                <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground hover:bg-primary/90">
                  {isSubmitting ? 'Updating...' : 'Set New Password'}
                </button>
                {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
                {success && <p className="text-xs text-green-500 font-bold">{success}</p>}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
