import { TypingStats } from "@/types/types";
import React from "react";
import Timer from "./Timer";

const Stats = ({ stats, time }: { stats: TypingStats; time: number }) => {
  return (
    <div className="mb-3 mt-3 flex flex-col space-x-5 text-center font-mono text-lg">
      <div>
        Time: <Timer time={time} />s | WPM: {stats.wpm ? stats.wpm : "0"} |
        Accuracy: {stats.accuracy ? stats.accuracy : "0"}%
      </div>
      <div>
        Correct Characters: {stats.correct} | Wrong Characters: {stats.wrong}
      </div>
    </div>
  );
};

export default Stats;
