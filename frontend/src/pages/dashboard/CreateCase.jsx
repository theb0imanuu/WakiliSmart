import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const CreateCase = () => {
  const [caseData, setCaseData] = useState({
    case_number: '',
    title: '',
    case_type: '',
    filing_date: '',
    notes: '',
    client_id: '',
  });
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch clients to populate the dropdown
    const fetchClients = async () => {
      try {
        const response = await api.get('/clients');
        setClients(response.data);
      } catch (error) {
        console.error('Failed to fetch clients', error);
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCaseData({ ...caseData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cases', caseData);
      alert('Case created successfully!');
      navigate('/dashboard/case-management');
    } catch (error) {
      alert('Failed to create case: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-navy-deep dark:text-white mb-8">Create New Case</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Case Number</label>
              <input
                type="text"
                name="case_number"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={caseData.case_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Case Title</label>
              <input
                type="text"
                name="title"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={caseData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Case Type</label>
              <input
                type="text"
                name="case_type"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={caseData.case_type}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Filing Date</label>
              <input
                type="date"
                name="filing_date"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={caseData.filing_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Client</label>
              <select
                name="client_id"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={caseData.client_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Notes</label>
              <textarea
                name="notes"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 h-32"
                value={caseData.notes}
                onChange={handleChange}
              />
            </div>
          </div>
          <button className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg self-start transition-colors cursor-pointer">
            Create Case
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCase;
