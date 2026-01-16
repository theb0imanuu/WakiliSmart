import { useState } from 'react';
import api from '../../api/axios';

const ArticleEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Assuming ArticleController exists or we need to create it.
        // The prompt asked for "ArticleEditor.tsx: Simple form for content creation."
        // I'll assume endpoint POST /articles exists (it was in the file list `articles/`)
        await api.post('/articles', { title, content, category });
        alert('Article created!');
        setTitle('');
        setContent('');
        setCategory('');
    } catch (error) {
        console.error('Error creating article', error);
        alert('Failed to create article');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Article Editor</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-6">
        <div>
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
        </div>
        <div>
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
            />
        </div>
        <div>
            <label className="block text-gray-700 font-medium mb-2">Content</label>
            <textarea
                className="w-full p-2 border border-gray-300 rounded h-64"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            ></textarea>
        </div>
        <div className="flex justify-end">
            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
                Publish Article
            </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEditor;
