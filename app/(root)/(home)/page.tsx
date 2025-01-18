"use client";

import Control from "@/components/Control";
import CustomText from "@/components/CustomText";
import { Result } from "@/components/Result";
import Stats from "@/components/Stats";
import Timer from "@/components/Timer";
import { Button } from "@/components/ui/button";
import { calculateStats } from "@/lib/CalculateStats";
import { data } from "@/lib/text";
import { TypingStats } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type modeTye = "show" | "typing" | "result";
const motionProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { type: "spring", duration: 0.3 },
};

export default function Home() {
  const [mode, setMode] = useState<modeTye>("show");

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number>();

  const [text, setText] = useState(data[0]);
  const [inputText, setInputText] = useState("");
  const [showText, setShowText] = useState(text);
  const [length, setLength] = useState(text.length);

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
  const statsRef = useRef(stats);
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  const [arrWps, setArrWps] = useState<{ time: number; wpm: number }[]>([]);

  const shuffle = (max: number, min: number) => {
    restart();
    const something = data[Math.floor(Math.random() * (max - min + 1)) + min];
    setText(something);
    setShowText(something);
    setLength(something.length);
  };

  const handleCustomTextSave = (text: string) => {
    setMode("show");
    restart();
    setText(text.trim());
    setShowText(text.trim());
    setLength(text.length);
  };

  function switchMode(type: modeTye) {
    if (mode === "show" || type === "typing") {
      setMode(type);
    } else if (mode === "typing" && type === "result") {
      setMode(type);
    } else if (mode === "result" && type === "show") {
      setMode(type);
      setArrWps([]);
      clearInterval(timerRef.current);
    }
  }

  const restart = () => {
    switchMode("show");
    setIsStarted(false);
    setInputText("");
    setTimeUsed(0);
    setStats({
      wpm: 0,
      accuracy: 0,
      correct: 0,
      wrong: 0,
    });
    setArrWps([]);
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  useEffect(() => {
    if (isStarted) {
      timerRef.current = window.setInterval(() => {
        setTimeUsed(Date.now() - startTime);
        setArrWps((prev) => {
          const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
          return [...prev, { time: elapsedTime, wpm: statsRef.current.wpm }];
        });
      }, 1000 * 1);
    }
    return () => clearInterval(timerRef.current);
  }, [isStarted, startTime]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setInputText(newText);

    if (!isStarted && newText.length === 1) {
      switchMode("typing");
      setIsStarted(true);
      setStartTime(Date.now());
    }

    const newStats = calculateStats(newText, text, timeUsed || 1);
    setStats(newStats);

    //it will kill the Interval when the text is equal to the target text
    if (newText.length >= text.length) {
      clearInterval(timerRef.current);
    }
    if (inputText.length + 1 === text.length) {
      switchMode("result");
    }
  };
  useEffect(() => inputRef.current?.focus(), []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  font-mono ">
      <div className="w-full max-w-3xl   p-8 pb-20 gap-16 ">
        <motion.div
          {...motionProps}
          className="mb-8 flex justify-between items-center">
          <div className="flex space-x-2">
            <Timer time={timeUsed} />
            {mode === "typing" && (
              <motion.div {...motionProps}>
                <Button
                  className=" bg-gray-800"
                  onClick={() => {
                    clearInterval(timerRef.current);
                    setIsStarted(false);
                    setInputText("");
                  }}>
                  Stop
                </Button>
              </motion.div>
            )}
          </div>
          <Control
            onRestart={restart}
            onShuffle={shuffle}
            onEdit={() => setCustomTextDiv(true)}
          />
        </motion.div>
        {(mode === "show" || mode === "typing") && (
          <motion.div {...motionProps}>
            <div>{length}</div>
            <div className="mb-8 text-xl max-h-[50vh] overflow-y-scroll custom-scrollbar leading-relaxed bg-gray-800 p-6 rounded-lg">
              {showText.split("").map((word, i) => {
                let color = "text-zinc-400";
                if (i < inputText.length) {
                  color =
                    word === inputText[i]
                      ? "text-green-400"
                      : "text-red-400 line-through";
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
          </motion.div>
        )}
        {mode === "typing" && (
          <motion.div {...motionProps}>
            <Stats stats={stats} />
          </motion.div>
        )}
        {mode === "result" && (
          <motion.div {...motionProps}>
            <Stats stats={stats} />
            <Result arrWps={arrWps} />
          </motion.div>
        )}
        {customTextDiv && (
          <CustomText
            onClose={() => setCustomTextDiv(false)}
            onSave={handleCustomTextSave}
            currentText={text}
          />
        )}
      </div>
    </div>
  );
}
