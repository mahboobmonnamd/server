import { RestifyHttpServerMethods } from "./restifyHttpServer.interface";
export interface RestifyRoutes {
    routesDefinition(httpServer: RestifyHttpServerMethods): void;
}
