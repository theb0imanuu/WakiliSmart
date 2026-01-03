import { useState, useEffect } from 'react';
import axios from 'axios';

interface Client {
  id: number;
  name: string;
}

export const NewCaseForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    case_type: 'CIVIL',
    client_id: '',
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('/api/clients');
        setClients(response.data);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await axios.post('/api/cases', {
        ...formData,
        client_id: parseInt(formData.client_id, 10),
      });
      if (response.status === 201) {
        setSubmitMessage('Case created successfully!');
        setFormData({ title: '', case_type: 'CIVIL', client_id: '' });
      } else {
        setSubmitMessage('An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Case creation error:', error);
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5 text-center">Create a New Case</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Case Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="case_type" className="block text-sm font-medium text-gray-700">
            Case Type
          </label>
          <select
            name="case_type"
            id="case_type"
            value={formData.case_type}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="CIVIL">Civil</option>
            <option value="CRIMINAL">Criminal</option>
            <option value="CONVEYANCING">Conveyancing</option>
          </select>
        </div>
        <div>
          <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
            Client
          </label>
          <select
            name="client_id"
            id="client_id"
            value={formData.client_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Case'}
          </button>
        </div>
        {submitMessage && (
          <p className="text-center text-sm text-gray-600 mt-3">{submitMessage}</p>
        )}
      </form>
    </div>
  );
};