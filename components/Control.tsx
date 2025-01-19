import { Button } from "@/components/ui/button";

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
    <div className="space-x-3 space-y-3">
      <Button className=" bg-gray-800" onClick={onRestart}>
        Restart
      </Button>
      <Button className=" bg-gray-800" onClick={() => onShuffle(0, 14)}>
        Shuffle
      </Button>
      <Button className=" bg-gray-800" onClick={onEdit}>
        Custom Text
      </Button>
    </div>
  );
};

export default Control;
