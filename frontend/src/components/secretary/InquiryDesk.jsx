import { useState, useEffect } from 'react';
import api from '../../api/axios';

const InquiryDesk = () => {
  const [inquiries, setInquiries] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await api.get('/inquiry');
      setInquiries(response.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inquiry', formData);
      setFormData({ name: '', email: '', phone: '', message: '' });
      fetchInquiries();
    } catch (error) {
      console.error('Error creating inquiry:', error);
    }
  };

  const handleConvert = async (id) => {
    try {
      await api.patch(`/inquiry/${id}/convert`);
      fetchInquiries();
    } catch (error) {
      console.error('Error converting inquiry:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Side: Form */}
      <div className="w-1/3 p-8 bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">New Inquiry</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Log Inquiry
          </button>
        </form>
      </div>

      {/* Right Side: List */}
      <div className="w-2/3 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Inquiries</h2>
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white p-4 rounded shadow border border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{inquiry.name || 'Walk-in'}</h3>
                <p className="text-gray-600 text-sm">{inquiry.message}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {inquiry.email && <span className="mr-2">{inquiry.email}</span>}
                  {inquiry.phone && <span>{inquiry.phone}</span>}
                </div>
              </div>
              <div>
                {inquiry.status === 'PENDING' ? (
                  <button
                    onClick={() => handleConvert(inquiry.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Convert to Client
                  </button>
                ) : (
                  <span className="text-green-600 font-semibold text-sm">Converted</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InquiryDesk;
