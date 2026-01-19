
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const InquiryDesk = () => {
  const { inquiries, setInquiries } = useOutletContext();
  const [newInquiry, setNewInquiry] = useState({
    clientName: '',
    phone: '',
    email: '',
    issueSummary: '',
    urgency: 'Low',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInquiry((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setInquiries((prev) => [...prev, { ...newInquiry, id: Date.now() }]);
    setNewInquiry({
      clientName: '',
      phone: '',
      email: '',
      issueSummary: '',
      urgency: 'Low',
    });
  };

  return (
    <div className="flex space-x-4">
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-4">Log Inquiry</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="clientName"
            value={newInquiry.clientName}
            onChange={handleInputChange}
            placeholder="Client Name"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="phone"
            value={newInquiry.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            value={newInquiry.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            name="issueSummary"
            value={newInquiry.issueSummary}
            onChange={handleInputChange}
            placeholder="Issue Summary"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <select
            name="urgency"
            value={newInquiry.urgency}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Log Inquiry
          </button>
        </form>
      </div>
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-4">Recent Inquiries</h2>
        <ul className="space-y-2">
          {inquiries.map((inquiry) => (
            <li key={inquiry.id} className="p-2 border border-gray-200 rounded">
              <p><strong>{inquiry.clientName}</strong> ({inquiry.urgency})</p>
              <p>{inquiry.issueSummary}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InquiryDesk;
