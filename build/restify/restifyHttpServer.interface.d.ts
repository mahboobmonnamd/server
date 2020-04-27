import { RequestHandler } from "restify";
/**
 * Interface used to define the http server
 */
export interface RestifyHttpServerMethods {
    /**
     *
     * @param url string Endpoint where our web service needs to be communicated
     * @param requestHandler bind function name with this object
     */
    get(url: string, requestHandler: RequestHandler): void;
    /**
     *
     * @param url string Endpoint where our web service needs to be communicated
     * @param requestHandler bind function name with this object
     */
    post(url: string, requestHandler: RequestHandler): void;
    /**
     *
     * @param url string Endpoint where our web service needs to be communicated
     * @param requestHandler bind function name with this object
     */
    put(url: string, requestHandler: RequestHandler): void;
    /**
     *
     * @param url string Endpoint where our web service needs to be communicated
     * @param requestHandler bind function name with this object
     */
    del(url: string, requestHandler: RequestHandler): void;
    /**
     *
     * @param url string Endpoint where our web service needs to be communicated
     * @param requestHandler bind function name with this object
     */
    head(url: string, requestHandler: RequestHandler): void;
}
