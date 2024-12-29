import React, { useState } from 'react';
import { Upload, Scan } from 'lucide-react';
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
        toast({
          title: "All photos uploaded!",
          description: "Click 'Scan Images' to analyze your photos."
        });
      }
    };

    reader.readAsDataURL(file);
  };

  const handleScan = () => {
    onImageCapture(capturedImages);
    toast({
      title: "Scanning started",
      description: "Analyzing your photos..."
    });
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

  const allImagesUploaded = capturedImages.front && capturedImages.left && capturedImages.right;

  return (
    <Card className="glass-card p-8 w-full max-w-md mx-auto rounded-3xl">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-lg font-medium text-primary-hover"
        >
          {allImagesUploaded ? "All photos uploaded!" : getViewInstructions()}
        </motion.div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {['front', 'left', 'right'].map((view) => (
              <div
                key={view}
                className={`aspect-square rounded-2xl border-2 ${
                  capturedImages[view as ViewType]
                    ? 'border-primary'
                    : view === currentView
                    ? 'border-dashed border-primary/60'
                    : 'border-muted'
                } flex items-center justify-center overflow-hidden bg-white/50`}
              >
                {capturedImages[view as ViewType] ? (
                  <img
                    src={capturedImages[view as ViewType]}
                    alt={`${view} view`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground text-center p-2">
                    {view} view
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 items-center">
            {!allImagesUploaded && (
              <Button
                onClick={() => document.getElementById('fileInput')?.click()}
                className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-6 h-auto"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload {currentView} view
              </Button>
            )}
            
            {allImagesUploaded && (
              <Button
                onClick={handleScan}
                className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-6 h-auto w-full max-w-sm"
              >
                <Scan className="mr-2 h-5 w-5" />
                Scan Images
              </Button>
            )}
            
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