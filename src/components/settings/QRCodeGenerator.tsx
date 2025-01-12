import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Download } from "lucide-react";

interface QRCodeGeneratorProps {
  shortCode: string;
}

export const QRCodeGenerator = ({ shortCode }: QRCodeGeneratorProps) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateQRCode = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('generate-qr-code', {
        body: { shortCode }
      });

      if (error) throw error;
      
      setQrCode(data.qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `scanner-qr-code-${shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-medium">Scanner QR Code</h3>
      <p className="text-sm text-muted-foreground">
        Generate a QR code that links directly to your scanner. Perfect for business cards or your website.
      </p>
      
      <div className="space-y-4">
        {!qrCode && (
          <Button 
            onClick={generateQRCode}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate QR Code
          </Button>
        )}

        {qrCode && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img 
                src={qrCode} 
                alt="Scanner QR Code"
                className="max-w-[200px]"
              />
            </div>
            
            <Button 
              onClick={downloadQRCode}
              className="w-full"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};