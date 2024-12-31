import React from 'react';

export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="text-indigo-600">Loading...</p>
      </div>
    </div>
  );
};