import { useEffect } from "react";

const useRedirection = (url: string | undefined) => {
  useEffect(() => {
    if (url !== undefined && !url.includes("undefined") && url !== "") {
      window.location.href = url as string;
    } else {
      console.log("url has undefined: ", url);
    }
  }, [url]);
};

export default useRedirection;
