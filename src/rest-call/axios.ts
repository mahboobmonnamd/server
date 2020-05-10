import Axios from "axios";

export class AxiosService {
  /**
   * Get web service will be called with the given url and if any headers added
   * By default it will add csrf token to the
   * @param url ip/domain in which the web service needs to communicate
   * @param headers if any headers to be appended
   */
  get(url: string, headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (headers) {
        Axios.defaults.headers.common = headers;
        Axios.defaults.responseType = "json";
      }
      try {
        return Axios.get(url)
          .then((result) => {
            return resolve(result.data);
          })
          .catch((err) => {
            return reject(err);
          });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Function to call post web service with Axios Framework.
   * This is Promise based function call.
   * Uses CSRF validation for OData Calls
   * @param url -> string with filters applied
   * @returns Promise Object
   */
  post(url: string, data: any, headers = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      Axios.post(url, data, { headers: headers })
        .then((response) => {
          return resolve(response);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  put(url: string, data: any, headers = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      Axios.put(url, data, { headers: headers })
        .then((response) => {
          return resolve(response);
        })
        .catch((err) => {
          let errResponse: any = {
            status: err.response.status,
            statusText: err.response.statusText,
            url: err.response.config.url,
            data: err.response.data,
          };
          return reject(errResponse);
        });
    });
  }

  delete(url: string, data: any, headers = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      if (headers) {
        Axios.defaults.headers.common = headers;
      }
      Axios.delete(url, { headers: headers })
        .then((response) => {
          return resolve(response);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}
