"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO Draft version not validated.
// FIXME FOrmat the pattern
var socket_io_1 = require("socket.io");
var util_1 = require("util");
var WSSocket = /** @class */ (function () {
    function WSSocket() {
    }
    /**
     *
     * @param port
     */
    WSSocket.prototype.sockets = function (port) {
        WSSocket.io = socket_io_1.listen(port, {
            path: "/socket/",
            transports: ["websocket", "polling"],
        });
        WSSocket.connection();
        console.log("Socket is running on port " + port);
    };
    WSSocket.connection = function () {
        try {
            WSSocket.io.on("connection", function (socket) {
                try {
                    WSSocket.socket = socket;
                    var user_1 = socket.handshake.query.token;
                    WSSocket.connectedUsers.push(user_1);
                    WSSocket.connectedUsers = Array.from(new Set(WSSocket.connectedUsers));
                    WSSocket.socket.join(user_1);
                    console.log("WSSocket -> connection -> user id: " + user_1 + " is connected");
                    WSSocket.publishMessage(user_1, "your user id " + user_1 + ", is connected.");
                    socket.on("disconnect", function () {
                        socket.leave(user_1);
                        console.log(user_1 + " Disconnected");
                        WSSocket.connectedUsers.splice(WSSocket.connectedUsers.indexOf(user_1), 1);
                    });
                    socket.on("socket_ack", function (userId) {
                        console.log("Message acknowledged from user id " + userId);
                        // ApiServer.Logger.info(`Message acknowledged from user id ${userId}`);
                    });
                    socket.on("message", function (e) {
                        console.log(e);
                    });
                }
                catch (error) {
                    console.log("WSSocket -> connection -> error", error);
                }
            });
        }
        catch (error) {
            // ApiServer.Logger.Error(error);
            console.log("WSSocket -> connection -> error", error);
            process.exit(1);
        }
    };
    /**
     * Call this function to publish the message to one or more users
     * @param user
     * @param message
     */
    WSSocket.publishMessage = function (userId, message) {
        console.log("WSSocket -> publishMessage -> publishMessage", userId);
        try {
            if (util_1.isArray(userId)) {
                userId.forEach(function (user) {
                    // ApiServer.Logger.info(`WSSocket -> publishMessage -> user \n Notification send to user ${user} and message is ${message}`);
                    WSSocket.io.in(user).emit(user, message);
                });
            }
            else {
                WSSocket.io.in(userId).emit(userId, message);
                WSSocket.io.emit(userId, message);
                // ApiServer.Logger.info(`WSSocket -> publishMessage -> user \n Notification send to user ${userId} and message is ${message}`);
            }
            return "Message is emitted";
        }
        catch (error) {
            // ApiServer.Logger.Error("WSSocket -> publishMessage -> error", error)
            return error;
        }
    };
    /**
     * send message to all connected users
     * @param message
     */
    WSSocket.sendMessageToAll = function (message) {
        WSSocket.io.emit(message);
    };
    WSSocket.connectedUsers = [];
    return WSSocket;
}());
exports.WSSocket = WSSocket;
//# sourceMappingURL=index.js.map