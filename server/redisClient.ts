import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

export const pubClient = createClient({
  // username: process.env.REDIS_USERNAME,
  // password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!),
  },
});
export const subClient = pubClient.duplicate();
