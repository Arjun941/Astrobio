"use client";

import { useState, useRef, useEffect, FormEvent } from 'react';
import { getChatbotResponseAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6 text-primary-foreground">
        <rect width="256" height="256" fill="none"/>
        <path d="M128,24a96,96,0,0,0-96,96,95.22,95.22,0,0,0,4.87,32H48a16,16,0,0,0-16,16v56a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V168a16,16,0,0,0-16-16h-11.13A95.22,95.22,0,0,0,224,120,96,96,0,0,0,128,24Z" opacity="0.2"/>
        <circle cx="128" cy="120" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
        <circle cx="92" cy="120" r="12"/>
        <circle cx="164" cy="120" r="12"/>
        <path d="M168,168H88a16,16,0,0,0-16,16v40a16,16,0,0,0,16,16h80a16,16,0,0,0,16-16V184A16,16,0,0,0,168,168Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
)

export default function ChatbotView({ paperUrl }: { paperUrl: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await getChatbotResponseAction(paperUrl, input);
    setIsLoading(false);

    if (result.error) {
      toast({
        title: "Error Getting Response",
        description: result.error,
        variant: "destructive",
      });
      setMessages((prev) => [...prev, { sender: 'bot', text: "Sorry, I encountered an error. Please try again." }]);
    } else if ('answer' in result && result.answer) {
      setMessages((prev) => [...prev, { sender: 'bot', text: result.answer }]);
    }
  };

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Chat with the Paper</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8 border-2 border-primary">
                    <AvatarFallback className="bg-primary"><BotIcon /></AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-muted p-3 max-w-[85%]">
                    <p className="text-sm">Hello! Ask me anything about this research paper.</p>
                </div>
            </div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.sender === 'user' ? 'justify-end' : ''
                )}
              >
                {message.sender === 'bot' && (
                  <Avatar className="w-8 h-8 border-2 border-primary">
                    <AvatarFallback className="bg-primary"><BotIcon /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg p-3 max-w-[85%]",
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.sender === 'bot' ? (
                    <div className="text-sm">
                      <MarkdownRenderer content={message.text} className="prose-sm" />
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  )}
                </div>
                 {message.sender === 'user' && (
                  <Avatar className="w-8 h-8 border-2">
                    <AvatarFallback><User size={16} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-3">
                 <Avatar className="w-8 h-8 border-2 border-primary">
                    <AvatarFallback className="bg-primary"><BotIcon /></AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
