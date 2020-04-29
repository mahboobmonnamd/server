import { RestifyHttpServerMethods } from "./restifyHttpServer.interface";
import { RestifyRoutes } from "./restifyRoutes.interface";
import {
  Server,
  RequestHandler,
  createServer,
  plugins,
  RequestHandlerType,
} from "restify";
import { ServerOpts } from "../server/server.interface";
import { BunyanLogger } from "../logger";

/**
 * Create a singleton resify server.
 * RestifyServer.getInstance will allow to invoke the server object
 */
class RestifyServer implements RestifyHttpServerMethods {
  private constructor() {}
  private static restify: Server;
  private static instance: RestifyServer;

  /**
   * To get the instance object of restify server use this function
   */
  public static getInstance() {
    if (!RestifyServer.instance) {
      RestifyServer.instance = new RestifyServer();
    }
    return RestifyServer.instance;
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
    RestifyServer.restify[method](url, (req, res, next) => {
      // Execute our middleware
      try {
        // return await requestHandler(req, res, next);
        return requestHandler(req, res, next);
      } catch (e) {
        // Store the logger somewhere
        req.log.error(e);
        return res.send(500, e);
      }
    });
    console.log(`Added route ${method.toUpperCase()}: ${url}`);
  }

  /**
   * Handles all unknown methods and response as success
   * To defined all supported headers
   * @param req restify request object
   * @param res restify response object
   */
  /*
    private unknownMethodHandler(req: Request, res: Response) {
        try {
            console.log('')
            if (req.method) {
                if (req.method.toLowerCase() === 'options') {
                    var allowHeaders = [
                        'Accept',
                        'Accept-Version',
                        'Content-Type',
                        'Api-Version',
                        'Origin',
                        'X-Requested-With',
                        'Authorization',
                        'API-KEY',
                        'api-token'
                    ];

                    if (res['methods'].indexOf('OPTIONS') === -1)
                        res['methods'].push('OPTIONS');

                    res.header('Access-Control-Allow-Credentials', true);
                    res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
                    res.header('Access-Control-Allow-Methods', res['methods'].join(', '));
                    res.header('Access-Control-Allow-Origin', req.headers.origin);

                    res.header("X-Frame-Options", "DENY");
                    res.header("Content-Security-Policy", "frame-ancestors 'none'");

                    return res.send(200);
                }
                // else
                //     return res.send(new this.restify.MethodNotAllowedError());
            }

            // Handle cors
            let cors = corsMiddleware({
                preflightMaxAge: 5, //Optional
                origins: ['*'],
                allowHeaders: ['api-token', 'API-KEY', 'authorization', 'refresh_token'],
                exposeHeaders: ['API-Token-Expiry', 'authorization']
            });
            this.restify.pre(cors.preflight);
            this.restify.use(cors.actual);
        } catch (error) {
            req.log.error(error);
            res.send(404, `Url not implemented`)
        }
    }
    */

  startServer(serverOpts: ServerOpts): void {
    try {
      /**
       * SHOULD CREATE SERVER WITH OPTIONS LIKE SSL, LOGS, ETC.
       */
      this.createServerWithOptions(
        serverOpts["isSSL"] != undefined ? serverOpts["isSSL"] : false
      );

      /**
       * VALIDATING THE METHODS
       */
      // this.restify.on('MethodNotAllowed', this.unknownMethodHandler);

      /**
       * PLUGINS INITIALIZATION FOR RESTIFY
       */
      this.initializePlugins(
        serverOpts["maxFileSize"] ? serverOpts["maxFileSize"] : 1500
      );
      RestifyServer.restify.on("after", function (req, res, route) {
        req.log.info({ req: req, res: res }, "finished"); // (3)
      });
      process.on("unhandledRejection", (reason, p) => {
        console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
        // application specific logging, throwing an error, or other logic here
      });

      /**
       * Initalize the routes
       */
      this.initRouteControllers(serverOpts["CONTROLLERS"]);

      // Create web socket connection
      //   if (isSocketRequired) {
      //     new WSSocket().sockets(socketPort);
      // }

      RestifyServer.restify.listen(serverOpts["port"], () =>
        console.log(`Server is up and running on port ${serverOpts["port"]}`)
      );
    } catch (error) {
      console.log("RestifyServer -> initialize -> error", error);
      process.exit();
    }
  }

  /**
   * Handle the plugins initialization using pre and use of restify.
   *
   * @param maxFileSize how much file size should be accepted.
   */
  private initializePlugins(maxFileSize) {
    RestifyServer.restify.use(
      plugins.bodyParser({
        mapParams: false,
        multiples: true,
        maxFileSize: maxFileSize,
      })
    );
    RestifyServer.restify.use(plugins.queryParser());
    RestifyServer.restify.use(plugins.requestLogger());
    RestifyServer.restify.use(plugins.fullResponse());
    RestifyServer.restify.use(plugins.gzipResponse());
  }

  /**
   * Initalize all routes
   * Routes will be passed as the class objects to the arguments
   * @param CONTROLLERS  Pass the routes as object
   */
  private initRouteControllers(CONTROLLERS: any[]) {
    // this.initialize(this);
    CONTROLLERS.forEach((controller: RestifyRoutes) => {
      try {
        if (typeof controller == "object") {
          /**
           * Every controller routesDefintion will take the input of RestifyHttpServerMethods
           * Passing the class object to provide the defintion of the route
           */
          controller.routesDefinition(this);
        }
      } catch (error) {
        console.log("ApiServer -> initControllers -> error", error);
      }
    });
  }

  /**
   * create restify server object.
   * This object should be created first to register routes
   * @param isSSL
   */
  private createServerWithOptions(isSSL: Boolean) {
    if (isSSL === true) {
      RestifyServer.restify = createServer({
        // log: ApiServer.Logger.logger,
        // httpsServerOptions: {
        //   key: readFileSync(join(__dirname, "../../assets/key.pem")),
        //   cert: readFileSync(join(__dirname, "../../assets/server.crt")),
        //   //requestCert: true,
        //   rejectUnauthorized: false,
        //   //ca: [fs.readFileSync(path.join(__dirname, 'server.crt'))]
        // },
      });
    } else {
      RestifyServer.restify = createServer({
        log: BunyanLogger.getInstance().loggerInstance,
      });
    }
  }

  /**
   * For any restify pre, use this function from where the object is created.
   * @param handler
   */
  public static pre(handler: RequestHandlerType) {
    RestifyServer.restify.pre(handler);
  }
}

export const restifyServer = RestifyServer.getInstance();
