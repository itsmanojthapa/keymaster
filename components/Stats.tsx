import { TypingStats } from "@/types/types";
import React from "react";
import Timer from "./Timer";

const Stats = ({ stats, time }: { stats: TypingStats; time: number }) => {
  return (
    <div className="mb-3 mt-3 flex flex-col space-x-5 text-center font-mono text-lg">
      <div>
        Time: {""}
        <span>
          <Timer time={time} />s{" "}
        </span>
        | WPM:{" "}
        <span className="text-teal-400"> {stats.wpm ? stats.wpm : "0"} </span>|
        Accuracy:
        <span
          className={`${stats.accuracy === 100 ? "text-teal-400" : "text-red-400"}`}
        >
          {" "}
          {stats.accuracy ? stats.accuracy : "0"}%
        </span>
      </div>
      <div>
        Correct Characters:
        <span className="text-teal-400"> {stats.correct}</span> | Wrong
        Characters:{" "}
        <span
          className={`${stats.wrong === 0 ? "text-teal-400" : "text-red-400"}`}
        >
          {stats.wrong}
        </span>
      </div>
    </div>
  );
};

export default Stats;
