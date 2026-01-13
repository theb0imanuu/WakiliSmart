import React from 'react';

const ClientsDirectory = () => {
  // Mock Client Data
  const clients = [
    { id: 1, name: "John Smith", type: "Individual", email: "john.smith@email.com", phone: "+254 712 345 678", cases: 2, status: "Active", img: "https://i.pravatar.cc/150?u=10" },
    { id: 2, name: "Acme Corp", type: "Corporate", email: "legal@acmecorp.com", phone: "+254 20 123 4567", cases: 5, status: "Active", img: "https://i.pravatar.cc/150?u=20" },
    { id: 3, name: "Sarah Johnson", type: "Individual", email: "s.johnson@email.com", phone: "+254 722 987 654", cases: 1, status: "Pending", img: "https://i.pravatar.cc/150?u=30" },
    { id: 4, name: "Global Innovations", type: "Corporate", email: "info@globalinn.com", phone: "+254 733 555 111", cases: 3, status: "Active", img: "https://i.pravatar.cc/150?u=40" },
    { id: 5, name: "Linda Williams", type: "Individual", email: "linda.w@email.com", phone: "+254 711 222 333", cases: 1, status: "Inactive", img: "https://i.pravatar.cc/150?u=50" },
    { id: 6, name: "Apex Properties", type: "Corporate", email: "admin@apexprops.co.ke", phone: "+254 20 999 8888", cases: 4, status: "Active", img: "https://i.pravatar.cc/150?u=60" },
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-serif">Client Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base">Manage your client relationships and contact details.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Add Client
        </button>
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
        {clients.map((client) => (
          <div key={client.id} className="group bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
            
            {/* Card Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white dark:border-slate-700 shadow-sm" 
                  style={{ backgroundImage: `url('${client.img}')` }}
                ></div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{client.name}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full inline-block mt-1">
                    {client.type}
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
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{client.cases} Active Cases</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full 
                  ${client.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                    client.status === 'Inactive' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : 
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                  {client.status}
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