"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var restify_1 = require("restify");
var logger_1 = require("../logger");
/**
 * Create a singleton resify server.
 * RestifyServer.getInstance will allow to invoke the server object
 */
var RestifyServer = /** @class */ (function () {
    function RestifyServer() {
    }
    /**
     * To get the instance object of restify server use this function
     */
    RestifyServer.getInstance = function () {
        if (!RestifyServer.instance) {
            RestifyServer.instance = new RestifyServer();
        }
        return RestifyServer.instance;
    };
    RestifyServer.prototype.get = function (url, requestHandler) {
        this.addRoute("get", "/api" + url, requestHandler);
    };
    RestifyServer.prototype.post = function (url, requestHandler) {
        this.addRoute("post", "/api" + url, requestHandler);
    };
    RestifyServer.prototype.put = function (url, requestHandler) {
        this.addRoute("put", "/api" + url, requestHandler);
    };
    RestifyServer.prototype.del = function (url, requestHandler) {
        this.addRoute("del", "/api" + url, requestHandler);
    };
    RestifyServer.prototype.head = function (url, requestHandler) {
        this.addRoute("head", "/api" + url, requestHandler);
    };
    /**
     * All
     * @param method defines whether the web service call should be get, post, put, del(delete)
     * @param url path which user will call to access
     * @param requestHandler restify request handler
     */
    RestifyServer.prototype.addRoute = function (method, url, requestHandler) {
        RestifyServer.restify[method](url, function (req, res, next) {
            // Execute our middleware
            try {
                // return await requestHandler(req, res, next);
                return requestHandler(req, res, next);
            }
            catch (e) {
                // Store the logger somewhere
                req.log.error(e);
                return res.send(500, e);
            }
        });
        console.log("Added route " + method.toUpperCase() + ": " + url);
    };
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
    RestifyServer.prototype.startServer = function (serverOpts) {
        try {
            /**
             * SHOULD CREATE SERVER WITH OPTIONS LIKE SSL, LOGS, ETC.
             */
            this.createServerWithOptions(serverOpts["isSSL"] != undefined ? serverOpts["isSSL"] : false);
            /**
             * VALIDATING THE METHODS
             */
            // this.restify.on('MethodNotAllowed', this.unknownMethodHandler);
            /**
             * PLUGINS INITIALIZATION FOR RESTIFY
             */
            this.initializePlugins(serverOpts["maxFileSize"] ? serverOpts["maxFileSize"] : 1500);
            RestifyServer.restify.on("after", function (req, res, route) {
                req.log.info({ req: req, res: res }, "finished"); // (3)
            });
            process.on("unhandledRejection", function (reason, p) {
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
            RestifyServer.restify.listen(serverOpts["port"], function () {
                return console.log("Server is up and running on port " + serverOpts["port"]);
            });
        }
        catch (error) {
            console.log("RestifyServer -> initialize -> error", error);
            process.exit();
        }
    };
    /**
     * Handle the plugins initialization using pre and use of restify.
     *
     * @param maxFileSize how much file size should be accepted.
     */
    RestifyServer.prototype.initializePlugins = function (maxFileSize) {
        RestifyServer.restify.use(restify_1.plugins.bodyParser({
            mapParams: false,
            multiples: true,
            maxFileSize: maxFileSize,
        }));
        RestifyServer.restify.use(restify_1.plugins.queryParser());
        RestifyServer.restify.use(restify_1.plugins.requestLogger());
        RestifyServer.restify.use(restify_1.plugins.fullResponse());
        RestifyServer.restify.use(restify_1.plugins.gzipResponse());
    };
    /**
     * Initalize all routes
     * Routes will be passed as the class objects to the arguments
     * @param CONTROLLERS  Pass the routes as object
     */
    RestifyServer.prototype.initRouteControllers = function (CONTROLLERS) {
        var _this = this;
        // this.initialize(this);
        CONTROLLERS.forEach(function (controller) {
            try {
                if (typeof controller == "object") {
                    /**
                     * Every controller routesDefintion will take the input of RestifyHttpServerMethods
                     * Passing the class object to provide the defintion of the route
                     */
                    controller.routesDefinition(_this);
                }
            }
            catch (error) {
                console.log("ApiServer -> initControllers -> error", error);
            }
        });
    };
    /**
     * create restify server object.
     * This object should be created first to register routes
     * @param isSSL
     */
    RestifyServer.prototype.createServerWithOptions = function (isSSL) {
        if (isSSL === true) {
            RestifyServer.restify = restify_1.createServer({
            // log: ApiServer.Logger.logger,
            // httpsServerOptions: {
            //   key: readFileSync(join(__dirname, "../../assets/key.pem")),
            //   cert: readFileSync(join(__dirname, "../../assets/server.crt")),
            //   //requestCert: true,
            //   rejectUnauthorized: false,
            //   //ca: [fs.readFileSync(path.join(__dirname, 'server.crt'))]
            // },
            });
        }
        else {
            RestifyServer.restify = restify_1.createServer({
                log: logger_1.BunyanLogger.getInstance().loggerInstance,
            });
        }
    };
    /**
     * For any restify pre, use this function from where the object is created.
     * @param handler
     */
    RestifyServer.pre = function (handler) {
        RestifyServer.restify.pre(handler);
    };
    return RestifyServer;
}());
exports.restifyServer = RestifyServer.getInstance();
//# sourceMappingURL=restifyServer.js.map