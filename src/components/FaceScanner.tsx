import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const FaceScanner = ({ onImageCapture }: { onImageCapture: (image: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const image = canvas.toDataURL('image/jpeg');
      onImageCapture(image);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
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