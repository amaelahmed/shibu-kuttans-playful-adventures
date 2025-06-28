
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ArrowDown } from 'lucide-react';
import ShibuKuttan from './ShibuKuttan';
import MathLevel from './levels/MathLevel';
import WordLevel from './levels/WordLevel';
import PuzzleLevel from './levels/PuzzleLevel';
import ArtLevel from './levels/ArtLevel';

interface GameLevelProps {
  world: string;
  level: number;
  onComplete: (world: string, level: number, stars: number) => void;
  onBack: () => void;
  onNextLevel: () => void;
}

const GameLevel = ({ world, level, onComplete, onBack, onNextLevel }: GameLevelProps) => {
  const [gameState, setGameState] = useState<'playing' | 'completed'>('playing');
  const [starsEarned, setStarsEarned] = useState(0);
  const [shibuDialogue, setShibuDialogue] = useState('');

  useEffect(() => {
    const dialogues = {
      math: ["Let's solve some fun math problems!", "Numbers are everywhere!", "You're great at math!"],
      word: ["Time for word adventures!", "Reading is so much fun!", "You're becoming a great reader!"],
      puzzle: ["Let's solve puzzles together!", "Think carefully and you'll get it!", "Your brain is amazing!"],
      art: ["Time to be creative!", "Colors make everything beautiful!", "You're such a talented artist!"]
    };
    
    setShibuDialogue(dialogues[world as keyof typeof dialogues]?.[0] || "Let's have fun learning!");
  }, [world]);

  const handleLevelComplete = (stars: number) => {
    setStarsEarned(stars);
    setGameState('completed');
    setShibuDialogue(`Fantastic! You earned ${stars} stars! 🌟`);
    onComplete(world, level, stars);
  };

  const renderLevelContent = () => {
    switch (world) {
      case 'math':
        return <MathLevel level={level} onComplete={handleLevelComplete} />;
      case 'word':
        return <WordLevel level={level} onComplete={handleLevelComplete} />;
      case 'puzzle':
        return <PuzzleLevel level={level} onComplete={handleLevelComplete} />;
      case 'art':
        return <ArtLevel level={level} onComplete={handleLevelComplete} />;
      default:
        return <div>Level content coming soon!</div>;
    }
  };

  const getWorldEmoji = () => {
    const emojis = {
      math: '🔢',
      word: '📚',
      puzzle: '🧩',
      art: '🎨'
    };
    return emojis[world as keyof typeof emojis] || '🎮';
  };

  if (gameState === 'completed') {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-gradient-to-br from-yellow-200 to-orange-300 border-4 border-orange-400 shadow-2xl animate-scale-in">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-purple-800 mb-4">Level Complete!</h2>
            
            <div className="flex justify-center items-center space-x-2 mb-6">
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-12 h-12 ${
                    i < starsEarned ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                  } animate-pulse`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            
            <ShibuKuttan dialogue={shibuDialogue} mood="celebrating" />
            
            <div className="flex space-x-4 mt-8">
              <Button
                onClick={onBack}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg px-6 py-3"
              >
                Back to Worlds
              </Button>
              <Button
                onClick={() => {
                  onNextLevel();
                  setGameState('playing');
                }}
                className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-6 py-3"
              >
                Next Level →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={onBack}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-6 py-3"
        >
          ← Back to Worlds
        </Button>
        <div className="text-white font-bold text-xl">
          {getWorldEmoji()} Level {level}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/95 shadow-2xl border-4 border-white/50 mb-6 animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-purple-800 capitalize">
              {world} World - Level {level}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <ShibuKuttan dialogue={shibuDialogue} />
            </div>
            {renderLevelContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameLevel;
