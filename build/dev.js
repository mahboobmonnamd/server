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
var index_1 = require("./restify/index");
var index_2 = require("./share/index");
var share_interface_1 = require("./share/share.interface");
var index_3 = require("./server/index");
var db_1 = require("./db");
var TestClass = /** @class */ (function () {
    function TestClass() {
    }
    TestClass.prototype.routesDefinition = function (httpServer) {
        httpServer.get("/", this.getRoute);
        httpServer.post("/", this.getRoute);
    };
    TestClass.prototype.getRoute = function (req, res, next) {
        res.send(200, {
            message: "Test Data of get",
        });
    };
    return TestClass;
}());
var factory = index_2.DataSharing.shareDataSubscription$("first").subscribe(console.log);
/** Example for data sharing */
index_2.DataSharing.shareData("first", "some data");
index_2.DataSharing.shareData("first", "some data1");
index_2.DataSharing.shareData("first");
/** Example to set system settings */
var data = {
    server: share_interface_1.ServerType.restify,
    logPath: "/Volumes/4M/Codes/Projects/server_new/logs",
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
try {
    index_2.DataSharing.systemDefaults = data;
    console.log(index_2.DataSharing.systemDefaults);
    index_2.DataSharing.systemDefaults = data;
}
catch (error) {
    console.log(error);
}
var server = /** @class */ (function () {
    function server() {
        index_1.restifyServer.startServer({
            port: 1000,
            CONTROLLERS: [new TestClass()],
        });
        /**
         * validating the query connection
         */
        db_1.Postgres.queryUsingPoolConnection("select * from core.lov", null).then(function (suc) {
            console.log("From TCL: : server -> constructor -> suc", suc);
        }, function (err) {
            console.log("From TCL: : server -> constructor -> err", err);
        });
    }
    server = __decorate([
        index_3.Serversetup({
            db: db,
        }),
        __metadata("design:paramtypes", [])
    ], server);
    return server;
}());
new server();
//# sourceMappingURL=dev.js.map