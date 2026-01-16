import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';

// Pages/Layouts (Mocking these for now as simple wrappers)
import InquiryDesk from './components/secretary/InquiryDesk';
import BillingTable from './components/secretary/BillingTable';
import Scheduler from './components/secretary/Scheduler';
import CaseManager from './components/advocate/CaseManager';
import ArticleEditor from './components/advocate/ArticleEditor';

const Login = () => <div className="p-10">Login Page Placeholder</div>;
const Unauthorized = () => <div className="p-10 text-red-500">Unauthorized</div>;

function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Secretary Routes */}
        <Route element={<RequireAuth allowedRoles={['SECRETARY']} />}>
          <Route path="/secretary/inquiries" element={<InquiryDesk />} />
          <Route path="/secretary/billing" element={<BillingTable />} />
          <Route path="/secretary/scheduler" element={<Scheduler />} />
          <Route path="/secretary" element={<Navigate to="/secretary/inquiries" replace />} />
        </Route>

        {/* Advocate Routes */}
        <Route element={<RequireAuth allowedRoles={['ADVOCATE']} />}>
          <Route path="/advocate/cases" element={<CaseManager />} />
          <Route path="/advocate/articles" element={<ArticleEditor />} />
          <Route path="/advocate" element={<Navigate to="/advocate/cases" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
