import { AxiosRequestConfig, CancelTokenSource, AxiosResponse } from "axios";

export interface RequestConfig extends AxiosRequestConfig {
  options?: {
    hasFormData?: boolean;
    defaultLoader?: boolean;
    fullResponse?: boolean;
    hideDefaultError?: boolean;
  };
}

export interface ResponseConfig {
  options: {
    defaultLoader?: boolean;
    fullResponse?: boolean;
    defaultError?: boolean;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CustomAxios<T = any> {
  axiosCall: Promise<AxiosResponse<T>>;
  abort: () => void;
}

export type JsonFormData = Record<string, string | Blob>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiRequest = (
  token: CancelTokenSource["token"]
) => Promise<AxiosResponse<any>>;
