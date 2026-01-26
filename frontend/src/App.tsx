import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import BookingPage from './pages/public/BookingPage';
import BlogPage from './pages/public/BlogPage';
import LoginPage from './pages/public/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

import SecretaryLayout from './pages/secretary/SecretaryLayout';
import SecretaryDashboard from './pages/secretary/SecretaryDashboard';
import InquiryDesk from './pages/secretary/InquiryDesk';
import BillingDashboard from './pages/secretary/BillingDashboard';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import RevenueReport from './pages/admin/RevenueReport';
import UserManagement from './pages/admin/UserManagement';
import BlogCMS from './pages/admin/BlogCMS';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Secretary Routes */}
      <Route element={<ProtectedRoute allowedRoles={['SECRETARY']} />}>
        <Route path="/secretary" element={<SecretaryLayout />}>
          <Route index element={<SecretaryDashboard />} />
          <Route path="inquiry" element={<InquiryDesk />} />
          <Route path="billing" element={<BillingDashboard />} />
        </Route>
      </Route>

      {/* Admin/Advocate Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'ADVOCATE']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="revenue" element={<RevenueReport />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="blog" element={<BlogCMS />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
