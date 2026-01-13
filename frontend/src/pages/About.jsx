import React from 'react';
import { Link } from 'react-router-dom';

// Import Images
import lawyerImg from '../assets/lawyer.webp';
import johnImg from '../assets/johnnjoroge.webp';
import sarahImg from '../assets/sarahamina.webp';
import davidImg from '../assets/davidomondi.webp';

const About = () => {
  return (
    <div className="w-full bg-background-light dark:bg-background-dark min-h-screen">
      
      {/* 1. Hero Section */}
      <div className="relative bg-navy-deep py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#D4AF37 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
        <div className="px-4 md:px-8 lg:px-40 flex justify-center relative z-10">
          <div className="max-w-[1280px] w-full text-center">
            <h1 className="text-white text-4xl md:text-6xl font-serif font-bold mb-6">
              Defending Your Rights, <br/> <span className="text-secondary">Securing Your Future.</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              We are a modern Kenyan law firm dedicated to simplifying legal complexities for individuals and businesses across East Africa.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Who We Are Section */}
      <div className="px-4 md:px-8 lg:px-40 flex justify-center py-20">
        <div className="max-w-[1280px] w-full flex flex-col lg:flex-row items-center gap-16">
          
          {/* Lawyer Image */}
          <div className="lg:w-1/2 w-full relative">
            <div className="absolute -left-4 -top-4 w-2/3 h-2/3 bg-blue-100 dark:bg-blue-900/20 rounded-xl -z-10"></div>
            <img 
              src={lawyerImg} 
              alt="Mark Macharia" 
              className="rounded-xl shadow-2xl w-full object-cover aspect-[4/5]"
            />
            <div className="absolute bottom-8 right-[-20px] bg-white dark:bg-[#1a202c] p-6 rounded-lg shadow-xl border-l-4 border-primary max-w-xs hidden md:block">
              <p className="text-navy-deep dark:text-white font-serif font-bold text-lg">"Justice is not just a concept; it's a service we deliver daily."</p>
              <p className="text-gray-500 text-sm mt-2">- Mark Macharia</p>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:w-1/2 w-full flex flex-col gap-6">
            <h2 className="text-secondary text-sm font-bold uppercase tracking-widest">About The Firm</h2>
            <h3 className="text-navy-deep dark:text-white text-3xl md:text-4xl font-serif font-bold">
              A Legacy of Trust & Excellence in Nairobi
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Founded by <strong>Mark Macharia</strong>, WakiliSmart was built on the belief that high-quality legal representation should be accessible, transparent, and responsive.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              With over 15 years of experience in the Kenyan judicial system, we understand the unique challenges our clients face. From land disputes in Kiambu to corporate mergers in Westlands, we bring clarity to chaos.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="border-l-2 border-gray-200 pl-4">
                <span className="block text-3xl font-bold text-primary mb-1">500+</span>
                <span className="text-sm text-gray-500 uppercase font-bold">Cases Won</span>
              </div>
              <div className="border-l-2 border-gray-200 pl-4">
                <span className="block text-3xl font-bold text-primary mb-1">15+</span>
                <span className="text-sm text-gray-500 uppercase font-bold">Years Experience</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Core Values */}
      <div className="bg-white dark:bg-[#1a202c] py-20 border-y border-gray-100 dark:border-gray-800">
        <div className="px-4 md:px-8 lg:px-40 flex justify-center">
          <div className="max-w-[1280px] w-full">
            <div className="text-center mb-16">
              <h2 className="text-navy-deep dark:text-white text-3xl font-serif font-bold">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Integrity", desc: "We uphold the highest ethical standards in every case we handle.", icon: "verified_user" },
                { title: "Client-Centric", desc: "Your peace of mind is our priority. We listen, plan, and execute for you.", icon: "person_apron" },
                { title: "Excellence", desc: "We don't settle for average. We strive for the best possible outcome.", icon: "star" },
              ].map((val, idx) => (
                <div key={idx} className="bg-background-light dark:bg-background-dark p-8 rounded-xl text-center hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-primary mb-4">
                    <span className="material-symbols-outlined text-3xl">{val.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-navy-deep dark:text-white mb-2">{val.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Kenyan Testimonials (UPDATED WITH IMAGES) */}
      <div className="py-20 bg-background-light dark:bg-background-dark">
        <div className="px-4 md:px-8 lg:px-40 flex justify-center">
          <div className="max-w-[1280px] w-full">
            <div className="text-center mb-12">
               <h2 className="text-secondary text-sm font-bold uppercase tracking-widest mb-2">Testimonials</h2>
               <h3 className="text-navy-deep dark:text-white text-3xl md:text-4xl font-serif font-bold">What Our Clients Say</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Review 1: John Njoroge */}
              <div className="bg-white dark:bg-[#1a202c] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 relative">
                <span className="material-symbols-outlined text-6xl text-gray-100 dark:text-gray-700 absolute top-4 right-4 -z-0">format_quote</span>
                <div className="flex text-secondary mb-4 relative z-10">
                  {"★★★★★".split("").map((star, i) => <span key={i}>{star}</span>)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 italic">
                  "I was facing a very difficult land succession case in Kiambu. Mark and his team handled the paperwork and court sessions with such professionalism. We finally got our title deeds after years of struggle."
                </p>
                <div className="flex items-center gap-3">
                  <img src={johnImg} alt="John Njoroge" className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" />
                  <div>
                    <p className="font-bold text-navy-deep dark:text-white text-sm">John Njoroge</p>
                    <p className="text-xs text-gray-500">Business Owner, Kiambu</p>
                  </div>
                </div>
              </div>

              {/* Review 2: Sarah Amina */}
              <div className="bg-white dark:bg-[#1a202c] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 relative">
                <span className="material-symbols-outlined text-6xl text-gray-100 dark:text-gray-700 absolute top-4 right-4 -z-0">format_quote</span>
                <div className="flex text-secondary mb-4 relative z-10">
                  {"★★★★★".split("").map((star, i) => <span key={i}>{star}</span>)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 italic">
                  "WakiliSmart helped me register my startup in Nairobi. They advised me on employment contracts and tax compliance. Highly recommended for any SME looking for solid legal footing."
                </p>
                <div className="flex items-center gap-3">
                  <img src={sarahImg} alt="Sarah Amina" className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" />
                  <div>
                    <p className="font-bold text-navy-deep dark:text-white text-sm">Sarah Amina</p>
                    <p className="text-xs text-gray-500">Tech Entrepreneur, Westlands</p>
                  </div>
                </div>
              </div>

              {/* Review 3: David Omondi */}
              <div className="bg-white dark:bg-[#1a202c] p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 relative">
                <span className="material-symbols-outlined text-6xl text-gray-100 dark:text-gray-700 absolute top-4 right-4 -z-0">format_quote</span>
                <div className="flex text-secondary mb-4 relative z-10">
                  {"★★★★★".split("").map((star, i) => <span key={i}>{star}</span>)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 italic">
                  "Dealing with a wrongful termination was stressful. The team at WakiliSmart explained my rights under Kenyan labour laws and represented me brilliantly. I am very grateful."
                </p>
                <div className="flex items-center gap-3">
                  <img src={davidImg} alt="David Omondi" className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" />
                  <div>
                    <p className="font-bold text-navy-deep dark:text-white text-sm">David Omondi</p>
                    <p className="text-xs text-gray-500">Accountant, Mombasa</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 5. CTA Section */}
      <div className="bg-primary py-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
        <div className="px-4 relative z-10">
           <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Need Legal Advice You Can Trust?</h2>
           <p className="text-blue-100 mb-8 max-w-xl mx-auto">Don't wait until it's too late. Schedule a consultation with Mark Macharia today.</p>
           <Link to="/book-consultation" className="bg-secondary hover:bg-yellow-600 text-navy-deep font-bold py-4 px-8 rounded-lg shadow-lg transition-colors inline-block">
              Book Your Consultation
           </Link>
        </div>
      </div>

    </div>
  );
};

export default About;