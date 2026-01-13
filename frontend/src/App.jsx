import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import BookConsultation from './pages/BookConsultation';
import PracticeAreas from './pages/PracticeAreas';
import PracticeAreaDetail from './pages/PracticeAreaDetail';
import KnowledgeHub from './pages/KnowledgeHub';
import About from './pages/About';
import StaffLogin from './pages/StaffLogin';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import CreateArticle from './pages/dashboard/CreateArticle';

import lawyerImg from './assets/lawyer.webp'; 

// --- Page Components ---

const HomePage = () => {
  const homeServices = [
    { id: "corporate-law", icon: "corporate_fare", title: "Corporate Law", desc: "Expert guidance on mergers, acquisitions, and corporate governance for businesses." },
    { id: "civil-litigation", icon: "gavel", title: "Civil Litigation", desc: "Strategic representation in complex disputes to protect your rights and interests." },
    { id: "family-estate", icon: "family_restroom", title: "Family & Estate", desc: "Compassionate support for sensitive family matters and future-proofing your assets." },
    { id: "real-estate", icon: "real_estate_agent", title: "Real Estate", desc: "Handling transactions, zoning issues, and property disputes with speed and accuracy." },
    { id: "intellectual-property", icon: "lightbulb", title: "Intellectual Property", desc: "Protecting your innovations and creative works through patents and trademarks." },
    { id: "employment-law", icon: "work", title: "Employment Law", desc: "Advising on contracts, compliance, and workplace disputes for employers." },
  ];

  return (
    <>
      {/* ... Hero, Stats, Practice Areas, Footer from your previous code ... */}
       <div className="relative w-full bg-background-light dark:bg-background-dark py-12 lg:py-20">
        <div className="px-4 md:px-8 lg:px-40 flex justify-center">
          <div className="flex flex-col-reverse lg:flex-row max-w-[1280px] w-full gap-12 items-center">
            
            {/* Text Content */}
            <div className="flex flex-col gap-6 lg:w-1/2">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 w-fit border border-blue-100 dark:border-blue-800">
                  <span className="material-symbols-outlined text-primary text-sm">verified</span>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">Top Rated Legal Counsel</span>
                </div>
                <h1 className="text-navy-deep dark:text-white text-4xl lg:text-6xl font-serif font-bold leading-[1.1]">
                  Expert Legal Counsel for Your <span className="text-primary">Peace of Mind</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-lg">
                  Navigating complex legal landscapes with integrity and precision. We provide specialized representation for individuals and businesses facing critical challenges.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <Link 
                  to="/book-consultation" 
                  className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-blue-700 text-white text-base font-bold shadow-lg shadow-blue-900/20 transition-all cursor-pointer"
                >
                  Book a Consultation
                </Link>
                <Link to="/about" className="flex items-center justify-center rounded-lg h-12 px-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-navy-deep dark:text-white text-base font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer">
                  Learn more About us
                </Link>
              </div>
              <div className="flex items-center gap-4 mt-6 text-sm text-gray-500 dark:text-gray-400">
                 <p>Trusted by <span className="font-bold text-navy-deep dark:text-white">500+ clients</span> this year</p>
              </div>
            </div>

            {/* Mark Macharia Image */}
            <div className="lg:w-1/2 w-full">
              <div className="relative">
                <div className="absolute -right-4 -bottom-4 w-2/3 h-2/3 bg-secondary/10 rounded-xl -z-10"></div>
                <div 
                  className="w-full aspect-[4/5] lg:aspect-square bg-cover bg-center bg-no-repeat rounded-xl shadow-2xl overflow-hidden relative group" 
                  style={{ backgroundImage: `url(${lawyerImg})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="font-serif text-xl font-bold">Mark Macharia</p>
                    <p className="text-sm opacity-90">Lead Attorney & Founder</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full bg-white dark:bg-[#1a202c] border-y border-[#e7ebf3] dark:border-gray-800">
        <div className="px-4 md:px-8 lg:px-40 flex justify-center py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-[1280px]">
            {[
              { label: "Years Experience", value: "15+" },
              { label: "Case Success Rate", value: "98%" },
              { label: "Happy Clients", value: "500+" },
              { label: "Support Available", value: "24/7" },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
                <p className="text-4xl font-bold text-primary font-serif">{stat.value}</p>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Practice Areas */}
      <div className="w-full bg-background-light dark:bg-background-dark py-20">
        <div className="px-4 md:px-8 lg:px-40 flex justify-center">
          <div className="flex flex-col max-w-[1280px] w-full">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-secondary text-sm font-bold uppercase tracking-widest mb-2">Our Expertise</h2>
                <h3 className="text-navy-deep dark:text-white text-3xl md:text-4xl font-serif font-bold">Comprehensive Legal Solutions</h3>
              </div>
              <Link to="/practice-areas" className="hidden md:flex items-center text-primary font-bold hover:gap-2 transition-all gap-1">
                View All Practice Areas <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeServices.map((service, idx) => (
                <div key={idx} className="group bg-white dark:bg-[#1a202c] p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-secondary/50 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                    <span className="material-symbols-outlined">{service.icon}</span>
                  </div>
                  <h4 className="text-xl font-bold text-navy-deep dark:text-white mb-3 font-serif">{service.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{service.desc}</p>
                  
                  {/* FIXED LINK: Now directs to the specific detail page */}
                  <Link to={`/practice-areas/${service.id}`} className="inline-flex items-center text-sm font-bold text-primary group-hover:text-secondary transition-colors">
                    Learn more <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-navy-deep text-gray-300 py-16 border-t border-gray-800">
        <div className="px-4 md:px-8 lg:px-40 flex justify-center">
          <div className="w-full max-w-[1280px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary" style={{fontSize: "28px"}}>balance</span>
                  <h2 className="text-white text-xl font-bold font-serif">WakiliSmart</h2>
                </div>
                <p className="text-sm leading-relaxed text-gray-400">
                  WakiliSmart is a modern legal practice dedicated to providing accessible, high-quality legal services.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-white font-bold text-lg font-serif">Newsletter</h3>
                <p className="text-sm text-gray-400">Subscribe for legal updates and news.</p>
                <form className="flex flex-col gap-2">
                  <input className="bg-gray-800 border-none rounded-lg h-10 px-4 text-sm focus:ring-2 focus:ring-secondary text-white placeholder-gray-500" placeholder="Your email address" type="email" />
                  <button className="bg-primary hover:bg-blue-700 text-white text-sm font-bold h-10 rounded-lg transition-colors cursor-pointer">Subscribe</button>
                </form>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-500">© 2026 WakiliSmart. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

// --- Main App Config ---

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<About />} />
          <Route path="book-consultation" element={<BookConsultation />} />
          <Route path="practice-areas" element={<PracticeAreas />} />
          <Route path="practice-areas/:slug" element={<PracticeAreaDetail />} />
          <Route path="knowledge-hub" element={<KnowledgeHub />} />          
        </Route>
        <Route path="staff-login" element={<StaffLogin />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="create-article" element={<CreateArticle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
