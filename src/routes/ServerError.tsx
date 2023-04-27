import { Result, Button } from "antd";
import { ERROR_FALLBACK_TEXT } from "../utils/constants";

const ServerError = () => (
  <Result
    className="server-error-ui"
    status="500"
    title="500"
    subTitle={`Sorry, ${ERROR_FALLBACK_TEXT}`}
    extra={
      <Button type="primary" onClick={() => location.reload()}>
        Try Again
      </Button>
    }
  />
);

export default ServerError;
