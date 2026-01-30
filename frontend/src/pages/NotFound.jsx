import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <p className="text-2xl font-semibold text-gray-700 mt-4">Page Not Found</p>
      <p className="text-gray-500 mt-2 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 transition"
      >
        <Home className="mr-2 h-5 w-5" />
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
