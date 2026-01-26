import { useState } from 'react';

const InquiryDesk = () => {
    // Mock data for UI demonstration as per requirement "Split screen"
    const [inquiries] = useState([
        { id: 1, name: 'John Doe', message: 'Need legal advice on land', time: '10:00 AM' },
        { id: 2, name: 'Jane Smith', message: 'Divorce process inquiry', time: '11:30 AM' },
    ]);

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      {/* Left: Log new walk-in */}
      <div className="w-1/3 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Log Walk-In</h2>
        <form className="space-y-4">
            <div>
                <label className="block text-sm">Name</label>
                <input type="text" className="w-full border rounded p-2" />
            </div>
            <div>
                <label className="block text-sm">Phone</label>
                <input type="tel" className="w-full border rounded p-2" />
            </div>
            <div>
                <label className="block text-sm">Reason</label>
                <textarea className="w-full border rounded p-2" rows={3}></textarea>
            </div>
            <button className="bg-blue-600 text-white w-full py-2 rounded">Log Inquiry</button>
        </form>
      </div>

      {/* Right: Live Feed */}
      <div className="flex-1 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Today's Inquiries</h2>
        <div className="space-y-4">
            {inquiries.map(iq => (
                <div key={iq.id} className="border-b pb-2">
                    <div className="flex justify-between">
                        <span className="font-bold">{iq.name}</span>
                        <span className="text-sm text-gray-500">{iq.time}</span>
                    </div>
                    <p className="text-gray-700">{iq.message}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InquiryDesk;
