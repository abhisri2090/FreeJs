# useApiCall Hook
A Hook implemented to separate out the API calls from React UI and provides required function / variable to access Api data.

# Problems
(All these are regarding a big / growing project)
1) Some junior(immature) developers write api call within the React component.
2) Handling async Api, api error (Ex: 401), api cancellation on component unmount and/or show toast on api error/success has to be catered at every place.
3) Manipulating Api param, url or response object on some condition basis creates unnecessary mess inside React component.
4) Different developer has different approach towards api call but one application should have only one approach.

# Solution
Build something that forces developer to follow a defined path.

# Example
codeSandBox => https://codesandbox.io/s/sweet-bohr-ieqlk9