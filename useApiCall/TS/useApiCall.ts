import { useState, useCallback, useRef, useEffect } from 'react';
import { useSnackbar } from '@mui/material';
import { useHistory } from 'react-router-dom';

import { CustomAxios } from './axios.schema';
import { RouteUrls, SIGN_OUT, SOMETHING_WRONG } from '../constants';

interface ApiConfigs<R> {
  successMsg?: string;
  errorMsg?: string;
  callBack?: ({ isError, response }: { isError: boolean; response: R }) => void;
}
type defaultReturnType = Record<string | number, any>;
type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
type ReturnProps<T = undefined, R = defaultReturnType> = [
  callApi: (params?: T, configs?: ApiConfigs<R>) => void,
  loading: boolean,
  data: R | undefined,
  error: any,
  callAbort: CallableFunction | null
];

/**
 * ## UseApiCall - is a hook, use this to make HTTP API calls
 * ----
 * ### Returns - [triggerApiCall, loadingState, successData, errorData, callAbort]
 * ----
 * @param apiCallService API call service function, that must be defined in service file
 * @param onSuccess optional callback, called on api success
 * @param onFail optional callback, called on api failure
 * @param skipRouter to skip router navigation (logout) on api failure (401), Use this to skip router initialisation
 * ---
 * ## triggerApiCall
 * @param params - directly passed to api service function
 * @param configs - optional configs
 *  - successMsg - success message to show on api success
 *  - errorMsg - error message to show on api failure
 *  - hideDefaultError - if true, error message/toast will not be shown
 *  - callBack - a callback on api response, use this to trigger a callback only for a particular api call
 * @example
 * ``` js
 * // callBack example
 * getUserData({userId: id}, {
      callBack: ({isError, apiResponseData}) => {
        if (!isError && apiResponseData) {
          // do something on success
        }
        else {
          // do something on failure
        }
      },
    });
 * ```
 */
function UseApiCall<T, R = Record<string, any>>(
  apiCallService: T extends (...args: any) => CustomAxios
    ? T
    : (...args: any) => CustomAxios,
  onSuccess?: (
    data: Awaited<ReturnType<typeof apiCallService>['axiosCall']>['data']
  ) => void,
  onFail?: (error: any) => void,
  skipRouter = false
): ReturnProps<
  Parameters<typeof apiCallService>[0],
  Awaited<ReturnType<typeof apiCallService>['axiosCall']>['data']
> {
  const [data, setData] = useState<
    Awaited<ReturnType<typeof apiCallService>['axiosCall']>['data'] | undefined
  >(undefined);
  const { openSnackbar } = useSnackbar();
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const callAbort = useRef<CallableFunction | null>(null);
  const isCallCancelledByComponent = useRef<boolean>(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const history = !skipRouter ? useHistory() : undefined;

  useEffect(() => {
    return () => {
      if (callAbort.current && loading) {
        callAbort.current();
        isCallCancelledByComponent.current = true;
      }
    };
  }, [loading]);

  const callApi = (
    params?: Parameters<typeof apiCallService>[0],
    configs: ApiConfigs<R> = {}
  ) => {
    if (loading && callAbort.current) {
      callAbort.current();
      isCallCancelledByComponent.current = true;
    }

    setLoading(true);
    const { axiosCall, abort } = apiCallService(params);
    callAbort.current = abort;
    axiosCall
      .then((response: any) => {
        if (configs.successMsg)
          openSnackbar(configs.successMsg, { variant: 'success' });
        setData(response.data);
        if (onSuccess) onSuccess(response.data);

        if (configs.callBack)
          configs.callBack({ isError: false, response: response.data });
      })
      .catch((err: any) => {
        if (isCallCancelledByComponent.current) return;

        console.warn('<<<<api Err:', err);

        if (configs.callBack)
          configs.callBack({ isError: true, response: err });

        if (Number(err?.status) === 401) {
          onUnauthenticated();
        } else if (Number(err?.status) > 399) {
          if (!err?.options?.hideDefaultError)
            openSnackbar(
              configs.errorMsg || err.options?.errMsg || SOMETHING_WRONG,
              { variant: 'error' }
            );
          setError(err);
          if (onFail) onFail(err);
        }
      })
      .finally(() => {
        if (isCallCancelledByComponent.current) {
          isCallCancelledByComponent.current = false;
          return;
        }
        callAbort.current = null;
        setLoading(false);
      });
  };

  const onUnauthenticated = useCallback(() => {
    if (skipRouter) return;
    openSnackbar(SIGN_OUT, { variant: 'info' });
    window.localStorage.clear();
    if (history) history.push(`${RouteUrls.Login}`);
  }, [history, skipRouter]);

  return [callApi, loading, data, error, callAbort.current];
}

export default UseApiCall;
