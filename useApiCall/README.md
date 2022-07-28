# useApiCall Hook
A Hook implemented to architecturally separate out the API calls from React UI and provides required function / variable to access Api data.
```
const [getUserData, isLoading, userData, userError, cancelUserCall] = useApiCall(userApiService)
```

## Example
codeSandBox example => https://codesandbox.io/s/sweet-bohr-ieqlk9

## Problems cantered
(All these are regarding a big / growing project)
1) Some junior developers write api call within the React component.
2) Different developer has different approach towards api call but one application should have only one approach.
3) Handling async Api, api error (Ex: 401), api cancellation on component unmount and/or show toast on api error/success has to be catered at every place.
4) Manipulating Api param, url or response object on some conditional basis creates unnecessary mess inside a React component.

## Solution
Build a axios wrapper that forces developer to follow a defined path of writing an API call.

## Code walkthrough
Hook implementation has been divided into three parts:
1) Hook itself (userApiHook.ts)
2) Axios Interceptor - provides get, post, etc methods of axios with all the base configs (interceptor.ts & network.ts).
3) Service file - file were an api call is written.

* Service File return a get, post, etc call function, that will be passed to useApiHook.
* useApiHook return an array as [callApi, loading, data, error, callAbort]
    * callApi - use this function to make api call (on button click).
    * loading - state of api call, true when api call is in transit.
    * data - api response data
    * error - if in case api resolves to an error
    * callAbort - a function to cancel api call in transit (will be auto triggered in case of component unmount)

## Note
* Keep all the service files in a separate folder
* Keep interceptor.ts & network.ts file in a separate folder.
* Keep userApiHook.ts in a 'Hook' folder.

## Future Scope
* useApiCall Test cases
* useApiCall mock function / component.