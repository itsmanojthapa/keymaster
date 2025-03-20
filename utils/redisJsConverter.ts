import { TypeRoom, TypeUser } from "../types/types";

export const jsRoomDataToRedis = (jsRoomData: TypeRoom) => {
  const redisRoomData: Record<string, string> = {
    roomCode: jsRoomData.roomCode,
    adminUserID: jsRoomData.adminUserID,
    adminSocketID: jsRoomData.adminSocketID,
    gameStarted: jsRoomData.gameStarted ? "true" : "false",
    gameEnded: jsRoomData.gameEnded ? "true" : "false",
    users: JSON.stringify(jsRoomData.users),
    text: jsRoomData.text,
    time: jsRoomData.time.toString(),
    date: jsRoomData.date.toISOString(),
    gameStartedTime: jsRoomData.gameStartedTime
      ? jsRoomData.gameStartedTime.toString()
      : "undefined",
  };
  return redisRoomData;
};

export const redisRoomDataToJS = (
  redisRoomData: Record<string, string>,
): TypeRoom => {
  const jsRoomData: TypeRoom = {
    roomCode: redisRoomData.roomCode,
    adminUserID: redisRoomData.adminUserID,
    adminSocketID: redisRoomData.adminSocketID,
    gameStarted: redisRoomData.gameStarted === "true",
    gameEnded: redisRoomData.gameEnded === "true",
    users: JSON.parse(redisRoomData.users || "[]"),
    text: redisRoomData.text,
    time: parseInt(redisRoomData.time, 10),
    date: new Date(redisRoomData.date),
    gameStartedTime:
      redisRoomData.gameStartedTime &&
      redisRoomData.gameStartedTime !== "undefined"
        ? parseInt(redisRoomData.gameStartedTime)
        : undefined,
  };
  return jsRoomData;
};

export const jsUserToRedis = (jsUser: TypeUser): Record<string, string> => {
  return {
    socketID: jsUser.socketID,
    userID: jsUser.userID,
    name: jsUser.name,
    image: jsUser.image,
    status: jsUser.status,
    inputLength: jsUser.inputLength.toString(),
    inputText: jsUser.inputText,
    wpm: jsUser.wpm !== undefined ? jsUser.wpm.toString() : "null",
    accuracy:
      jsUser.accuracy !== undefined ? jsUser.accuracy.toString() : "null",
    correct: jsUser.correct !== undefined ? jsUser.correct.toString() : "null",
    wrong: jsUser.wrong !== undefined ? jsUser.wrong.toString() : "null",
  };
};

export const redisUserToJS = (redisUser: Record<string, string>): TypeUser => {
  return {
    socketID: redisUser.socketID,
    userID: redisUser.userID,
    name: redisUser.name,
    image: redisUser.image,
    status: redisUser.status === "active" ? "active" : "inactive",
    inputLength: parseInt(redisUser.inputLength, 10),
    inputText: redisUser.inputText,
    wpm: redisUser.wpm !== "null" ? parseFloat(redisUser.wpm) : undefined,
    accuracy:
      redisUser.accuracy !== "null"
        ? parseFloat(redisUser.accuracy)
        : undefined,
    correct:
      redisUser.correct !== "null"
        ? parseInt(redisUser.correct, 10)
        : undefined,
    wrong:
      redisUser.wrong !== "null" ? parseInt(redisUser.wrong, 10) : undefined,
  };
};
