import { ServerSetupOpts } from "./server.interface";
import { DBConnection } from "../db";

export function Serversetup(args: ServerSetupOpts) {
  console.log("server setup");
  return function (constructor: Function) {
    if (args.db.DBConnection == DBConnection.pg) {
      const pg = require("../db/postgres/index");
      const conn = new pg.Postgres(args.db.DBPostgresProperties);
    }
  };
}
