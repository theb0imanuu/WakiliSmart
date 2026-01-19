
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const Sidebar = () => (
  <div className="w-64 bg-gray-800 text-white h-screen">
    <div className="p-4">
      <h1 className="text-2xl font-bold">WakiliSmart</h1>
    </div>
    <nav>
      <ul>
        <li className="p-4 hover:bg-gray-700"><Link to="/secretary/dashboard">Dashboard</Link></li>
        <li className="p-4 hover:bg-gray-700"><Link to="/secretary/calendar">Calendar</Link></li>
        <li className="p-4 hover:bg-gray-700"><Link to="/secretary/scheduling">Scheduling</Link></li>
        <li className="p-4 hover:bg-gray-700"><Link to="/secretary/billing">Billing</Link></li>
        <li className="p-4 hover:bg-gray-700"><Link to="/secretary/repository">Repository</Link></li>
      </ul>
    </nav>
  </div>
);

const TopNavBar = () => (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <input
            type="text"
            placeholder="Search clients, cases, invoices..."
            className="w-full max-w-lg p-2 border border-gray-300 rounded"
        />
    </div>
);


const SecretaryLayout = () => {
  const [inquiries, setInquiries] = useState([]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNavBar />
        <main className="p-4">
          <Outlet context={{ inquiries, setInquiries }} />
        </main>
      </div>
    </div>
  );
};

export default SecretaryLayout;
