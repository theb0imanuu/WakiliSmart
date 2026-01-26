import { useState } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const BookingPage = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    date: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/appointments', formData);
      setMessage('Appointment booked successfully! We will contact you to confirm.');
      setFormData({ clientName: '', clientPhone: '', clientEmail: '', date: '', purpose: '' });
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6">Book a Consultation</h2>
          {message && <div className={`p-3 mb-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone (e.g., 0712345678)</label>
              <input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
              <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
              <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Purpose</label>
              <textarea name="purpose" value={formData.purpose} onChange={handleChange} required className="w-full border rounded p-2" rows={3}></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Booking...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
