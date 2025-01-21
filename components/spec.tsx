import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimeOption } from "@/types/types";

export function Spec({
  selectedTime,
  setSelectedTime,
}: {
  selectedTime: TimeOption;
  setSelectedTime: (time: TimeOption) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between rounded-full bg-zinc-900/90 px-3 py-2 backdrop-blur-sm">
        {/* Tabs: Time & Words */}
        <button
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 hover:scale-105",
            "bg-zinc-800 text-white",
            // "text-zinc-400 hover:text-zinc-300",
          )}
        >
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">time</span>
        </button>
        {/* Divider */}
        <div className="mx-2 h-6 w-px bg-zinc-700" />
        <div className="flex items-center">
          <div className="flex gap-1 px-1">
            {[15, 30, 60, 120].map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time as TimeOption)}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 hover:scale-105",
                  selectedTime === time
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-zinc-300",
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
