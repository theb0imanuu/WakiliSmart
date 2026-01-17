import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const CreateClient = () => {
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/clients', clientData);
      alert('Client created successfully!');
      navigate('/dashboard/clients');
    } catch (error) {
      alert('Failed to create client: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-navy-deep dark:text-white mb-8">Add New Client</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={clientData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                name="email"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={clientData.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={clientData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Notes</label>
              <textarea
                name="notes"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 h-32"
                value={clientData.notes}
                onChange={handleChange}
              />
            </div>
          </div>
          <button className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg self-start transition-colors cursor-pointer">
            Add Client
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClient;
