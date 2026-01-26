import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { getBlogPosts } from '../../services/blog.service';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  bannerPath?: string;
  author: {
    name: string;
  };
  created_at: string;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts()
      .then(setPosts)
      .catch((err) => console.error('Failed to load blog posts', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Legal Insights</h1>
        {loading ? (
          <p>Loading articles...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                {post.bannerPath && (
                   <img src={`/api/${post.bannerPath}`} alt={post.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <div className="text-sm text-blue-600 mb-2">{post.category}</div>
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.content}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>By {post.author.name}</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
