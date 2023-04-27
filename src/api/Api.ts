import axios from "axios";
import { checkJWTTokenChanged, logout, onError } from "../utils/helperFunctions";
import { getPhpToken, getWareHouseId, getNodeToken, COPY_JWT_TOKEN } from "../utils/constants";

const PhPAppURL = process.env.REACT_APP_URL;
const NodeAppUrl = process.env.REACT_APP_NODE_APP_URL;

// For common configs
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "true";

export const phpInstance = axios.create({
  baseURL: PhPAppURL,
  headers: {
    Authorization: `Bearer ${getPhpToken()}`,
    WAREHOUSEID: getWareHouseId() as string
  }
});

export const nodeInstance = axios.create({
  baseURL: NodeAppUrl,
  headers: {
    Authorization: `Bearer ${getNodeToken()}`,
    WAREHOUSEID: getWareHouseId() as string
  }
});

export const prodInstance = axios.create({
  baseURL: "https://api.niyotail.com",
  headers: { Authorization: `Bearer ${getPhpToken()}`, WAREHOUSEID: getWareHouseId() as string }
});

export const getNodeTokenFromBackend = async () => {
  try {
    const response = await prodInstance.get(`admin/v1/gateway/token`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error: any) {
    onError(error);
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const changeNodeTokenFromBackend = async () => {
  try {
    // updating copy of JWT_TOKEN
    localStorage.setItem(COPY_JWT_TOKEN, getPhpToken() || "");
    const response = await phpInstance.get(`admin/v1/gateway/token`);
    const res = response?.data?.data;
    if (res?.token) {
      localStorage.setItem("NODE_TOKEN", res?.token);
      // Doing location.reload() to change NODE_TOKEN for node instance
      location.reload();
    }
    return Promise.resolve(response?.data?.data || []);
  } catch (error: any) {
    onError(error);
    console.log("error", error);
    return Promise.resolve([]);
  }
};

// Api response check for PHP Instance
phpInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response) {
      // For unauthorized ie if 401, then redirecting to logout page of Old Admin Panel
      const { status, statusText } = error.response;
      if (status === 401 || statusText === "Unauthorized") {
        logout();
      }
      // For forbidden ie if 403, then redirecting to logout page of Old Admin Panel
      if (status === 403 || statusText === "Forbidden") {
        logout();
      }
    }

    return Promise.reject(error);
  }
);

// Api response check for Node Instance
nodeInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response) {
      // For unauthorized ie if 401, then redirecting to logout page of Old Admin Panel
      const { status, statusText } = error.response;
      if (status === 401 || statusText === "Unauthorized") {
        logout();
      }
      // For forbidden ie if 403, then redirecting to logout page of Old Admin Panel
      if (status === 403 || statusText === "Forbidden") {
        logout();
      }
    }

    return Promise.reject(error);
  }
);

// Api request check for PHP Instance
phpInstance.interceptors.request.use(
  async function (config) {
    const isJWTChanged = checkJWTTokenChanged();
    if (isJWTChanged) {
      // console.log("JWT_CHANGED......");
      await changeNodeTokenFromBackend();
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Api request check for Node Instance
nodeInstance.interceptors.request.use(
  async function (config) {
    const isJWTChanged = checkJWTTokenChanged();
    if (isJWTChanged) {
      // console.log("JWT_CHANGED......");
      await changeNodeTokenFromBackend();
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
