import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';

const InquiryDesk = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/inquiry');
      setInquiries(response.data);
    } catch (err) {
      setError('Failed to fetch inquiries.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/inquiry/${id}/status`, { status: newStatus });
      fetchInquiries();
    } catch (error) {
      alert('Failed to update status: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleConvertToClient = async (inquiry) => {
    if (window.confirm('Are you sure you want to convert this inquiry to a client?')) {
      try {
        if (!inquiry.name || !inquiry.phone || !inquiry.email) {
          alert('Cannot convert to client: name, email, and phone are required.');
          return;
        }
        const clientResponse = await api.post('/clients', {
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
        });
        await api.patch(`/inquiry/${inquiry.id}/status`, {
          status: 'CONVERTED',
          clientId: clientResponse.data.id,
        });
        fetchInquiries();
      } catch (error) {
        alert('Failed to convert to client: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const statusMap = {
    PENDING: 'new',
    PENDING_REPLY: 'pending',
    CONVERTED: 'closed',
  };

  const getColumnData = (status) => inquiries.filter(i => statusMap[i.status] === status);

  const InquiryCard = ({ item }) => {
    const colors = {
      red: "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
      gray: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600",
      blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
      yellow: "bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
      purple: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
      green: "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    };
    
    const nextStatus = {
      PENDING: 'PENDING_REPLY',
      PENDING_REPLY: 'CONVERTED',
    };

    return (
      <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h3>
          <span className="text-[10px] text-slate-500 font-medium bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {item.message}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className={`px-2 py-0.5 border rounded text-[10px] font-bold uppercase tracking-wide ${colors.gray}`}>
            General
          </span>
          {item.status !== 'CONVERTED' && (
            <button onClick={() => handleConvertToClient(item)} className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white p-1.5 rounded-md hover:bg-blue-700 shadow-sm">
              <span className="material-symbols-outlined text-[16px]">person_add</span>
            </button>
          )}
          {item.status === 'CONVERTED' && (
            <button
              onClick={() => navigate(`/dashboard/calendar/new?clientId=${item.client_id}`)}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-green-600 text-white p-1.5 rounded-md hover:bg-green-700 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">event</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-serif">Inquiry Desk</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base">Manage incoming leads and secretarial tasks.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a202c] text-slate-600 dark:text-slate-300 text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            Filter
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Log Inquiry
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        {loading && <p className="p-6">Loading inquiries...</p>}
        {error && <p className="p-6 text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="flex h-full gap-6 min-w-[1000px]">
            <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 h-full">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-primary/20"></div>
                  <span className="font-bold text-slate-700 dark:text-slate-200">New Inquiries</span>
                </div>
                <span className="bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-600">
                  {getColumnData('new').length}
                </span>
              </div>
              <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
                {getColumnData('new').map(item => <InquiryCard key={item.id} item={item} />)}
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 h-full">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 ring-2 ring-yellow-500/20"></div>
                  <span className="font-bold text-slate-700 dark:text-slate-200">Pending Reply</span>
                </div>
                <span className="bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-600">
                  {getColumnData('pending').length}
                </span>
              </div>
              <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
                {getColumnData('pending').map(item => <InquiryCard key={item.id} item={item} />)}
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 h-full">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-500/20"></div>
                  <span className="font-bold text-slate-700 dark:text-slate-200">Resolved</span>
                </div>
                <span className="bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-600">
                  {getColumnData('closed').length}
                </span>
              </div>
              <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
                {getColumnData('closed').map(item => <InquiryCard key={item.id} item={item} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryDesk;