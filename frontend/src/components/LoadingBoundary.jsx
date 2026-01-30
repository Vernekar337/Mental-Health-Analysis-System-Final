import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingBoundary = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mb-4" />
      <p className="text-gray-500 animate-pulse">Loading...</p>
    </div>
  );
};

export default LoadingBoundary;
