import { DBConnectionProps } from "../db";
import { ServerConfigurations } from "../share";
export interface ServerOpts {
    port: number;
    env?: serverEnvironment;
    isSSL?: Boolean;
}
export declare enum serverEnvironment {
    development = 0,
    production = 1
}
export interface ServerSetupOpts {
    /**
     * Server configurations
     */
    serverConfigurations: ServerConfigurations;
    /**
     * Server opts to create the server
     */
    serverOpts: ServerOpts;
    /**
     * route controllers needs to be passed here
     */
    routesDefintions: object[];
    /**
     * if db connection needs to be created
     */
    db?: DBConnectionProps;
}
