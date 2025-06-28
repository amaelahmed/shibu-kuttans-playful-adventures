
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, Book, Calculator, Puzzle, Pencil } from 'lucide-react';
import { GameProgress } from '@/pages/Index';

interface WorldSelectionProps {
  onSelectWorld: (world: string) => void;
  onBack: () => void;
  progress: GameProgress;
}

const WorldSelection = ({ onSelectWorld, onBack, progress }: WorldSelectionProps) => {
  const worlds = [
    {
      id: 'math',
      name: 'Math World',
      icon: Calculator,
      color: 'from-blue-400 to-blue-600',
      description: 'Numbers, counting, and fun math adventures!',
      emoji: '🔢'
    },
    {
      id: 'word',
      name: 'Word World',
      icon: Book,
      color: 'from-green-400 to-green-600',
      description: 'Letters, words, and reading fun!',
      emoji: '📚'
    },
    {
      id: 'puzzle',
      name: 'Puzzle World',
      icon: Puzzle,
      color: 'from-purple-400 to-purple-600',
      description: 'Brain teasers and logic challenges!',
      emoji: '🧩'
    },
    {
      id: 'art',
      name: 'Art World',
      icon: Pencil,
      color: 'from-pink-400 to-pink-600',
      description: 'Colors, creativity, and artistic fun!',
      emoji: '🎨'
    }
  ];

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <Button
          onClick={onBack}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-6 py-3"
        >
          ← Back to Console
        </Button>
        <div className="text-white font-bold text-xl">
          Total Stars: ⭐ {progress.totalStars}
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
          Choose Your Adventure! 🌟
        </h1>
        <p className="text-xl text-white opacity-90">
          Which world would you like to explore today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto flex-1">
        {worlds.map((world) => {
          const worldProgress = progress.worldProgress[world.id];
          const Icon = world.icon;
          
          return (
            <Card 
              key={world.id}
              className="hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl border-4 border-white/20 animate-scale-in"
              onClick={() => onSelectWorld(world.id)}
            >
              <CardHeader className={`bg-gradient-to-br ${world.color} text-white rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{world.emoji}</div>
                    <div>
                      <CardTitle className="text-2xl font-bold">{world.name}</CardTitle>
                      <p className="text-white/90">{world.description}</p>
                    </div>
                  </div>
                  <Icon className="w-12 h-12" />
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-semibold text-gray-700">
                    Progress: {worldProgress.levelsCompleted}/{worldProgress.totalLevels} levels
                  </div>
                  <div className="flex items-center text-yellow-600">
                    ⭐ {worldProgress.stars} stars
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="bg-gray-200 rounded-full h-4 mb-4">
                  <div 
                    className={`bg-gradient-to-r ${world.color} h-4 rounded-full transition-all duration-500`}
                    style={{ width: `${(worldProgress.levelsCompleted / worldProgress.totalLevels) * 100}%` }}
                  ></div>
                </div>
                
                <Button 
                  className={`w-full bg-gradient-to-r ${world.color} hover:opacity-90 text-white font-bold text-lg py-3`}
                >
                  Enter {world.name} →
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WorldSelection;
