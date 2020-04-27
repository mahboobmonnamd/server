import { DBConnectionProps } from "../db";
export interface ServerOpts {
    port: number;
    env?: serverEnvironment;
    CONTROLLERS: object[];
    isSSL?: Boolean;
}
export declare enum serverEnvironment {
    development = 0,
    production = 1
}
export interface ServerSetupOpts {
    db: DBConnectionProps;
}
