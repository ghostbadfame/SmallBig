'use client';

import React from 'react';
import { useEffect } from 'react';

interface ErrorProps {
  error?: Error;
  reset?: () => void;
}

const Error: React.FC<ErrorProps> = ({ error, reset }) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-4">
          We're sorry, but it looks like there was an error. Our team has been notified and we're working to fix it.
        </p>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error details: </strong>
            <span className="block sm:inline">{error.message}</span>
          </div>
        )}
        {reset && (
          <button
            onClick={reset}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;