import { createServer } from "node:http";
import next from "next";
import { initSocket } from "./socketServer";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const startServer = (port: number): void => {
  // when using middleware `hostname` and `port` must be provided below
  const app = next({ dev, hostname, port });
  const handler = app.getRequestHandler();

  app.prepare().then(() => {
    const httpServer = createServer(handler);

    httpServer.once("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error(err);
        process.exit(1);
      }
    });

    httpServer.listen(port, () => {
      console.log(`>🚀 Ready on http://${hostname}:${port} `);
      console.log("AUTH_URL: ", process.env.AUTH_URL);
      initSocket(httpServer);
    });
  });
};

startServer(port);
