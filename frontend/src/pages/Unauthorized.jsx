import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Unauthorized</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        You do not have permission to access this page.
      </p>
      <Link
        to="/dashboard"
        className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
