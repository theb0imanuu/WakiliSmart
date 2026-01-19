import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const PracticeAreasDashboard = () => {
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPracticeAreas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/practice-areas');
      setPracticeAreas(response.data);
    } catch (err) {
      setError('Failed to fetch practice areas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPracticeAreas();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this practice area?')) {
      try {
        await api.delete(`/practice-areas/${id}`);
        fetchPracticeAreas();
      } catch (error) {
        alert('Failed to delete practice area: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-navy-deep dark:text-white">Practice Areas</h1>
        <Link
          to="/dashboard/practice-areas/new"
          className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Add Practice Area
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Slug
                </th>
                <th scope="col" className="px-6 py-3">
                  Icon
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-red-500">
                    {error}
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                practiceAreas.map((area) => (
                  <tr
                    key={area.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {area.title}
                    </th>
                    <td className="px-6 py-4">{area.slug}</td>
                    <td className="px-6 py-4">{area.icon}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-4 justify-end">
                        <Link
                          to={`/dashboard/practice-areas/${area.id}/edit`}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(area.id)}
                          className="font-medium text-red-600 dark:text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PracticeAreasDashboard;
