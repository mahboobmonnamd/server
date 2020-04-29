"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var share_controller_1 = require("./share/share.controller");
var share_interface_1 = require("./share/share.interface");
var serverSetup_1 = require("./server/serverSetup");
var db_1 = require("./db");
require("dotenv").config();
var TestClass = /** @class */ (function () {
    function TestClass() {
    }
    TestClass.prototype.routesDefinition = function (httpServer) {
        httpServer.get("/", this.getRoute);
        httpServer.post("/", this.getRoute);
    };
    TestClass.prototype.getRoute = function (req, res, next) {
        res.send(200, {
            message: "s Test Data of get",
        });
    };
    return TestClass;
}());
var factory = share_controller_1.DataSharing.shareDataSubscription$("first").subscribe(console.log);
/** Example for data sharing */
share_controller_1.DataSharing.shareData("first", "some data");
share_controller_1.DataSharing.shareData("first", "some data1");
share_controller_1.DataSharing.shareData("first");
/** Example to set system settings */
var data = {
    server: share_interface_1.ServerType.restify,
    logPath: "./logs",
};
var db = {
    DefaultConnectionRequired: true,
    DBConnection: db_1.DBConnection.pg,
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
var server = /** @class */ (function () {
    function server() {
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
    server = __decorate([
        serverSetup_1.Serversetup({
            serverConfigurations: data,
            serverOpts: { port: 1000 },
            routesDefintions: [new TestClass()],
            db: db,
        }),
        __metadata("design:paramtypes", [])
    ], server);
    return server;
}());
new server();
//# sourceMappingURL=dev.js.map