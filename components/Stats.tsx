import React from "react";

const Stats = ({
  wpm,
  accuracy,
  correct,
  wrong,
}: {
  wpm: number;
  accuracy: number;
  correct: number;
  wrong: number;
}) => {
  return (
    <div className="flex space-x-5 text-center">
      <div>
        <div className="text-3xl">{wpm ? wpm : "0"}</div>
        <div>WPM</div>
      </div>
      <div>
        <div className="text-3xl">{accuracy ? accuracy : "0"}%</div>
        <div>Accuracy</div>
      </div>
      <div>
        <div className="text-3xl">{correct ? wpm : "0"}</div>
        <div>Correct</div>
      </div>
      <div>
        <div className="text-3xl">{wrong ? wrong : "0"}</div>
        <div>Wrong</div>
      </div>
    </div>
  );
};

export default Stats;
