/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, CancelTokenSource, AxiosResponse } from 'axios';

import config from '../../../../config';
import networkInterceptor from './interceptor';
import { ApiRequest, RequestConfig, CustomAxios } from '../../../types/axios.schema';

// Change is base url on project basis
const baseURL = 'https://www.baseUrl.com'
const REQUEST_TIMEOUT = 20000;
let instance: AxiosInstance;

/**
 * @function getInstance
 * @description return axois instance
 */
const getInstance = async () => {
  if (!instance) {
    instance = createInstance();
    networkInterceptor.register(instance);
  }
  return instance;
};

/**
 * @function createInstance
 * @description create axios instance only once
 */
const createInstance = (): AxiosInstance => {
  instance = axios.create({
    baseURL,
    timeout: REQUEST_TIMEOUT,
  });

  return instance;
};

const getCancelToken = (): CancelTokenSource => {
  const source = axios.CancelToken.source();
  return source;
};

/**
 * @function applyCancelPromise
 * @param {ApiRequest} callback - an axios api request function like get / post / put
 * @description Return new Promise with cancellation mechanism
 */
const applyCancelPromise = (callback: ApiRequest): CustomAxios => {
  const cancelToken = getCancelToken();
  let isRequestComplete = false;

  const requestCancelPromise = {
    axiosCall: new Promise<AxiosResponse>((resolve, reject) => {
      callback(cancelToken.token)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          isRequestComplete = true;
        });
    }),
    abort: () => {
      if (isRequestComplete) return;
      cancelToken.cancel();
    },
  };

  return requestCancelPromise;
};

/**
 * @param {string} url
 * @param {*} body
 * @param {*} headers
 * @param {*} ConfigOptions
 * These config options can be passed to the api options
 * - errMsg: Error message to be shown in case of error
 * - fullResponse: to get the actual axios api response (only data object in the apu response is returned)
 * - hideDefaultError: to hide the default error message (use in case of custom conditional error message)
 */
const get = (
  url: string,
  params?: Record<string, any>,
  headers?: Record<string, string>,
  options: RequestConfig['options'] = {},
) => {
  return applyCancelPromise((token) => {
    const urlParams = new URLSearchParams(params).toString();
    let newUrl = url;
    if (urlParams) {
      newUrl = `${url}?${decodeURIComponent(urlParams)}`;
    }

    return instance.get(newUrl, {
      headers,
      options,
      cancelToken: token,
    } as RequestConfig);
  });
};

/**
 * @param {string} url
 * @param {*} body
 * @param {*} headers
 * @param {*} ConfigOptions
 * These config options can be passed to the api options
 * - errMsg: Error message to be shown in case of error
 * - hasFormData: to convert api data into form data
 * - fullResponse: to get the actual axios api response (only data object in the apu response is returned)
 * - hideDefaultError: to hide the default error message (use in case of custom conditional error message)
 */
const post = (
  url: string,
  body?: Record<string, any>,
  headers?: Record<string, string>,
  options: RequestConfig['options'] = {},
) => {
  return applyCancelPromise((token) => {
    return instance.post(url, body, {
      headers,
      options,
      cancelToken: token,
    } as RequestConfig);
  });
};

/**
 * @param {string} url
 * @param {*} body
 * @param {*} headers
 * @param {*} ConfigOptions
 * These config options can be passed to the api options
 * - errMsg: Error message to be shown in case of error
 * - hasFormData: to convert api data into form data
 * - fullResponse: to get the actual axios api response (only data object in the apu response is returned)
 * - hideDefaultError: to hide the default error message (use in case of custom conditional error message)
 */
const patch = (
  url: string,
  body?: Record<string, string>,
  headers?: Record<string, string>,
  options: RequestConfig['options'] = {},
) => {
  return applyCancelPromise((token) => {
    return instance.patch(url, body, {
      headers,
      options,
      cancelToken: token,
    } as RequestConfig);
  });
};

/**
 * @param {string} url
 * @param {*} body
 * @param {*} headers
 * @param {*} ConfigOptions
 * These config options can be passed to the api options
 * - errMsg: Error message to be shown in case of error
 * - hasFormData: to convert api data into form data
 * - fullResponse: to get the actual axios api response (only data object in the apu response is returned)
 * - hideDefaultError: to hide the default error message (use in case of custom conditional error message)
 */
const deleteCall = (url: string, headers?: Record<string, string>, options: RequestConfig['options'] = {}) => {
  return applyCancelPromise((token) => {
    return instance.delete(url, {
      headers,
      options,
      cancelToken: token,
    } as RequestConfig);
  });
};

getInstance();

export { get, post, patch, deleteCall };
