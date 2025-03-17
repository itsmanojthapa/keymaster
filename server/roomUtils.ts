import { TypeRoom, TypeRoomsTimeout } from "../types/types";

export const roomsTimeoutTime = 1000 * 60 * 10; // 8 minutes
export const roomsTimeout: TypeRoomsTimeout = [];
export const db: TypeRoom[] = [];

export const findRoom = (roomCode: string): TypeRoom | undefined => {
  return db.find((room) => room.roomCode === roomCode);
};

export const deleteRoom = (roomCode: string) => {
  const index = db.findIndex((room) => room.roomCode === roomCode);
  if (index !== -1) {
    db.splice(index, 1);
  }
};

export const userExistsInRoom = (roomCode: string, userId: string) => {
  const room = findRoom(roomCode);
  if (!room) return false;
  const exists = room.users.find((user) => user.userID === userId);
  return exists;
};

export const deleteUserRoom = (roomCode: string, userId: string) => {
  const room = findRoom(roomCode);
  if (!room) {
    return;
  }

  const user = room.users.find((user) => user.userID === userId);
  if (user) {
    user.status = "inactive";
  } else {
  }
};

export const generateHex = (): string => {
  return Math.random().toString(16).substring(2, 10);
};
