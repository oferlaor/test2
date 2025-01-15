export const getRandomWord = async (): Promise<string> => {
  try {
    const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
    const [word] = await response.json();
    return word.toUpperCase();
  } catch (error) {
    // Fallback words in case API fails
    const fallbackWords = ["REACT", "BREAK", "STEAM", "FLUTE", "CRANE"];
    return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
  }
};

export const checkGuess = (guess: string, answer: string) => {
  const result = new Array(5).fill("");
  const answerArray = answer.split("");
  const guessArray = guess.split("");

  // Check for correct positions first
  guessArray.forEach((letter, i) => {
    if (letter === answerArray[i]) {
      result[i] = "green";
      answerArray[i] = null;
    }
  });

  // Check for existing letters in wrong positions
  guessArray.forEach((letter, i) => {
    if (result[i] !== "green" && answerArray.includes(letter)) {
      result[i] = "yellow";
      answerArray[answerArray.indexOf(letter)] = null;
    } else if (result[i] !== "green") {
      result[i] = "gray";
    }
  });

  return result;
};
