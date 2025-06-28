
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PuzzleLevelProps {
  level: number;
  onComplete: (stars: number) => void;
}

const PuzzleLevel = ({ level, onComplete }: PuzzleLevelProps) => {
  const [pattern, setPattern] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [puzzlesCompleted, setPuzzlesCompleted] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  const totalPuzzles = 5;

  useEffect(() => {
    generatePuzzle();
  }, [level]);

  const generatePuzzle = () => {
    let newPattern: string[] = [];
    let answer = '';
    let puzzleOptions: string[] = [];

    if (level <= 2) {
      // Simple shape patterns
      const shapes = ['🔴', '🔵', '🟢', '🟡'];
      const patternLength = 4;
      const selectedShapes = shapes.slice(0, 2);
      
      for (let i = 0; i < patternLength; i++) {
        newPattern.push(selectedShapes[i % 2]);
      }
      answer = selectedShapes[patternLength % 2];
      puzzleOptions = [...selectedShapes, '🟠', '🟣'];
    } else if (level <= 4) {
      // Number sequences
      const start = Math.floor(Math.random() * 5) + 1;
      const step = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < 4; i++) {
        newPattern.push((start + i * step).toString());
      }
      answer = (start + 4 * step).toString();
      
      // Generate wrong options
      puzzleOptions = [
        answer,
        (start + 3 * step).toString(),
        (start + 5 * step).toString(),
        (start + 6 * step).toString()
      ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
    } else {
      // Complex patterns
      const patterns = [
        { seq: ['🔺', '🔸', '🔺', '🔸'], answer: '🔺' },
        { seq: ['A', 'B', 'C', 'A'], answer: 'B' },
        { seq: ['1', '4', '9', '16'], answer: '25' }, // Square numbers
      ];
      
      const selected = patterns[Math.floor(Math.random() * patterns.length)];
      newPattern = selected.seq;
      answer = selected.answer;
      
      if (selected.answer === '25') {
        puzzleOptions = ['25', '20', '24', '36'];
      } else {
        puzzleOptions = ['🔺', '🔸', '🔴', '🔵'];
      }
    }

    // Shuffle options
    puzzleOptions.sort(() => Math.random() - 0.5);
    
    setPattern(newPattern);
    setUserAnswer('');
    setOptions(puzzleOptions);
    setShowFeedback(false);
  };

  const handleSubmit = (selectedAnswer: string) => {
    setUserAnswer(selectedAnswer);
    
    let correctAnswer = '';
    if (level <= 2) {
      const shapes = ['🔴', '🔵'];
      correctAnswer = shapes[pattern.length % 2];
    } else if (level <= 4) {
      const numbers = pattern.map(p => parseInt(p));
      const step = numbers[1] - numbers[0];
      correctAnswer = (numbers[numbers.length - 1] + step).toString();
    } else {
      if (pattern.includes('🔺')) correctAnswer = '🔺';
      else if (pattern.includes('A')) correctAnswer = 'B';
      else correctAnswer = '25';
    }
    
    const isCorrect = selectedAnswer === correctAnswer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setFeedback('🧩 Excellent! You found the pattern!');
    } else {
      setFeedback(`🤔 The answer was "${correctAnswer}". Great effort!`);
    }
    
    setShowFeedback(true);
    setPuzzlesCompleted(prev => prev + 1);
    
    setTimeout(() => {
      if (puzzlesCompleted + 1 >= totalPuzzles) {
        const stars = correctAnswers >= 4 ? 3 : correctAnswers >= 3 ? 2 : 1;
        onComplete(stars);
      } else {
        generatePuzzle();
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-lg font-semibold text-purple-700 mb-2">
          Puzzle {puzzlesCompleted + 1} of {totalPuzzles}
        </div>
        <div className="bg-green-100 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-500"
            style={{ width: `${(puzzlesCompleted / totalPuzzles) * 100}%` }}
          ></div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-purple-800 mb-4">Find the Pattern!</h3>
            <div className="text-6xl mb-4 space-x-4">
              {pattern.map((item, index) => (
                <span key={index} className="inline-block mx-2">
                  {item}
                </span>
              ))}
              <span className="text-purple-600">→ ?</span>
            </div>
            <div className="text-lg text-purple-600">
              What comes next in the pattern?
            </div>
          </div>
          
          {!showFeedback ? (
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleSubmit(option)}
                  className="h-16 text-3xl bg-white hover:bg-purple-50 text-purple-800 border-2 border-purple-300 hover:border-purple-500"
                >
                  {option}
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

      <div className="text-center text-lg font-semibold text-white">
        Correct Patterns: {correctAnswers}/{puzzlesCompleted}
      </div>
    </div>
  );
};

export default PuzzleLevel;
