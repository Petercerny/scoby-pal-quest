import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, CheckCircle, Star } from "lucide-react";

interface MiniPuzzleProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Simple pattern matching puzzle
export const MiniPuzzle = ({ isOpen, onClose, onComplete, difficulty }: MiniPuzzleProps) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showPattern, setShowPattern] = useState(true);

  const colors = ['🟡', '🟢', '🔵', '🟣'];
  
  useEffect(() => {
    if (isOpen) {
      generatePuzzle();
    }
  }, [isOpen, difficulty]);

  const generatePuzzle = () => {
    const length = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    const newSequence = Array.from({ length }, () => 
      colors[Math.floor(Math.random() * colors.length)]
    );
    setSequence(newSequence);
    setUserSequence([]);
    setIsComplete(false);
    setShowPattern(true);
    
    // Hide pattern after showing it briefly
    setTimeout(() => {
      setShowPattern(false);
    }, 2000 + (length * 500));
  };

  const handleColorClick = (color: string) => {
    if (showPattern || isComplete) return;
    
    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);
    
    // Check if sequence matches so far
    const isCorrectSoFar = newUserSequence.every((color, index) => 
      color === sequence[index]
    );
    
    if (!isCorrectSoFar) {
      // Wrong! Reset
      setTimeout(() => {
        setUserSequence([]);
      }, 500);
      return;
    }
    
    // Check if complete
    if (newUserSequence.length === sequence.length) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9999] flex items-center justify-center"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999
      }}
    >
      <Card 
        className="w-full max-w-sm bg-gradient-card shadow-warm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Pattern Puzzle
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {difficulty}
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {showPattern 
              ? "Remember this pattern..." 
              : isComplete 
                ? "Perfect! Well done! 🎉"
                : "Repeat the pattern you saw"
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Pattern Display */}
          <div className="flex justify-center">
            <div className="flex gap-2 p-4 bg-muted/30 rounded-lg min-h-16 items-center">
              {showPattern ? (
                sequence.map((color, index) => (
                  <div
                    key={index}
                    className="text-2xl animate-bounce-gentle"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {color}
                  </div>
                ))
              ) : (
                userSequence.map((color, index) => (
                  <div key={index} className="text-2xl">
                    {color}
                  </div>
                ))
              )}
              
              {!showPattern && !isComplete && userSequence.length < sequence.length && (
                <div className="w-8 h-8 border-2 border-dashed border-muted-foreground rounded-full flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">?</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Color Buttons */}
          {!showPattern && !isComplete && (
            <div className="grid grid-cols-2 gap-3">
              {colors.map((color) => (
                <Button
                  key={color}
                  variant="outline"
                  size="lg"
                  onClick={() => handleColorClick(color)}
                  className="h-16 text-3xl hover:scale-105 transition-transform border-2"
                >
                  {color}
                </Button>
              ))}
            </div>
          )}
          
          {/* Success state */}
          {isComplete && (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-scoby-healthy mx-auto mb-2" />
              <p className="font-medium text-scoby-healthy">Puzzle Solved!</p>
              <p className="text-sm text-muted-foreground">+25 XP earned</p>
            </div>
          )}
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {sequence.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index < userSequence.length
                    ? 'bg-scoby-healthy'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};