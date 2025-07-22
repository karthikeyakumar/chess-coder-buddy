import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const VoiceToggle = ({ isEnabled, onToggle }: VoiceToggleProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onToggle(!isEnabled)}
      className={cn(
        "gap-2 transition-colors",
        isEnabled && "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
    >
      {isEnabled ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
      {isEnabled ? "Voice On" : "Voice Off"}
    </Button>
  );
};