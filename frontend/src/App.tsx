import { Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">WakiliSmart</h1>
            <div>
              {/* Navigation links will go here */}
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-4">
          <Outlet /> {/* This is where child routes will be rendered */}
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;