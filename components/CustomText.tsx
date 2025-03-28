import React, { useState } from "react";

const CustomText = ({
  onSave,
  onClose,
  currentText,
}: {
  onSave: (e: string) => void;
  onClose: () => void;
  currentText: string;
}) => {
  const [text, setText] = useState(currentText);
  const handleSave = () => {
    onSave(text);
    onClose();
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg bg-zinc-900 p-6 text-zinc-200">
        <h2 className="mb-4 text-xl font-bold">Custom Text</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="custom-scrollbar mb-4 h-48 w-full resize-none rounded-lg bg-zinc-800 p-4 font-mono focus:outline-none focus:ring-2 focus:ring-zinc-600"
          placeholder="Enter your custom text..."
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded bg-zinc-700 px-4 py-2 font-semibold transition-colors hover:bg-zinc-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded bg-teal-700 px-4 py-2 font-semibold transition-colors hover:bg-teal-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomText;
