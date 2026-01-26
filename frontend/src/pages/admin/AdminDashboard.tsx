
const AdminDashboard = () => {
  return (
    <div>
        <h1 className="text-3xl font-bold mb-8">Advocate Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm uppercase">Total Revenue</h3>
                <p className="text-2xl font-bold">KES 1,200,000</p>
            </div>
            <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm uppercase">Active Cases</h3>
                <p className="text-2xl font-bold">24</p>
            </div>
            <div className="bg-white p-6 rounded shadow border-l-4 border-yellow-500">
                <h3 className="text-gray-500 text-sm uppercase">Pending Appts</h3>
                <p className="text-2xl font-bold">8</p>
            </div>
            <div className="bg-white p-6 rounded shadow border-l-4 border-red-500">
                <h3 className="text-gray-500 text-sm uppercase">Overdue Invoices</h3>
                <p className="text-2xl font-bold">3</p>
            </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
