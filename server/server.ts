import { createServer } from "node:http";
import next from "next";
// import { Server } from "socket.io";
import { initSocket } from "./socketServer";
import { db } from "./roomUtils";
import fs from "fs";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  initSocket(httpServer);

  // setInterval(writeToFile, 3000); //Testing
  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

//write db to file every 3 seconds
// const writeToFile = () => {
//   fs.writeFile("output.json", JSON.stringify(db, null, 2), (err) => {
//     if (err) console.error("Error writing file:", err);
//   });
// };
