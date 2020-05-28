"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../db");
var share_1 = require("../share");
function Serversetup(args) {
    return function (constructor) {
        if (args.db !== undefined) {
            createDB();
        }
        serverConfiguration();
    };
    function serverConfiguration() {
        try {
            share_1.DataSharing.systemDefaults = args.serverConfigurations;
            console.log(share_1.DataSharing.systemDefaults);
            if (args.serverConfigurations.server == share_1.ServerType.restify) {
                var restifyServer = require("./../restify/index").restifyServer;
                restifyServer.startServer(args.serverOpts, args.routesDefintions);
            }
            else if (args.serverConfigurations.server == share_1.ServerType.express) {
                var expressServer = require("./../express/index").expressServer;
                expressServer.startServer(args.serverOpts, args.routesDefintions);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    function createDB() {
        if (args.db.DBConnection == db_1.DBConnection.pg) {
            var pg = require("../db/postgres/index");
            new pg.Postgres(args.db.DBPostgresProperties);
        }
    }
}
exports.Serversetup = Serversetup;
//# sourceMappingURL=serverSetup.js.map