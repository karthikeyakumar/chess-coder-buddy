import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { VoiceToggle } from "./VoiceToggle";
import { ChessBoard } from "./ChessBoard";
import { ApiKeySetup } from "./ApiKeySetup";
import { Crown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChezziAI } from "@/lib/chezzi-ai";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: "Hey there, chess friend! 👋 I'm Chezzi, and I'm absolutely pumped to help you level up your game! Think of me as your debugging buddy, but for chess moves instead of code.\n\nWhat's on your mind today? Got a game you want me to analyze? A position that's bugging you? Or maybe you just want to chat about chess theory? I'm all ears (well, all algorithms)! 🤓♟️",
      timestamp: new Date()
    }
  ]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ fen?: string; pgn?: string }>({});
  const [chezziAI] = useState(() => new ChezziAI());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Use ChezziAI for intelligent responses
      const response = await chezziAI.getChatResponse(content, currentPosition);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Text-to-speech if enabled
      if (isVoiceEnabled) {
        speakText(aiResponse.content);
      }
    } catch (error) {
      console.error('AI response error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Oops! Looks like I hit a null pointer exception. Let me try that again... 🐛",
        timestamp: new Date()
      }]);
    }
    
    setIsTyping(false);
  };

  const generateChezziResponse = (userInput: string): string => {
    const responses = [
      "Ah, interesting position! This reminds me of a recursive function—looks complex on the surface, but there's an elegant pattern underneath. Let me break it down for you...",
      "Ooh, that's a spicy question! It's like when you're debugging and suddenly spot the issue—everything clicks into place. Here's what I'm thinking...",
      "Classic chess dilemma! This is like choosing between different algorithms—each has its merits. Let me walk you through the trade-offs...",
      "Great question! You know, this position is like well-written code—every piece has a purpose. Let me show you the underlying logic...",
      "Brilliant! This reminds me of the time I was analyzing Kasparov's games and found a similar pattern. It's like finding an easter egg in code!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
      {/* Chat Section */}
      <div className="lg:col-span-2">
        <Card className="h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <Crown className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Chezzi</h3>
                <p className="text-sm text-muted-foreground">Your AI Chess Coach</p>
              </div>
            </div>
            <VoiceToggle 
              isEnabled={isVoiceEnabled} 
              onToggle={setIsVoiceEnabled} 
            />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message}
                onSpeak={isVoiceEnabled ? speakText : undefined}
              />
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="p-2 bg-chat-ai rounded-lg">
                  <Crown className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: '0.6s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </Card>
      </div>

      {/* Chess Board Section */}
      <div className="lg:col-span-1">
        <ChessBoard onPositionChange={(fen, pgn) => {
          // Update Chezzi with the new position
          const positionMessage = `*Position updated: ${fen}*\n\nPGN: ${pgn}`;
          // Could trigger analysis here
        }} />
      </div>
    </div>
  );
};