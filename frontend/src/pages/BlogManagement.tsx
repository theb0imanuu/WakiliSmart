import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock, 
  FileText,
  X,
  Image as ImageIcon,
  Tag,
  User as UserIcon
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  tags: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

export default function BlogManagement() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTag, setSelectedTag] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/blog/admin');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Extract unique tags for filtering
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach(tag => tags.add(tag));
      }
    });
    return ['All', ...Array.from(tags).sort()];
  }, [posts]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/blog/${id}`);
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post', error);
    }
  };

  const handleToggleStatus = async (post: any) => {
    try {
      const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      await api.patch(`/blog/${post.id}`, { status: newStatus });
      fetchPosts();
    } catch (error) {
      console.error('Failed to toggle status', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || post.status === statusFilter;
    const matchesTag = selectedTag === 'All' || post.tags?.includes(selectedTag);

    return matchesSearch && matchesStatus && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground">Blog Management</h1>
          <p className="text-muted-foreground font-medium">Create, edit, and curate firm publications.</p>
        </div>
        <button 
          onClick={() => {
            setEditingPost(null);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 active:scale-95"
        >
          <Plus size={20} /> Create New Post
        </button>
      </div>

      {/* Filters & Search */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 rounded-[2rem] bg-background p-6 shadow-sm border border-border/50 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
            <input
              type="text"
              placeholder="Search by title, author, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border-2 border-border/50 bg-muted/20 pl-14 pr-4 py-3.5 text-sm outline-none transition-all focus:border-primary focus:bg-background focus:ring-8 focus:ring-primary/5"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border-2 border-border/50 bg-muted/20 px-4 py-2">
              <Filter size={18} className="text-muted-foreground/60" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm font-bold text-foreground outline-none cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Drafts</option>
              </select>
            </div>
            
            {(searchTerm || statusFilter !== 'ALL' || selectedTag !== 'All') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setSelectedTag('All');
                }}
                className="text-xs font-bold text-primary hover:underline px-2"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Tag Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={cn(
                "rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border",
                selectedTag === tag 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10" 
                  : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:bg-muted/30"
              )}
            >
              {tag === 'All' ? 'All Categories' : `#${tag}`}
            </button>
          ))}
        </div>

        <div className="px-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
          Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Posts List */}
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-video w-full rounded-3xl bg-muted"></div>
              <div className="h-4 w-3/4 bg-muted rounded"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
            </div>
          ))
        ) : filteredPosts.length > 0 ? filteredPosts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-background shadow-sm border border-border/50 transition-all hover:shadow-2xl hover:-translate-y-2"
          >
            <div className="aspect-video w-full overflow-hidden bg-muted relative">
              {post.imageUrl ? (
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                  <ImageIcon size={48} />
                </div>
              )}
              <div className="absolute left-6 top-6">
                <span className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border-2",
                  post.status === 'PUBLISHED' 
                    ? "bg-green-500/90 text-white border-green-400" 
                    : "bg-amber-500/90 text-white border-amber-400"
                )}>
                  {post.status === 'PUBLISHED' ? <CheckCircle size={12} /> : <Clock size={12} />}
                  {post.status}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-8">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(post.tags) && post.tags.slice(0, 2).map((tag: string) => (
                    <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-primary/60">
                      #{tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-black text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                  {post.content.replace(/[#*`]/g, '')}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary border border-primary/20">
                    {post.author?.fullName?.split(' ').map((n: any) => n[0]).join('') || 'A'}
                  </div>
                  <div>
                    <p className="text-xs font-black text-foreground">{post.author?.fullName}</p>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => {
                      setEditingPost(post);
                      setIsFormOpen(true);
                    }}
                    className="rounded-xl p-2.5 text-muted-foreground/60 hover:bg-primary/10 hover:text-primary transition-all"
                    title="Edit Post"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(post)}
                    className="rounded-xl p-2.5 text-muted-foreground/60 hover:bg-green-500/10 hover:text-green-600 transition-all"
                    title={post.status === 'PUBLISHED' ? "Set to Draft" : "Publish Now"}
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="rounded-xl p-2.5 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-all"
                    title="Delete Post"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
               <Search size={32} className="text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-black text-foreground">No posts found</h3>
            <p className="mt-2 text-muted-foreground font-medium">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {/* Post Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <PostForm 
            post={editingPost}
            onClose={() => setIsFormOpen(false)}
            onSuccess={() => {
              setIsFormOpen(false);
              fetchPosts();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PostForm({ post, onClose, onSuccess }: { post?: any, onClose: () => void, onSuccess: () => void }) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: post ? {
      title: post.title,
      content: post.content,
      status: post.status,
      imageUrl: post.imageUrl || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
    } : {
      status: 'DRAFT',
    }
  });

  const onSubmit = async (data: PostFormData) => {
    if (!user) return;
    try {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
      };

      if (post) {
        await api.patch(`/blog/${post.id}`, payload);
      } else {
        await api.post('/blog', payload);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save post', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/50 px-8 py-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">{post ? 'Edit Post' : 'Create New Post'}</h2>
            <p className="text-sm text-muted-foreground">Share legal insights and firm updates.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground/60 hover:bg-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-h-[75vh] overflow-y-auto p-8">
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground/80">Post Title</label>
              <div className="relative mt-2">
                <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  {...register('title')}
                  className={cn(
                    "w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                    errors.title && "border-destructive"
                  )}
                  placeholder="Enter a compelling title"
                />
              </div>
              {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-foreground/80">Status</label>
                <div className="relative mt-2">
                  <CheckCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <select
                    {...register('status')}
                    className="w-full appearance-none rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground/80">Featured Image URL</label>
                <div className="relative mt-2">
                  <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    {...register('imageUrl')}
                    className={cn(
                      "w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                      errors.imageUrl && "border-destructive"
                    )}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                {errors.imageUrl && <p className="mt-1 text-xs text-destructive">{errors.imageUrl.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground/80">Tags (comma separated)</label>
              <div className="relative mt-2">
                <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  {...register('tags')}
                  className="w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
                  placeholder="e.g. Land Law, Family, Litigation"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground/80">Content (Markdown supported)</label>
              <div className="mt-2">
                <textarea
                  {...register('content')}
                  rows={10}
                  className={cn(
                    "w-full rounded-xl border border-border bg-muted/30 p-4 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10 font-mono text-sm",
                    errors.content && "border-destructive"
                  )}
                  placeholder="Write your post content here..."
                />
              </div>
              {errors.content && <p className="mt-1 text-xs text-destructive">{errors.content.message}</p>}
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-3 font-bold text-muted-foreground transition-all hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-primary py-3 font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95 disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : post ? "Update Post" : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
