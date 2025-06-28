
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MathLevelProps {
  level: number;
  onComplete: (stars: number) => void;
}

const MathLevel = ({ level, onComplete }: MathLevelProps) => {
  const [currentProblem, setCurrentProblem] = useState({ num1: 0, num2: 0, operation: '+', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [problemsCompleted, setProblemsCompleted] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const totalProblems = 5;

  useEffect(() => {
    generateProblem();
  }, [level]);

  const generateProblem = () => {
    let num1, num2, operation, answer;
    
    if (level <= 2) {
      // Easy addition/subtraction (1-10)
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      operation = Math.random() < 0.7 ? '+' : '-';
      if (operation === '-' && num2 > num1) {
        [num1, num2] = [num2, num1]; // Ensure positive result
      }
      answer = operation === '+' ? num1 + num2 : num1 - num2;
    } else if (level <= 4) {
      // Medium problems (1-20)
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      const operations = ['+', '-', '×'];
      operation = operations[Math.floor(Math.random() * operations.length)];
      
      if (operation === '+') answer = num1 + num2;
      else if (operation === '-') {
        if (num2 > num1) [num1, num2] = [num2, num1];
        answer = num1 - num2;
      } else {
        answer = num1 * num2;
      }
    } else {
      // Hard problems
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      const operations = ['+', '-', '×', '÷'];
      operation = operations[Math.floor(Math.random() * operations.length)];
      
      if (operation === '÷') {
        answer = Math.floor(Math.random() * 12) + 1;
        num1 = answer * num2; // Ensure clean division
      } else if (operation === '+') answer = num1 + num2;
      else if (operation === '-') {
        if (num2 > num1) [num1, num2] = [num2, num1];
        answer = num1 - num2;
      } else {
        answer = num1 * num2;
      }
    }
    
    setCurrentProblem({ num1, num2, operation, answer });
    setUserAnswer('');
    setShowFeedback(false);
  };

  const handleSubmit = () => {
    const isCorrect = parseInt(userAnswer) === currentProblem.answer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setFeedback('🎉 Correct! Great job!');
    } else {
      setFeedback(`😊 Not quite! The answer is ${currentProblem.answer}. Keep trying!`);
    }
    
    setShowFeedback(true);
    setProblemsCompleted(prev => prev + 1);
    
    setTimeout(() => {
      if (problemsCompleted + 1 >= totalProblems) {
        const stars = correctAnswers >= 4 ? 3 : correctAnswers >= 3 ? 2 : 1;
        onComplete(stars);
      } else {
        generateProblem();
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-lg font-semibold text-purple-700 mb-2">
          Problem {problemsCompleted + 1} of {totalProblems}
        </div>
        <div className="bg-green-100 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-500"
            style={{ width: `${(problemsCompleted / totalProblems) * 100}%` }}
          ></div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300">
        <CardContent className="p-8 text-center">
          <div className="text-6xl font-bold text-blue-800 mb-8">
            {currentProblem.num1} {currentProblem.operation} {currentProblem.num2} = ?
          </div>
          
          {!showFeedback ? (
            <div className="space-y-4">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="text-4xl text-center w-32 h-16 border-4 border-blue-400 rounded-lg font-bold"
                placeholder="?"
              />
              <div>
                <Button
                  onClick={handleSubmit}
                  disabled={!userAnswer}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold text-xl px-8 py-4"
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

      <div className="text-center text-lg font-semibold text-white">
        Correct Answers: {correctAnswers}/{problemsCompleted}
      </div>
    </div>
  );
};

export default MathLevel;
