type TypeTypingStats = {
  wpm: number;
  accuracy: number;
  correct: number;
  wrong: number;
};

type TypeTimeOption = 15 | 30 | 60 | 120;

type TypeUser = {
  id: string;
  status: "active" | "inactive";
  inputText: string;
  timetaken?: number;
  inputLength: number;
  resultData?: TypeTypingStats;
};

interface TypeRoom {
  roomCode: string;
  author: string;
  gameStarted: boolean;
  gameStartedTime: Date | null;
  gameEnded: boolean;
  text: string;
  users: TypeUser[];
  time: number;
  date: Date;
  messages: string[];
}

type TypeRoomsTimeout = {
  roomCode: string;
  timeout: NodeJS.Timeout;
}[];

export type {
  TypeTypingStats,
  TypeTimeOption,
  TypeUser,
  TypeRoom,
  TypeRoomsTimeout,
};
