import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { BookConsultationForm } from './pages/PublicPortal/BookConsultationForm';
import { SecretaryDashboard } from './pages/SecretaryDashboard/AppointmentsTable';
import { AdvocatePortal } from './pages/AdvocatePortal/FinancialDashboard';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <BookConsultationForm /> },
      { path: '/secretary', element: <SecretaryDashboard /> },
      { path: '/advocate', element: <AdvocatePortal /> },
    ],
  },
]);
