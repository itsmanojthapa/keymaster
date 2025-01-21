import { Button } from "@/components/ui/button";
import { RotateCw, Edit3, Dices } from "lucide-react";

const Control = ({
  onRestart,
  onShuffle,
  onEdit,
}: {
  onRestart: () => void;
  onShuffle: (max: number, min: number) => void;
  onEdit: () => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-2 rounded-full bg-zinc-900/90 px-3 py-2 backdrop-blur-sm">
      <Button
        className="rounded-full px-3 py-2 text-zinc-400 transition-all duration-200 hover:scale-105 hover:bg-zinc-800 hover:text-white"
        onClick={onRestart}
      >
        <RotateCw className="h-4 w-4" />
        {/* <span className="text-sm font-medium">Restart</span> */}
      </Button>
      <Button
        className="rounded-full px-3 py-2 text-zinc-400 transition-all duration-200 hover:scale-105 hover:bg-zinc-800 hover:text-white"
        onClick={() => onShuffle(0, 14)}
      >
        <Dices />
        <span className="hidden text-sm font-medium hover:inline">Shuffle</span>
      </Button>
      <Button
        className="rounded-full px-3 py-2 text-zinc-400 transition-all duration-200 hover:scale-105 hover:bg-zinc-800 hover:text-white"
        onClick={onEdit}
      >
        <Edit3 className="h-4 w-4" />
        <span className="text-sm font-medium">Edit</span>
      </Button>
    </div>
  );
};

export default Control;
