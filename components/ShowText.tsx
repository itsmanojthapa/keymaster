import React from "react";
import { motion } from "framer-motion";
import { motionSet } from "@/lib/motionSet";

const ShowText = ({
  inputText,
  text,
}: {
  inputText?: string;
  text: string;
}) => {
  return (
    <motion.div
      {...motionSet}
      className="custom-scrollbar overflow-auto rounded-lg text-xl leading-relaxed"
    >
      <div className="relative m-6">
        <div className="flex flex-wrap">
          {inputText &&
            inputText.split("").map((word, i) => {
              let color = "text-zinc-400";
              if (i < inputText.length) {
                color =
                  word === text[i]
                    ? "text-teal-500"
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
          {text &&
            text
              .split("")
              .slice(inputText ? inputText.length : 0, text.length)
              .map((word, i) => {
                const color = "text-zinc-600";
                return (
                  <span key={i} className={word === " " ? "w-3" : color}>
                    {word === " " ? "\u00A0" : word}
                  </span>
                );
              })}
        </div>
      </div>
    </motion.div>
  );
};

export default ShowText;
