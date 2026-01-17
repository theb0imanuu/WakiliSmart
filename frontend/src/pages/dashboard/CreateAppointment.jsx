import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const CreateAppointment = () => {
  const [appointmentData, setAppointmentData] = useState({
    purpose: '',
    date: '',
    client_id: '',
    case_id: '',
  });
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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

  useEffect(() => {
    if (appointmentData.client_id) {
      const fetchCases = async () => {
        try {
          // Assuming cases are fetched per client. This might need adjustment based on API design.
          const response = await api.get(`/cases?clientId=${appointmentData.client_id}`);
          setCases(response.data);
        } catch (error) {
          console.error('Failed to fetch cases', error);
        }
      };
      fetchCases();
    }
  }, [appointmentData.client_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData({ ...appointmentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', appointmentData);
      alert('Appointment created successfully!');
      navigate('/dashboard/calendar');
    } catch (error) {
      alert('Failed to create appointment: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-navy-deep dark:text-white mb-8">New Appointment</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Purpose</label>
              <input
                type="text"
                name="purpose"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={appointmentData.purpose}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Date</label>
              <input
                type="datetime-local"
                name="date"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={appointmentData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Client</label>
              <select
                name="client_id"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={appointmentData.client_id}
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
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Case (Optional)</label>
              <select
                name="case_id"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={appointmentData.case_id}
                onChange={handleChange}
              >
                <option value="">Select a case</option>
                {cases.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg self-start transition-colors cursor-pointer">
            Create Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointment;
