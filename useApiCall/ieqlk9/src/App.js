import { useEffect } from "react";

import "./styles.css";
import { getUserData } from "./ApiServices/getUserData";
import useApiCall from "./useApiCallGit/TsVersion/useApiCall";

export default function App() {
  const [getData, isLoading, userData] = useApiCall(getUserData);

  useEffect(() => {
    getData({ pageNumber: 1 });
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>

      <button
        onClick={() => {
          getData({ pageNumber: 2 });
        }}
      >
        get User List
      </button>

      {!userData ? null : (
        <>
          <h1>User Data:</h1>
          {isLoading ? (
            <div>Loading</div>
          ) : (
            <div>{JSON.stringify(userData)}</div>
          )}
        </>
      )}
    </div>
  );
}
