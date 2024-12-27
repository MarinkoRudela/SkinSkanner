import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";

export const IntegrationGuide = () => {
  const iframeCode = `<iframe
  src="${window.location.origin}"
  width="100%"
  height="800px"
  frameborder="0"
></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode);
    toast({
      title: "Copied!",
      description: "Integration code copied to clipboard",
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Integration Guide</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">To embed this application on your website:</p>
        <div className="bg-gray-50 p-4 rounded">
          <pre className="text-sm overflow-x-auto">{iframeCode}</pre>
          <Button
            variant="outline"
            className="mt-2"
            onClick={handleCopy}
          >
            Copy Code
          </Button>
        </div>
      </div>
    </div>
  );
};