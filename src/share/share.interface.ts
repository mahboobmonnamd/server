/**
 * The default value for server will be passed
 */
export interface ServerConfigurations {
  server: ServerType;
  logPath: string;
}

export enum ServerType {
  restify,
  express,
}
