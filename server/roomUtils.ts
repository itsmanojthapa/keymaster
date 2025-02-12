import { TypeRoom, TypeRoomsTimeout } from "@/types/types";

export const roomsTimeoutTime = 1000 * 60 * 8; // 8 minutes
export const roomsTimeout: TypeRoomsTimeout = [];
export const db: TypeRoom[] = [];

export const findRoom = (roomCode: string): TypeRoom | undefined => {
  return db.find((room) => room.roomCode === roomCode);
};

export const deleteRoom = (roomCode: string) => {
  const index = db.findIndex((room) => room.roomCode === roomCode);
  if (index !== -1) {
    db.splice(index, 1);
    console.log(`Room ${roomCode} deleted`);
  }
};

export const userExistsInRoom = (roomCode: string, userId: string) => {
  const room = findRoom(roomCode);
  if (!room) return false;
  const exists = room.users.find((user) => user.id === userId);
  return exists;
};

export const deleteUserRoom = (roomCode: string, userId: string) => {
  const room = findRoom(roomCode);
  if (!room) {
    console.log(`Room ${roomCode} not found`);
    return;
  }

  const user = room.users.find((user) => user.id === userId);
  if (user) {
    user.status = "inactive";
    console.log(`User ${userId} inactive in #${roomCode} Room`);
  } else {
    console.log(`User ${userId} not found in #${roomCode} Room`);
  }
};

export const generateHex = (): string => {
  return Math.random().toString(16).substring(2, 10);
};
