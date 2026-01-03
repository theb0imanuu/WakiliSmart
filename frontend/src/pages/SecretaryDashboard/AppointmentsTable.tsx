import { useState, useEffect } from 'react';
import axios from 'axios';
import { NewCaseForm } from './NewCaseForm';

interface Appointment {
  id: number;
  client: {
    name: string;
    phone: string;
    email: string;
  };
  reason: string;
}

export const SecretaryDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('/api/appointments/pending');
        setAppointments(response.data);
      } catch (err) {
        setError('Failed to fetch appointments.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleConfirm = (id: number) => {
    console.log(`Confirm appointment ${id}`);
    // Here you would typically make an API call to update the status
  };

  const handleReschedule = (id: number) => {
    console.log(`Reschedule appointment ${id}`);
    // Here you would typically open a modal or form to pick a new date/time
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Pending Appointments</h2>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <tr key={appt.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{appt.client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appt.client.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appt.client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appt.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleConfirm(appt.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Confirm</button>
                    <button onClick={() => handleReschedule(appt.id)} className="text-red-600 hover:text-red-900">Reschedule</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No pending appointments.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <NewCaseForm />
    </div>
  );
};
