
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CountLearnLevelProps {
  level: number;
  onComplete: (stars: number) => void;
}

const CountLearnLevel = ({ level, onComplete }: CountLearnLevelProps) => {
  const [objects, setObjects] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionType, setQuestionType] = useState<'count' | 'add' | 'subtract'>('count');

  const totalQuestions = 6;
  const objectEmojis = ['🍎', '🌟', '🎈', '🐶', '🚗', '🎾', '🍌', '🦋', '🌸', '🎁'];

  useEffect(() => {
    generateQuestion();
  }, [level]);

  const generateQuestion = () => {
    if (level <= 2) {
      // Simple counting (1-10)
      generateCountingQuestion(1, 10);
    } else if (level <= 4) {
      // Counting or simple addition (1-15)
      if (Math.random() < 0.7) {
        generateCountingQuestion(5, 15);
      } else {
        generateAdditionQuestion(1, 10);
      }
    } else {
      // Mix of counting, addition, and subtraction
      const rand = Math.random();
      if (rand < 0.4) {
        generateCountingQuestion(10, 20);
      } else if (rand < 0.7) {
        generateAdditionQuestion(1, 15);
      } else {
        generateSubtractionQuestion(5, 15);
      }
    }
    
    setUserAnswer('');
    setShowFeedback(false);
  };

  const generateCountingQuestion = (min: number, max: number) => {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const emoji = objectEmojis[Math.floor(Math.random() * objectEmojis.length)];
    
    setObjects(Array(count).fill(emoji));
    setCorrectAnswer(count);
    setQuestionType('count');
  };

  const generateAdditionQuestion = (min: number, max: number) => {
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    const emoji1 = objectEmojis[Math.floor(Math.random() * objectEmojis.length)];
    const emoji2 = objectEmojis[Math.floor(Math.random() * objectEmojis.length)];
    
    const group1 = Array(num1).fill(emoji1);
    const group2 = Array(num2).fill(emoji2);
    
    setObjects([...group1, '➕', ...group2]);
    setCorrectAnswer(num1 + num2);
    setQuestionType('add');
  };

  const generateSubtractionQuestion = (min: number, max: number) => {
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min + 5;
    const num2 = Math.floor(Math.random() * Math.min(num1, max - min + 1)) + min;
    const emoji = objectEmojis[Math.floor(Math.random() * objectEmojis.length)];
    
    const totalObjects = Array(num1).fill(emoji);
    const crossedOut = Array(num2).fill('❌');
    
    setObjects([...totalObjects, '➖', ...crossedOut]);
    setCorrectAnswer(num1 - num2);
    setQuestionType('subtract');
  };

  const handleSubmit = () => {
    const isCorrect = parseInt(userAnswer) === correctAnswer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setFeedback(`🎉 Correct! The answer is ${correctAnswer}!`);
    } else {
      setFeedback(`💡 Not quite! The correct answer is ${correctAnswer}. Keep trying!`);
    }
    
    setShowFeedback(true);
    setQuestionsCompleted(prev => prev + 1);
    
    setTimeout(() => {
      if (questionsCompleted + 1 >= totalQuestions) {
        const stars = correctAnswers >= 5 ? 3 : correctAnswers >= 3 ? 2 : 1;
        onComplete(stars);
      } else {
        generateQuestion();
      }
    }, 2000);
  };

  const getQuestionText = () => {
    switch (questionType) {
      case 'count':
        return 'How many objects do you see?';
      case 'add':
        return 'Count all the objects together!';
      case 'subtract':
        return 'How many objects are left?';
      default:
        return 'Count the objects!';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-700 mb-2">Count & Learn</h3>
        <p className="text-lg text-purple-600 mb-4">Count objects and learn numbers!</p>
        <div className="flex justify-center space-x-6 text-lg font-semibold">
          <span className="text-blue-600">Question: {questionsCompleted + 1}/{totalQuestions}</span>
          <span className="text-green-600">Correct: {correctAnswers}</span>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300">
        <CardContent className="p-8 text-center">
          <h4 className="text-xl font-bold text-purple-800 mb-6">
            {getQuestionText()}
          </h4>
          
          <div className="bg-white rounded-lg p-6 mb-6 min-h-[200px] flex flex-wrap items-center justify-center gap-2">
            {objects.map((obj, index) => (
              <span key={index} className="text-4xl m-1">
                {obj}
              </span>
            ))}
          </div>

          {!showFeedback ? (
            <div className="space-y-4">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="text-4xl text-center w-32 h-16 border-4 border-green-400 rounded-lg font-bold"
                placeholder="?"
                min="0"
              />
              <div>
                <Button
                  onClick={handleSubmit}
                  disabled={!userAnswer}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl px-8 py-4"
                >
                  Check Answer!
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
    </div>
  );
};

export default CountLearnLevel;
