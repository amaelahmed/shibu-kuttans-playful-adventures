
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Trophy, Award } from 'lucide-react';
import { GameProgress } from '@/pages/Index';

interface ProgressDashboardProps {
  progress: GameProgress;
  onBack: () => void;
}

const ProgressDashboard = ({ progress, onBack }: ProgressDashboardProps) => {
  const totalLevelsCompleted = Object.values(progress.worldProgress)
    .reduce((sum, world) => sum + world.levelsCompleted, 0);
  
  const totalLevelsAvailable = Object.values(progress.worldProgress)
    .reduce((sum, world) => sum + world.totalLevels, 0);

  const badges = [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete 5 levels',
      emoji: '👣',
      earned: progress.badges.includes('first-steps')
    },
    {
      id: 'star-collector',
      name: 'Star Collector',
      description: 'Earn 50 stars',
      emoji: '⭐',
      earned: progress.badges.includes('star-collector')
    },
    {
      id: 'math-master',
      name: 'Math Master',
      description: 'Complete all Math World levels',
      emoji: '🔢',
      earned: progress.worldProgress.math?.levelsCompleted >= 5
    },
    {
      id: 'word-wizard',
      name: 'Word Wizard',
      description: 'Complete all Word World levels',
      emoji: '📚',
      earned: progress.worldProgress.word?.levelsCompleted >= 5
    }
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-8">
        <Button
          onClick={onBack}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-6 py-3"
        >
          ← Back to Console
        </Button>
        <div className="text-white font-bold text-2xl">
          📊 My Progress
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Overall Stats */}
        <Card className="bg-gradient-to-br from-yellow-200 to-orange-300 border-4 border-orange-400 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-purple-800">
              🏆 Shibu Kuttan's Achievement Board 🏆
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white bg-opacity-80 rounded-lg p-4">
                <div className="text-4xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-purple-800">{progress.totalStars}</div>
                <div className="text-sm text-purple-600">Total Stars</div>
              </div>
              <div className="bg-white bg-opacity-80 rounded-lg p-4">
                <div className="text-4xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-purple-800">{totalLevelsCompleted}</div>
                <div className="text-sm text-purple-600">Levels Completed</div>
              </div>
              <div className="bg-white bg-opacity-80 rounded-lg p-4">
                <div className="text-4xl mb-2">🏅</div>
                <div className="text-2xl font-bold text-purple-800">{progress.badges.length}</div>
                <div className="text-sm text-purple-600">Badges Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* World Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(progress.worldProgress).map(([worldId, worldData]) => {
            const worldInfo = {
              math: { name: 'Math World', emoji: '🔢', color: 'from-blue-400 to-blue-600' },
              word: { name: 'Word World', emoji: '📚', color: 'from-green-400 to-green-600' },
              puzzle: { name: 'Puzzle World', emoji: '🧩', color: 'from-purple-400 to-purple-600' },
              art: { name: 'Art World', emoji: '🎨', color: 'from-pink-400 to-pink-600' }
            }[worldId] || { name: worldId, emoji: '🎮', color: 'from-gray-400 to-gray-600' };

            return (
              <Card key={worldId} className="bg-white shadow-lg">
                <CardHeader className={`bg-gradient-to-r ${worldInfo.color} text-white`}>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">{worldInfo.emoji}</span>
                    <span>{worldInfo.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold">Progress:</span>
                    <span>{worldData.levelsCompleted}/{worldData.totalLevels} levels</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-4 mb-3">
                    <div 
                      className={`bg-gradient-to-r ${worldInfo.color} h-4 rounded-full transition-all duration-500`}
                      style={{ width: `${(worldData.levelsCompleted / worldData.totalLevels) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      {worldData.stars} stars
                    </span>
                    {worldData.levelsCompleted === worldData.totalLevels && (
                      <div className="text-green-600 font-bold">Complete! 🎉</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Badges */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-purple-800 flex items-center justify-center">
              <Trophy className="w-8 h-8 mr-2" />
              Badge Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    badge.earned
                      ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400 shadow-lg'
                      : 'bg-gray-100 border-gray-300 opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.emoji}</div>
                  <div className="font-bold text-purple-800">{badge.name}</div>
                  <div className="text-sm text-purple-600 mt-1">{badge.description}</div>
                  {badge.earned && (
                    <div className="mt-2 text-green-600 font-bold">✓ Earned!</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressDashboard;
