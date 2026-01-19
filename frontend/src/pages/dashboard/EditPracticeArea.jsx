import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';

const EditPracticeArea = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('');
  const [desc, setDesc] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPracticeArea = async () => {
      try {
        // We need to fetch by ID, but the API finds by slug.
        // This is a limitation of the current API.
        // For now, we will fetch all and find by ID.
        const response = await api.get('/practice-areas');
        const area = response.data.find((area) => area.id === id);
        if (area) {
          setTitle(area.title);
          setSlug(area.slug);
          setIcon(area.icon);
          setDesc(area.desc);
        }
      } catch (error) {
        alert('Failed to fetch practice area: ' + (error.response?.data?.message || error.message));
      }
    };
    fetchPracticeArea();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/practice-areas/${id}`, { title, slug, icon, desc });
      alert('Practice area updated successfully!');
      navigate('/dashboard/practice-areas');
    } catch (error) {
      alert('Failed to update practice area: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-navy-deep dark:text-white mb-8">Edit Practice Area</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Slug</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Icon</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 h-32"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>
          <button className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg self-start transition-colors cursor-pointer">
            Update Practice Area
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPracticeArea;
