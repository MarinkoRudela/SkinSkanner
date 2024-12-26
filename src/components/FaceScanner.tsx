import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

type ViewType = 'front' | 'left' | 'right';

interface CapturedImages {
  front?: string;
  left?: string;
  right?: string;
}

export const FaceScanner = ({ onImageCapture }: { onImageCapture: (images: CapturedImages) => void }) => {
  const [currentView, setCurrentView] = useState<ViewType>('front');
  const [capturedImages, setCapturedImages] = useState<CapturedImages>({});

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      
      const newCapturedImages = {
        ...capturedImages,
        [currentView]: imageData
      };
      
      setCapturedImages(newCapturedImages);

      if (currentView === 'front') {
        setCurrentView('left');
        toast({
          title: "Front view uploaded!",
          description: "Now, please upload a photo of your left side."
        });
      } else if (currentView === 'left') {
        setCurrentView('right');
        toast({
          title: "Left view uploaded!",
          description: "Finally, please upload a photo of your right side."
        });
      } else {
        onImageCapture(newCapturedImages);
        toast({
          title: "Upload complete!",
          description: "Analyzing your photos..."
        });
      }
    };

    reader.readAsDataURL(file);
  };

  const getViewInstructions = () => {
    switch (currentView) {
      case 'front':
        return "Please upload a front view photo";
      case 'left':
        return "Please upload a left side view photo";
      case 'right':
        return "Please upload a right side view photo";
    }
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-lg font-medium text-medspa-800"
        >
          {getViewInstructions()}
        </motion.div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {['front', 'left', 'right'].map((view) => (
              <div
                key={view}
                className={`aspect-square rounded-lg border-2 ${
                  capturedImages[view as ViewType]
                    ? 'border-medspa-600'
                    : view === currentView
                    ? 'border-dashed border-medspa-400'
                    : 'border-gray-200'
                } flex items-center justify-center overflow-hidden`}
              >
                {capturedImages[view as ViewType] ? (
                  <img
                    src={capturedImages[view as ViewType]}
                    alt={`${view} view`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-500 text-center p-2">
                    {view} view
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => document.getElementById('fileInput')?.click()}
              className="bg-medspa-600 hover:bg-medspa-700 text-white"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload {currentView} view
            </Button>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};