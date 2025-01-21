import { useState } from "react";
import { Clock, Type } from "lucide-react";
import { cn } from "@/lib/utils";

type TimeOption = 15 | 30;
type WordOption = 10 | 25 | 50;

export function Spec() {
  const [selectedTime, setSelectedTime] = useState<TimeOption>(15);
  const [selectedWords, setSelectedWords] = useState<WordOption>(25);
  const [activeTab, setActiveTab] = useState<"time" | "words">("time");

  return (
    <div className="flex items-center justify-between rounded-full bg-zinc-900/90 px-3 py-2 backdrop-blur-sm">
      {/* Tabs: Time & Words */}
      <button
        onClick={() => setActiveTab("time")}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 hover:scale-105",
          activeTab === "time"
            ? "bg-zinc-800 text-white"
            : "text-zinc-400 hover:text-zinc-300",
        )}
      >
        <Clock className="h-4 w-4" />
        <span className="text-sm font-medium">time</span>
      </button>
      <button
        onClick={() => setActiveTab("words")}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 hover:scale-105",
          activeTab === "words"
            ? "bg-zinc-800 text-white"
            : "text-zinc-400 hover:text-zinc-300",
        )}
      >
        <Type className="h-4 w-4" />
        <span className="text-sm font-medium">words</span>
      </button>

      {/* Divider */}
      <div className="mx-2 h-6 w-px bg-zinc-700" />

      {/* Options: Time or Words */}
      <div className="flex items-center">
        {activeTab === "time" ? (
          <div className="flex gap-1 px-1">
            {[15, 30].map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time as TimeOption)}
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 hover:scale-105",
                  selectedTime === time
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-zinc-300",
                )}
              >
                {time}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-1 px-1">
            {[10, 25, 50].map((count) => (
              <button
                key={count}
                onClick={() => setSelectedWords(count as WordOption)}
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 hover:scale-105",
                  selectedWords === count
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-zinc-300",
                )}
              >
                {count}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
