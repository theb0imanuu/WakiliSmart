import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Users, Award, Gavel, Building2, Heart, Briefcase, Scale, Star, MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    name: 'John Njoroge',
    role: 'Business Owner',
    content: 'WakiliSmart handled our company merger with exceptional professionalism. Their attention to detail is unmatched.',
    rating: 5,
    image: '/johnnjoroge.webp',
  },
  {
    name: 'David Omondi',
    role: 'Real Estate Investor',
    content: 'The conveyancing process was smooth and transparent. I highly recommend their property law services.',
    rating: 5,
    image: '/davidomondi.webp',
  },
  {
    name: 'Sarah Amina',
    role: 'Family Client',
    content: 'Compassionate and expert guidance during a difficult family matter. They truly care about their clients.',
    rating: 5,
    image: '/sarahamina.webp',
  },
];

const stats = [
  { label: 'Years Experience', value: '15+' },
  { label: 'Cases Won', value: '1,200+' },
  { label: 'Happy Clients', value: '3,500+' },
  { label: 'Support', value: '24/7' },
];

const practiceAreas = [
  {
    title: 'Civil Litigation',
    icon: <Gavel className="h-6 w-6" />,
    description: 'Expert representation in property disputes, contract breaches, and tort claims.',
  },
  {
    title: 'Conveyancing',
    icon: <Building2 className="h-6 w-6" />,
    description: 'Seamless real estate transactions, land transfers, and property law advice.',
  },
  {
    title: 'Criminal Defence',
    icon: <Shield className="h-6 w-6" />,
    description: 'Protecting your rights with vigorous defence in all criminal matters.',
  },
  {
    title: 'Commercial Law',
    icon: <Briefcase className="h-6 w-6" />,
    description: 'Strategic legal counsel for businesses, from formation to complex mergers.',
  },
  {
    title: 'Family Law',
    icon: <Heart className="h-6 w-6" />,
    description: 'Compassionate guidance in divorce, custody, and succession matters.',
  },
  {
    title: 'Other Services',
    icon: <Users className="h-6 w-6" />,
    description: 'Mediation, arbitration, and general legal consultancy services.',
  },
];

import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/firebase';

