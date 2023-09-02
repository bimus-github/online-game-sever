const express = require("express");
import { createServer } from "http";
import { Server } from "socket.io";
import { useSocket } from "./socket";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
export const server = createServer(app);
const io = new Server(3001, {
  transports: ["websocket"],
});

useSocket(io);

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
