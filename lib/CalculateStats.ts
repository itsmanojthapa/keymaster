export function calculateStats(
  inputText: string,
  text: string,
  timeUsed: number
) {
  let accurateWord = 0;
  let wrongWord = 0;

  const minLength = Math.min(inputText.length, text.length);

  for (let i = 0; i < minLength; i++) {
    if (inputText[i] === text[i]) {
      accurateWord++;
    } else {
      wrongWord++;
    }
  }
  // Add remaining characters as incorrect if typed is longer than target
  //   if (inputText.length > text.length) {
  //     wrongWord += Math.abs(inputText.length - text.length);
  //   }
  if (inputText.length > text.length) {
    wrongWord += Math.abs(inputText.length - text.length);
  }
  console.log(accurateWord, wrongWord);

  const totalChars = inputText.length;
  const minutes = timeUsed / 60000; // Convert ms to minutes
  const wpm = Math.round(accurateWord / 5 / minutes); // Standard WPM calculation
  const accuracy = Math.round((accurateWord / totalChars) * 100) || 0;

  return {
    wpm: wpm,
    accuracy: accuracy,
    correct: accurateWord,
    wrong: wrongWord,
  };
}
