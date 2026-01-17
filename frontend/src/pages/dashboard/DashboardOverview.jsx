import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DashboardOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = role === 'ADVOCATE' ? '/dashboard/advocate' : '/dashboard/secretary';
      try {
        const response = await api.get(endpoint);
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good Morning, ${username}`;
    if (hour < 18) return `Good Afternoon, ${username}`;
    return `Good Evening, ${username}`;
  };

  const advocateStats = data ? [
    { title: "Active Cases", value: data.activeCasesCount, icon: "work", color: "text-primary", bg: "bg-primary/10" },
    { title: "Upcoming Deadlines", value: data.upcomingDeadlines?.length, icon: "warning", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
    { title: "Recent Activity", value: data.activeCases?.length, icon: "history", color: "text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
  ] : [];

  const secretaryStats = data ? [
    { title: "Today's Appointments", value: data.todayAppointments, icon: "calendar_today", color: "text-primary", bg: "bg-primary/10" },
    { title: "Pending Inquiries", value: data.pendingInquiries, icon: "help", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
    { title: "Unpaid Invoices", value: data.totalUnpaidInvoices, icon: "receipt_long", color: "text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
  ] : [];
  
  const stats = role === 'ADVOCATE' ? advocateStats : secretaryStats;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      
      {/* 1. Page Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2 font-serif">{getGreeting()}</h1>
          <p className="text-slate-500 dark:text-slate-400">Here is your daily snapshot for today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="material-symbols-outlined text-base">visibility_off</span>
          <span>Privacy Mode: Off</span>
        </div>
      </div>

      {/* 2. Quick Stats */}
      {loading && <p>Loading stats...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-[#1a202c] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 hover:border-primary/50 transition-colors cursor-default group">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{stat.title}</p>
                <span className={`material-symbols-outlined ${stat.color} ${stat.bg} p-1.5 rounded-lg group-hover:bg-opacity-100 transition-colors`}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Daily Snapshot & Financials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Agenda */}
        {role === 'SECRETARY' && (
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Today's Agenda</h3>
              <button className="text-primary text-sm font-semibold hover:underline cursor-pointer">View Calendar</button>
            </div>
            <div className="p-4 flex flex-col gap-3 overflow-y-auto max-h-[300px]">
              {data?.todayAppointmentsList &&
              data.todayAppointmentsList.length > 0 ? (
                data.todayAppointmentsList.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mr-4">
                      <span className="text-xs font-bold">
                        {new Date(app.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {app.client?.name || 'Unknown Client'}
                      </p>
                      <p className="text-xs text-slate-500">{app.purpose}</p>
                    </div>
                    <div className="ml-auto">
                      <span
                        className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                          app.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>No appointments today.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Financial Overview (Simplified Chart) */}
        {role === 'ADVOCATE' && (
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Financial Overview
                </h3>
                <p className="text-sm text-slate-500">
                  Revenue (Last 6 Months)
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 uppercase font-semibold">
                  Total Revenue (YTD)
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {data?.totalRevenue
                    ? data.totalRevenue.toLocaleString()
                    : '0'}
                </p>
              </div>
            </div>
            {/* CSS Bar Chart */}
            <div className="flex items-end justify-between h-40 gap-2 w-full border-b border-slate-200 dark:border-slate-700 pb-2">
              {data?.monthlyRevenue ? (
                data.monthlyRevenue.map((item, i) => {
                  const max = Math.max(
                    ...data.monthlyRevenue.map((d) => d.amount),
                    1,
                  );
                  const height = (item.amount / max) * 100;
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 group w-full h-full justify-end"
                    >
                      <div
                        className="w-full max-w-[40px] bg-primary rounded-t-sm relative opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${height}%` }}
                      >
                        {/* Tooltip could go here */}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {item.month}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full text-center py-10 text-slate-500">
                  No data available
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Recent Activity Table */}
      {role === 'ADVOCATE' && data?.activeCases && (
        <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Case Activity</h3>
            <button className="text-slate-400 hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Case ID</th>
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.activeCases.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{row.case_number}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{row.client?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{row.title}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(row.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-primary cursor-pointer"><span className="material-symbols-outlined text-lg">more_vert</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;