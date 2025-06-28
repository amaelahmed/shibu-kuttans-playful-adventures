
import { useState, useEffect } from 'react';
import GameConsole from '@/components/GameConsole';
import WorldSelection from '@/components/WorldSelection';
import GameLevel from '@/components/GameLevel';
import ProgressDashboard from '@/components/ProgressDashboard';
import { useToast } from '@/hooks/use-toast';

export interface GameProgress {
  totalStars: number;
  worldProgress: {
    [key: string]: {
      levelsCompleted: number;
      totalLevels: number;
      stars: number;
    };
  };
  badges: string[];
  currentLevel: number;
}

const Index = () => {
  const [gameState, setGameState] = useState<'console' | 'worlds' | 'level' | 'progress'>('console');
  const [selectedWorld, setSelectedWorld] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [progress, setProgress] = useState<GameProgress>({
    totalStars: 0,
    worldProgress: {
      math: { levelsCompleted: 0, totalLevels: 5, stars: 0 },
      word: { levelsCompleted: 0, totalLevels: 5, stars: 0 },
      puzzle: { levelsCompleted: 0, totalLevels: 5, stars: 0 },
      art: { levelsCompleted: 0, totalLevels: 5, stars: 0 },
      minigames: { levelsCompleted: 0, totalLevels: 8, stars: 0 }
    },
    badges: [],
    currentLevel: 1
  });

  const { toast } = useToast();

  useEffect(() => {
    const savedProgress = localStorage.getItem('shibu-kuttan-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const saveProgress = (newProgress: GameProgress) => {
    setProgress(newProgress);
    localStorage.setItem('shibu-kuttan-progress', JSON.stringify(newProgress));
  };

  const handleWorldSelect = (world: string) => {
    setSelectedWorld(world);
    setGameState('level');
  };

  const handleLevelComplete = (world: string, level: number, starsEarned: number) => {
    const newProgress = { ...progress };
    
    // Update world progress
    if (newProgress.worldProgress[world]) {
      newProgress.worldProgress[world].levelsCompleted = Math.max(
        newProgress.worldProgress[world].levelsCompleted,
        level
      );
      newProgress.worldProgress[world].stars += starsEarned;
    }
    
    // Update total stars
    newProgress.totalStars += starsEarned;
    
    // Check for badges
    const totalCompleted = Object.values(newProgress.worldProgress)
      .reduce((sum, world) => sum + world.levelsCompleted, 0);
    
    if (totalCompleted >= 5 && !newProgress.badges.includes('first-steps')) {
      newProgress.badges.push('first-steps');
      toast({
        title: "🎉 New Badge Earned!",
        description: "First Steps - Complete 5 levels!"
      });
    }
    
    if (newProgress.totalStars >= 50 && !newProgress.badges.includes('star-collector')) {
      newProgress.badges.push('star-collector');
      toast({
        title: "⭐ New Badge Earned!",
        description: "Star Collector - Earn 50 stars!"
      });
    }
    
    saveProgress(newProgress);
    
    toast({
      title: `Great job! You earned ${starsEarned} stars!`,
      description: "Keep up the awesome work!"
    });
  };

  const renderCurrentView = () => {
    switch (gameState) {
      case 'console':
        return (
          <GameConsole 
            onStartGame={() => setGameState('worlds')}
            onViewProgress={() => setGameState('progress')}
            progress={progress}
          />
        );
      case 'worlds':
        return (
          <WorldSelection 
            onSelectWorld={handleWorldSelect}
            onBack={() => setGameState('console')}
            progress={progress}
          />
        );
      case 'level':
        return (
          <GameLevel
            world={selectedWorld}
            level={selectedLevel}
            onComplete={handleLevelComplete}
            onBack={() => setGameState('worlds')}
            onNextLevel={() => setSelectedLevel(prev => prev + 1)}
          />
        );
      case 'progress':
        return (
          <ProgressDashboard
            progress={progress}
            onBack={() => setGameState('console')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 animate-fade-in">
      {renderCurrentView()}
    </div>
  );
};

export default Index;
