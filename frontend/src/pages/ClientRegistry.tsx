import React, { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Phone, 
  Mail, 
  MapPin,
  Filter,
  Download,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';

import ClientIntakeForm from '@/components/ClientIntakeForm';
import CaseDetailsModal from '@/components/CaseDetailsModal';

export default function ClientRegistry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (error) {
      console.error('Failed to fetch clients', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = 
        client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const hasCases = client._count?.cases > 0;
      const matchesFilter = 
        filterType === 'ALL' || 
        (filterType === 'ACTIVE' && hasCases) || 
        (filterType === 'INACTIVE' && !hasCases);
      
      return matchesSearch && matchesFilter;
    });
  }, [clients, searchTerm, filterType]);

  const exportToCSV = () => {
    const headers = ['Client ID', 'Full Name', 'Phone', 'Email', 'Address', 'Cases', 'Date Joined'];
    const rows = filteredClients.map(c => [
      c.clientId,
      `"${c.fullName.replace(/"/g, '""')}"`,
      c.phoneNumber,
      c.email || 'N/A',
      `"${c.physicalAddress?.replace(/"/g, '""') || 'N/A'}"`,
      c._count?.cases || 0,
      new Date(c.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wakilismart_clients_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Client Registry</h1>
          <p className="text-muted-foreground">Manage your firm's client relationships and contact information.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
        >
          <UserPlus size={18} /> New Client
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 rounded-2xl bg-background p-4 shadow-sm border border-border/50 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search by name, ID, phone or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-border/50 bg-muted/30 pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="appearance-none rounded-xl border border-border/50 bg-background pl-10 pr-8 py-2.5 text-sm font-semibold text-muted-foreground outline-none transition-all hover:bg-muted focus:border-primary"
            >
              <option value="ALL">All Clients</option>
              <option value="ACTIVE">Active (With Cases)</option>
              <option value="INACTIVE">Inactive (No Cases)</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/60">
              <ChevronRight size={14} className="rotate-90" />
            </div>
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 rounded-xl border border-border/50 bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted"
          >
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* Client Table */}
      <div className="overflow-hidden rounded-2xl bg-background shadow-sm border border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 bg-muted/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Client ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Full Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/60 text-center">Cases</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Last Activity</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Loading clients...</td>
                </tr>
              ) : filteredClients.length > 0 ? filteredClients.map((client) => (
                <tr key={client.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-bold text-primary">{client.clientId}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {client.fullName.split(' ').map((n: string) => n[0] || '').join('')}
                      </div>
                      <span className="text-sm font-bold text-foreground">{client.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                        <Phone size={12} className="text-muted-foreground/60" /> {client.phoneNumber}
                      </div>
                      {client.email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                          <Mail size={12} className="text-muted-foreground/60" /> {client.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                      {client._count?.cases || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 relative">
                      <div className="relative">
                        <button 
                          onClick={() => setMenuOpenId(menuOpenId === client.id ? null : client.id)}
                          className={cn(
                            "rounded-lg p-2 transition-colors",
                            menuOpenId === client.id ? "bg-primary text-primary-foreground" : "text-muted-foreground/60 hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        <AnimatePresence>
                          {menuOpenId === client.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setMenuOpenId(null)} 
                              />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-border bg-background p-1 shadow-xl outline-none"
                              >
                                <button 
                                  onClick={() => {
                                    setEditingClient(client);
                                    setMenuOpenId(null);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-foreground hover:bg-muted"
                                >
                                  Edit Info
                                </button>
                                <div className="my-1 border-t border-border" />
                                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-destructive hover:bg-destructive/10">
                                  Delete Record
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No clients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border/50 bg-muted/50 px-6 py-4">
          <p className="text-xs font-medium text-muted-foreground">Showing {filteredClients.length} clients</p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-border bg-background px-3 py-1 text-xs font-bold text-muted-foreground disabled:opacity-50">Previous</button>
            <button className="rounded-lg border border-border bg-background px-3 py-1 text-xs font-bold text-muted-foreground">Next</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <ClientIntakeForm 
            onClose={() => setIsFormOpen(false)} 
            onSuccess={() => {
              setIsFormOpen(false);
              fetchClients();
            }} 
          />
        )}
        {editingClient && (
          <ClientIntakeForm 
            isEdit={true}
            initialData={editingClient}
            onClose={() => setEditingClient(null)} 
            onSuccess={() => {
              setEditingClient(null);
              fetchClients();
            }} 
          />
        )}
        {selectedCase && (
          <CaseDetailsModal 
            caseData={selectedCase}
            onClose={() => setSelectedCase(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

