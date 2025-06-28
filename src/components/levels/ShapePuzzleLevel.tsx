
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ShapePuzzleLevelProps {
  level: number;
  onComplete: (stars: number) => void;
}

const ShapePuzzleLevel = ({ level, onComplete }: ShapePuzzleLevelProps) => {
  const [shapes, setShapes] = useState<Array<{ id: string; shape: string; color: string; placed: boolean }>>([]);
  const [slots, setSlots] = useState<Array<{ id: string; shape: string; filled: boolean }>>([]);
  const [draggedShape, setDraggedShape] = useState<string | null>(null);
  const [completedShapes, setCompletedShapes] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const shapeTypes = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  useEffect(() => {
    initializePuzzle();
  }, [level]);

  const initializePuzzle = () => {
    const numShapes = Math.min(3 + level, 6);
    const selectedShapes = shapeTypes.slice(0, numShapes);
    
    const gameShapes = selectedShapes.map((shape, index) => ({
      id: `shape-${index}`,
      shape,
      color: colors[index % colors.length],
      placed: false
    }));

    const gameSlots = selectedShapes
      .map((shape, index) => ({
        id: `slot-${index}`,
        shape,
        filled: false
      }))
      .sort(() => Math.random() - 0.5);

    setShapes(gameShapes.sort(() => Math.random() - 0.5));
    setSlots(gameSlots);
    setCompletedShapes(0);
    setAttempts(0);
  };

  const handleDragStart = (shapeId: string) => {
    setDraggedShape(shapeId);
  };

  const handleDrop = (slotId: string) => {
    if (!draggedShape) return;
    
    const shape = shapes.find(s => s.id === draggedShape);
    const slot = slots.find(s => s.id === slotId);
    
    if (!shape || !slot || slot.filled) return;
    
    setAttempts(prev => prev + 1);
    
    if (shape.shape === slot.shape) {
      // Correct placement
      setShapes(prev => prev.map(s => 
        s.id === draggedShape ? { ...s, placed: true } : s
      ));
      setSlots(prev => prev.map(s => 
        s.id === slotId ? { ...s, filled: true } : s
      ));
      setCompletedShapes(prev => prev + 1);
    }
    
    setDraggedShape(null);
  };

  const renderShape = (shape: string, color: string, size: number = 60) => {
    const style = { width: size, height: size, backgroundColor: color };
    
    switch (shape) {
      case 'circle':
        return <div className="rounded-full" style={style}></div>;
      case 'square':
        return <div className="rounded-lg" style={style}></div>;
      case 'triangle':
        return (
          <div 
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid ${color}`,
            }}
          ></div>
        );
      case 'star':
        return <div className="text-6xl" style={{ color }}>⭐</div>;
      case 'heart':
        return <div className="text-6xl" style={{ color }}>❤️</div>;
      case 'diamond':
        return <div className="text-6xl" style={{ color }}>💎</div>;
      default:
        return <div className="rounded-full" style={style}></div>;
    }
  };

  useEffect(() => {
    if (completedShapes === shapes.length && shapes.length > 0) {
      const stars = attempts <= shapes.length ? 3 : attempts <= shapes.length + 2 ? 2 : 1;
      setTimeout(() => onComplete(stars), 1000);
    }
  }, [completedShapes, shapes.length, attempts]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-700 mb-2">Shape Puzzle</h3>
        <p className="text-lg text-purple-600 mb-4">Fit shapes into the right spots!</p>
        <div className="flex justify-center space-x-6 text-lg font-semibold">
          <span className="text-blue-600">Attempts: {attempts}</span>
          <span className="text-green-600">Completed: {completedShapes}/{shapes.length}</span>
        </div>
      </div>

      {/* Shape Slots */}
      <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300">
        <CardContent className="p-8">
          <h4 className="text-xl font-bold text-center text-purple-800 mb-6">
            Drop shapes here:
          </h4>
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`w-24 h-24 border-4 border-dashed border-gray-400 rounded-lg flex items-center justify-center ${
                  slot.filled ? 'bg-green-100 border-green-400' : 'bg-white hover:bg-gray-50'
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(slot.id)}
              >
                {slot.filled ? (
                  <span className="text-2xl">✅</span>
                ) : (
                  <span className="text-gray-400 text-sm">Drop here</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Shapes */}
      <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300">
        <CardContent className="p-8">
          <h4 className="text-xl font-bold text-center text-purple-800 mb-6">
            Drag these shapes:
          </h4>
          <div className="flex flex-wrap justify-center gap-4">
            {shapes.filter(shape => !shape.placed).map((shape) => (
              <div
                key={shape.id}
                className="cursor-move hover:scale-110 transition-transform p-4 bg-white rounded-lg shadow-lg"
                draggable
                onDragStart={() => handleDragStart(shape.id)}
              >
                {renderShape(shape.shape, shape.color)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShapePuzzleLevel;
