import React from 'react';

const DashboardOverview = () => {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      
      {/* 1. Page Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2 font-serif">Good Morning, Counsel</h1>
          <p className="text-slate-500 dark:text-slate-400">Here is your daily snapshot for today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="material-symbols-outlined text-base">visibility_off</span>
          <span>Privacy Mode: Off</span>
        </div>
      </div>

      {/* 2. Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Hearings Today", value: "3", icon: "gavel", color: "text-primary", bg: "bg-primary/10", trend: "+1 from yesterday", trendColor: "text-green-600", trendIcon: "trending_up" },
          { title: "Filings Due (48h)", value: "2", icon: "warning", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", trend: "Critical Priority", trendColor: "text-red-500", trendIcon: "priority_high" },
          { title: "Unread Messages", value: "5", icon: "mail", color: "text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", trend: "2 High Priority Clients", trendColor: "text-blue-500", trendIcon: "notification_important" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-[#1a202c] rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 hover:border-primary/50 transition-colors cursor-default group">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{stat.title}</p>
              <span className={`material-symbols-outlined ${stat.color} ${stat.bg} p-1.5 rounded-lg group-hover:bg-opacity-100 transition-colors`}>{stat.icon}</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className={`${stat.trendColor} text-xs font-semibold flex items-center mt-1`}>
                <span className="material-symbols-outlined text-sm mr-0.5">{stat.trendIcon}</span>
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Daily Snapshot & Financials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Agenda */}
        <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Today's Agenda</h3>
            <button className="text-primary text-sm font-semibold hover:underline cursor-pointer">View Calendar</button>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {[
              { time: "09:00 AM", title: "Court Hearing: Mwangi v. State", loc: "High Court, Room 4B", type: "blue" },
              { time: "02:30 PM", title: "Client Intake: Sarah Johnson", loc: "Zoom Meeting", type: "gray" }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className={`flex flex-col items-center justify-center min-w-[3.5rem] ${item.type === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'} rounded-lg h-14`}>
                  <span className="text-xs font-bold uppercase">Oct</span>
                  <span className="text-lg font-bold">24</span>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {item.time}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {item.loc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Overview (Simplified Chart) */}
        <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Financial Overview</h3>
              <p className="text-sm text-slate-500">Revenue (Last 6 Months)</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 uppercase font-semibold">Total Revenue (YTD)</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">$142,500</p>
            </div>
          </div>
          {/* CSS Bar Chart */}
          <div className="flex items-end justify-between h-40 gap-2 w-full border-b border-slate-200 dark:border-slate-700 pb-2">
            {[40, 65, 45, 80, 60, 90].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group w-full h-full justify-end">
                    <div className="w-full max-w-[40px] bg-primary rounded-t-sm relative opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                    <span className="text-xs text-slate-500 font-medium">{['May','Jun','Jul','Aug','Sep','Oct'][i]}</span>
                </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Recent Activity Table */}
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
                <th className="px-6 py-3 font-medium">Activity</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { id: "#4029", client: "John Doe Estate", act: "Document Uploaded: Will_v2.pdf", date: "Oct 24", status: "Active", color: "green" },
                { id: "#3901", client: "TechCorp Merger", act: "Email Received: Contract revision", date: "Oct 23", status: "Pending", color: "yellow" },
                { id: "#4100", client: "Sarah Johnson", act: "New Case Created", date: "Oct 23", status: "New", color: "blue" },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{row.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{row.client}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{row.act}</td>
                  <td className="px-6 py-4 text-slate-500">{row.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${row.color}-100 text-${row.color}-700 dark:bg-${row.color}-900/30 dark:text-${row.color}-400`}>
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

    </div>
  );
};

export default DashboardOverview;