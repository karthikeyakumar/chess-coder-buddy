import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw, Upload } from "lucide-react";

export const ChessBoard = () => {
  // Simple 8x8 grid representation for now
  const renderSquare = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0;
    const squareColor = isLight ? "bg-chess-board-light" : "bg-chess-board-dark";
    
    return (
      <div
        key={`${row}-${col}`}
        className={`aspect-square ${squareColor} border border-border/20 flex items-center justify-center text-lg font-medium transition-colors hover:opacity-80`}
      >
        {/* Piece placement logic would go here */}
      </div>
    );
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Analysis Board</CardTitle>
          <Badge variant="outline">8x8</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Chess Board Grid */}
        <div className="grid grid-cols-8 border-2 border-chess-dark rounded-lg overflow-hidden mb-4 shadow-lg">
          {Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => renderSquare(row, col))
          )}
        </div>
        
        {/* Board Controls */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-2">
            <Upload className="h-4 w-4" />
            Load PGN
          </Button>
        </div>
        
        {/* Position Info */}
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Paste a position or PGN in the chat, and I'll show it here with live analysis!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};