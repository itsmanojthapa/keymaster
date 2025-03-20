import React from "react";
import { motion } from "framer-motion";
import { motionSet } from "@/lib/motionSet";

const ShowText = ({
  inputText,
  text,
  isFocused,
}: {
  inputText?: string;
  text: string;
  isFocused?: boolean;
}) => {
  return (
    <motion.div
      {...motionSet}
      className="custom-scrollbar overflow-auto rounded-lg font-mono text-xl leading-relaxed"
    >
      <div className="relative m-6">
        <div className="flex flex-wrap">
          {/* {inputText &&
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
                  <span key={i} className={`${color} w-3 border-l-2`}>
                    {text[i]}
                  </span>
                );
              }
              return (
                <span key={i} className={color}>
                  {word}
                </span>
              );
            })} */}
          {text &&
            text
              .split("")
              // .slice(inputText ? inputText.length : 0, text.length)
              .map((word, i) => {
                const isMatch = inputText
                  ? word === inputText.charAt(i)
                  : false;
                return (
                  <span
                    key={i}
                    className={`border-l-2 border-transparent ${word === " " && "w-3"} ${i === inputText?.length && isFocused ? "animate-blink border-teal-500" : ""} ${
                      isMatch
                        ? "text-teal-500"
                        : i < (inputText?.length ?? 0)
                          ? "text-red-500 line-through"
                          : "text-zinc-600"
                    } `}

                    // ${isMatch ? "text-teal-500" : i < inputText?.length ? "" : ""}
                    // ${inputText && inputText.charAt(inputText.length - 1) === word ? "text-teal-500" : ""}
                    // ${i < (inputText ? inputText.length : 0) && "hidden"}
                  >
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

// inputText.charAt(inputText.length - 1) === word
