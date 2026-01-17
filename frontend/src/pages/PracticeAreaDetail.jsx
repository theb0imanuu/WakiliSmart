import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const PracticeAreaDetail = () => {
  const { slug } = useParams();
  const [area, setArea] = useState(null);
  const [otherAreas, setOtherAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPracticeAreaData = async () => {
      try {
        setLoading(true);
        const areaResponse = await api.get(`/practice-areas/${slug}`);
        setArea(areaResponse.data);

        const allAreasResponse = await api.get('/practice-areas');
        setOtherAreas(allAreasResponse.data.filter(p => p.slug !== slug));
      } catch (err) {
        setError('Failed to fetch practice area data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeAreaData();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-20 text-2xl font-serif">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-2xl font-serif text-red-500">{error}</div>;
  }

  if (!area) {
    return <div className="text-center py-20 text-2xl font-serif">Service not found.</div>;
  }
  
  const features = [
    "Legal Consultation and Advisory",
    "Contract Drafting and Review",
    "Dispute Resolution and Litigation",
    "Regulatory Compliance",
    "Mergers and Acquisitions",
    "Due Diligence",
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      
      {/* Hero Header for specific service */}
      <div className="bg-navy-deep text-white py-20 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#D4AF37 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
         <div className="px-4 md:px-8 lg:px-40 flex justify-center relative z-10">
            <div className="max-w-[1280px] w-full">
              <div className="flex items-center gap-2 mb-4 text-secondary font-bold uppercase tracking-wider text-sm">
                 <Link to="/practice-areas" className="hover:text-white transition-colors">Practice Areas</Link> 
                 <span>/</span>
                 <span>{area.title}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold">{area.title}</h1>
            </div>
         </div>
      </div>

      <div className="px-4 md:px-8 lg:px-40 flex justify-center py-16">
        <div className="max-w-[1280px] w-full flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <div className="lg:w-2/3">
             <div className="bg-white dark:bg-[#1a202c] p-8 md:p-12 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <h2 className="text-2xl font-bold font-serif mb-6 text-navy-deep dark:text-white">Overview</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                  {area.desc}
                </p>

                <h3 className="text-xl font-bold font-serif mb-4 text-navy-deep dark:text-white">What We Cover</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <span className="material-symbols-outlined text-secondary mt-0.5">check_circle</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div>
                     <h4 className="font-bold text-navy-deep dark:text-white text-lg">Need help with {area.title}?</h4>
                     <p className="text-gray-600 dark:text-gray-400 text-sm">Our team is ready to review your case immediately.</p>
                   </div>
                   <Link to="/book-consultation" className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors whitespace-nowrap">
                      Book Consultation
                   </Link>
                </div>
             </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 flex flex-col gap-8">
             {/* Other Services Widget */}
             <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="font-serif font-bold text-xl mb-4 text-navy-deep dark:text-white">Other Services</h3>
                <div className="flex flex-col gap-2">
                   {otherAreas.map(other => (
                      <Link 
                        key={other.slug} 
                        to={`/practice-areas/${other.slug}`}
                        className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex justify-between items-center group"
                      >
                         <span>{other.title}</span>
                         <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                      </Link>
                   ))}
                </div>
             </div>

             {/* Quick Contact Widget */}
             <div className="bg-navy-deep text-white p-8 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <span className="material-symbols-outlined text-9xl">gavel</span>
                </div>
                <h3 className="font-serif font-bold text-xl mb-2">WakiliSmart</h3>
                <p className="text-gray-400 text-sm mb-6">Excellence in every case.</p>
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary">call</span>
                      <span className="font-medium">+254 700 000 000</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary">mail</span>
                      <span className="font-medium">consult@wakilismart.com</span>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PracticeAreaDetail;