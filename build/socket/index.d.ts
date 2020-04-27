export declare class WSSocket {
    private static io;
    private static connectedUsers;
    private static socket;
    /**
     *
     * @param port
     */
    sockets(port: number): void;
    static connection(): void;
    /**
     * Call this function to publish the message to one or more users
     * @param user
     * @param message
     */
    static publishMessage(userId: any[] | string, message: any): any;
    /**
     * send message to all connected users
     * @param message
     */
    static sendMessageToAll(message: string): void;
}
