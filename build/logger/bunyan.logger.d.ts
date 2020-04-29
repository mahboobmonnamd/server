export declare class BunyanLogger {
    static logger: BunyanLogger;
    private loggerName;
    private filePath;
    private log;
    private constructor();
    /**
     *
     * @param loggerName set the logger name
     */
    static getInstance(loggerName?: string): BunyanLogger;
    private createLogs;
    get loggerInstance(): any;
    /**
     * Logs the data defined in to the console.
     * To keep track of all requests, this logger can be used.
     *
     * @param data text to register in log file
     */
    info(data: any): void;
    /**
     * Logs errors to error.log file.
     * Maintains all tupe of records
     * @param data Error description.
     * @param fileName optional file name in which error occurs.
     * @param functionName optional function name in which function the issue is raised.
     * @param otherInfo optional additional information for the error log
     */
    Error(data: any, fileName?: String, functionName?: String, otherInfo?: String): void;
}
