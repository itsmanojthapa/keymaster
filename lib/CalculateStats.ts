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

  const totalChars = inputText.length; // Total characters typed
  const minutes = timeUsed / 60000; // Convert ms to minutes

  // Prevent unrealistic small minute values to prevent 12000 WPM ERROR for first character
  const safeMinutes = minutes > 0.01 ? minutes : 0.01; // Set a minimum value of 0.01 minutes

  // Calculate WPM (Words Per Minute) as per standard formula
  const wpm = Math.round(accurateWord / 5 / safeMinutes);

  // Calculate Accuracy (Safe Calculation)
  const accuracy =
    totalChars > 0 ? Math.round((accurateWord / totalChars) * 100) : 0;

  // console.log({
  //   totalChars,
  //   accurateWord,
  //   timeUsed,
  //   minutes,
  //   safeMinutes,
  //   wpm,
  //   accuracy,
  // });

  return {
    wpm: wpm,
    accuracy: accuracy,
    correct: accurateWord,
    wrong: wrongWord,
  };
}
