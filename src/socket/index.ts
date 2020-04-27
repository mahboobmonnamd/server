// TODO Draft version not validated.
// FIXME FOrmat the pattern
import { listen } from "socket.io";
import {} from "../restify";
import { isArray } from "util";

export class WSSocket {
  private static io: SocketIO.Server;
  private static connectedUsers: any[] = [];
  private static socket;

  /**
   *
   * @param port
   */
  public sockets(port: number): void {
    WSSocket.io = listen(port, {
      path: "/socket/",
      transports: ["websocket", "polling"],
    });
    WSSocket.connection();
    console.log(`Socket is running on port ${port}`);
  }

  static connection() {
    try {
      WSSocket.io.on("connection", (socket) => {
        try {
          WSSocket.socket = socket;
          const user = socket.handshake.query.token;
          WSSocket.connectedUsers.push(user);
          WSSocket.connectedUsers = Array.from(
            new Set(WSSocket.connectedUsers)
          );
          WSSocket.socket.join(user);
          console.log(
            `WSSocket -> connection -> user id: ${user} is connected`
          );
          WSSocket.publishMessage(user, `your user id ${user}, is connected.`);
          socket.on("disconnect", () => {
            socket.leave(user);
            console.log(`${user} Disconnected`);
            WSSocket.connectedUsers.splice(
              WSSocket.connectedUsers.indexOf(user),
              1
            );
          });

          socket.on("socket_ack", (userId) => {
            console.log(`Message acknowledged from user id ${userId}`);
            // ApiServer.Logger.info(`Message acknowledged from user id ${userId}`);
          });

          socket.on("message", (e) => {
            console.log(e);
          });
        } catch (error) {
          console.log("WSSocket -> connection -> error", error);
        }
      });
    } catch (error) {
      // ApiServer.Logger.Error(error);
      console.log("WSSocket -> connection -> error", error);
      process.exit(1);
    }
  }
  /**
   * Call this function to publish the message to one or more users
   * @param user
   * @param message
   */
  static publishMessage(userId: any[] | string, message) {
    console.log("WSSocket -> publishMessage -> publishMessage", userId);
    try {
      if (isArray(userId)) {
        userId.forEach((user) => {
          // ApiServer.Logger.info(`WSSocket -> publishMessage -> user \n Notification send to user ${user} and message is ${message}`);
          WSSocket.io.in(user).emit(user, message);
        });
      } else {
        WSSocket.io.in(userId).emit(userId, message);
        WSSocket.io.emit(userId, message);
        // ApiServer.Logger.info(`WSSocket -> publishMessage -> user \n Notification send to user ${userId} and message is ${message}`);
      }

      return "Message is emitted";
    } catch (error) {
      // ApiServer.Logger.Error("WSSocket -> publishMessage -> error", error)
      return error;
    }
  }

  /**
   * send message to all connected users
   * @param message
   */
  static sendMessageToAll(message: string) {
    WSSocket.io.emit(message);
  }
}
