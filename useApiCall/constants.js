const DEFAULT_INTERCEPTOR_CONFIG = {
  errMsg: '',
  hasFormData: false,
  fullResponse: false,
  hideDefaultError: false,
};

const AUTH_TOKEN_KEY = 'Application Token';
const RouteUrls = { login: '/login' };
const SIGN_OUT = 'Signed out! Please login again'
const SOMETHING_WRONG = 'Something went wrong'

export {
  DEFAULT_INTERCEPTOR_CONFIG,
  AUTH_TOKEN_KEY,
  RouteUrls,
  SIGN_OUT,
  SOMETHING_WRONG,
};
