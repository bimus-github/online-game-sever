import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ClientToServerEvents, ServerToClientEvents } from "./types";
import { Room_Type } from "../types";

type SocketType = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap
>;

interface ConnectedUsers {
  [userId: string]: Socket;
}

const connectedUsers: ConnectedUsers = {};

export const useSocket = (io: SocketType) => {
  io.on("connection", (socket) => {
    console.log("new user socket user: " + socket.id);
    const userId = socket.id;
    connectedUsers[userId] = socket;

    // sending current id
    socket.on("gettingId", () => {
      // Iterate over all connected users
      Object.keys(connectedUsers).forEach((connectedUserId) => {
        // Skip sending the message to the current user
        if (connectedUserId === userId) {
          // Emit the message to the socket of each connected user
          connectedUsers[connectedUserId].emit("gettingId", connectedUserId);
        }
      });
    });

    // create new room
    socket.on("createRoom", (room: Room_Type) => {
      // Iterate over all connected users
      Object.keys(connectedUsers).forEach((connectedUserId) => {
        // Skip sending the message to the current user
        if (connectedUserId !== userId) {
          // Emit the message to the socket of each connected user
          connectedUsers[connectedUserId].emit("createRoom", room);
        }
      });
    });

    // connecting user Y
    socket.on("conectingWithUserY", (room: Room_Type) => {
      // Iterate over all connected users
      Object.keys(connectedUsers).forEach((connectedUserId) => {
        // Skip sending the message to the current user
        if (connectedUserId === room.id) {
          // Emit the message to the socket of each connected user
          connectedUsers[connectedUserId].emit("conectingWithUserY", room);
        }
      });
    });

    console.log(Object.keys(connectedUsers));

    // Disconnect client
    socket.on("disconnect", () => {
      console.log("user disconnected:" + userId);
      // Remove the socket from connectedUsers upon disconnection
      delete connectedUsers[userId];
    });
  });
};
