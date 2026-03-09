import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingBoundary = () => {
  return (
    <div className="flex justify-center items-center h-64 text-slate-500">
      <Loader2 className="animate-spin h-8 w-8 text-emerald-600 mr-3" />
      <span className="text-lg font-medium">Loading...</span>
    </div>
  );
};

export default LoadingBoundary;
