import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSound } from '@/hooks/useSound';

interface ColorMatchLevelProps {
  level: number;
  onComplete: (stars: number) => void;
}

const ColorMatchLevel = ({ level, onComplete }: ColorMatchLevelProps) => {
  const [targetColor, setTargetColor] = useState('');
  const [targetColorName, setTargetColorName] = useState('');
  const [colorOptions, setColorOptions] = useState<Array<{ color: string; name: string }>>([]);
  const [score, setScore] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const totalQuestions = 8;
  const { playSound } = useSound();

  const colors = [
    { color: '#FF0000', name: 'Red' },
    { color: '#00FF00', name: 'Green' },
    { color: '#0000FF', name: 'Blue' },
    { color: '#FFFF00', name: 'Yellow' },
    { color: '#FF00FF', name: 'Pink' },
    { color: '#00FFFF', name: 'Cyan' },
    { color: '#FFA500', name: 'Orange' },
    { color: '#800080', name: 'Purple' },
    { color: '#FFC0CB', name: 'Light Pink' },
    { color: '#90EE90', name: 'Light Green' },
    { color: '#87CEEB', name: 'Sky Blue' },
    { color: '#F0E68C', name: 'Khaki' }
  ];

  useEffect(() => {
    generateQuestion();
  }, [level]);

  const generateQuestion = () => {
    const availableColors = colors.slice(0, Math.min(4 + level * 2, colors.length));
    const correctColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    
    // Create options with correct color and 2-3 random colors
    const wrongColors = availableColors
      .filter(c => c.name !== correctColor.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const options = [correctColor, ...wrongColors].sort(() => Math.random() - 0.5);
    
    setTargetColor(correctColor.color);
    setTargetColorName(correctColor.name);
    setColorOptions(options);
    setShowFeedback(false);
  };

  const handleColorSelect = (selectedColor: { color: string; name: string }) => {
    const isCorrect = selectedColor.name === targetColorName;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback(`🎉 Correct! That's ${selectedColor.name}!`);
      playSound('success');
    } else {
      setFeedback(`💡 That's ${selectedColor.name}. The correct answer was ${targetColorName}!`);
      playSound('wrong');
    }
    
    setShowFeedback(true);
    setQuestionsCompleted(prev => prev + 1);
    
    setTimeout(() => {
      if (questionsCompleted + 1 >= totalQuestions) {
        const stars = score >= 7 ? 3 : score >= 5 ? 2 : 1;
        playSound('levelComplete');
        // Play star sounds based on stars earned
        setTimeout(() => {
          for (let i = 0; i < stars; i++) {
            setTimeout(() => playSound('star'), i * 200);
          }
        }, 500);
        onComplete(stars);
      } else {
        generateQuestion();
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-700 mb-2">Color Match</h3>
        <p className="text-lg text-purple-600 mb-4">Match colors and learn new ones!</p>
        <div className="flex justify-center space-x-6 text-lg font-semibold">
          <span className="text-blue-600">Question: {questionsCompleted + 1}/{totalQuestions}</span>
          <span className="text-green-600">Score: {score}</span>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300">
        <CardContent className="p-8 text-center">
          <h4 className="text-xl font-bold text-purple-800 mb-6">
            Which color matches this one?
          </h4>
          
          <div 
            className="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-gray-400 shadow-lg"
            style={{ backgroundColor: targetColor }}
          ></div>

          {!showFeedback ? (
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {colorOptions.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleColorSelect(option)}
                  className="h-20 text-lg font-bold text-white shadow-lg hover:scale-105 transition-transform"
                  style={{ backgroundColor: option.color }}
                >
                  {option.name}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-2xl font-bold text-purple-800 animate-fade-in">
              {feedback}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorMatchLevel;
