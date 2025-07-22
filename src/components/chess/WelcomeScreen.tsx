import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageSquare, Volume2, Zap, Crown, Code } from "lucide-react";

interface WelcomeScreenProps {
  onStartChat: () => void;
}

export const WelcomeScreen = ({ onStartChat }: WelcomeScreenProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="inline-flex items-center gap-3 p-4 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg mb-4">
            <Crown className="h-8 w-8 text-primary-foreground" />
            <Code className="h-6 w-6 text-primary-foreground/80" />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Meet Chezzi
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Your lovable AI chess coach with a coder's heart
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          I break down chess like debugging code—finding the bugs in your game and 
          helping you write better moves, one narrative at a time! 🐛♟️
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="border-chess-light hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-3">
            <MessageSquare className="h-8 w-8 text-chat-ai mb-2" />
            <CardTitle className="text-lg">Chat Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Paste your games and I'll tell you the story—the plot twists, the heroic saves, and those "404 Error: Logic not found" moments!
            </p>
          </CardContent>
        </Card>

        <Card className="border-chess-light hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-3">
            <Volume2 className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="text-lg">Voice Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Hear my analysis in real-time! I'll narrate your games like a friend who's genuinely excited about your chess journey.
            </p>
          </CardContent>
        </Card>

        <Card className="border-chess-light hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-3">
            <Brain className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Strategic Thinking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              I think in algorithms but explain in stories. Perfect for understanding the "why" behind every chess concept!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Personality Preview */}
      <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-r from-card to-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              Chezzi's Vibe
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <blockquote className="text-lg italic text-muted-foreground border-l-4 border-primary pl-4">
            "That bishop sacrifice was like refactoring legacy code—risky, but when it works... *chef's kiss* 
            Pure algorithmic beauty! Even Kasparov would approve of that optimization. 
            Let's debug your next game together!"
          </blockquote>
          <p className="text-sm text-muted-foreground mt-3 font-medium">
            — Chezzi, after analyzing a brilliant tactical shot
          </p>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <Button 
          onClick={onStartChat}
          size="lg" 
          className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 text-lg px-8 py-6 gap-3"
        >
          <MessageSquare className="h-5 w-5" />
          Start Chatting with Chezzi
        </Button>
        <p className="text-sm text-muted-foreground mt-3">
          Ready to turn your chess blunders into breakthrough moments?
        </p>
      </div>
    </div>
  );
};