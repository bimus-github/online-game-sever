import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ClientToServerEvents, ServerToClientEvents } from "./types";
import { Room_Type } from "../types";

type SocketType = Server<
  ServerToClientEvents,
  ClientToServerEvents,
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
        //Sending the message to the current user
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
        if (connectedUserId !== userId) {
          // Emit the message to the socket of each connected user
          connectedUsers[connectedUserId].emit("conectingWithUserY", room);
        }
      });
    });

    // update cells
    socket.on("updateCell", ({ cells, id }) => {
      Object.keys(connectedUsers).forEach((connectedUserId) => {
        if (connectedUserId === id) {
          connectedUsers[connectedUserId].emit("updateCell", cells);
        }
      });
    });

    // reset cells
    socket.on("resetCell", (id) => {
      Object.keys(connectedUsers).forEach((connectedUserId) => {
        if (connectedUserId === id) {
          connectedUsers[connectedUserId].emit("resetCell");
        }
      });
    });

    // ask for reset
    socket.on("askForResetCell", (id) => {
      Object.keys(connectedUsers).forEach((connectedUserId) => {
        if (connectedUserId === id) {
          connectedUsers[connectedUserId].emit("askForResetCell");
        }
      });
    });

    // delete room
    socket.on("deleteRoom", (id) => {
      // Iterate over all connected users
      Object.keys(connectedUsers).forEach((connectedUserId) => {
        // Skip sending the message to the current user
        if (connectedUserId !== userId) {
          // Emit the message to the socket of each connected user
          connectedUsers[connectedUserId].emit("deleteRoom", id);
        }
      });
    });

    // yes
    socket.on("yes", (id) => {
      Object.keys(connectedUsers).forEach((connectedUserId) => {
        if (connectedUserId === id) {
          connectedUsers[connectedUserId].emit("yes");
        }
      });
    });

    // no
    socket.on("no", (id) => {
      Object.keys(connectedUsers).forEach((connectedUserId) => {
        if (connectedUserId === id) {
          connectedUsers[connectedUserId].emit("no");
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
