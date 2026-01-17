import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const PracticeAreas = () => {
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPracticeAreas = async () => {
      try {
        const response = await api.get('/practice-areas');
        setPracticeAreas(response.data);
      } catch (err) {
        setError('Failed to fetch practice areas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeAreas();
  }, []);

  return (
    <div className="w-full bg-background-light dark:bg-background-dark py-20">
      <div className="px-4 md:px-8 lg:px-40 flex justify-center">
        <div className="max-w-[1280px] w-full">
          
          {/* Page Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-navy-deep dark:text-white text-4xl md:text-5xl font-serif font-bold mb-6">Our Practice Areas</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              WakiliSmart offers a full spectrum of legal services. We combine deep industry knowledge with legal expertise to provide solutions that work.
            </p>
          </div>

          {/* Grid */}
          {loading && <p>Loading practice areas...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {practiceAreas.map((area) => (
                <Link 
                  key={area.slug} 
                  to={`/practice-areas/${area.slug}`} 
                  className="group bg-white dark:bg-[#1a202c] p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-secondary/50 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 flex flex-col"
                >
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                    <span className="material-symbols-outlined text-3xl">{area.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-navy-deep dark:text-white mb-3 font-serif">{area.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed flex-grow">{area.desc.substring(0, 100)}...</p>
                  <div className="flex items-center text-sm font-bold text-primary group-hover:text-secondary transition-colors mt-auto">
                    View Details <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PracticeAreas;