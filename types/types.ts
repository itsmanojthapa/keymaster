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
  inputLength: number;
  resultData?: TypeTypingStats;
};

interface TypeRoom {
  roomCode: string;
  author: string;
  gameStarted: boolean;
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
