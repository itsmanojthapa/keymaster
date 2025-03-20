import { getUserFromDB } from "../lib/actions/getUserFromDB";
import { Socket } from "socket.io";

export const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const userId = socket.handshake.query.userId;

    if (userId) {
      const user = await getUserFromDB(userId as string);

      // Store authenticated user in socket
      // it make user data available in all socket events socket.data.user.id etc.
      socket.data.user = user;
    }

    next(); // Proceed to connection
  } catch (error) {
    console.log("❌ Internal server error - authenticateSocket");
    console.error(error);
  }
};
