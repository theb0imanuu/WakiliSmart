import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const CreateInvoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    amount: '',
    balance_due: '',
    serviceType: '',
    due_date: '',
    case_id: '',
  });
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await api.get('/cases');
        setCases(response.data);
      } catch (error) {
        console.error('Failed to fetch cases', error);
      }
    };
    fetchCases();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/billing', {
        ...invoiceData,
        amount: parseFloat(invoiceData.amount),
        balance_due: parseFloat(invoiceData.balance_due),
      });
      alert('Invoice created successfully!');
      navigate('/dashboard/billing');
    } catch (error) {
      alert('Failed to create invoice: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-navy-deep dark:text-white mb-8">Generate New Invoice</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Amount</label>
              <input
                type="number"
                name="amount"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={invoiceData.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Balance Due</label>
              <input
                type="number"
                name="balance_due"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={invoiceData.balance_due}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Service Type</label>
              <input
                type="text"
                name="serviceType"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={invoiceData.serviceType}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Due Date</label>
              <input
                type="date"
                name="due_date"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={invoiceData.due_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Case</label>
              <select
                name="case_id"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                value={invoiceData.case_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a case</option>
                {cases.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg self-start transition-colors cursor-pointer">
            Generate Invoice
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;
