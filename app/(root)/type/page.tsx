"use client";

import Control from "@/components/Control";
import CustomText from "@/components/CustomText";
import { Result } from "@/components/Result";
import Stats from "@/components/Stats";
import { Button } from "@/components/ui/button";
import { calculateStats } from "@/lib/CalculateStats";
import { data } from "@/lib/text";
import { TypeTimeOption, TypeTypingStats } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import textLength from "@/lib/textLength";
import { Spec } from "@/components/spec";
import { OctagonX } from "lucide-react";
import { motionSet } from "@/lib/motionSet";
import ShowText from "@/components/ShowText";

type modeTye = "show" | "typing" | "result";

export default function Type() {
  const [mode, setMode] = useState<modeTye>("show");

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number>(); //store a mutable value that does not cause a re-render when updated, allows you to persist values between renders.

  const [text, setText] = useState(data[0]);
  const [inputText, setInputText] = useState("");

  const [selectedTime, setSelectedTime] = useState<TypeTimeOption>(15);

  const [customTextDiv, setCustomTextDiv] = useState(false);
  const [timeUsed, setTimeUsed] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("focus", handleFocus);
      inputElement.addEventListener("blur", handleBlur);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("focus", handleFocus);
        inputElement.removeEventListener("blur", handleBlur);
      }
    };
  }, [inputRef]);

  const [stats, setStats] = useState<TypeTypingStats>({
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault(); // Block backspace and delete
    }
    if (inputText.length === 0 && e.key === " ") {
      e.preventDefault();
    }

    if (text.charAt(inputText.length) === " " && e.key === " ") {
      return;
    }
    if (inputText.charAt(inputText.length - 2) === " " && e.key === " ") {
      e.preventDefault();
    }
  };

  useEffect(() => inputRef.current?.focus(), []);
  return (
    <div className="pt-16 sm:pt-24">
      <div className="mx-auto w-full max-w-5xl gap-16 p-8 pb-20">
        <motion.i {...motionSet}>~ {textLength(text)}</motion.i>

        <motion.div
          {...motionSet}
          className="mx-auto mt-3 flex w-fit flex-col items-center justify-between space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0"
        >
          <Control
            onRestart={restart}
            onShuffle={shuffle}
            onEdit={() => setCustomTextDiv(true)}
          />
          <Spec setSelectedTime={setSelectedTime} selectedTime={selectedTime} />
        </motion.div>

        {(mode === "show" || mode === "typing") && (
          <div className="relative">
            <ShowText inputText={inputText} text={text} isFocused={isFocused} />
            <input
              ref={inputRef}
              value={inputText}
              type="text"
              placeholder="Start typing..."
              onChange={handleInput}
              className="absolute inset-0 h-full w-full cursor-default resize-none opacity-0 focus:outline-none"
              onKeyDown={handleKeyDown} // Prevents Backspace
            />
          </div>
        )}
        {(mode === "typing" || mode === "result") && (
          <motion.div {...motionSet} className="flex flex-col items-center">
            {mode === "typing" && (
              <motion.span
                {...motionSet}
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
          <motion.div {...motionSet} className="mx-auto max-w-2xl">
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
