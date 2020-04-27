export interface PostgresConnectionOpts {
  /**
   * friendly unique name to identify the connection
   * If it is blank, connection will be created in a name "default".
   * Only a single connection can be created in that name.
   * All other connections should have a different name
   */
  CONNECTION_NAME?: string;
  DB_URL: string;
  DB_NAME: string;
  USER_NAME: string;
  PASSWORD: string;
  port: number;
}
