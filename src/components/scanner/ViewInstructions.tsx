import React from 'react';
import { motion } from 'framer-motion';

interface ViewInstructionsProps {
  currentView: string;
  allImagesUploaded: boolean;
}

export const ViewInstructions = ({ currentView, allImagesUploaded }: ViewInstructionsProps) => {
  const getViewInstructions = () => {
    if (allImagesUploaded) return "All photos uploaded!";
    
    switch (currentView) {
      case 'front':
        return "Please upload a front view photo";
      case 'left':
        return "Please upload a left side view photo";
      case 'right':
        return "Please upload a right side view photo";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-base md:text-lg font-medium text-primary-hover px-2"
    >
      {getViewInstructions()}
    </motion.div>
  );
};