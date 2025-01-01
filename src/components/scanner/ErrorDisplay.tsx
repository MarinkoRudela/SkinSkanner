import React from "react";

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-medspa-50 to-white">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );
};