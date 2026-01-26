
const BillingDashboard = () => {
  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Billing & Invoices</h1>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Export CSV</button>
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">INV-001</td>
                        <td className="px-6 py-4 whitespace-nowrap">Alice Wambui</td>
                        <td className="px-6 py-4 whitespace-nowrap">KES 15,000</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">View</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">INV-002</td>
                        <td className="px-6 py-4 whitespace-nowrap">Bob Kamau</td>
                        <td className="px-6 py-4 whitespace-nowrap">KES 45,000</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Unpaid</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">View</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default BillingDashboard;
