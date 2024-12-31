import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";

interface ShareLinksProps {
  userId: string;
}

export const ShareLinks = ({ userId }: ShareLinksProps) => {
  const shareUrl = `${window.location.origin}/b/${userId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Copied!",
      description: "Share link copied to clipboard",
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Share on Social Media</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Your unique link to share:</p>
        <div className="bg-gray-50 p-4 rounded">
          <pre className="text-sm overflow-x-auto">{shareUrl}</pre>
          <Button
            variant="outline"
            className="mt-2"
            onClick={handleCopy}
          >
            Copy Link
          </Button>
        </div>
      </div>
    </div>
  );
};