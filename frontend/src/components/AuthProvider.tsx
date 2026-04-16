import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';

interface User {
  id: number;
  username?: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'SECRETARY' | 'ADVOCATE';
  phone?: string;
  settings?: any;
}

interface AuthContextType {
  user: User | null;
  role: 'ADMIN' | 'SECRETARY' | 'ADVOCATE' | null;
  loading: boolean;
  isAuthReady: boolean;
  login: (user: User, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  isAuthReady: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'ADMIN' | 'SECRETARY' | 'ADVOCATE' | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const login = (userData: User, userRole: any) => {
    setUser(userData);
    setRole(userRole);
  };

  const logout = async () => {
    // Clear state FIRST to avoid UI flickering/loops
    setUser(null);
    setRole(null);
    localStorage.clear();

    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error (handled)', err);
    } finally {
      window.location.href = '/'; 
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
        setRole(response.data.role);
      } catch (error) {
        // If 401, the interceptor handles the refresh, and if that fails, 
        // it throws, meaning the user is genuinely unauthenticated.
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
        setIsAuthReady(true);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  componentDidCatch(error: any, errorInfo: any) { console.error("ErrorBoundary caught an error", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-destructive/10 p-4 text-center">
          <div className="rounded-2xl bg-background p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-destructive">Application Error</h2>
            <p className="mt-4 text-muted-foreground">{this.state.error?.message || "Something went wrong."}</p>
            <button onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-destructive px-6 py-2 font-bold text-destructive-foreground hover:bg-destructive/90">Reload Application</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
