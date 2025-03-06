"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StartTypingButton from "@/components/StartTypingButton";
import Link from "next/link";

type Player = {
  username: string;
  wps: number;
  time: string;
  accuracy: number;
};

const leaderboard: Player[] = [
  { username: "FastTyper", wps: 12.5, time: "60s", accuracy: 98 },
  { username: "SpeedDemon", wps: 11.8, time: "60s", accuracy: 97 },
  { username: "Lightning", wps: 11.2, time: "60s", accuracy: 96 },
  { username: "KeyBlazer", wps: 10.9, time: "60s", accuracy: 95 },
  { username: "TypeStorm", wps: 10.5, time: "60s", accuracy: 94 },
  { username: "RapidFingers", wps: 10.2, time: "60s", accuracy: 93 },
  { username: "TurboKeys", wps: 10.0, time: "60s", accuracy: 92 },
  { username: "SwiftTyper", wps: 9.8, time: "60s", accuracy: 91 },
  { username: "BlazingSpeed", wps: 9.5, time: "60s", accuracy: 90 },
  { username: "QuickHands", wps: 9.3, time: "60s", accuracy: 89 },
];

const Leaderboard = () => {
  return (
    <div className="flex flex-col items-center">
      LeaderBoard
      <div className="w-full max-w-3xl gap-16 p-8 pb-20">
        <Table>
          <TableCaption>Leaderboard </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>WPS</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Accuracy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((player, i) => (
              <TableRow
                key={i + 1}
                className="cursor-pointer hover:bg-zinc-800"
              >
                <TableCell>
                  {i + 1 === 1
                    ? "🥇"
                    : i + 1 === 2
                      ? "🥈"
                      : i + 1 === 3
                        ? "🥉"
                        : i + 1}
                </TableCell>
                <TableCell>{player.username}</TableCell>
                <TableCell>{player.wps}</TableCell>
                <TableCell>{player.time}</TableCell>
                <TableCell className="text-right">{player.accuracy}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Link href="/type">
          <StartTypingButton />
        </Link>
      </div>
    </div>
  );
};

// export function Leaderboard() {
//   const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

//   return (
//     <div className="rounded-xl bg-zinc-900 p-6 text-white shadow-lg">
//       <h2 className="mb-4 text-2xl font-bold text-teal-400">Leaderboard</h2>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="text-teal-300">Rank</TableHead>
//             <TableHead className="text-teal-300">Username</TableHead>
//             <TableHead className="text-teal-300">WPS</TableHead>
//             <TableHead className="text-teal-300">Time</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {leaderboard.map((player) => (
//             <TableRow
//               key={player.rank}
//               onClick={() => setSelectedPlayer(player)}
//               className="cursor-pointer hover:bg-zinc-800"
//             >
//               <TableCell>{player.rank}</TableCell>
//               <TableCell>{player.username}</TableCell>
//               <TableCell>{player.wps}</TableCell>
//               <TableCell>{player.time}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
export default Leaderboard;
