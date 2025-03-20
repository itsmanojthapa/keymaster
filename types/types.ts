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
  wpm: number | undefined;
  accuracy: number | undefined;
  correct: number | undefined;
  wrong: number | undefined;
};

export type TypeRoom = {
  roomCode: string;
  adminUserID: string;
  adminSocketID: string;
  gameStarted: boolean;
  gameStartedTime?: number;
  gameEnded: boolean;
  text: string;
  users: string[];
  time: number;
  date: Date;
};

export type TypeRoomsTimeout = {
  roomCode: string;
  timeout: NodeJS.Timeout;
}[];

export type TypeCreateRoom = {
  text: string;
  selectedTime: number;
};
