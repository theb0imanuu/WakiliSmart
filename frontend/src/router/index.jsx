import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import BookConsultation from '../pages/BookConsultation';
import PracticeAreas from '../pages/PracticeAreas';
import PracticeAreaDetail from '../pages/PracticeAreaDetail';
import KnowledgeHub from '../pages/KnowledgeHub';
import ArticleDetail from '../pages/ArticleDetail';
import About from '../pages/About';
import StaffLogin from '../pages/StaffLogin';
import HomePage from '../pages/HomePage';
import RequireAuth from '../components/RequireAuth';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardOverview from '../pages/dashboard/DashboardOverview';
import CaseManagement from '../pages/dashboard/CaseManagement';
import CreateCase from '../pages/dashboard/CreateCase';
import ClientsDirectory from '../pages/dashboard/ClientsDirectory';
import CreateClient from '../pages/dashboard/CreateClient';
import Calendar from '../pages/dashboard/Calendar';
import CreateAppointment from '../pages/dashboard/CreateAppointment';
import BillingInvoicing from '../pages/dashboard/BillingInvoicing';
import CreateInvoice from '../pages/dashboard/CreateInvoice';
import DocumentRepository from '../pages/dashboard/DocumentRepository';
import InquiryDesk from '../pages/dashboard/InquiryDesk';
import CreateArticle from '../pages/dashboard/CreateArticle';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<About />} />
          <Route path="book-consultation" element={<BookConsultation />} />
          <Route path="practice-areas" element={<PracticeAreas />} />
          <Route path="practice-areas/:slug" element={<PracticeAreaDetail />} />
          <Route path="knowledge-hub" element={<KnowledgeHub />} />       
          <Route path="knowledge-hub/:id" element={<ArticleDetail />} />   
        </Route>
        <Route path="staff-login" element={<StaffLogin />} />
        <Route path="/dashboard" element={<RequireAuth allowedRoles={['ADVOCATE', 'SECRETARY']} />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="case-management" element={<CaseManagement />} />
            <Route path="case-management/new" element={<CreateCase />} />
            <Route path="clients" element={<ClientsDirectory />} />
            <Route path="clients/new" element={<CreateClient />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="calendar/new" element={<CreateAppointment />} />
            <Route path="billing" element={<BillingInvoicing />} />
            <Route path="billing/new" element={<CreateInvoice />} />
            <Route path="documents" element={<DocumentRepository />} />
            <Route path="inquiries" element={<InquiryDesk />} />
            <Route path="create-article" element={<RequireAuth allowedRoles={['ADVOCATE']} />}>
              <Route index element={<CreateArticle />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
