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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Custom Text</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 bg-gray-700 text-gray-300 p-4 rounded-lg resize-none custom-scrollbar  focus:outline-none focus:ring-2 focus:ring-gray-600 font-mono mb-4"
          placeholder="Enter your custom text..."
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomText;
