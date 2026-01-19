
import React from 'react';

const KPI_CARDS = [
  { title: "Today's Appointments", value: 5 },
  { title: 'Pending Inquiries', value: 12 },
  { title: 'Outstanding Invoices', value: 'KES 50,000' },
];

const SecretaryDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {KPI_CARDS.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-600">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecretaryDashboard;
