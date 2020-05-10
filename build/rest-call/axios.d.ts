export declare class AxiosService {
    /**
     * Get web service will be called with the given url and if any headers added
     * By default it will add csrf token to the
     * @param url ip/domain in which the web service needs to communicate
     * @param headers if any headers to be appended
     */
    get(url: string, headers?: any): Promise<any>;
    /**
     * Function to call post web service with Axios Framework.
     * This is Promise based function call.
     * Uses CSRF validation for OData Calls
     * @param url -> string with filters applied
     * @returns Promise Object
     */
    post(url: string, data: any, headers?: {}): Promise<any>;
    put(url: string, data: any, headers?: {}): Promise<any>;
    delete(url: string, data: any, headers?: {}): Promise<any>;
}
