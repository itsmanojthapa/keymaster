"use client";

import Control from "@/components/Control";
import CustomText from "@/components/CustomText";
import { Result } from "@/components/Result";
import Stats from "@/components/Stats";
import { Button } from "@/components/ui/button";
import { calculateStats } from "@/lib/CalculateStats";
import { data } from "@/lib/text";
import { TimeOption, TypingStats } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import textLength from "@/lib/textLength";
import { Spec } from "@/components/spec";
import { OctagonX } from "lucide-react";

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
  const timerRef = useRef<number>(); //store a mutable value that does not cause a re-render when updated, allows you to persist values between renders.

  const [text, setText] = useState(data[0]);
  const [inputText, setInputText] = useState("");

  const [selectedTime, setSelectedTime] = useState<TimeOption>(15);

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
        // setTimeUsed(Date.now() - startTime);
        const time = Date.now() - startTime;
        setTimeUsed(time);
        setArrWps((prev) => {
          const elapsedTime = Math.floor(time / 1000);
          return [...prev, { time: elapsedTime, wpm: statsRef.current.wpm }];
        });
        if (time >= selectedTime * 1000) {
          clearInterval(timerRef.current);
          setIsStarted(false);
          setMode("result");
        }
      }, 1000 * 1);
    }
    return () => clearInterval(timerRef.current);
  }, [isStarted, startTime, selectedTime]);

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
    <div className="mt-20 flex flex-col items-center font-mono">
      <div className="w-full max-w-3xl gap-16 p-8 pb-20">
        <motion.i {...motionProps}>~ {textLength(text)}</motion.i>

        <motion.div
          {...motionProps}
          className="mx-auto flex w-fit flex-col items-center justify-between space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0"
        >
          <Control
            onRestart={restart}
            onShuffle={shuffle}
            onEdit={() => setCustomTextDiv(true)}
          />
          <Spec setSelectedTime={setSelectedTime} selectedTime={selectedTime} />
        </motion.div>

        {(mode === "show" || mode === "typing") && (
          <motion.div
            {...motionProps}
            className="custom-scrollbar overflow-auto rounded-lg text-xl leading-relaxed"
          >
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
                className="absolute inset-0 h-full w-full cursor-default resize-none opacity-0 focus:outline-none"
              />
            </div>
          </motion.div>
        )}
        {(mode === "typing" || mode === "result") && (
          <motion.div {...motionProps} className="flex flex-col items-center">
            {mode === "typing" && (
              <motion.span
                {...motionProps}
                className="flex w-fit items-center justify-center rounded-full bg-zinc-900/90 px-3 py-2 backdrop-blur-sm"
              >
                <Button
                  className="rounded-full px-3 py-2 text-zinc-400 transition-all duration-200 hover:scale-105 hover:bg-zinc-800 hover:text-white"
                  onClick={() => {
                    clearInterval(timerRef.current);
                    setIsStarted(false);
                    setInputText("");
                    setMode("result");
                  }}
                >
                  <OctagonX />
                </Button>
              </motion.span>
            )}
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
