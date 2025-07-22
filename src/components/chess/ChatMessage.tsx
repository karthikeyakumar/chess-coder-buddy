import { Button } from "@/components/ui/button";
import { Crown, User, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  onSpeak?: (text: string) => void;
}

export const ChatMessage = ({ message, onSpeak }: ChatMessageProps) => {
  const isAI = message.type === "ai";

  return (
    <div className={cn(
      "flex gap-3 animate-slide-up",
      isAI ? "justify-start" : "justify-end"
    )}>
      {isAI && (
        <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg shrink-0">
          <Crown className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] rounded-lg p-3 relative",
        isAI 
          ? "bg-chat-bubble border border-border" 
          : "bg-chat-user text-white"
      )}>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </div>
        
        {isAI && onSpeak && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSpeak(message.content)}
            className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-background border shadow-sm hover:shadow-md"
          >
            <Volume2 className="h-3 w-3" />
          </Button>
        )}
        
        <div className="text-xs text-muted-foreground mt-2">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
      
      {!isAI && (
        <div className="p-2 bg-muted rounded-lg shrink-0">
          <User className="h-4 w-4 text-foreground" />
        </div>
      )}
    </div>
  );
};