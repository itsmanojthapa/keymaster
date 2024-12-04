"use client";

import Control from "@/components/Control";
import CustomText from "@/components/CustomText";
import Stats from "@/components/Stats";
import Timer from "@/components/Timer";
import { TypingStats } from "@/types/types";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState(
    "now his at not people on than want some at the work and make well would only what two these I there do only these and if then into he but people me work take have could if it what well an well see they by and do good"
  );
  const [inputText, setInputText] = useState("");
  const [customText, setCustomText] = useState(false);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    correct: 0,
    wrong: 0,
  });

  const restart = () => {};
  const shuffle = () => {};
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  font-mono">
      <div className="w-full max-w-3xl bg-slate-600  p-8 pb-20 gap-16">
        <div className="mb-8 flex justify-between items-center">
          <Timer time={Date.now() - 1733336433798} />
          <Control
            onRestart={restart}
            onShuffle={shuffle}
            onEdit={() => setCustomText(true)}
          />
        </div>
        <div>{text.length}</div>
        <div className="mb-8 text-xl leading-relaxed bg-gray-800 p-6 rounded-lg">
          {text.split("").map((word, i) => {
            let color = "text-zinc-400";
            if (i < inputText.length) {
              color = word === inputText[i] ? "text-green-400" : "text-red-400";
            }
            return (
              <span key={i} className={color}>
                {word}
              </span>
            );
          })}
        </div>
        <div className="mb-8">
          <input
            value={inputText}
            type="text"
            placeholder="Start typing..."
            onChange={handleInput}
            className="w-full h-24 bg-gray-800 p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
        <div>
          <Stats stats={stats} />
        </div>
        <CustomText />
      </div>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Footer
      </footer>
    </div>
  );
}
