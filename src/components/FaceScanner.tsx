import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ImagePreview } from './scanner/ImagePreview';
import { ImageUploadButton } from './scanner/ImageUploadButton';
import { ScanButton } from './scanner/ScanButton';
import { ViewInstructions } from './scanner/ViewInstructions';

type ViewType = 'front' | 'left' | 'right';

interface CapturedImages {
  front?: string;
  left?: string;
  right?: string;
}

export const FaceScanner = React.memo(({ onImageCapture }: { onImageCapture: (images: CapturedImages) => void }) => {
  const [currentView, setCurrentView] = useState<ViewType>('front');
  const [capturedImages, setCapturedImages] = useState<CapturedImages>({});

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [currentView, capturedImages]);

  const allImagesUploaded = Boolean(capturedImages.front && capturedImages.left && capturedImages.right);

  return (
    <Card className="glass-card p-4 md:p-8 w-full max-w-md mx-auto rounded-3xl">
      <div className="space-y-4 md:space-y-6">
        <ViewInstructions 
          currentView={currentView}
          allImagesUploaded={allImagesUploaded}
        />

        <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {['front', 'left', 'right'].map((view) => (
              <ImagePreview
                key={view}
                view={view as ViewType}
                imageUrl={capturedImages[view as ViewType]}
                isCurrentView={view === currentView}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 md:gap-4 items-center">
            {!allImagesUploaded && (
              <ImageUploadButton
                currentView={currentView}
                onClick={() => document.getElementById('fileInput')?.click()}
              />
            )}
            
            {allImagesUploaded && (
              <ScanButton onClick={() => onImageCapture(capturedImages)} />
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
});

FaceScanner.displayName = 'FaceScanner';