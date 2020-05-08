"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var ExpressServer = /** @class */ (function () {
    function ExpressServer() {
    }
    /**
     * To get the instance object of restify server use this function
     */
    ExpressServer.getInstance = function () {
        if (!ExpressServer.instance) {
            ExpressServer.instance = new ExpressServer();
        }
        return ExpressServer.instance;
    };
    ExpressServer.prototype.get = function (url, requestHandler) {
        this.addRoute("get", "/api" + url, requestHandler);
    };
    ExpressServer.prototype.post = function (url, requestHandler) {
        this.addRoute("post", "/api" + url, requestHandler);
    };
    ExpressServer.prototype.put = function (url, requestHandler) {
        this.addRoute("put", "/api" + url, requestHandler);
    };
    ExpressServer.prototype.del = function (url, requestHandler) {
        this.addRoute("del", "/api" + url, requestHandler);
    };
    ExpressServer.prototype.head = function (url, requestHandler) {
        this.addRoute("head", "/api" + url, requestHandler);
    };
    /**
     * All
     * @param method defines whether the web service call should be get, post, put, del(delete)
     * @param url path which user will call to access
     * @param requestHandler restify request handler
     */
    ExpressServer.prototype.addRoute = function (method, url, requestHandler) {
        ExpressServer.express[method](url, function (req, res, next) {
            try {
                // return await requestHandler(req, res, next);
                return requestHandler(req, res, next);
            }
            catch (error) {
                // Store the logger some where
                return res.status(500).send(error);
            }
        });
        console.debug("Added route " + method.toUpperCase() + ": " + url);
    };
    ExpressServer.prototype.startServer = function (serverOpts, routes) {
        try {
            ExpressServer.express = express_1.default();
            /**
             * Initalize the routes
             */
            this.initRouteControllers(routes);
            ExpressServer.express.listen(serverOpts["port"], function () {
                return console.debug("Server is up and running on port " + serverOpts["port"]);
            });
        }
        catch (error) {
            console.error("ExpressServer -> initialize -> error", error);
            process.exit();
        }
    };
    /**
     * Initalize all routes
     * Routes will be passed as the class objects to the arguments
     * @param CONTROLLERS  Pass the routes as object
     */
    ExpressServer.prototype.initRouteControllers = function (CONTROLLERS) {
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
                console.error("ApiServer -> initControllers -> error", error);
            }
        });
    };
    return ExpressServer;
}());
exports.expressServer = ExpressServer.getInstance();
//# sourceMappingURL=expressServer.js.map