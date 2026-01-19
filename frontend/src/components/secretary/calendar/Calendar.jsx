
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const Calendar = () => {
  const { inquiries } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [appointments, setAppointments] = useState([]);

  const handleTimeSlotClick = (time) => {
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  const handleBookAppointment = () => {
    if (selectedClient && selectedTime) {
      setAppointments([...appointments, { client: selectedClient, time: selectedTime, id: Date.now() }]);
      setIsModalOpen(false);
      setSelectedClient('');
      setSelectedTime(null);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Calendar</h2>
      <div className="grid grid-cols-6 gap-2">
        <div />
        {days.map(day => <div key={day} className="font-bold text-center">{day}</div>)}
        {timeSlots.map(time => (
          <React.Fragment key={time}>
            <div className="font-bold text-right pr-2">{time}</div>
            {days.map(day => (
              <div
                key={`${day}-${time}`}
                className="border border-gray-200 h-24 cursor-pointer"
                onClick={() => handleTimeSlotClick(`${day} ${time}`)}
              >
                {appointments.find(appt => appt.time === `${day} ${time}`)?.client}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Book Appointment for {selectedTime}</h3>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            >
              <option value="">Select a client</option>
              {inquiries.map(inquiry => (
                <option key={inquiry.id} value={inquiry.clientName}>
                  {inquiry.clientName}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-800 p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
