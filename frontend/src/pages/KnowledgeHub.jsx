import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import lawyerImg from '../assets/lawyer.webp'; 

const KnowledgeHub = () => {
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles');
        const formattedArticles = response.data.map(article => ({
          ...article,
          excerpt: article.content.substring(0, 100) + '...',
          date: new Date(article.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          image: lawyerImg, // Using a placeholder image
        }));
        setArticles(formattedArticles);
        if (formattedArticles.length > 0) {
          setFeaturedArticle(formattedArticles[0]);
        }
      } catch (err) {
        setError('Failed to fetch articles.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="w-full bg-background-light dark:bg-background-dark min-h-screen py-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="mb-12 rounded-2xl bg-white dark:bg-[#1a202c] shadow-sm p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
            <h1 className="text-navy-deep dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-4 font-serif">
              WakiliSmart Legal Insights
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-normal leading-normal mb-8">
              Demystifying the law for everyone. Expert legal insights, guides, and news to help you navigate with confidence.
            </p>
            <div className="w-full max-w-[560px]">
              <label className="flex w-full items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                <div className="flex items-center justify-center pl-3 text-gray-400">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input 
                  className="w-full border-none bg-transparent px-4 py-3 text-navy-deep dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 text-base" 
                  placeholder="Search for legal topics, keywords..." 
                  type="text"
                />
                <button className="bg-primary hover:bg-blue-700 text-white rounded-md px-6 py-2.5 text-sm font-bold transition-colors cursor-pointer">
                  Search
                </button>
              </label>
            </div>
          </div>
        </section>

        {/* Content Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Article Grid (8/12) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {loading && <p>Loading articles...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Featured Article */}
            {!loading && !error && featuredArticle && (
              <article className="group relative flex flex-col md:flex-row gap-6 bg-white dark:bg-[#1a202c] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800">
                <div 
                  className="w-full md:w-2/5 aspect-video md:aspect-auto bg-cover bg-center" 
                  style={{ backgroundImage: `url(${featuredArticle.image})` }}
                ></div>
                <div className="flex flex-col justify-center p-6 md:pr-8 md:py-8 w-full md:w-3/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide">Featured</span>
                    <span className="text-gray-400 text-xs font-medium">{featuredArticle.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-navy-deep dark:text-white mb-3 group-hover:text-primary transition-colors font-serif">
                    <Link to={`/knowledge-hub/${featuredArticle.id}`}>{featuredArticle.title}</Link>
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                  <Link to={`/knowledge-hub/${featuredArticle.id}`} className="inline-flex items-center text-primary font-semibold text-sm hover:underline">
                    Read Full Article <span className="material-symbols-outlined text-base ml-1">arrow_forward</span>
                  </Link>
                </div>
              </article>
            )}

            {/* Mobile Filter Chips */}
            <div className="lg:hidden overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-2 whitespace-nowrap">
                <button className="px-4 py-2 rounded-full bg-navy-deep text-white text-sm font-medium">All Topics</button>
                {['Family Law', 'Corporate', 'Real Estate', 'IP Law'].map(tag => (
                  <button key={tag} className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Standard Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!loading && !error && articles.slice(1).map((article) => (
                <article key={article.id} className="flex flex-col bg-white dark:bg-[#1a202c] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800 group h-full">
                  <div 
                    className="aspect-video w-full bg-cover bg-center" 
                    style={{ backgroundImage: `url(${article.image})` }}
                  ></div>
                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-primary text-xs font-bold uppercase tracking-wide">{article.category}</span>
                      <span className="text-gray-400 text-xs">{article.date}</span>
                    </div>
                    <h4 className="text-lg font-bold text-navy-deep dark:text-white mb-2 group-hover:text-primary transition-colors font-serif">
                      <Link to={`/knowledge-hub/${article.id}`}>{article.title}</Link>
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Using Lawyer Image as Author for now */}
                        <div 
                          className="size-6 rounded-full bg-gray-200 bg-cover bg-center" 
                          style={{ backgroundImage: `url(${lawyerImg})` }}
                        ></div>
                        <span className="text-xs font-medium text-gray-500">{article.author.username}</span>
                      </div>
                      <span className="material-symbols-outlined text-gray-400 text-sm group-hover:text-primary transition-colors">arrow_forward</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <button className="flex items-center justify-center px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 bg-white dark:bg-[#1a202c] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm cursor-pointer">
                Load More Articles
              </button>
            </div>
          </div>

          {/* Right Column: Sidebar (4/12) */}
          <aside className="lg:col-span-4 flex flex-col gap-6 h-fit sticky top-24">
            
            {/* About Profile Widget */}
            <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="size-16 rounded-full bg-cover bg-center border-2 border-white shadow-sm" 
                  style={{ backgroundImage: `url(${lawyerImg})` }}
                ></div>
                <div>
                  <h3 className="font-bold text-lg text-navy-deep dark:text-white font-serif">Mark Macharia</h3>
                  <p className="text-xs text-primary font-semibold uppercase tracking-wide">Lead Attorney</p>
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                Dedicated practitioner providing accessible, professional legal solutions for individuals and small businesses. We make law simple.
              </p>
              <Link to="/about" className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors inline-flex items-center">
                View Full Profile <span className="material-symbols-outlined text-base ml-1">chevron_right</span>
              </Link>
            </div>

            {/* Categories Widget */}
            <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hidden lg:block">
              <h3 className="font-bold text-lg text-navy-deep dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 font-serif">Topics</h3>
              <nav className="flex flex-col gap-1">
                {[
                  { name: 'All Topics', count: 24, active: true },
                  { name: 'Family Law', count: 12 },
                  { name: 'Corporate Law', count: 8 },
                  { name: 'Real Estate', count: 5 },
                  { name: 'Intellectual Property', count: 3 },
                  { name: 'Litigation', count: 7 },
                ].map((cat, idx) => (
                  <a key={idx} className={`flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${cat.active ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`} href="#">
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${cat.active ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{cat.count}</span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Newsletter Widget */}
            <div className="bg-gradient-to-br from-[#1a202c] to-[#2d3748] p-6 rounded-xl shadow-md text-white">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-secondary">mark_email_unread</span>
                <h3 className="font-bold text-lg font-serif">Stay Informed</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">Get the latest legal news and guides delivered directly to your inbox.</p>
              <form className="flex flex-col gap-3">
                <input className="w-full rounded-lg border-0 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Your email address" type="email"/>
                <button className="w-full rounded-lg bg-primary hover:bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors cursor-pointer" type="button">Subscribe</button>
              </form>
              <p className="text-[10px] text-gray-400 mt-3 text-center">No spam, unsubscribe anytime.</p>
            </div>

            {/* Popular Tags */}
            <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hidden lg:block">
              <h3 className="font-bold text-sm text-navy-deep dark:text-white mb-4 uppercase tracking-wider">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['#divorce', '#startups', '#contracts', '#copyright', '#landlord', '#wills'].map(tag => (
                  <a key={tag} className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" href="#">{tag}</a>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeHub;