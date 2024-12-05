"use client";

import Control from "@/components/Control";
import CustomText from "@/components/CustomText";
import Stats from "@/components/Stats";
import Timer from "@/components/Timer";
import { calculateStats } from "@/lib/CalculateStats";
import { data } from "@/lib/text";
import { TypingStats } from "@/types/types";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number>();

  const [text, setText] = useState(data[0]);
  const [inputText, setInputText] = useState("");
  const [customTextDiv, setCustomTextDiv] = useState(false);
  const [timeUsed, setTimeUsed] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    correct: 0,
    wrong: 0,
  });

  const shuffle = (max: number, min: number) => {
    restart();
    setText(data[Math.floor(Math.random() * (max - min + 1)) + min]);
  };

  const handleCustomTextSave = (text: string) => {
    restart();
    setText(text);
  };

  const restart = () => {
    setIsStarted(false);
    setInputText("");
    setTimeUsed(0);
    setStats({
      wpm: 0,
      accuracy: 0,
      correct: 0,
      wrong: 0,
    });
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (isStarted) {
      timerRef.current = window.setInterval(() => {
        setTimeUsed(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [isStarted, startTime]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setInputText(newText);

    if (!isStarted && newText.length === 1) {
      setIsStarted(true);
      setStartTime(Date.now());
    }

    const newStats = calculateStats(newText, text, timeUsed || 1);
    setStats(newStats);

    //it will kill the Interval when the text is equal to the target text
    if (newText.length >= text.length) {
      clearInterval(timerRef.current);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  font-mono ">
      <div className="w-full max-w-3xl   p-8 pb-20 gap-16 ">
        <div className="mb-8 flex justify-between items-center">
          <Timer time={timeUsed} />
          <Control
            onRestart={restart}
            onShuffle={shuffle}
            onEdit={() => setCustomTextDiv(true)}
          />
        </div>
        <div>{text.length}</div>
        <div className="mb-8 text-xl max-h-[50vh] overflow-y-scroll custom-scrollbar leading-relaxed bg-gray-800 p-6 rounded-lg">
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
            ref={inputRef}
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
        {customTextDiv && (
          <CustomText
            onClose={() => setCustomTextDiv(false)}
            onSave={handleCustomTextSave}
            currentText={text}
          />
        )}
      </div>
      {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Footer
      </footer> */}
    </div>
  );
}
