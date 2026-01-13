import React from 'react';
import { Link } from 'react-router-dom';

const CaseManagement = () => {
  // Sample Data - In a real app, this comes from your API
  const cases = [
    { id: "REF-2023-089", title: "Smith v. State", client: "John Smith", initials: "JS", color: "bg-blue-100 text-blue-600", status: "Active", statusColor: "green", nextDate: "Nov 24, 2023", area: "Criminal Defense" },
    { id: "REF-2023-092", title: "TechCorp Acquisition", client: "Acme Corp", initials: "AC", color: "bg-purple-100 text-purple-600", status: "Review", statusColor: "blue", nextDate: "No upcoming hearings", area: "Corporate" },
    { id: "REF-2023-075", title: "Estate of M. Williams", client: "Linda Williams", initials: "LW", color: "bg-orange-100 text-orange-600", status: "Pending", statusColor: "yellow", nextDate: "Dec 02, 2023", area: "Family Law" },
    { id: "REF-2023-112", title: "Doe Divorce Proceedings", client: "Jane Doe", initials: "JD", color: "bg-pink-100 text-pink-600", status: "Urgent", statusColor: "red", nextDate: "Tomorrow", area: "Family Law" },
    { id: "REF-2023-045", title: "Intellectual Property Dispute", client: "Global Innovations", initials: "GI", color: "bg-teal-100 text-teal-600", status: "Closed", statusColor: "gray", nextDate: "Case Closed", area: "IP Law" },
  ];

  // Helper to get badge colors based on status
  const getStatusBadge = (status, color) => {
    const colors = {
      green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
      red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
      gray: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.gray}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full">
      
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1 text-sm">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Home</span>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-white font-medium">Cases</span>
          </div>
          <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight font-serif">Case Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Manage and track all active legal matters and court proceedings</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Case
        </button>
      </div>

      {/* 2. Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full lg:max-w-md h-11">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400">search</span>
          </div>
          <input 
            className="block w-full h-full pl-10 pr-3 py-2 bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm shadow-sm transition-all" 
            placeholder="Search by case number, client, or keyword..." 
            type="text"
          />
        </div>
        
        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="group flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary dark:hover:border-primary transition-colors shadow-sm">
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Status:</span>
            <span className="text-primary text-sm font-medium">Active</span>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-[20px]">expand_more</span>
          </button>
          <button className="group flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary dark:hover:border-primary transition-colors shadow-sm">
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Practice Area:</span>
            <span className="text-slate-900 dark:text-white text-sm font-medium">All</span>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-[20px]">expand_more</span>
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="text-slate-500 hover:text-primary dark:text-slate-400 transition-colors p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <button className="text-slate-500 hover:text-primary dark:text-slate-400 transition-colors p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
            <span className="material-symbols-outlined">download</span>
          </button>
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 w-12"><input className="rounded border-slate-300 text-primary focus:ring-primary bg-slate-50 dark:bg-slate-700 dark:border-slate-600" type="checkbox"/></th>
                <th className="px-6 py-4">Case Details</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Next Hearing</th>
                <th className="px-6 py-4">Practice Area</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {cases.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <input className="rounded border-slate-300 text-primary focus:ring-primary bg-white dark:bg-slate-800 dark:border-slate-600" type="checkbox"/>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{row.title}</span>
                      <span className="text-xs text-slate-500 mt-0.5 font-mono">{row.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${row.color}`}>
                        {row.initials}
                      </div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{row.client}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(row.status, row.statusColor)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[18px] ${row.statusColor === 'red' ? 'text-red-500' : 'text-slate-400'}`}>event</span>
                      <span className={row.statusColor === 'red' ? 'text-red-600 font-medium' : ''}>{row.nextDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{row.area}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white dark:bg-[#1a202c] border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-medium text-slate-900 dark:text-white">1</span> to <span className="font-medium text-slate-900 dark:text-white">{cases.length}</span> of <span className="font-medium text-slate-900 dark:text-white">128</span> results
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors">Previous</button>
            <button className="px-3 py-1 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CaseManagement;