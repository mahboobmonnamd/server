import { restifyServer } from "./restify/index";
import { RestifyHttpServerMethods } from "./restify/restifyHttpServer.interface";
import { RestifyRoutes } from "./restify/restifyRoutes.interface";
import { Request, Response, Next } from "restify";
import { DataSharing } from "./share/share.controller";
import { ServerConfigurations, ServerType } from "./share/share.interface";
import { Serversetup } from "./server/serverSetup";
import { DBConnection, Postgres } from "./db";
require("dotenv").config();
class TestClass implements RestifyRoutes {
  routesDefinition(httpServer: RestifyHttpServerMethods): void {
    httpServer.get("/", this.getRoute);
    httpServer.post("/", this.getRoute);
  }

  getRoute(req: Request, res: Response, next: Next) {
    // Postgres.insertsUsingConnectionPoolAsTranscations(`query`, null)
    //   .then((succ) => {
    //     console.log(succ);
    //     res.send(200, {
    //       message: "s Test Data of get",
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }
}

const factory = DataSharing.singletonDataObjectSubscription$("first").subscribe(
  console.log
);

/** Example for data sharing */
DataSharing.singletonDataObject("first", "some data");
DataSharing.singletonDataObject("first", "some data1");
DataSharing.singletonDataObject("first");

/** Example to set system settings */
let data: ServerConfigurations = {
  server: ServerType.express,
  logPath: "./logs",
};

const db = {
  DefaultConnectionRequired: true,
  DBConnection: DBConnection.pg,
  DBPostgresProperties: {
    CONNECTION_NAME: "default",
    DB_NAME: "beauty",
    PASSWORD: process.env.PASSWORD,
    USER_NAME: "mahboob",
    DB_URL: process.env.DB_URL,
    port: 5432,
  },
};

// try {
//   DataSharing.systemDefaults = data;
//   console.log(DataSharing.systemDefaults);
//   DataSharing.systemDefaults = {
//     server: ServerType.restify,
//     logPath: "./logss",
//   };
// } catch (error) {
//   console.log(error);
// }

@Serversetup({
  serverConfigurations: data,
  serverOpts: { port: 1000 },
  routesDefintions: [new TestClass()],
  // db: db,
})
class server {
  constructor() {
    // restifyServer.startServer({
    //   CONTROLLERS: [new TestClass()],
    // });
    /**
     * validating the query connection
     */
    // Postgres.queryUsingPoolConnection(`select * from core.lov`, null).then(
    //   (suc) => {
    //     console.log(`From TCL: : server -> constructor -> suc`, suc);
    //   },
    //   (err) => {
    //     console.log(`From TCL: : server -> constructor -> err`, err);
    //   }
    // );
  }
}
new server();
