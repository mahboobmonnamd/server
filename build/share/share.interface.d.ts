/**
 * The default value for server will be passed
 */
export interface ServerConfigurations {
    server: ServerType;
    logPath: string;
}
export declare enum ServerType {
    restify = 0,
    express = 1
}
