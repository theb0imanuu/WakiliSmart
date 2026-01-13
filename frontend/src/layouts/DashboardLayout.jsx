import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import imgLogo from '../assets/logo.svg';
import lawyerImg from '../assets/lawyer.webp'; 

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Helper to determine active state
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Cases', path: '/dashboard/cases', icon: 'work' },
    { name: 'Clients', path: '/dashboard/clients', icon: 'group' },
    { name: 'Inquiry Desk', path: '/dashboard/inquiries', icon: 'mark_chat_unread' }, 
    { name: 'Calendar', path: '/dashboard/calendar', icon: 'calendar_month' },
    { name: 'Billing', path: '/dashboard/billing', icon: 'payments' },
    { name: 'Documents', path: '/dashboard/documents', icon: 'folder_open' },
  ];

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col bg-white dark:bg-[#111621] border-r border-slate-200 dark:border-slate-800 shrink-0 z-20`}>
        
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden px-4">
            {/* UPDATED: Using the SVG image import */}
            <img src={imgLogo} alt="WakiliSmart Logo" className="h-8 w-8 shrink-0" />
            
            {isSidebarOpen && (
              <div className="flex flex-col min-w-0">
                <h1 className="text-base font-bold leading-none truncate">WakiliSmart</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">Legal ERP</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isActive(item.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive(item.path) ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
              {isSidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button className={`flex items-center justify-center gap-2 w-full rounded-lg bg-primary hover:bg-blue-700 text-white h-10 transition-all ${isSidebarOpen ? 'px-4' : 'px-0'}`}>
            <span className="material-symbols-outlined text-[20px]">add</span>
            {isSidebarOpen && <span className="text-sm font-bold">New Matter</span>}
          </button>
          
          <div className={`mt-4 flex items-center gap-3 px-1 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="h-9 w-9 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-700 shrink-0" style={{ backgroundImage: `url(${lawyerImg})` }}></div>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">Mark Macharia</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">Admin</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111621] px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="text-slate-500 hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="hidden md:flex relative w-96">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none placeholder:text-slate-400 dark:text-white"
                placeholder="Search cases, clients, or documents..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 relative cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <Link to="/" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary">
              Log Out
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fc] dark:bg-[#0f131a] p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;