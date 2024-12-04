import { TypingStats } from "@/types/types";
import React from "react";

const Stats = ({ stats }: { stats: TypingStats }) => {
  return (
    <div className="flex space-x-5 text-center">
      <div>
        <div className="text-3xl">{stats.wpm ? stats.wpm : "0"}</div>
        <div>WPM</div>
      </div>
      <div>
        <div className="text-3xl">{stats.accuracy ? stats.accuracy : "0"}%</div>
        <div>Accuracy</div>
      </div>
      <div>
        <div className="text-3xl">{stats.correct ? stats.wpm : "0"}</div>
        <div>Correct</div>
      </div>
      <div>
        <div className="text-3xl">{stats.wrong ? stats.wrong : "0"}</div>
        <div>Wrong</div>
      </div>
    </div>
  );
};

export default Stats;
