import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const BillingInvoicing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await api.get('/billing');
        setInvoices(response.data);
      } catch (err) {
        setError('Failed to fetch invoices.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const getAvatarUrl = (id) => `https://i.pravatar.cc/150?u=${id}`;

  const statusColors = {
    PAID: 'green',
    UNPAID: 'amber',
    OVERDUE: 'red',
  };

  const getStatusBadge = (status) => {
    const color = statusColors[status.toUpperCase()] || 'gray';
    const styles = {
      red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-900",
      green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-900",
      amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-900",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[color] || styles.green}`}>
        {status}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalBilled = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const pendingPayments = invoices.filter(inv => inv.status === 'UNPAID').reduce((acc, inv) => acc + inv.balance_due, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'OVERDUE').reduce((acc, inv) => acc + inv.balance_due, 0);

  const stats = [
    { title: "Total Billed (Month)", value: formatCurrency(totalBilled), icon: "payments", color: "text-primary/60" },
    { title: "Pending Payments", value: formatCurrency(pendingPayments), icon: "pending_actions", color: "text-yellow-500/60" },
    { title: "Overdue Amount", value: formatCurrency(overdueAmount), icon: "warning", color: "text-red-500/60" },
  ];

  return (
    <div className="flex flex-col gap-8 h-full">
      
      {/* 1. Page Heading & Actions */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-serif">Billing & Invoicing</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base">Manage client invoices, track payments, and generate new bills.</p>
        </div>
        <Link to="/dashboard/billing/new" className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all whitespace-nowrap cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">post_add</span>
          <span>Generate Invoice</span>
        </Link>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-[#1a202c] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{stat.title}</p>
              <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Table Section */}
      <div className="flex flex-col gap-4">
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-[#1a202c] p-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-full sm:w-96 relative">
            <input 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#f6f6f8] dark:bg-[#111621] border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white" 
              placeholder="Search client, invoice #..." 
              type="text"
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 pointer-events-none text-[20px]">search</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a202c] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter
            </button>
            <button className="flex-1 sm:flex-none items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a202c] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export
            </button>
          </div>
        </div>

        {/* Main Data Table */}
        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-[#1a202c]">
          {loading && <p className="p-6">Loading invoices...</p>}
          {error && <p className="p-6 text-red-500">{error}</p>}
          {!loading && !error && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0f172a] dark:bg-slate-900 text-white border-b border-slate-700">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider w-32">Invoice #</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider min-w-[200px]">Client Name</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider min-w-[200px]">Service</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider w-32">Date</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider w-32 text-right">Amount</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider w-32 text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider w-24 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-white dark:bg-[#1a202c]">
                        <td className="px-6 py-4 font-medium text-primary">{inv.id.substring(0, 8)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 bg-cover bg-center" 
                              style={{ backgroundImage: `url('${getAvatarUrl(inv.case.client.id)}')` }}
                            ></div>
                            <span className="font-medium text-slate-900 dark:text-slate-100">{inv.case.client.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{inv.serviceType}</td>
                        <td className="px-6 py-4 text-slate-500">{new Date(inv.due_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">{formatCurrency(inv.amount)}</td>
                        <td className="px-6 py-4 text-center">
                          {getStatusBadge(inv.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#1a202c]">
                <p className="text-sm text-slate-500">Showing <span className="font-medium">1</span> to <span className="font-medium">{invoices.length}</span> of <span className="font-medium">{invoices.length}</span> results</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 cursor-pointer">Previous</button>
                  <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default BillingInvoicing;