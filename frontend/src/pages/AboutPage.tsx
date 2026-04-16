import React from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Heart, Award, Users, Scale, MessageSquare, CheckCircle2 } from 'lucide-react';

const values = [
  {
    title: 'Integrity',
    description: 'We uphold the highest ethical standards in every case, ensuring transparency and honesty in our practice.',
    icon: <Shield className="h-6 w-6" />,
  },
  {
    title: 'Excellence',
    description: 'Our team is committed to delivering superior results through deep legal expertise and meticulous preparation.',
    icon: <Award className="h-6 w-6" />,
  },
  {
    title: 'Client-First',
    description: 'We prioritize your goals and well-being, providing personalized guidance and clear communication.',
    icon: <Heart className="h-6 w-6" />,
  },
  {
    title: 'Innovation',
    description: 'We leverage modern technology to streamline legal processes, making them faster and more accessible.',
    icon: <Target className="h-6 w-6" />,
  },
];

const team = [
  {
    name: 'Mark Macharia',
    role: 'Lead Advocate & Founder',
    bio: 'Mark has over 15 years of experience in civil litigation and commercial law. He is passionate about social justice and legal reform.',
    image: '/lawyer.webp',
  },
  {
    name: 'Jane Wambui',
    role: 'Senior Associate',
    bio: 'Jane specializes in family law and conveyancing. She is known for her compassionate approach and attention to detail.',
    image: '/sarahamina.webp',
  },
  {
    name: 'Robert Otieno',
    role: 'Litigation Consultant',
    bio: 'Robert is an expert in criminal defence and administrative law, with a track record of successful high-stakes litigation.',
    image: '/davidomondi.webp',
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-primary py-24 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight sm:text-6xl"
          >
            Redefining Legal Services in Kenya
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-3xl text-lg text-primary-foreground/80 leading-relaxed"
          >
            WakiliSmart is more than just a law firm. We are a team of dedicated professionals committed to providing 
            accessible, transparent, and technology-driven legal solutions for individuals and businesses.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our Mission</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                To simplify legal complexities through innovation and expertise, ensuring every client receives 
                fair, efficient, and professional representation. We believe that justice should not be a luxury, 
                but a right accessible to all.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  'Democratizing access to high-quality legal counsel.',
                  'Implementing cutting-edge legal tech for efficiency.',
                  'Building trust through radical transparency.',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[16/9] overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src="/login.webp"
                  alt="Modern Office" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-6 shadow-xl border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">3,500+ Clients</p>
                    <p className="text-xs text-muted-foreground">Trusted nationwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our Core Values</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              These principles guide everything we do, from the simplest consultation to complex litigation.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl bg-background p-8 shadow-sm border border-border/50 hover:shadow-md transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
                <p className="mt-4 text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Meet Our Leadership</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              A blend of seasoned expertise and dynamic energy.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col group"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-muted">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider">{member.role}</p>
                  <p className="mt-4 text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary mx-4 mb-24 rounded-3xl py-16 text-primary-foreground sm:mx-8 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Discuss Your Case?</h2>
          <p className="mt-6 text-lg text-primary-foreground/80">
            Contact us today for a confidential consultation. Let our expertise work for you.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-2 rounded-full bg-white px-8 py-3 text-lg font-bold text-primary transition-all hover:bg-white/90 active:scale-95">
              Contact Us <MessageSquare size={20} />
            </button>
            <button className="rounded-full border-2 border-white/30 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-white/10 active:scale-95">
              Our Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