export default function LandingPage() {
  const [latestPosts, setLatestPosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const q = query(
      collection(db, 'blog_posts'),
      where('status', '==', 'PUBLISHED'),
      orderBy('publishedAt', 'desc'),
      limit(3)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLatestPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'blog_posts'));

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
                Expert Legal Counsel for Your <span className="text-primary">Peace of Mind</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                WakiliSmart provides professional legal services across Kenya. We combine traditional legal expertise with modern technology to deliver efficient, transparent, and effective results.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/book-consultation"
                  className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-xl active:scale-95"
                >
                  Book Consultation <ArrowRight size={20} />
                </Link>
                <a
                  href="#practice-areas"
                  className="rounded-full border-2 border-border bg-background px-8 py-4 text-lg font-bold text-foreground transition-all hover:border-primary hover:text-primary"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1000"
                  alt="Law Office"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-background p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Award size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Top Rated Firm</p>
                    <p className="text-xs text-muted-foreground">Legal Excellence Awards 2025</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl font-bold">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-primary-foreground/80 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section id="practice-areas" className="bg-muted/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our Practice Areas</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Comprehensive legal solutions tailored to your unique needs.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {practiceAreas.map((area, idx) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-2xl bg-background p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {area.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-foreground">{area.title}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-xl">
                <img
                  src="/lawyer.webp"
                  alt="Lead Advocate"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Defending Your Rights. <span className="text-link">Securing Your Future.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Led by Advocate Mark Macharia, our firm has built a reputation for excellence and integrity. We understand that legal matters can be daunting, which is why we prioritize clear communication and personalized strategies for every client.
              </p>
              <div className="mt-10 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Integrity First</h4>
                    <p className="text-sm text-muted-foreground">We maintain the highest ethical standards in all our dealings.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Client-Centric</h4>
                    <p className="text-sm text-muted-foreground">Your goals are our priority. We work tirelessly to achieve the best outcomes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {latestPosts.length > 0 && (
        <section className="bg-muted/50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Latest Insights</h2>
                <p className="mt-4 text-lg text-muted-foreground">Expert legal analysis and firm updates.</p>
              </div>
              <Link 
                to="/blog" 
                className="group flex items-center gap-2 text-sm font-bold text-primary"
              >
                View Knowledge Hub <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {latestPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-background shadow-sm border border-border transition-all hover:shadow-xl"
                >
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    {post.imageUrl ? (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Scale size={48} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {post.tags?.[0] || 'Legal Update'}
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-4 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.content.replace(/[#*`]/g, '')}
                    </p>
                    <Link 
                      to="/blog" 
                      className="mt-8 flex items-center gap-2 text-sm font-bold text-primary"
                    >
                      Read More <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">What Our Clients Say</h2>
            <p className="mt-4 text-lg text-muted-foreground">Trusted by individuals and businesses across Kenya.</p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-3xl bg-muted/30 p-8 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex gap-1 text-warning">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-6 text-muted-foreground italic leading-relaxed">"{testimonial.content}"</p>
                <div className="mt-8 flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-secondary py-24 text-secondary-foreground sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Get in Touch</h2>
              <p className="mt-6 text-lg leading-relaxed text-secondary-foreground/70">
                Have a legal question? Our team is ready to assist you. Visit our office or reach out through any of our channels.
              </p>
              <div className="mt-12 space-y-8">
                <div className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Our Office</h4>
                    <p className="mt-1 text-secondary-foreground/70">Wakili Plaza, 4th Floor, Upper Hill, Nairobi, Kenya</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Phone</h4>
                    <p className="mt-1 text-secondary-foreground/70">+254 700 000 000</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <p className="mt-1 text-secondary-foreground/70">info@wakilismart.co.ke</p>
                  </div>
                </div>
              </div>
              <div className="mt-12 flex gap-4">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-foreground/5 transition-colors hover:bg-primary"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-secondary-foreground/5 p-8 backdrop-blur-sm sm:p-12">
              <form className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full rounded-xl border border-secondary-foreground/10 bg-secondary-foreground/5 px-4 py-3 outline-none transition-all focus:border-primary focus:bg-secondary-foreground/10"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full rounded-xl border border-secondary-foreground/10 bg-secondary-foreground/5 px-4 py-3 outline-none transition-all focus:border-primary focus:bg-secondary-foreground/10"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full rounded-xl border border-secondary-foreground/10 bg-secondary-foreground/5 px-4 py-3 outline-none transition-all focus:border-primary focus:bg-secondary-foreground/10"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full rounded-xl border border-secondary-foreground/10 bg-secondary-foreground/5 px-4 py-3 outline-none transition-all focus:border-primary focus:bg-secondary-foreground/10"
                />
                <button className="w-full rounded-xl bg-primary py-4 font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-12 text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="WakiliSmart Logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold text-secondary-foreground">WakiliSmart</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-8 text-sm font-medium">
              <Link to="/" className="hover:text-secondary-foreground">Home</Link>
              <Link to="/about" className="hover:text-secondary-foreground">About</Link>
              <a href="#practice-areas" className="hover:text-secondary-foreground">Practice Areas</a>
              <Link to="/blog" className="hover:text-secondary-foreground">Blog</Link>
              <a href="#contact" className="hover:text-secondary-foreground">Contact</a>
              <Link to="/login" className="hover:text-secondary-foreground">Staff Login</Link>
            </nav>
            <p className="text-sm">© {new Date().getFullYear()} WakiliSmart. All rights reserved.</p>
          </div>
          <div className="mt-8 border-t border-secondary-foreground/10 pt-8 text-center text-xs">
            <p>Legal Disclaimer: The information on this website is for general informational purposes only and does not constitute legal advice. No advocate-client relationship is formed by viewing this site or contacting us through it.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
