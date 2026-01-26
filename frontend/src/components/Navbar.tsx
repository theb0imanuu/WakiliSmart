import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">WakiliSmart</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/booking" className="hover:text-gray-300">Book Consultation</Link>
          <Link to="/blog" className="hover:text-gray-300">Blog</Link>
          {user ? (
            <>
              {user.role === 'ADMIN' || user.role === 'ADVOCATE' ? (
                 <Link to="/admin" className="hover:text-gray-300">Dashboard</Link>
              ) : (
                 <Link to="/secretary" className="hover:text-gray-300">Dashboard</Link>
              )}
              <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
