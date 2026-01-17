import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const ClientsDirectory = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get('/clients');
        setClients(response.data);
      } catch (err) {
        setError('Failed to fetch clients.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const getAvatarUrl = (id) => `https://i.pravatar.cc/150?u=${id}`;

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-serif">Client Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base">Manage your client relationships and contact details.</p>
        </div>
        <Link to="/dashboard/clients/new" className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Add Client
        </Link>
      </div>

      {/* 2. Search & Filters */}
      <div className="bg-white dark:bg-[#1a202c] p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
          <input 
            type="text" 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400 dark:text-white"
            placeholder="Search by name, email, or phone..."
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold transition-colors">
            Filter
          </button>
          <button className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* 3. Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <p>Loading clients...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && clients.map((client) => (
          <div key={client.id} className="group bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
            
            {/* Card Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white dark:border-slate-700 shadow-sm" 
                  style={{ backgroundImage: `url('${getAvatarUrl(client.id)}')` }}
                ></div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{client.name}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full inline-block mt-1">
                    Individual
                  </span>
                </div>
              </div>
              <button className="text-slate-400 hover:text-primary">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>

            {/* Card Body */}
            <div className="p-6 pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="material-symbols-outlined text-[18px] text-slate-400">mail</span>
                {client.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="material-symbols-outlined text-[18px] text-slate-400">call</span>
                {client.phone}
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">briefcase</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{client.cases.length} Active Cases</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`}>
                  Active
                </span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl flex gap-2">
              <button className="flex-1 py-2 text-xs font-bold text-primary border border-primary/20 rounded hover:bg-primary hover:text-white transition-colors">
                View Profile
              </button>
              <button className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Message
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default ClientsDirectory;