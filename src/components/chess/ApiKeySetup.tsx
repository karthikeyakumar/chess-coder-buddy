import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, Sparkles, X } from "lucide-react";

interface ApiKeySetupProps {
  onApiKeySet: (key: string) => void;
  onSkip: () => void;
  currentKey?: string;
}

export const ApiKeySetup = ({ onApiKeySet, onSkip, currentKey }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState(currentKey || "");
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-primary to-accent rounded-full">
          <Sparkles className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-xl">Unlock Chezzi's Full Power!</CardTitle>
        <p className="text-muted-foreground">
          Add your Google Gemini API key for intelligent analysis
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter your Gemini API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={!apiKey.trim()} className="flex-1 gap-2">
              <Key className="h-4 w-4" />
              Connect
            </Button>
            <Button type="button" variant="outline" onClick={onSkip} className="gap-2">
              <X className="h-4 w-4" />
              Skip
            </Button>
          </div>
        </form>

        <div className="text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowHelp(!showHelp)}
            className="text-muted-foreground"
          >
            How to get API key?
          </Button>
        </div>

        {showHelp && (
          <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
            <p className="font-medium">Get your free Gemini API key:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Visit <code className="bg-background px-1 rounded">ai.google.dev</code></li>
              <li>Sign in with Google account</li>
              <li>Click "Get API Key"</li>
              <li>Copy and paste here</li>
            </ol>
            
            <div className="mt-3 p-2 bg-primary/10 rounded border">
              <Badge variant="outline" className="mb-2">Without API key</Badge>
              <p className="text-xs">Chezzi will still work with smart offline responses and chess analysis!</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};