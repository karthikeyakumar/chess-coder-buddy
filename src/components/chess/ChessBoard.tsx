import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw, Upload, Brain, TrendingUp } from "lucide-react";

interface ChessBoardProps {
  onPositionChange?: (fen: string, pgn: string) => void;
  initialFen?: string;
}

export const ChessBoard = ({ onPositionChange, initialFen }: ChessBoardProps) => {
  const [game, setGame] = useState(() => new Chess(initialFen));
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState<number | null>(null);

  // Initialize Stockfish engine
  const [stockfish, setStockfish] = useState<Worker | null>(null);

  useEffect(() => {
    // Initialize Stockfish worker
    const worker = new Worker(new URL('stockfish/src/stockfish.js', import.meta.url));
    worker.postMessage('uci');
    worker.postMessage('isready');
    
    worker.onmessage = (event) => {
      const line = event.data;
      if (line.includes('info depth') && line.includes('score cp')) {
        // Extract centipawn evaluation
        const cpMatch = line.match(/score cp (-?\d+)/);
        if (cpMatch) {
          setEvaluation(parseInt(cpMatch[1]) / 100); // Convert to pawns
        }
      }
    };

    setStockfish(worker);

    return () => {
      worker.terminate();
    };
  }, []);

  const analyzePosition = useCallback(() => {
    if (!stockfish) return;
    
    setIsAnalyzing(true);
    stockfish.postMessage(`position fen ${game.fen()}`);
    stockfish.postMessage('go depth 15');
    
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  }, [stockfish, game]);

  const onDrop = useCallback(
    ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string }) => {
      try {
        const move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q', // Always promote to queen for simplicity
        });

        if (move === null) return false; // Illegal move

        const newGame = new Chess(game.fen());
        setGame(newGame);
        setGamePosition(newGame.fen());
        
        // Notify parent component
        onPositionChange?.(newGame.fen(), newGame.pgn());
        
        // Analyze new position
        setTimeout(analyzePosition, 100);
        
        return true;
      } catch (error) {
        return false; // Illegal move
      }
    },
    [game, onPositionChange, analyzePosition]
  );

  const resetBoard = () => {
    const newGame = new Chess();
    setGame(newGame);
    setGamePosition(newGame.fen());
    setEvaluation(null);
    onPositionChange?.(newGame.fen(), newGame.pgn());
  };

  const loadPgn = () => {
    const pgn = prompt("Enter PGN:");
    if (pgn) {
      try {
        const newGame = new Chess();
        newGame.loadPgn(pgn);
        setGame(newGame);
        setGamePosition(newGame.fen());
        onPositionChange?.(newGame.fen(), newGame.pgn());
        analyzePosition();
      } catch (error) {
        alert("Invalid PGN format");
      }
    }
  };

  const getEvaluationColor = () => {
    if (evaluation === null) return "text-muted-foreground";
    if (evaluation > 1) return "text-green-600";
    if (evaluation < -1) return "text-red-600";
    return "text-yellow-600";
  };

  const getEvaluationText = () => {
    if (evaluation === null) return "No analysis";
    if (Math.abs(evaluation) > 5) return evaluation > 0 ? "White winning" : "Black winning";
    if (Math.abs(evaluation) > 2) return evaluation > 0 ? "White advantage" : "Black advantage";
    if (Math.abs(evaluation) > 0.5) return evaluation > 0 ? "White slightly better" : "Black slightly better";
    return "Equal position";
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Analysis Board</CardTitle>
          <div className="flex items-center gap-2">
            {isAnalyzing && (
              <Badge variant="outline" className="gap-1 animate-pulse">
                <Brain className="h-3 w-3" />
                Analyzing...
              </Badge>
            )}
            <Badge variant="outline" className={getEvaluationColor()}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {evaluation !== null ? `${evaluation > 0 ? '+' : ''}${evaluation.toFixed(1)}` : "0.0"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Chess Board */}
        <div className="w-full aspect-square max-w-md mx-auto rounded-lg overflow-hidden shadow-lg border-2 border-chess-dark">
          <Chessboard
            options={{
              position: gamePosition,
              onPieceDrop: onDrop,
            }}
          />
        </div>
        
        {/* Board Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={resetBoard} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={loadPgn} className="gap-2">
            <Upload className="h-4 w-4" />
            Load PGN
          </Button>
        </div>
        
        <Button 
          variant="chess" 
          size="sm" 
          onClick={analyzePosition}
          disabled={isAnalyzing}
          className="w-full gap-2"
        >
          <Brain className="h-4 w-4" />
          {isAnalyzing ? "Analyzing..." : "Analyze Position"}
        </Button>
        
        {/* Evaluation & Status */}
        <div className="p-3 bg-muted rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Evaluation:</span>
            <span className={`text-sm font-medium ${getEvaluationColor()}`}>
              {getEvaluationText()}
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {game.isCheckmate() 
              ? `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins`
              : game.isCheck()
              ? `${game.turn() === 'w' ? 'White' : 'Black'} is in check`
              : game.isDraw()
              ? "Game is a draw"
              : `${game.turn() === 'w' ? 'White' : 'Black'} to move`
            }
          </div>
          
          <div className="text-xs text-muted-foreground">
            Moves: {Math.ceil(game.history().length / 2)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};