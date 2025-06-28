
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WordLevelProps {
  level: number;
  onComplete: (stars: number) => void;
}

const WordLevel = ({ level, onComplete }: WordLevelProps) => {
  const [currentWord, setCurrentWord] = useState({ word: '', scrambled: '', hint: '' });
  const [userAnswer, setUserAnswer] = useState('');
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const totalWords = 5;

  const wordLists = {
    easy: [
      { word: 'cat', hint: '🐱 A furry pet that says meow' },
      { word: 'dog', hint: '🐶 A loyal pet that barks' },
      { word: 'sun', hint: '☀️ Bright yellow thing in the sky' },
      { word: 'car', hint: '🚗 Something you drive on roads' },
      { word: 'hat', hint: '👒 You wear this on your head' }
    ],
    medium: [
      { word: 'house', hint: '🏠 Where you live with your family' },
      { word: 'happy', hint: '😊 When you feel joyful and glad' },
      { word: 'green', hint: '🌿 The color of grass and leaves' },
      { word: 'water', hint: '💧 You drink this when thirsty' },
      { word: 'music', hint: '🎵 Sounds that make songs' }
    ],
    hard: [
      { word: 'elephant', hint: '🐘 Large gray animal with a trunk' },
      { word: 'rainbow', hint: '🌈 Colorful arc in the sky after rain' },
      { word: 'butterfly', hint: '🦋 Colorful insect with wings' },
      { word: 'chocolate', hint: '🍫 Sweet brown treat' },
      { word: 'adventure', hint: '🗺️ An exciting journey or experience' }
    ]
  };

  useEffect(() => {
    generateWord();
  }, [level]);

  const scrambleWord = (word: string) => {
    const chars = word.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
  };

  const generateWord = () => {
    let wordList;
    if (level <= 2) wordList = wordLists.easy;
    else if (level <= 4) wordList = wordLists.medium;
    else wordList = wordLists.hard;

    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    const scrambled = scrambleWord(randomWord.word);
    
    setCurrentWord({
      word: randomWord.word,
      scrambled: scrambled === randomWord.word ? scrambleWord(randomWord.word) : scrambled,
      hint: randomWord.hint
    });
    setUserAnswer('');
    setShowFeedback(false);
  };

  const handleSubmit = () => {
    const isCorrect = userAnswer.toLowerCase() === currentWord.word.toLowerCase();
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setFeedback('🎉 Perfect! You unscrambled it!');
    } else {
      setFeedback(`💡 The word was "${currentWord.word}". Keep practicing!`);
    }
    
    setShowFeedback(true);
    setWordsCompleted(prev => prev + 1);
    
    setTimeout(() => {
      if (wordsCompleted + 1 >= totalWords) {
        const stars = correctAnswers >= 4 ? 3 : correctAnswers >= 3 ? 2 : 1;
        onComplete(stars);
      } else {
        generateWord();
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-lg font-semibold text-purple-700 mb-2">
          Word {wordsCompleted + 1} of {totalWords}
        </div>
        <div className="bg-green-100 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-500"
            style={{ width: `${(wordsCompleted / totalWords) * 100}%` }}
          ></div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-green-800 mb-4">Unscramble the Word!</h3>
            <div className="text-5xl font-bold text-green-700 mb-4 tracking-wider">
              {currentWord.scrambled.toUpperCase()}
            </div>
            <div className="text-lg text-green-600 bg-white bg-opacity-50 rounded-lg p-3">
              Hint: {currentWord.hint}
            </div>
          </div>
          
          {!showFeedback ? (
            <div className="space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="text-3xl text-center w-64 h-16 border-4 border-green-400 rounded-lg font-bold"
                placeholder="Type the word..."
              />
              <div>
                <Button
                  onClick={handleSubmit}
                  disabled={!userAnswer.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl px-8 py-4"
                >
                  Check Word!
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-purple-800 animate-fade-in">
              {feedback}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-lg font-semibold text-white">
        Correct Words: {correctAnswers}/{wordsCompleted}
      </div>
    </div>
  );
};

export default WordLevel;
