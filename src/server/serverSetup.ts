import { ServerSetupOpts } from "./server.interface";
import { DBConnection } from "../db";
import { ServerType, DataSharing } from "../share";

export function Serversetup(args: ServerSetupOpts) {
  return function (constructor: Function) {
    createDB();
    serverConfiguration();
  };
  function serverConfiguration() {
    try {
      DataSharing.systemDefaults = args.serverConfigurations;
      console.log(DataSharing.systemDefaults);
      if (args.serverConfigurations.server == ServerType.restify) {
        const restifyServer = require("./../restify/index").restifyServer;
        restifyServer.startServer(args.serverOpts, args.routesDefintions);
      }
    } catch (error) {
      console.log(error);
    }
  }
  function createDB() {
    if (args.db.DBConnection == DBConnection.pg) {
      const pg = require("../db/postgres/index");
      new pg.Postgres(args.db.DBPostgresProperties);
    }
  }
}
