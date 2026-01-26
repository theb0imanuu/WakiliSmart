
const SecretaryDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Secretary Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold">Today's Appointments</h2>
          <p className="text-4xl mt-4 font-semibold text-blue-600">5</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold">Pending Inquiries</h2>
          <p className="text-4xl mt-4 font-semibold text-yellow-600">12</p>
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
        <p>No recent activity.</p>
      </div>
    </div>
  );
};

export default SecretaryDashboard;
