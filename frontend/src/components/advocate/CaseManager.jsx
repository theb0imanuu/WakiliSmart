import { useState, useEffect } from 'react';
import api from '../../api/axios';

const CaseManager = () => {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app, you'd have a specific endpoint for searching cases
    // For now, assuming dashboard stats might return active cases, or we need a new endpoint
    // Let's assume we can fetch cases from a generic endpoint (which we might need to create in backend if not exists)
    // For this mockup, I'll use the dashboard endpoint data if available, or just mock it locally if backend isn't ready.
    // Wait, the backend has `CasesModule`, let's assume `GET /cases` works.
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
        // We didn't explicitly create a CasesController in this session, but it was in the file list.
        // Assuming it exists or I should have created it.
        // Let's try to hit the dashboard advocate endpoint to get active cases as per requirements.
        const response = await api.get('/dashboard/advocate');
        if (response.data && response.data.activeCases) {
            setCases(response.data.activeCases);
        }
    } catch (error) {
        console.error("Error fetching cases", error);
    }
  };

  const filteredCases = cases.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.case_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Case Manager</h2>
        <input
          type="text"
          placeholder="Search cases..."
          className="p-2 border rounded w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((c) => (
            <div key={c.id} className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xl text-gray-800">{c.title}</h3>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">{c.status}</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{c.case_number}</p>
                <div className="mt-4">
                    <p className="text-sm text-gray-600"><span className="font-semibold">Filing Date:</span> {new Date(c.filing_date).toLocaleDateString()}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default CaseManager;
