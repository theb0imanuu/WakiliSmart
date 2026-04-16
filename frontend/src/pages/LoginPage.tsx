import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Scale, Lock, User, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import api from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();
  const { role, login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });
      const { user } = response.data;
      login(user, user.role);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('An error occurred during login. Please try again later.');
      }
    }
  };

  React.useEffect(() => {
    // Navigate will happen here once the role changes to the loaded user
    if (role === 'ADMIN') {
      navigate('/dashboard/admin');
    } else if (role === 'SECRETARY' || role === 'ADVOCATE') {
      navigate('/dashboard/secretary');
    }
  }, [role, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-background shadow-2xl md:grid-cols-2">
        {/* Left Side - Branding */}
        <div className="hidden relative bg-primary p-12 text-primary-foreground md:flex md:flex-col md:justify-between overflow-hidden">
          <img 
            src="/login.webp" 
            alt="WakiliSmart Branding" 
            className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-overlay pointer-events-none" 
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="WakiliSmart Logo" className="h-10 w-10 object-contain" />
              <span className="text-2xl font-bold tracking-tight">WakiliSmart</span>
            </div>
            <h2 className="mt-12 text-4xl font-bold leading-tight">
              A New Standard in Legal Tech.
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/80">
              Streamlining practice management, billing, and client communication for the modern advocate.
            </p>
          </div>
          <div className="relative z-10 text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} WakiliSmart. All rights reserved.
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 sm:p-12">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-foreground">Staff Portal</h3>
            <p className="mt-2 text-muted-foreground">Sign in to manage your practice</p>
          </div>

          <div className="mt-10 space-y-6">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-semibold text-foreground">Email Address</label>
                <div className="relative mt-2">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    {...register('email')}
                    className={cn(
                      "w-full rounded-xl border border-border bg-muted/30 pl-12 pr-4 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                      errors.email && "border-red-500"
                    )}
                    placeholder="Enter email"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground">Password</label>
                <div className="relative mt-2">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    className={cn(
                      "w-full rounded-xl border border-border bg-muted/30 pl-12 pr-12 py-3 outline-none transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10",
                      errors.password && "border-red-500"
                    )}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-primary py-4 font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95 disabled:opacity-70"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

