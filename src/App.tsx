import { Suspense, useEffect, useState } from "react";
import "./App.less";
import { useRoutes } from "react-router-dom";
import routing from "./routing";
import { Spin } from "antd";

import { COPY_JWT_TOKEN, getNodeToken, getPhpToken, hasRequiredCookies } from "./utils/constants";
import * as Sentry from "@sentry/react";
import { getNodeTokenFromBackend } from "./api/Api";
import ServerError from "./routes/ServerError";
import Login from "./routes/Login";
import { checkJWTTokenChanged } from "./utils/helperFunctions";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [hasNodeToken, setHasNodeToken] = useState<boolean | "FAILED">(false);

  // initial cookie setup
  useEffect(() => {
    const checkCokiesChangedOrNot = async () => {
      if (hasRequiredCookies()) {
        const NODE_TOKEN = getNodeToken();
        if (!isLoggedIn) {
          setIsLoggedIn(true);
        }

        if (NODE_TOKEN) {
          // CHECKING IF JWT AND COPY_JWT IS CHANGED OR NOT

          const isJWTChanged = checkJWTTokenChanged();
          if (isJWTChanged) {
            // update copy of JWT_TOKEN
            localStorage.setItem(COPY_JWT_TOKEN, getPhpToken() || "");
            const response = await getNodeTokenFromBackend();
            if (response?.token) {
              setHasNodeToken(true);
              // document.cookie = `NODE_TOKEN = ${response.token}`;
              localStorage.setItem("NODE_TOKEN", response?.token);
              // Doing location.reload(), as Node token is initially not present, and hence it will not be avaiable when axios
              // instance is created.
              location.reload();
            } else {
              setHasNodeToken("FAILED");
            }
          } else {
            setHasNodeToken(true);
          }
        } else if (!NODE_TOKEN) {
          const response = await getNodeTokenFromBackend();

          if (response?.token) {
            setHasNodeToken(true);
            // document.cookie = `NODE_TOKEN = ${response.token}`;
            localStorage.setItem("NODE_TOKEN", response?.token);
            // Doing location.reload(), as Node token is initially not present, and hence it will not be avaiable when axios
            // instance is created.
            location.reload();
          } else {
            setHasNodeToken("FAILED");
          }
        }
      } else {
        //redirect to login and clear local storage
        if (isLoggedIn) {
          setIsLoggedIn(false);
        }
      }
    };
    checkCokiesChangedOrNot();
  }, []);

  const content = useRoutes(routing(isLoggedIn));

  return (
    <div>
      {hasNodeToken === true ? (
        <Suspense fallback={<FallbackUI />}>{content}</Suspense>
      ) : hasNodeToken === "FAILED" ? (
        <ServerError />
      ) : isLoggedIn ? (
        <FallbackUI />
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Sentry.withProfiler(App);

const FallbackUI = () => {
  return (
    <div className="fallback-ui">
      <Spin tip="Loading..." />
    </div>
  );
};
