
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ArtLevelProps {
  level: number;
  onComplete: (stars: number) => void;
}

const ArtLevel = ({ level, onComplete }: ArtLevelProps) => {
  const [canvas, setCanvas] = useState<string[][]>([]);
  const [selectedColor, setSelectedColor] = useState('🔴');
  const [targetPattern, setTargetPattern] = useState<string[][]>([]);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const colors = ['🔴', '🔵', '🟢', '🟡', '🟠', '🟣', '⚫', '⚪'];
  const gridSize = level <= 2 ? 4 : level <= 4 ? 5 : 6;

  useEffect(() => {
    initializeCanvas();
    generateTarget();
  }, [level]);

  const initializeCanvas = () => {
    const newCanvas = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill('⚪')
    );
    setCanvas(newCanvas);
  };

  const generateTarget = () => {
    const target = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill('⚪')
    );

    // Create simple patterns based on level
    if (level <= 2) {
      // Simple cross pattern
      const center = Math.floor(gridSize / 2);
      for (let i = 0; i < gridSize; i++) {
        target[center][i] = '🔴';
        target[i][center] = '🔴';
      }
    } else if (level <= 4) {
      // Checkerboard pattern
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if ((i + j) % 2 === 0) {
            target[i][j] = '🔵';
          }
        }
      }
    } else {
      // Border pattern
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (i === 0 || i === gridSize - 1 || j === 0 || j === gridSize - 1) {
            target[i][j] = '🟢';
          }
        }
      }
    }

    setTargetPattern(target);
  };

  const handleCellClick = (row: number, col: number) => {
    if (completed) return;

    const newCanvas = [...canvas];
    newCanvas[row][col] = selectedColor;
    setCanvas(newCanvas);

    // Check if pattern matches target
    checkCompletion(newCanvas);
  };

  const checkCompletion = (currentCanvas: string[][]) => {
    const matches = currentCanvas.every((row, i) => 
      row.every((cell, j) => cell === targetPattern[i][j])
    );

    if (matches) {
      setCompleted(true);
      setFeedback('🎨 Amazing artwork! You recreated the pattern perfectly!');
      setTimeout(() => {
        onComplete(3); // Always give 3 stars for art completion
      }, 2000);
    }
  };

  const resetCanvas = () => {
    initializeCanvas();
    setCompleted(false);
    setFeedback('');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-300">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold text-pink-800 mb-4 text-center">
            🎨 Art Challenge - Recreate the Pattern!
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Pattern */}
            <div>
              <h4 className="text-lg font-semibold text-pink-700 mb-2 text-center">Target Pattern:</h4>
              <div className="grid gap-1 p-4 bg-white rounded-lg border-2 border-pink-300" 
                   style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
                {targetPattern.map((row, i) =>
                  row.map((cell, j) => (
                    <div
                      key={`target-${i}-${j}`}
                      className="w-8 h-8 flex items-center justify-center text-lg border border-gray-200"
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Your Canvas */}
            <div>
              <h4 className="text-lg font-semibold text-pink-700 mb-2 text-center">Your Canvas:</h4>
              <div className="grid gap-1 p-4 bg-white rounded-lg border-2 border-pink-300" 
                   style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
                {canvas.map((row, i) =>
                  row.map((cell, j) => (
                    <button
                      key={`canvas-${i}-${j}`}
                      onClick={() => handleCellClick(i, j)}
                      className="w-8 h-8 flex items-center justify-center text-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      disabled={completed}
                    >
                      {cell}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-pink-700 mb-3 text-center">Choose Your Color:</h4>
            <div className="flex justify-center gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all ${
                    selectedColor === color 
                      ? 'border-pink-500 bg-pink-100 scale-110' 
                      : 'border-gray-300 hover:border-pink-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="text-center mt-6">
              <div className="text-2xl font-bold text-pink-800 animate-fade-in">
                {feedback}
              </div>
            </div>
          )}

          {/* Reset Button */}
          {!completed && (
            <div className="text-center mt-4">
              <Button
                onClick={resetCanvas}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-2"
              >
                Clear Canvas
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtLevel;
