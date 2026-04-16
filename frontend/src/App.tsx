/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import SecretaryDashboard from './pages/SecretaryDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ClientRegistry from './pages/ClientRegistry';
import CaseRegistry from './pages/CaseRegistry';
import BillingPage from './pages/BillingPage';
import CalendarView from './pages/CalendarView';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import BlogPage from './pages/BlogPage';
import BlogManagement from './pages/BlogManagement';
import AboutPage from './pages/AboutPage';
import UsersManagement from './pages/UsersManagement';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
        <Route path="/book-consultation" element={<PublicLayout><BookingPage /></PublicLayout>} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Secretary Dashboard Routes */}
        <Route path="/dashboard/secretary" element={<DashboardLayout role="SECRETARY"><SecretaryDashboard /></DashboardLayout>} />
        <Route path="/dashboard/secretary/calendar" element={<DashboardLayout role="SECRETARY"><CalendarView /></DashboardLayout>} />
        <Route path="/dashboard/secretary/clients" element={<DashboardLayout role="SECRETARY"><ClientRegistry /></DashboardLayout>} />
        <Route path="/dashboard/secretary/cases" element={<DashboardLayout role="SECRETARY"><CaseRegistry /></DashboardLayout>} />
        <Route path="/dashboard/secretary/billing" element={<DashboardLayout role="SECRETARY"><BillingPage /></DashboardLayout>} />
        <Route path="/dashboard/secretary/reports" element={<DashboardLayout role="SECRETARY"><ReportsPage /></DashboardLayout>} />
        <Route path="/dashboard/secretary/settings" element={<DashboardLayout role="SECRETARY"><SettingsPage /></DashboardLayout>} />

        {/* Advocate Dashboard Routes */}
        <Route path="/dashboard/advocate" element={<DashboardLayout role="ADVOCATE"><SecretaryDashboard /></DashboardLayout>} />
        <Route path="/dashboard/advocate/calendar" element={<DashboardLayout role="ADVOCATE"><CalendarView /></DashboardLayout>} />
        <Route path="/dashboard/advocate/clients" element={<DashboardLayout role="ADVOCATE"><ClientRegistry /></DashboardLayout>} />
        <Route path="/dashboard/advocate/cases" element={<DashboardLayout role="ADVOCATE"><CaseRegistry /></DashboardLayout>} />
        <Route path="/dashboard/advocate/billing" element={<DashboardLayout role="ADVOCATE"><BillingPage /></DashboardLayout>} />
        <Route path="/dashboard/advocate/reports" element={<DashboardLayout role="ADVOCATE"><ReportsPage /></DashboardLayout>} />
        <Route path="/dashboard/advocate/settings" element={<DashboardLayout role="ADVOCATE"><SettingsPage /></DashboardLayout>} />

        {/* Admin Dashboard Routes */}
        <Route path="/dashboard/admin" element={<DashboardLayout role="ADMIN"><AdminDashboard /></DashboardLayout>} />
        <Route path="/dashboard/admin/calendar" element={<DashboardLayout role="ADMIN"><CalendarView /></DashboardLayout>} />
        <Route path="/dashboard/admin/clients" element={<DashboardLayout role="ADMIN"><ClientRegistry /></DashboardLayout>} />
        <Route path="/dashboard/admin/cases" element={<DashboardLayout role="ADMIN"><CaseRegistry /></DashboardLayout>} />
        <Route path="/dashboard/admin/billing" element={<DashboardLayout role="ADMIN"><BillingPage /></DashboardLayout>} />
        <Route path="/dashboard/admin/reports" element={<DashboardLayout role="ADMIN"><ReportsPage /></DashboardLayout>} />
        <Route path="/dashboard/admin/blog" element={<DashboardLayout role="ADMIN"><BlogManagement /></DashboardLayout>} />
        <Route path="/dashboard/admin/users" element={<DashboardLayout role="ADMIN"><UsersManagement /></DashboardLayout>} />
        <Route path="/dashboard/admin/settings" element={<DashboardLayout role="ADMIN"><SettingsPage /></DashboardLayout>} />
      </Routes>
    </Router>
  );
}







