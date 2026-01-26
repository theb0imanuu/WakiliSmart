import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if they try to access unauthorized page
    if (user.role === 'ADMIN' || user.role === 'ADVOCATE') {
        return <Navigate to="/admin" replace />;
    } else {
        return <Navigate to="/secretary" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
