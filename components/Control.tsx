import { Button } from "@/components/ui/button";

const Control = ({
  onRestart,
  onShuffle,
  onEdit,
}: {
  onRestart: () => void;
  onShuffle: () => void;
  onEdit: () => void;
}) => {
  return (
    <div className="space-x-2">
      <Button onClick={onRestart}>Restart</Button>
      <Button onClick={onShuffle}>Shuffle</Button>
      <Button onClick={onEdit}> Custom Text</Button>
    </div>
  );
};

export default Control;
