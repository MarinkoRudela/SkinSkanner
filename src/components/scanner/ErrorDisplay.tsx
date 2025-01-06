import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  const isSetupError = error.includes("hasn't completed their profile") || 
                      error.includes("not set up their booking URL");
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-medspa-50 to-white">
      <div className="text-center p-8 max-w-md">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-gray-600 whitespace-pre-wrap mb-4">{error}</p>
        {isSetupError ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              The business owner is still setting up their profile. Please check back later or contact them directly.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="mt-4"
            >
              Return to Home
            </Button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            If this error persists, please contact support or try refreshing the page.
          </p>
        )}
      </div>
    </div>
  );
};