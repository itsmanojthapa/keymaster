import { getUserFromDB } from "../lib/actions/getUserFromDB";
import { Socket } from "socket.io";

export const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const userId = socket.handshake.query.userId as string;

    const user = await getUserFromDB(userId);

    // Store authenticated user in socket
    socket.data.user = user;

    next(); // Proceed to connection
  } catch (error) {
    console.log("❌ Internal server error - authenticateSocket");
    console.error(error);
  }
};
