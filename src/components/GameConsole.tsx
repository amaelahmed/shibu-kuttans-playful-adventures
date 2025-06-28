
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Play, Trophy, Volume2, VolumeX } from 'lucide-react';
import ShibuKuttan from './ShibuKuttan';
import { GameProgress } from '@/pages/Index';
import { useSound } from '@/hooks/useSound';

interface GameConsoleProps {
  onStartGame: () => void;
  onViewProgress: () => void;
  progress: GameProgress;
}

const GameConsole = ({ onStartGame, onViewProgress, progress }: GameConsoleProps) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [shibuDialogue, setShibuDialogue] = useState("Hi there! I'm Shibu Kuttan, ready for some fun learning?");
  const [musicEnabled, setMusicEnabled] = useState(true);
  const { playSound, playBackgroundMusic, stopBackgroundMusic } = useSound();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const dialogues = [
      "Hi there! I'm Shibu Kuttan, ready for some fun learning?",
      "Let's explore amazing worlds together!",
      "Math, words, puzzles - what's your favorite?",
      "You're doing great! Keep learning and playing!",
      "Every star you earn makes me so proud!"
    ];
    
    const interval = setInterval(() => {
      setShibuDialogue(dialogues[Math.floor(Math.random() * dialogues.length)]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (musicEnabled) {
      playBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
  }, [musicEnabled, playBackgroundMusic, stopBackgroundMusic]);

  const handleButtonClick = (callback: () => void, soundName: string = 'click') => {
    playSound(soundName);
    callback();
  };

  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled);
    playSound('click');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-4xl bg-gradient-to-br from-yellow-200 to-orange-300 border-4 border-orange-400 shadow-2xl animate-scale-in">
        <CardContent className="p-8">
          {/* Console Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-purple-800 mb-2 animate-fade-in">
              🎮 Shibu Kuttan's Gaming Console 🎮
            </h1>
            <div className="text-lg text-purple-600 font-semibold flex items-center justify-center space-x-4">
              <span>Time: {currentTime}</span>
              <span>Stars: ⭐ {progress.totalStars}</span>
              <Button
                onClick={toggleMusic}
                className="bg-purple-500 hover:bg-purple-600 text-white p-2"
                size="sm"
              >
                {musicEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Console Screen */}
          <div className="bg-black rounded-lg p-6 mb-8 border-4 border-gray-600">
            <div className="bg-gradient-to-br from-blue-300 to-green-300 rounded-lg p-6 min-h-[300px] flex flex-col items-center justify-center">
              <ShibuKuttan dialogue={shibuDialogue} />
              
              {/* Game Stats Display */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 w-full">
                {Object.entries(progress.worldProgress).map(([world, data]) => (
                  <div key={world} className="bg-white bg-opacity-80 rounded-lg p-3 text-center">
                    <div className="text-sm font-semibold capitalize text-purple-800">{world}</div>
                    <div className="text-xs text-purple-600">
                      {data.levelsCompleted}/{data.totalLevels} levels
                    </div>
                    <div className="flex justify-center items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{data.stars}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Console Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button
              onClick={() => handleButtonClick(onStartGame, 'success')}
              className="h-20 text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Play className="w-8 h-8 mr-3" />
              Start Game
            </Button>
            
            <Button
              onClick={() => handleButtonClick(onViewProgress)}
              className="h-20 text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Trophy className="w-8 h-8 mr-3" />
              My Progress
            </Button>
            
            <Button
              className="h-20 text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => handleButtonClick(() => setShibuDialogue("Settings coming soon! Keep playing for now!"))}
            >
              ⚙️ Settings
            </Button>
          </div>

          {/* Console Decoration */}
          <div className="flex justify-center mt-6 space-x-4">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameConsole;
