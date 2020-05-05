import { ExpressHttpServerMethods } from "./expressHttpServer.interface";
import express, {
  RequestHandler,
  Express,
  Request,
  Response,
  NextFunction,
} from "express";
import { ServerOpts } from "../server";
import { ExpressRoutes } from "./expressRoutes.interface";

class ExpressServer implements ExpressHttpServerMethods {
  private constructor() {}

  private static express: Express;
  private static instance: ExpressServer;

  /**
   * To get the instance object of restify server use this function
   */
  public static getInstance() {
    if (!ExpressServer.instance) {
      ExpressServer.instance = new ExpressServer();
    }
    return ExpressServer.instance;
  }

  get(url: string, requestHandler: RequestHandler): void {
    this.addRoute("get", "/api" + url, requestHandler);
  }

  post(url: string, requestHandler: RequestHandler): void {
    this.addRoute("post", "/api" + url, requestHandler);
  }

  put(url: string, requestHandler: RequestHandler): void {
    this.addRoute("put", "/api" + url, requestHandler);
  }

  del(url: string, requestHandler: RequestHandler): void {
    this.addRoute("del", "/api" + url, requestHandler);
  }

  head(url: string, requestHandler: RequestHandler): void {
    this.addRoute("head", "/api" + url, requestHandler);
  }

  /**
   * All
   * @param method defines whether the web service call should be get, post, put, del(delete)
   * @param url path which user will call to access
   * @param requestHandler restify request handler
   */
  private addRoute(
    method: "get" | "post" | "put" | "del" | "head",
    url: string,
    requestHandler: RequestHandler
  ) {
    ExpressServer.express[method](
      url,
      (req: Request, res: Response, next: NextFunction) => {
        try {
          // return await requestHandler(req, res, next);
          return requestHandler(req, res, next);
        } catch (error) {
          // Store the logger some where
          return res.status(500).send(error);
        }
      }
    );
    console.debug(`Added route ${method.toUpperCase()}: ${url}`);
  }

  startServer(serverOpts: ServerOpts, routes: object[]): void {
    try {
      ExpressServer.express = express();
      /**
       * Initalize the routes
       */
      this.initRouteControllers(routes);

      ExpressServer.express.listen(serverOpts["port"], () =>
        console.debug(`Server is up and running on port ${serverOpts["port"]}`)
      );
    } catch (error) {
      console.error("ExpressServer -> initialize -> error", error);
      process.exit();
    }
  }

  /**
   * Initalize all routes
   * Routes will be passed as the class objects to the arguments
   * @param CONTROLLERS  Pass the routes as object
   */
  private initRouteControllers(CONTROLLERS: any[]) {
    // this.initialize(this);
    CONTROLLERS.forEach((controller: ExpressRoutes) => {
      try {
        if (typeof controller == "object") {
          /**
           * Every controller routesDefintion will take the input of RestifyHttpServerMethods
           * Passing the class object to provide the defintion of the route
           */
          controller.routesDefinition(this);
        }
      } catch (error) {
        console.error("ApiServer -> initControllers -> error", error);
      }
    });
  }
}

export const expressServer = ExpressServer.getInstance();
