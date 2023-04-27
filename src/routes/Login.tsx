import { useState } from "react";
import { Result, Button } from "antd";
import useRedirection from "../hooks/useRedirection";

const Login = () => {
  const [url, setUrl] = useState("");
  useRedirection(url);
  const relogin = () => {
    const url = process.env.REACT_APP_OLD_ADMIN_APP_URL + "/logout";
    setUrl(url);
  };

  return (
    <Result
      className="fallback-ui"
      status="warning"
      title="Session Token has been expired. Kindly login again."
      extra={
        <Button type="primary" key="console" onClick={relogin}>
          Login
        </Button>
      }
    />
  );
};

export default Login;
