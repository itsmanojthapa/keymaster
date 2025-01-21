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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg bg-gray-800 p-6">
        <h2 className="mb-4 text-xl font-bold">Custom Text</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="custom-scrollbar mb-4 h-48 w-full resize-none rounded-lg bg-gray-700 p-4 font-mono text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Enter your custom text..."
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded bg-blue-600 px-4 py-2 transition-colors hover:bg-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomText;
