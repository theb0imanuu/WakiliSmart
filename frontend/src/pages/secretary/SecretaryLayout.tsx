import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const SecretaryLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SecretaryLayout;
