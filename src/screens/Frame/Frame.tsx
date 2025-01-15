import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { checkGuess, getRandomWord } from "../../lib/words";

export const Frame = (): JSX.Element => {
  const [answer, setAnswer] = useState("");
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initGame = async () => {
      const word = await getRandomWord();
      setAnswer(word);
      setLoading(false);
    };
    initGame();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || loading) return;
      
      if (e.key === "Enter" && currentGuess.length === 5) {
        if (guesses.length >= 6) return;
        
        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess("");

        if (currentGuess === answer) {
          setWon(true);
          setGameOver(true);
        } else if (newGuesses.length === 6) {
          setGameOver(true);
        }
      } else if (e.key === "Backspace") {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (currentGuess.length < 5 && e.key.match(/^[a-zA-Z]$/)) {
        setCurrentGuess(prev => (prev + e.key).toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, gameOver, guesses, answer, loading]);

  const getBackgroundColor = (rowIndex: number, colIndex: number) => {
    if (rowIndex >= guesses.length) return "";
    
    const guess = guesses[rowIndex];
    const results = checkGuess(guess, answer);
    
    switch (results[colIndex]) {
      case "green": return "bg-green";
      case "yellow": return "bg-yellow";
      case "gray": return "bg-gray-400";
      default: return "";
    }
  };

  const getLetter = (rowIndex: number, colIndex: number) => {
    if (rowIndex === guesses.length && currentGuess[colIndex]) {
      return currentGuess[colIndex];
    }
    return guesses[rowIndex]?.[colIndex] || "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-w-[220px] min-h-[284px] p-2.5">
        <Card className="bg-white">
          <CardContent className="flex items-center justify-center p-6">
            Loading...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full min-w-[220px] min-h-[284px] p-2.5">
      <Card className="bg-white">
        <CardContent className="flex flex-col gap-2 p-6">
          {Array(6).fill(null).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {Array(5).fill(null).map((_, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-6 h-6 rounded border-2 border-solid border-[#c2c3c7] flex items-center justify-center text-xs font-bold transition-colors ${
                    getBackgroundColor(rowIndex, colIndex) || "bg-gradient-to-b from-[#f0f0f0] to-[#c2c3c7]"
                  }`}
                >
                  {getLetter(rowIndex, colIndex)}
                </div>
              ))}
            </div>
          ))}

          <div className="relative w-[152px] h-6 mt-2">
            <span className="absolute left-0 top-3 text-[8px] font-normal">
              {gameOver ? (won ? "You won!" : `Answer: ${answer}`) : "Wordle #200"}
            </span>
            <span className="absolute right-0 top-3 text-[8px] font-normal">
              1/5/2022
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
