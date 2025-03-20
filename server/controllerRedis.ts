import { pubClient } from "./redisClient";
import { TypeRoom, TypeUser } from "../types/types";
import {
  jsUserToRedis,
  redisRoomDataToJS,
  redisUserToJS,
} from "../utils/redisJsConverter";
import { calculateStats } from "../lib/CalculateStats";

// Room Exists in Redis
export const roomExists = async (roomCode: string) => {
  const exists = await pubClient.exists(`room:${roomCode}:roomData`);
  return exists == 1 ? true : false;
};

// Find a room from Redis
export const getRoom = async (roomCode: string): Promise<TypeRoom> => {
  const roomData = await pubClient
    .hGetAll(`room:${roomCode}:roomData`)
    .then((data) => {
      return redisRoomDataToJS(data);
    });

  return roomData;
};

// Get users from room
export const getUsersInRoom = async (roomCode: string) => {
  const userRedis = await pubClient.hGet(`room:${roomCode}:roomData`, "users");
  if (!userRedis) return [];
  return JSON.parse(userRedis);
};

// Check if user exists in room
export const userExistsInRoom = async (roomCode: string, userId: string) => {
  const users = await getUsersInRoom(roomCode);
  return users.includes(userId);
};

// Add user to room users
export const addUserToRoomUsers = async (roomCode: string, userId: string) => {
  const users = await getUsersInRoom(roomCode);
  users.map((user: string) => {
    if (user === userId) {
      return;
    }
  });
  users.push(userId);
  await pubClient.hSet(
    `room:${roomCode}:roomData`,
    "users",
    JSON.stringify(users),
  );
};

// Get User Data
export const getUser = async (
  roomCode: string,
  userId: string,
): Promise<TypeUser | undefined> => {
  const user = await pubClient
    .hGetAll(`room:${roomCode}:user:${userId}`)
    .then((data) => {
      return redisUserToJS(data);
    }); // Convert Redis data to JS object

  return user;
};

// get no of users in room
export const getNoOfUsersInRoom = async (roomCode: string) => {
  const userRedis = await pubClient.hGet(`room:${roomCode}:roomData`, "users");
  if (!userRedis) return 0;
  const users = JSON.parse(userRedis);
  return users.length;
};

//get users data
export const getUsersDataInRoom = async (roomCode: string) => {
  const userIDs = await getUsersInRoom(roomCode);

  const users = await Promise.all(
    userIDs.map(async (userID: string) => {
      const user = redisUserToJS(
        await pubClient.hGetAll(`room:${roomCode}:user:${userID}`),
      );
      return user;
    }),
  );

  return users;
};

// Delete a room from Redis
export const deleteRoom = async (roomCode: string) => {
  const keys = await pubClient.keys(`room:${roomCode}:*`);
  if (keys.length > 0) {
    await pubClient.del(keys);
  }
};

// Mark user as inactive inside a room
export const inactiveUserRoom = async (roomCode: string, userId: string) => {
  await pubClient.hSet(`room:${roomCode}:user:${userId}`, "status", "inactive");
};

//Start Game
export const startGame = async (roomCode: string) => {
  await pubClient.hSet(`room:${roomCode}:roomData`, "gameStarted", "true");
  await pubClient.hSet(
    `room:${roomCode}:roomData`,
    "gameStartedTime",
    JSON.stringify(Date.now() + 3 * 1000), //3 sec delay
  );
  await setRoomTTL(roomCode, 60 * 5); // 4 minutes
};

//End Game
export const endGame = async (roomCode: string) => {
  await pubClient.hSet(`room:${roomCode}:roomData`, "gameEnded", "true");
};

//Calculate Result
export const calculateResult = async (roomCode: string) => {
  const text = await pubClient.hGet(`room:${roomCode}:roomData`, "text");
  const timeStr = await pubClient.hGet(`room:${roomCode}:roomData`, "time");
  const time = parseInt(timeStr!);

  const users = await getUsersInRoom(roomCode);

  for (const userID of users) {
    const user = await getUser(roomCode, userID);
    if (!user) continue;

    const stats = calculateStats(
      user.inputText,
      text!,
      user.timetaken || time * 1000,
    );
    user.wpm = stats.wpm;
    user.accuracy = stats.accuracy;
    user.correct = stats.correct;
    user.wrong = stats.wrong;

    await pubClient.hSet(
      `room:${roomCode}:user:${user.userID}`,
      jsUserToRedis(user),
    );
  }
};

// Set Room Expiry
export const setRoomTTL = async (roomCode: string, time: number) => {
  await pubClient.expire(`room:${roomCode}:roomData`, time);
  await pubClient.expire(`room:${roomCode}:messages`, time);
  const users = JSON.parse(
    (await pubClient.hGet(`room:${roomCode}:roomData`, "users")) || "[]",
  );
  for (const userID of users) {
    await pubClient.expire(`room:${roomCode}:user:${userID}`, time);
  }
};

// Utility to generate random hex
export const generateHex = (): string => {
  return Math.random().toString(16).substring(2, 10);
};
