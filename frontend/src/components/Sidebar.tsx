import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/revenue', label: 'Revenue Report' },
    { to: '/admin/users', label: 'User Management' },
    { to: '/admin/blog', label: 'Blog CMS' },
  ];

  const secretaryLinks = [
    { to: '/secretary', label: 'Dashboard' },
    { to: '/secretary/inquiry', label: 'Inquiry Desk' },
    { to: '/secretary/billing', label: 'Billing' },
  ];

  const links = user?.role === 'ADMIN' || user?.role === 'ADVOCATE' ? adminLinks : secretaryLinks;

  return (
    <div className="bg-gray-100 w-64 h-screen p-4 border-r">
      <div className="mb-8">
        <h2 className="text-lg font-bold">Menu</h2>
      </div>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`block p-2 rounded ${
                location.pathname === link.to ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
