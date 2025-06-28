
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MemoryMatchLevelProps {
  level: number;
  onComplete: (stars: number) => void;
}

const MemoryMatchLevel = ({ level, onComplete }: MemoryMatchLevelProps) => {
  const [cards, setCards] = useState<Array<{ id: number; emoji: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const emojis = ['🐶', '🐱', '🐸', '🦋', '🌟', '🎈', '🍎', '🌈', '🚗', '⚽', '🎨', '🎵'];

  useEffect(() => {
    initializeGame();
  }, [level]);

  const initializeGame = () => {
    const pairCount = Math.min(4 + level, 8); // Start with 4 pairs, max 8
    const gameEmojis = emojis.slice(0, pairCount);
    const cardPairs = [...gameEmojis, ...gameEmojis];
    
    // Shuffle cards
    const shuffledCards = cardPairs
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false
      }))
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStarted(true);
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    if (cards[cardId].flipped || cards[cardId].matched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    const newCards = cards.map(card => 
      card.id === cardId ? { ...card, flipped: true } : card
    );
    setCards(newCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards[firstId];
      const secondCard = newCards[secondId];

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, matched: true } 
              : card
          ));
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, flipped: false } 
              : card
          ));
          setFlippedCards([]);
        }, 1500);
      }
    }
  };

  useEffect(() => {
    const totalPairs = cards.length / 2;
    if (matchedPairs === totalPairs && totalPairs > 0) {
      const stars = moves <= totalPairs + 2 ? 3 : moves <= totalPairs + 4 ? 2 : 1;
      setTimeout(() => onComplete(stars), 1000);
    }
  }, [matchedPairs, cards.length, moves]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-700 mb-2">Memory Match</h3>
        <p className="text-lg text-purple-600 mb-4">Find all the matching pairs!</p>
        <div className="flex justify-center space-x-6 text-lg font-semibold">
          <span className="text-blue-600">Moves: {moves}</span>
          <span className="text-green-600">Pairs: {matchedPairs}/{cards.length / 2}</span>
        </div>
      </div>

      <div className={`grid gap-4 mx-auto max-w-2xl ${
        cards.length <= 12 ? 'grid-cols-4' : 'grid-cols-4 md:grid-cols-6'
      }`}>
        {cards.map((card) => (
          <Card
            key={card.id}
            className={`aspect-square cursor-pointer transition-all duration-300 ${
              card.flipped || card.matched
                ? 'bg-white border-blue-400'
                : 'bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700'
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            <CardContent className="p-0 h-full flex items-center justify-center">
              {card.flipped || card.matched ? (
                <span className="text-4xl">{card.emoji}</span>
              ) : (
                <span className="text-2xl text-white">?</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {!gameStarted && (
        <div className="text-center">
          <Button
            onClick={initializeGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold text-xl px-8 py-4"
          >
            Start Game!
          </Button>
        </div>
      )}
    </div>
  );
};

export default MemoryMatchLevel;
