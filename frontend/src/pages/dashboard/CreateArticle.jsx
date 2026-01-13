import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/articles', { title, content });
      alert('Article posted successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to post article: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-navy-deep dark:text-white mb-8">Post New Article</h1>

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
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Content</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 h-64"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <button className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg self-start transition-colors cursor-pointer">
            Publish Article
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;
