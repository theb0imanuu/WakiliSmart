import { useState } from 'react';
import { createBlogPost } from '../../services/blog.service';

const BlogCMS = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
  });
  const [banner, setBanner] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('content', formData.content);
    if (banner) {
        data.append('banner', banner);
    }

    try {
        await createBlogPost(data);
        alert('Post created!');
        setFormData({ title: '', category: '', content: '' });
        setBanner(null);
    } catch (err) {
        alert('Failed to create post');
    }
  };

  return (
    <div>
        <h1 className="text-2xl font-bold mb-6">Blog CMS</h1>
        <div className="bg-white p-6 rounded shadow max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input type="text" className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input type="text" className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Content</label>
                    <textarea className="w-full border p-2 rounded" rows={6} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Banner Image</label>
                    <input type="file" className="w-full" onChange={e => setBanner(e.target.files ? e.target.files[0] : null)} />
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Publish Post</button>
            </form>
        </div>
    </div>
  );
};

export default BlogCMS;
