import { createLogger, stdSerializers } from "bunyan";
const RotatingFileStream = require("bunyan-rotating-file-stream");
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import { DataSharing } from "../share/share.controller";

export class BunyanLogger {
  public static logger: BunyanLogger;
  private loggerName;
  private filePath;
  private log;

  private constructor(loggerName) {
    this.loggerName = loggerName;
    this.createLogs();
  }
  /**
   *
   * @param loggerName set the logger name
   */
  public static getInstance(loggerName = "4M Server") {
    if (!BunyanLogger.logger) {
      BunyanLogger.logger = new BunyanLogger(loggerName);
    }
    return this.logger;
  }

  private createLogs() {
    this.filePath = DataSharing.systemDefaults.logPath;
    if (typeof this.filePath != "undefined") {
      if (!existsSync(this.filePath)) {
        mkdirSync(this.filePath);
      }
    } else {
      this.filePath = `${__dirname}/logs`;
    }
  }

  get loggerInstance() {
    this.log = createLogger({
      name: this.loggerName,
      src: true,
      streams: [
        {
          stream: new RotatingFileStream({
            type: "rotating-file",
            path: join(this.filePath, "info-%Y%m%d.log"),
            period: "1d", // daily rotation
            totalFiles: 10, // keep up to 10 back copies
            rotateExisting: true, // Give ourselves a clean file when we start up, based on period
            threshold: "10m", // Rotate log files larger than 10 megabytes
            totalSize: "20m", // Don't keep more than 20mb of archived log files
            gzip: true, // Compress the archive log files to save space
            template: "info-%Y%m%d.log", //you can add. - _ before datestamp.
          }),
          // type: 'rotating-file',
          // period: '3000ms',
          level: "info",
          count: 30,
          // path: join(filePath, 'info - ' + fileDate + '.log')            // log INFO and above to stdout
        },
        {
          stream: new RotatingFileStream({
            type: "rotating-file",
            path: join(this.filePath, "error-%Y%m%d.log"),
            period: "1d", // daily rotation
            totalFiles: 10, // keep up to 10 back copies
            rotateExisting: true, // Give ourselves a clean file when we start up, based on period
            threshold: "10m", // Rotate log files larger than 10 megabytes
            totalSize: "20m", // Don't keep more than 20mb of archived log files
            gzip: true, // Compress the archive log files to save space
            template: "error-%Y%m%d.log", //you can add. - _ before datestamp.
          }),
          // type: 'rotating-file',
          // period: '3000ms',
          level: "error",
          count: 30,
          // path: join(filePath, 'error - ' + fileDate + '.log')   // log ERROR and above to a file
        },
      ],
      serializers: {
        req: stdSerializers.req,
        res: stdSerializers.res,
        err: stdSerializers.err,
      },
    });
    return this.log;
  }

  /**
   * Logs the data defined in to the console.
   * To keep track of all requests, this logger can be used.
   *
   * @param data text to register in log file
   */
  info(data: any) {
    this.log.info(data);
  }

  /**
   * Logs errors to error.log file.
   * Maintains all tupe of records
   * @param data Error description.
   * @param fileName optional file name in which error occurs.
   * @param functionName optional function name in which function the issue is raised.
   * @param otherInfo optional additional information for the error log
   */
  Error(
    data: any,
    fileName?: String,
    functionName?: String,
    otherInfo?: String
  ) {
    data = typeof data === "object" ? JSON.stringify(data) : data;
    this.log.error(
      data + " " + fileName + " " + functionName + " " + otherInfo
    );
  }
}
