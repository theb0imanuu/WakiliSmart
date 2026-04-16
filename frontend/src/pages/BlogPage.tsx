import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Calendar, 
  User, 
  Tag, 
  ArrowRight,
  ChevronLeft,
  Clock,
  Share2,
  Bookmark,
  FileText
} from 'lucide-react';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/blog');
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Extract all unique tags
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach(tag => tags.add(tag));
      }
    });
    return ['All', ...Array.from(tags).sort()];
  }, [posts]);

  // Comprehensive filtering
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = selectedTag === 'All' || post.tags?.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  // Separate the featured post (first in filtered results if no search is active)
  const featuredPost = !searchTerm && selectedTag === 'All' && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  if (selectedPost) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <button 
          onClick={() => setSelectedPost(null)}
          className="group mb-8 flex items-center gap-2 text-sm font-bold text-primary transition-all hover:-translate-x-1"
        >
          <ChevronLeft size={18} /> Back to Insights
        </button>

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-background shadow-2xl border border-border/50"
        >
          {selectedPost.imageUrl && (
            <div className="aspect-[21/9] w-full overflow-hidden">
              <img 
                src={selectedPost.imageUrl} 
                alt={selectedPost.title} 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          
          <div className="p-8 sm:p-12 lg:p-16">
            <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                {selectedPost.publishedAt ? new Date(selectedPost.publishedAt).toLocaleDateString('en-KE', { dateStyle: 'long' }) : 'Recently'}
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-primary" />
                {selectedPost.author?.fullName}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-primary" />
                {Math.ceil(selectedPost.content.length / 1000)} min read
              </div>
            </div>

            <h1 className="mt-8 text-4xl font-black text-foreground sm:text-5xl lg:text-6xl leading-tight">
              {selectedPost.title}
            </h1>

            <div className="mt-10 flex flex-wrap gap-2">
              {Array.isArray(selectedPost.tags) && selectedPost.tags.map((tag: string) => (
                <span key={tag} className="rounded-full bg-primary/5 border border-primary/10 px-4 py-1.5 text-xs font-bold text-primary/80">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="prose prose-lg prose-blue mt-12 max-w-none text-muted-foreground leading-relaxed custom-markdown">
              <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
            </div>

            <div className="mt-20 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between border-t border-border/50 pt-10">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-black text-primary border border-primary/20">
                  {selectedPost.author?.fullName?.split(' ').map((n: any) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-lg text-foreground">{selectedPost.author?.fullName}</p>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Expert Legal Counsel</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground transition-all hover:bg-primary hover:text-white hover:border-primary">
                  <Share2 size={20} />
                </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground transition-all hover:bg-primary hover:text-white hover:border-primary">
                  <Bookmark size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-xs font-black uppercase tracking-[0.3em] text-primary underline underline-offset-8 decoration-2">Firm Publications</span>
          <h1 className="mt-8 text-5xl font-black tracking-tight text-foreground sm:text-6xl">
            Legal <span className="text-primary italic">Insights</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed font-medium">
            Navigating the complexities of law with expert analysis and real-world results.
          </p>
        </motion.div>
      </div>

      {/* Search & Categories */}
      <div className="mt-16 space-y-12">
        <div className="relative max-w-2xl">
          <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
          <input
            type="text"
            placeholder="Search for legal topics, keywords, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-[2rem] border-2 border-border/50 bg-background pl-16 pr-8 py-5 text-lg outline-none transition-all focus:border-primary focus:ring-8 focus:ring-primary/5 shadow-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={cn(
                "rounded-2xl px-6 py-2.5 text-xs font-bold transition-all active:scale-95 border",
                selectedTag === tag 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                  : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:bg-muted/30"
              )}
            >
              {tag === 'All' ? 'All Articles' : `#${tag}`}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Hero Post */}
      {featuredPost && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-20 group relative overflow-hidden rounded-[3rem] bg-background border border-border shadow-2xl lg:flex"
        >
          <div className="shrink-0 lg:w-3/5 overflow-hidden">
             {featuredPost.imageUrl ? (
                <img 
                  src={featuredPost.imageUrl} 
                  alt={featuredPost.title} 
                   className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
             ) : (
                <div className="flex h-full min-h-[400px] w-full items-center justify-center bg-muted/30">
                  <FileText size={80} className="text-muted-foreground/20" />
                </div>
             )}
          </div>
          <div className="flex flex-1 flex-col justify-center p-10 lg:p-16">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
              Featured Insight
            </span>
            <h2 className="mt-6 text-3xl font-black text-foreground sm:text-4xl leading-tight group-hover:text-primary transition-colors">
              {featuredPost.title}
            </h2>
            <p className="mt-6 text-muted-foreground line-clamp-3 leading-relaxed text-lg">
              {featuredPost.content.replace(/[#*`]/g, '')}
            </p>
            <div className="mt-10 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                 {featuredPost.author?.fullName?.[0]}
              </div>
              <div>
                <p className="font-bold text-foreground">{featuredPost.author?.fullName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={12} /> {Math.ceil(featuredPost.content.length / 1000)} min read
                </div>
              </div>
            </div>
            <button 
               onClick={() => setSelectedPost(featuredPost)}
               className="mt-10 self-start rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
            >
               Read Feature Article
            </button>
          </div>
        </motion.div>
      )}

      {/* Blog Grid */}
      <div className={cn(
        "mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3",
        featuredPost ? "mt-24" : "mt-8"
      )}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-video w-full rounded-3xl bg-muted"></div>
              <div className="h-4 w-3/4 bg-muted rounded"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
            </div>
          ))
        ) : gridPosts.length > 0 ? gridPosts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group flex flex-col overflow-hidden rounded-[2.5rem] bg-background shadow-sm border border-border/50 transition-all hover:shadow-2xl hover:-translate-y-2"
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
                  <FileText size={48} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-white text-xs font-bold flex items-center gap-1.5">
                  <Clock size={14} /> {Math.ceil(post.content.length / 1000)} min read
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-10">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(post.tags) && post.tags.slice(0, 2).map((tag: string) => (
                  <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-primary/70 bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10">
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="mt-6 text-xl font-black text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              
              <p className="mt-4 text-sm text-muted-foreground line-clamp-3 leading-relaxed font-medium">
                {post.content.replace(/[#*`]/g, '')}
              </p>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {post.author?.fullName?.[0]}
                   </div>
                   <span className="text-xs font-bold text-muted-foreground">{post.author?.fullName}</span>
                </div>
                <button 
                  onClick={() => setSelectedPost(post)}
                  className="rounded-full bg-muted p-2 text-primary transition-all hover:bg-primary hover:text-white"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-32 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                <Search size={40} className="text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-black text-foreground">No matches found</h3>
              <p className="mt-2 text-muted-foreground max-w-sm mx-auto">We couldn't find any articles matching your current search or tags.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedTag('All'); }}
                className="mt-8 font-black text-primary hover:underline underline-offset-8"
              >
                Clear all filters
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
