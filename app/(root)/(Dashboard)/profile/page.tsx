import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { BadgeCheck } from "lucide-react";
import { auth } from "@/auth/auth";

// Profile data type
type TestHistory = {
  mode: "type" | "arena";
  wps: number;
  time: string;
  accuracy: number;
  correctChar: number;
  wrongChar: number;
};

const testHistory: TestHistory[] = [
  {
    mode: "type",
    wps: 12.5,
    time: "60s",
    accuracy: 98,
    correctChar: 150,
    wrongChar: 3,
  },
  {
    mode: "arena",
    wps: 11.8,
    time: "60s",
    accuracy: 97,
    correctChar: 140,
    wrongChar: 5,
  },
  {
    mode: "type",
    wps: 10.9,
    time: "60s",
    accuracy: 95,
    correctChar: 130,
    wrongChar: 6,
  },
];

async function Profile() {
  const session = await auth();
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center justify-center">
        <Avatar className="h-24 w-24 ring-2 ring-blue-500/20">
          <AvatarImage
            className="h-full w-full object-cover"
            src={`${session?.user?.image}`}
          />

          <AvatarFallback>
            <AvatarImage
              className="h-full w-full object-cover"
              src={`https://api.dicebear.com/8.x/bottts/svg?seed=${session?.user?.name}`}
            />
          </AvatarFallback>
        </Avatar>
        <p className="mt-5 text-lg font-semibold">
          Username: {`${session?.user?.name}`}
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm">
          <p>Email: {`${session?.user?.email}`}</p>
          {true && <BadgeCheck className="bg-black text-teal-300" />}
        </div>
      </div>

      <div className="mt-6 w-full max-w-3xl rounded-xl bg-zinc-900 p-6 text-white shadow-lg">
        <h3 className="mb-4 text-xl font-bold">Typing Test History</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Mode</TableHead>
              <TableHead>WPS</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Accuracy</TableHead>
              <TableHead className=""> Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testHistory.map((test, index) => (
              <TableRow key={index}>
                <TableCell>{test.mode}</TableCell>
                <TableCell>{test.wps}</TableCell>
                <TableCell>{test.time}</TableCell>
                <TableCell>{test.accuracy}%</TableCell>
                <TableCell className="">
                  <HoverCard openDelay={1} closeDelay={1}>
                    <HoverCardTrigger className="cursor-pointer text-teal-300 hover:underline">
                      View
                    </HoverCardTrigger>
                    <HoverCardContent side="right">
                      <p>Correct Characters: {test.correctChar}</p>
                      <p>Wrong Characters: {test.wrongChar}</p>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Profile;
