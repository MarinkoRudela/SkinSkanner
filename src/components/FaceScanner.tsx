import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('front');
  const [capturedImages, setCapturedImages] = useState<CapturedImages>({});

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsStreaming(true);
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Unable to access the camera. Please make sure you've granted camera permissions.",
        variant: "destructive"
      });
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const image = canvas.toDataURL('image/jpeg', 0.8);
        
        const newCapturedImages = {
          ...capturedImages,
          [currentView]: image
        };
        
        setCapturedImages(newCapturedImages);

        if (currentView === 'front') {
          setCurrentView('left');
          toast({
            title: "Great!",
            description: "Now, please turn your head to show your left side."
          });
        } else if (currentView === 'left') {
          setCurrentView('right');
          toast({
            title: "Perfect!",
            description: "Finally, please turn your head to show your right side."
          });
        } else {
          onImageCapture(newCapturedImages);
          stopCamera();
        }
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const getViewInstructions = () => {
    switch (currentView) {
      case 'front':
        return "Please look directly at the camera";
      case 'left':
        return "Turn your head to show your left side";
      case 'right':
        return "Turn your head to show your right side";
    }
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <div className="space-y-4">
        {!isStreaming ? (
          <Button 
            onClick={startCamera}
            className="w-full bg-medspa-600 hover:bg-medspa-700 text-white"
          >
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        ) : (
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-lg font-medium text-medspa-800"
            >
              {getViewInstructions()}
            </motion.div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <div className="flex gap-2">
              <Button 
                onClick={captureImage}
                className="flex-1 bg-medspa-600 hover:bg-medspa-700 text-white"
              >
                Capture {currentView} view
              </Button>
              <Button 
                onClick={stopCamera}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};