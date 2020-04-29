import { RestifyHttpServerMethods } from "./restifyHttpServer.interface";
import { RequestHandler, RequestHandlerType } from "restify";
import { ServerOpts } from "../server/server.interface";
/**
 * Create a singleton resify server.
 * RestifyServer.getInstance will allow to invoke the server object
 */
declare class RestifyServer implements RestifyHttpServerMethods {
    private constructor();
    private static restify;
    private static instance;
    /**
     * To get the instance object of restify server use this function
     */
    static getInstance(): RestifyServer;
    get(url: string, requestHandler: RequestHandler): void;
    post(url: string, requestHandler: RequestHandler): void;
    put(url: string, requestHandler: RequestHandler): void;
    del(url: string, requestHandler: RequestHandler): void;
    head(url: string, requestHandler: RequestHandler): void;
    /**
     * All
     * @param method defines whether the web service call should be get, post, put, del(delete)
     * @param url path which user will call to access
     * @param requestHandler restify request handler
     */
    private addRoute;
    /**
     * Handles all unknown methods and response as success
     * To defined all supported headers
     * @param req restify request object
     * @param res restify response object
     */
    startServer(serverOpts: ServerOpts, routes: object[]): void;
    /**
     * Handle the plugins initialization using pre and use of restify.
     *
     * @param maxFileSize how much file size should be accepted.
     */
    private initializePlugins;
    /**
     * Initalize all routes
     * Routes will be passed as the class objects to the arguments
     * @param CONTROLLERS  Pass the routes as object
     */
    private initRouteControllers;
    /**
     * create restify server object.
     * This object should be created first to register routes
     * @param isSSL
     */
    private createServerWithOptions;
    /**
     * For any restify pre, use this function from where the object is created.
     * @param handler
     */
    static pre(handler: RequestHandlerType): void;
}
export declare const restifyServer: RestifyServer;
export {};
