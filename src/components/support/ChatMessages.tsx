import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  return (
    <ScrollArea className="flex-1 pr-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3 mr-4">
              Typing...
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};