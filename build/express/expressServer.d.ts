import { ExpressHttpServerMethods } from "./expressHttpServer.interface";
import { RequestHandler } from "express";
import { ServerOpts } from "../server";
declare class ExpressServer implements ExpressHttpServerMethods {
    private constructor();
    private static express;
    private static instance;
    /**
     * To get the instance object of restify server use this function
     */
    static getInstance(): ExpressServer;
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
    startServer(serverOpts: ServerOpts, routes: object[]): void;
    /**
     * Initalize all routes
     * Routes will be passed as the class objects to the arguments
     * @param CONTROLLERS  Pass the routes as object
     */
    private initRouteControllers;
}
export declare const expressServer: ExpressServer;
export {};
