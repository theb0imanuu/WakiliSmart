import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  FolderOpen, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Menu,
  X,
  Scale,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/components/AuthProvider';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({ 
  children, 
  role 
}: { 
  children: React.ReactNode; 
  role: 'ADMIN' | 'SECRETARY' | 'ADVOCATE' 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getBaseHref = () => {
    switch (role.toLowerCase()) {
      case 'admin': return '/dashboard/admin';
      case 'secretary': return '/dashboard/secretary';
      case 'advocate': return '/dashboard/advocate';
      default: return '/dashboard/secretary';
    }
  };

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: getBaseHref(), icon: <LayoutDashboard size={20} /> },
    { name: 'Calendar', href: `${getBaseHref()}/calendar`, icon: <CalendarDays size={20} /> },
    { name: 'Clients', href: `${getBaseHref()}/clients`, icon: <Users size={20} /> },
    { name: 'Cases', href: `${getBaseHref()}/cases`, icon: <FolderOpen size={20} /> },
    { name: 'Billing', href: `${getBaseHref()}/billing`, icon: <CreditCard size={20} /> },
    { name: 'Reports', href: `${getBaseHref()}/reports`, icon: <BarChart3 size={20} /> },
  ];

  if (role === 'ADMIN') {
    navItems.push({ name: 'Staff Users', href: '/dashboard/admin/users', icon: <Users size={20} /> });
    navItems.push({ name: 'Blog', href: '/dashboard/admin/blog', icon: <FileText size={20} /> });
  }

  // Settings is universal for all roles now
  navItems.push({ name: 'Settings', href: `${getBaseHref()}/settings`, icon: <Settings size={20} /> });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="relative z-40 hidden flex-col border-r border-border bg-background shadow-sm md:flex"
      >
        <div className="flex h-20 items-center px-6">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="WakiliSmart Logo" className="h-10 w-10 shrink-0 object-contain" />
            {isSidebarOpen && (
              <span className="text-xl font-bold tracking-tight text-foreground">WakiliSmart</span>
            )}
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <div className={cn("shrink-0", isActive ? "text-primary" : "text-muted-foreground/60")}>
                  {item.icon}
                </div>
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition-all hover:bg-destructive/10"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="z-30 flex h-20 items-center justify-between border-b border-border bg-background px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:block hidden"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative hidden sm:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search clients, cases, invoices..."
                className="w-80 rounded-xl border border-border bg-muted/30 pl-10 pr-4 py-2 text-sm outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background"></span>
            </button>
            <div className="h-8 w-px bg-border"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground">
                  {user?.fullName || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{role}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.fullName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

