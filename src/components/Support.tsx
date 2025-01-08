import { useState } from "react";
import { Bot } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ChatInput } from "./support/ChatInput";
import { ChatMessages } from "./support/ChatMessages";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const Support = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "This is Jenny at Skin Skanner Support. How can I help you today?"
  }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const email = "info@skinskanner.ai";

  const handleEmailClick = () => {
    window.location.href = `mailto:${email}`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = { role: 'user', content: inputMessage };
    setMessages([...messages, newMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('support-chat', {
        body: { messages: [...messages, newMessage] },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm having trouble responding right now. Please email our support team at info@skinskanner.ai for assistance.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="rounded-full shadow-lg">
            <Bot className="h-4 w-4 mr-2" />
            Jenny - Support
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[90vw] sm:w-[440px]">
          <SheetHeader>
            <SheetTitle>SkinSkanner Support</SheetTitle>
            <SheetDescription>
              How can we help you today?
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col h-[calc(100vh-200px)] mt-4">
            <ChatMessages messages={messages} isLoading={isLoading} />
            
            <ChatInput
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              isLoading={isLoading}
            />

            <div className="text-sm text-muted-foreground mt-4 text-center">
              Need direct assistance?{" "}
              <Button
                variant="link"
                className="text-primary p-0 h-auto"
                onClick={handleEmailClick}
              >
                Email us
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};