"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../db");
function Serversetup(args) {
    console.log("server setup");
    return function (constructor) {
        if (args.db.DBConnection == db_1.DBConnection.pg) {
            var pg = require("../db/postgres/index");
            var conn = new pg.Postgres(args.db.DBPostgresProperties);
        }
    };
}
exports.Serversetup = Serversetup;
//# sourceMappingURL=serverSetup.js.map