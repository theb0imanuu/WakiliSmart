import React, { useState } from 'react';
import api from '../utils/api';

const BookConsultation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    practiceArea: '',
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, message, practiceArea } = formData;
    
    const fullMessage = `Practice Area: ${practiceArea}\n\n${message}`;

    try {
      const response = await api.post('/inquiry', {
        name,
        email,
        phone,
        message: fullMessage,
      });

      if (response.status === 201) {
        setFormStatus({
          submitted: true,
          success: true,
          message: 'Your consultation request has been sent successfully!',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          practiceArea: '',
        });
      }
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Something went wrong. Please try again later.',
      });
    }
  };
  
  return (
    <div className="w-full bg-background-light dark:bg-background-dark py-12 lg:py-20">
      <div className="px-4 md:px-8 lg:px-40 flex justify-center">
        <div className="max-w-4xl w-full bg-white dark:bg-[#1a202c] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row">
          
          {/* Left Side: Contact Info */}
          <div className="w-full md:w-1/3 bg-primary p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#D4AF37 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
            
            <div className="relative z-10">
              <h3 className="font-serif text-2xl font-bold mb-6">Contact Information</h3>
              <p className="text-blue-100 mb-8 text-sm leading-relaxed">
                Fill out the form and our team will get back to you within 24 hours to confirm your appointment.
              </p>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary">call</span>
                  <div>
                    <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Phone</p>
                    <p className="font-medium">+254 700 000 000</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary">mail</span>
                  <div>
                    <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Email</p>
                    <p className="font-medium">consult@wakilismart.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  <div>
                    <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Office</p>
                    <p className="font-medium">Nairobi, Kenya</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12">
               <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-sm">public</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-sm">alternate_email</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-2/3 p-8 lg:p-12">
            <h2 className="text-2xl font-bold font-serif text-navy-deep dark:text-white mb-6">Schedule Your Consultation</h2>
            
            {formStatus.submitted ? (
              <div
                className={`p-4 rounded-lg text-sm ${
                  formStatus.success
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                }`}
              >
                {formStatus.message}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-600 dark:text-gray-300">Full Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="John Doe" className="h-12 px-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-navy-deep dark:text-white transition-all" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600 dark:text-gray-300">Email Address</label>
                    <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="john@example.com" className="h-12 px-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-navy-deep dark:text-white transition-all" required />
                  </div>
                  
                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600 dark:text-gray-300">Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+254..." className="h-12 px-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-navy-deep dark:text-white transition-all" required />
                  </div>
                </div>

                {/* Practice Area */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-600 dark:text-gray-300">Legal Area</label>
                  <select name="practiceArea" value={formData.practiceArea} onChange={handleChange} className="h-12 px-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-navy-deep dark:text-white transition-all appearance-none cursor-pointer">
                    <option value="" disabled>Select a practice area</option>
                    <option value="corporate">Corporate Law</option>
                    <option value="civil">Civil Litigation</option>
                    <option value="family">Family & Estate</option>
                    <option value="realestate">Real Estate</option>
                    <option value="ip">Intellectual Property</option>
                    <option value="employment">Employment Law</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-600 dark:text-gray-300">Case Details</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="Briefly describe your legal issue..." className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-navy-deep dark:text-white transition-all resize-none"></textarea>
                </div>

                <button
                  type="submit"
                  className="h-12 mt-2 bg-primary hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-900/10 transition-colors cursor-pointer"
                >
                  Request Appointment
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookConsultation;