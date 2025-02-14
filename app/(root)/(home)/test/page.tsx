import Pcr from "@/components/Pcr";
import { Card } from "@/components/ui/card";
import { TypeUser } from "@/types/types";
import React from "react";

const Page = () => {
  const result: TypeUser[] = [
    {
      id: "11111",
      status: "active",
      inputText: "Hello World ",
      inputLength: 0,
      resultData: { wpm: 50, accuracy: 100, correct: 45, wrong: 5 },
    },
    {
      id: "22222",
      status: "active",
      inputText: "Hello World ",
      inputLength: 0,
      resultData: { wpm: 50, accuracy: 100, correct: 45, wrong: 5 },
    },
    {
      id: "3333333",
      status: "active",
      inputText: "Hello World ",
      inputLength: 0,
      resultData: { wpm: 50, accuracy: 100, correct: 45, wrong: 5 },
    },
  ];
  return (
    <div>
      <Card className="w-fit border-zinc-800/50 bg-zinc-900/50 p-4 shadow-xl backdrop-blur-sm">
        {result?.map((user, i) => {
          return user.status === "active" ? (
            <Pcr user={user} key={i} time={25} />
          ) : (
            <div className="hidden" key={i}></div>
          );
        })}
      </Card>
    </div>
  );
};

export default Page;
