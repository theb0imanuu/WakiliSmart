import { useState, useEffect } from 'react';
import axios from 'axios';

export const AdvocatePortal = () => {
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [outstandingInvoices, setOutstandingInvoices] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const revenuePromise = axios.get('/api/billing/total-revenue');
        const invoicesPromise = axios.get('/api/billing/outstanding-invoices');

        const [revenueResponse, invoicesResponse] = await Promise.all([
          revenuePromise,
          invoicesPromise,
        ]);

        setTotalRevenue(revenueResponse.data.totalRevenue);
        setOutstandingInvoices(invoicesResponse.data.outstandingInvoices);
      } catch (err) {
        setError('Failed to fetch financial data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Financial Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            KES {totalRevenue?.toLocaleString() ?? 'N/A'}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Outstanding Invoices</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            KES {outstandingInvoices?.toLocaleString() ?? 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};
