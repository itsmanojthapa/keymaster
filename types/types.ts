export type TypeTypingStats = {
  wpm: number;
  accuracy: number;
  correct: number;
  wrong: number;
};

export type TypeTimeOption = 15 | 30 | 60 | 120;

export type TypeUser = {
  socketID: string;
  userID: string;
  name: string;
  image: string;
  status: "active" | "inactive";
  inputText: string;
  timetaken?: number;
  inputLength: number;
  resultData?: TypeTypingStats;
};

export type TypeRoom = {
  roomCode: string;
  authorUserID: string;
  authorSocketID: string;
  gameStarted: boolean;
  gameStartedTime: Date | null;
  gameEnded: boolean;
  text: string;
  users: TypeUser[];
  time: number;
  date: Date;
  messages: string[];
};

export type TypeRoomsTimeout = {
  roomCode: string;
  timeout: NodeJS.Timeout;
}[];

export type TypeCreateRoom = {
  text: string;
  selectedTime: number;
};
