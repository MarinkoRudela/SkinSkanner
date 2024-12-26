import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

export const FaceScanner = ({ onImageCapture }: { onImageCapture: (image: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    // Cleanup function to stop the camera when component unmounts
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
        onImageCapture(image);
        stopCamera();
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
                Capture
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