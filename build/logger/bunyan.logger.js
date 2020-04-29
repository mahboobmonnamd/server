"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bunyan_1 = require("bunyan");
var RotatingFileStream = require("bunyan-rotating-file-stream");
var path_1 = require("path");
var fs_1 = require("fs");
var share_controller_1 = require("../share/share.controller");
var BunyanLogger = /** @class */ (function () {
    function BunyanLogger(loggerName) {
        this.loggerName = loggerName;
        this.createLogs();
    }
    /**
     *
     * @param loggerName set the logger name
     */
    BunyanLogger.getInstance = function (loggerName) {
        if (loggerName === void 0) { loggerName = "4M Server"; }
        if (!BunyanLogger.logger) {
            BunyanLogger.logger = new BunyanLogger(loggerName);
        }
        return this.logger;
    };
    BunyanLogger.prototype.createLogs = function () {
        this.filePath = share_controller_1.DataSharing.systemDefaults.logPath;
        if (typeof this.filePath != "undefined") {
            if (!fs_1.existsSync(this.filePath)) {
                fs_1.mkdirSync(this.filePath);
            }
        }
        else {
            this.filePath = __dirname + "/logs";
        }
    };
    Object.defineProperty(BunyanLogger.prototype, "loggerInstance", {
        get: function () {
            this.log = bunyan_1.createLogger({
                name: this.loggerName,
                src: true,
                streams: [
                    {
                        stream: new RotatingFileStream({
                            type: "rotating-file",
                            path: path_1.join(this.filePath, "info-%Y%m%d.log"),
                            period: "1d",
                            totalFiles: 10,
                            rotateExisting: true,
                            threshold: "10m",
                            totalSize: "20m",
                            gzip: true,
                            template: "info-%Y%m%d.log",
                        }),
                        // type: 'rotating-file',
                        // period: '3000ms',
                        level: "info",
                        count: 30,
                    },
                    {
                        stream: new RotatingFileStream({
                            type: "rotating-file",
                            path: path_1.join(this.filePath, "error-%Y%m%d.log"),
                            period: "1d",
                            totalFiles: 10,
                            rotateExisting: true,
                            threshold: "10m",
                            totalSize: "20m",
                            gzip: true,
                            template: "error-%Y%m%d.log",
                        }),
                        // type: 'rotating-file',
                        // period: '3000ms',
                        level: "error",
                        count: 30,
                    },
                ],
                serializers: {
                    req: bunyan_1.stdSerializers.req,
                    res: bunyan_1.stdSerializers.res,
                    err: bunyan_1.stdSerializers.err,
                },
            });
            return this.log;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Logs the data defined in to the console.
     * To keep track of all requests, this logger can be used.
     *
     * @param data text to register in log file
     */
    BunyanLogger.prototype.info = function (data) {
        this.log.info(data);
    };
    /**
     * Logs errors to error.log file.
     * Maintains all tupe of records
     * @param data Error description.
     * @param fileName optional file name in which error occurs.
     * @param functionName optional function name in which function the issue is raised.
     * @param otherInfo optional additional information for the error log
     */
    BunyanLogger.prototype.Error = function (data, fileName, functionName, otherInfo) {
        data = typeof data === "object" ? JSON.stringify(data) : data;
        this.log.error(data + " " + fileName + " " + functionName + " " + otherInfo);
    };
    return BunyanLogger;
}());
exports.BunyanLogger = BunyanLogger;
//# sourceMappingURL=bunyan.logger.js.map