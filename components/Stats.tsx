import { TypingStats } from "@/types/types";
import React from "react";

const Stats = ({ stats }: { stats: TypingStats }) => {
  return (
    <div className="flex space-x-5 text-center mb-3">
      <div>
        <div className="text-3xl">{stats.wpm ? stats.wpm : "0"}</div>
        <div className="underline">WPM</div>
      </div>
      <div>
        <div className="text-3xl">{stats.accuracy ? stats.accuracy : "0"}%</div>
        <div className="underline">Accuracy</div>
      </div>
      <div>
        <div className="text-3xl">{stats.correct ? stats.correct : "0"}</div>
        <div className="underline">Correct Word</div>
      </div>
      <div>
        <div className="text-3xl">{stats.wrong ? stats.wrong : "0"}</div>
        <div className="underline">Wrong Word</div>
      </div>
    </div>
  );
};

export default Stats;
