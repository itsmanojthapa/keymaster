"use client";

import Control from "@/components/Control";
import CustomText from "@/components/CustomText";
import { Result } from "@/components/Result";
import Stats from "@/components/Stats";
import { Button } from "@/components/ui/button";
import { calculateStats } from "@/lib/CalculateStats";
import { data } from "@/lib/text";
import { TypingStats } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import textLength from "@/lib/textLength";

type modeTye = "show" | "typing" | "result";
const motionProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { type: "spring", duration: 0.3 },
};

export default function Type() {
  const [mode, setMode] = useState<modeTye>("show");

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
  const statsRef = useRef(stats);
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  const [arrWps, setArrWps] = useState<{ time: number; wpm: number }[]>([]);

  const shuffle = (max: number, min: number) => {
    restart();
    const something = data[Math.floor(Math.random() * (max - min + 1)) + min];
    setText(something);
  };

  const handleCustomTextSave = (text: string) => {
    setMode("show");
    restart();
    text = text.replace(/\s+/g, " ").trim();
    setText(text);
  };

  function switchMode(type: modeTye) {
    if (mode === "show" || type === "typing") {
    } else if (mode === "typing" && type === "result") {
    } else if (mode === "result" && type === "show") {
      setArrWps([]);
      clearInterval(timerRef.current);
    }
    setMode(type);
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
      const newStats = calculateStats(inputText, text, timeUsed);
      setStats(newStats);
    }
  }, [timeUsed, inputText, isStarted, text]);

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
    <div className="flex flex-col items-center mt-20 font-mono">
      <div className="w-full max-w-3xl p-8 pb-20 gap-16 ">
        <motion.div
          {...motionProps}
          className="mb-8 flex justify-between items-center flex-col sm:flex-row">
          <Control
            onRestart={restart}
            onShuffle={shuffle}
            onEdit={() => setCustomTextDiv(true)}
          />
          <div className="flex space-x-5">
            {mode === "typing" && (
              <motion.div {...motionProps}>
                <Button
                  variant="outline"
                  className="bg-transparent border-zinc-400"
                  onClick={() => {
                    clearInterval(timerRef.current);
                    setIsStarted(false);
                    setInputText("");
                    setMode("result");
                  }}>
                  Stop
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
        {(mode === "show" || mode == "typing") && (
          <motion.div {...motionProps}>
            <i>~ {textLength(text)}</i>
          </motion.div>
        )}
        {(mode === "show" || mode === "typing") && (
          <motion.div
            {...motionProps}
            className="text-xl overflow-auto custom-scrollbar leading-relaxed rounded-lg">
            <div className="relative m-6">
              <div className="flex flex-wrap">
                {inputText.split("").map((word, i) => {
                  let color = "text-zinc-400";
                  if (i < inputText.length) {
                    color =
                      word === text[i]
                        ? "text-teal-400"
                        : "text-red-400 line-through";
                  }
                  if (word === " ") {
                    return (
                      <span key={i} className={`${color} w-3`}>
                        {text[i]}
                      </span>
                    );
                  }
                  return (
                    <span key={i} className={color}>
                      {word}
                    </span>
                  );
                })}
                {text
                  .split("")
                  .slice(inputText.length, text.length)
                  .map((word, i) => {
                    const color = "text-zinc-600";
                    return (
                      <span key={i} className={word === " " ? "w-3" : color}>
                        {word === " " ? "\u00A0" : word}
                      </span>
                    );
                  })}
              </div>
              <input
                ref={inputRef}
                value={inputText}
                type="text"
                placeholder="Start typing..."
                onChange={handleInput}
                className="absolute inset-0 opacity-0 cursor-default w-full h-full resize-none focus:outline-none "
              />
            </div>
          </motion.div>
        )}
        {(mode === "typing" || mode === "result") && (
          <motion.div {...motionProps}>
            <Stats stats={stats} time={timeUsed} />
          </motion.div>
        )}
        {mode === "result" && (
          <motion.div {...motionProps}>
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
