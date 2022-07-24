/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from "axios";

import { RequestConfig, ResponseConfig, JsonFormData } from "../axios.schema";
import { DEFAULT_INTERCEPTOR_CONFIG, AUTH_TOKEN_KEY } from "../../constants";

let requestInterceptorRef: number | null = null;
let responseInterceptorRef: number | null = null;

/**
 * @function getDefaultHeaders
 * @description generate default headers which can be send with every request
 */
const getDefaultHeaders = () => {
  const token = AUTH_TOKEN_KEY;

  let headers = {};
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`
    };
  }
  return headers;
};

/**
 * @function getDefaultParams
 * @description generate default params which can be send with every GET request
 */
const getDefaultParams = () => {
  return "";
};

/**
 * @function getDefaultBody
 * @description Generate default body which can be send with every POST request
 */
const getDefaultBody = () => {
  return {};
};

/**
 * @function jsonToFormData
 * @param {JsonFormData} jsonObj
 * @description Convert Json object to FormData {pass 'hasFormData' to options in post/put request object}
 */
const jsonToFormData = (jsonObj: JsonFormData = {}) => {
  const formData = new FormData();
  Object.entries(jsonObj).forEach(([key, val]) => {
    formData.append(key, val);
  });
  return formData;
};

/**
 * @function formatApiError
 * @param {number} status
 * @param {object} data
 * @description return API error
 */
const formatApiError = (
  status?: string | number,
  data?: Record<string, any>,
  options: ResponseConfig["options"] = {}
): Promise<never> => {
  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({ status, data, options });
};

/**
 * @function onRequest
 * @param {AxiosRequestConfig} config
 * @description on axois request
 */
const onRequest = (axiosConfig: RequestConfig): AxiosRequestConfig => {
  const config = { ...axiosConfig };
  config.options = { ...DEFAULT_INTERCEPTOR_CONFIG, ...config.options };

  config.headers = { ...getDefaultHeaders(), ...config.headers };

  if (config.method === "get") {
    const defaultParams = getDefaultParams();
    if (defaultParams && config.url) {
      config.url += config.url.includes("?")
        ? `&${defaultParams}`
        : `?${defaultParams}`;
    }
  } else {
    const defaultBody = getDefaultBody();
    config.data = { ...defaultBody, ...config.data };

    // generate FormData form JSON object
    if (config.options.hasFormData) {
      config.data = jsonToFormData(config.data);
    }
  }

  // show default loader
  if (config.options.defaultLoader) {
    // TODO: Add a global method to show a loader while an api call is in progress
  }

  if (config.data === undefined) {
    config.data = null;
  }
  return config;
};

/**
 * @function onRequest
 * @param {AxiosRequestConfig} config
 * @description on axois request
 */
const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  // eslint-disable-next-line no-console
  console.warn(`[request error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
};

/**
 * @function onResponseSuccess
 * @param {AxiosResponse} resp
 * @description on axois success response
 */
const onResponseSuccess = (
  response: AxiosResponse
): AxiosResponse | Promise<never> => {
  const { options } = response.config as ResponseConfig & AxiosResponse;

  if (options.fullResponse) {
    return { data: response, options } as any;
  }

  const { data } = response;

  return { data, options } as any;
};

/**
 * @function onResponseError
 * @param {AxiosError} resp
 * @description on axois error response
 */
const onResponseError = (err: AxiosError): Promise<AxiosError> => {
  const { options } = (err.config || {}) as AxiosError["config"] &
    ResponseConfig;
  const { data, status } = err.response || { status: 0 };

  return formatApiError(status, data, options);
};

/**
 * @function registerNetworkInterceptor
 * @param {AxiosInstance} instance
 * @description register interceptor; called just once at the start of app.
 */
const registerNetworkInterceptor = (instance: AxiosInstance) => {
  // handle default configuration in request interceptor
  requestInterceptorRef = instance.interceptors.request.use(
    onRequest,
    onRequestError
  );

  // handle default configuration in response interceptor
  responseInterceptorRef = instance.interceptors.response.use(
    onResponseSuccess,
    onResponseError
  );
};

/**
 * @function deregisterNetworkInterceptor
 * @param {AxiosInstance} instance
 * @description de-registers the interceptor; currently not being used (mostly it would not be used)
 */
const deregisterNetworkInterceptor = (instance: AxiosInstance) => {
  // handle default configuration in request interceptor
  if (requestInterceptorRef)
    instance.interceptors.request.eject(requestInterceptorRef);

  // handle default configuration in response interceptor
  if (responseInterceptorRef)
    instance.interceptors.response.eject(responseInterceptorRef);
};

export default {
  register: registerNetworkInterceptor,
  deregister: deregisterNetworkInterceptor
};
