
import { useState, useEffect } from 'react';

interface ShibuKuttanProps {
  dialogue: string;
  mood?: 'happy' | 'excited' | 'thinking' | 'celebrating';
}

const ShibuKuttan = ({ dialogue, mood = 'happy' }: ShibuKuttanProps) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    setBounce(true);
    const timer = setTimeout(() => setBounce(false), 600);
    return () => clearTimeout(timer);
  }, [dialogue]);

  const getMoodEmoji = () => {
    switch (mood) {
      case 'excited': return '🤗';
      case 'thinking': return '🤔';
      case 'celebrating': return '🎉';
      default: return '😊';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Shibu Kuttan Character */}
      <div className={`relative transition-all duration-300 ${bounce ? 'animate-bounce' : ''}`}>
        <div className="w-32 h-32 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full border-4 border-orange-600 flex items-center justify-center shadow-lg">
          {/* Face */}
          <div className="relative">
            {/* Eyes */}
            <div className="flex space-x-3 mb-2">
              <div className={`w-4 h-4 bg-black rounded-full transition-all duration-150 ${isBlinking ? 'h-1' : ''}`}></div>
              <div className={`w-4 h-4 bg-black rounded-full transition-all duration-150 ${isBlinking ? 'h-1' : ''}`}></div>
            </div>
            {/* Nose */}
            <div className="w-2 h-2 bg-black rounded-full mx-auto mb-2"></div>
            {/* Mouth */}
            <div className="w-8 h-4 border-b-4 border-black rounded-full"></div>
          </div>
        </div>
        {/* Ears */}
        <div className="absolute -top-2 -left-4 w-8 h-12 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full border-2 border-orange-600 transform -rotate-12"></div>
        <div className="absolute -top-2 -right-4 w-8 h-12 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full border-2 border-orange-600 transform rotate-12"></div>
      </div>

      {/* Speech Bubble */}
      <div className="mt-4 bg-white rounded-lg p-4 shadow-lg max-w-md relative animate-fade-in">
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
        <p className="text-center text-purple-800 font-semibold text-lg">
          {getMoodEmoji()} {dialogue}
        </p>
      </div>
    </div>
  );
};

export default ShibuKuttan;
