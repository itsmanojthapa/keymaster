import { TypingStats } from "@/types/types";
import React from "react";
import Timer from "./Timer";

const Stats = ({ stats, time }: { stats: TypingStats; time: number }) => {
  return (
    <div className=" text-lg flex font-mono mt-3 space-x-5 text-center mb-3 flex-col">
      <div>
        Time: <Timer time={time} />s | WPM: {stats.wpm ? stats.wpm : "0"} |
        Accuracy: {stats.accuracy ? stats.accuracy : "0"}%
      </div>
      <div>
        Correct word: {stats.correct} | Wrong Word: {stats.wrong}
      </div>
    </div>
  );
};

export default Stats;
