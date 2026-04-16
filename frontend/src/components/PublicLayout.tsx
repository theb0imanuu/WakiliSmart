import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Practice Areas', href: '/#practice-areas' },
    { name: 'Knowledge Hub', href: '/blog' },
    { name: 'Staff Portal', href: '/login' },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="WakiliSmart Logo" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold tracking-tight text-foreground">WakiliSmart</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/book-consultation"
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="rounded-lg p-2 text-muted-foreground md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-0 top-20 w-full border-b border-border/50 bg-background px-4 py-6 shadow-xl md:hidden"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-lg font-medium text-foreground"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/book-consultation"
                  className="mt-2 w-full rounded-lg bg-primary py-3 text-center font-semibold text-primary-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book Consultation
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-20">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.svg" alt="WakiliSmart Logo" className="h-8 w-8 object-contain" />
                <span className="text-lg font-bold tracking-tight text-foreground">WakiliSmart</span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                A new standard in legal tech. Streamlining practice management, billing, and client communication for the modern advocate.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Contact Us</h4>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  +254 700 000 000
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  info@wakilismart.co.ke
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  Upper Hill, Nairobi, Kenya
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Quick Links</h4>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/#practice-areas">Practice Areas</Link></li>
                <li><Link to="/blog">Knowledge Hub</Link></li>
                <li><Link to="/login">Staff Portal</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 border-t border-border pt-8 text-center text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} WakiliSmart. All rights reserved. Defending Your Rights. Securing Your Future.
          </div>
        </div>
      </footer>
    </div>
  );
}
