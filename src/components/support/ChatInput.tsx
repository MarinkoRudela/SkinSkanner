import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
}

export const ChatInput = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
}: ChatInputProps) => {
  return (
    <div className="flex items-center gap-2 pt-4">
      <Input
        placeholder="Type your message..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage();
          }
        }}
        disabled={isLoading}
      />
      <Button
        size="icon"
        onClick={handleSendMessage}
        disabled={isLoading || !inputMessage.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};