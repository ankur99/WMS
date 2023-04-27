import { message, notification } from "antd";
import { AxiosError } from "axios";
import {
  ERROR_FALLBACK_TEXT,
  getPhpToken,
  getWareHouseId,
  hasRequiredCookies,
  timeForToastError,
  timeForToastSuccess,
  COPY_JWT_TOKEN
} from "./constants";
import type { RangePickerProps } from "antd/es/date-picker";
import moment from "moment";
import { FilterValue } from "antd/lib/table/interface";
import { phpInstance, nodeInstance } from "../api/Api";

export const onError = (error: AxiosError) => {
  const msg = getErrorMessages(error);
  message.error(msg, timeForToastError);
};

export const onErrorNotification = (error: AxiosError) => {
  const desc = getErrorMessages(error);
  notification["error"]({
    message: "Error",
    description: desc,
    duration: 0,
    placement: "topRight"
  });
};

export const showErrorToast = (msg: string) => {
  message.error(msg || ERROR_FALLBACK_TEXT, timeForToastError);
};

export const showSuccessToast = (msg: string) => {
  message.success(msg || "Successfully done!", timeForToastSuccess);
};

export const showErrorNotification = ({ msg, desc }: { msg: string; desc: string }) => {
  notification["error"]({
    message: msg || "Error",
    description: desc || ERROR_FALLBACK_TEXT,
    duration: 0,
    placement: "topRight"
  });
};

interface DownloadCSV {
  uri: string;
  fileName: string;
  instanceType: "php" | "node";
}

export const downloadCSVWithInstance = async ({ uri, fileName, instanceType }: DownloadCSV) => {
  try {
    let response;

    if (instanceType === "php") {
      response = await phpInstance({
        url: uri,
        method: "GET",
        responseType: "blob" // important
      });
    } else {
      response = await nodeInstance({
        url: uri,
        method: "GET",
        responseType: "blob" // important
      });
    }
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error: any) {
    const msg = getErrorMessages(error);
    showErrorToast(msg);
  }
};

export const formatArray = (array: []) => {
  const newArray: Record<string, unknown>[] = [];
  if (array && array.length) {
    array.forEach((obj: { id: string; name?: string; title?: string }) => {
      newArray.push({
        key: obj.id || obj,
        label: obj.name || obj.title || obj
      });
    });
  }
  return newArray;
};

export const sampleDownload = () => {
  const a = window.document.createElement("a");
  a.href = window.URL.createObjectURL(new Blob(["Test,Text"], { type: "text/csv" }));
  a.download = "test.csv";

  // Append anchor to body.
  document.body.appendChild(a);
  a.click();

  // Remove anchor from body
  document.body.removeChild(a);
};

// getting the wareHouse Name form the warehouse id and returns the name
export const getWareHouseName = () => {
  try {
    if (hasRequiredCookies()) {
      const WAREHOUSE_ID = getWareHouseId();
      if (!WAREHOUSE_ID) return "";
      const wareHouses = localStorage.getItem("WAREHOUSE_LIST")
        ? JSON.parse(localStorage.getItem("WAREHOUSE_LIST") || "[]")
        : [];
      const value = wareHouses?.filter(
        (wareHouse: { id: number; name: string }) => wareHouse.id === +WAREHOUSE_ID
      );
      if (value && value?.length > 0) {
        return value[0].name;
      } else {
        getWareHouses();
        return "";
      }
    }
  } catch (error) {
    console.log("error", error);
  }
  return "";
};

//Getting the wareHouses from backend if not present in localStorage
export const getWareHouses = async () => {
  try {
    const wareHousesList = localStorage.getItem("WAREHOUSE_LIST");
    if (!wareHousesList || wareHousesList?.length === 0) {
      const response = await phpInstance.get("/admin/v1/search/warehouses");
      const wareHouses = response?.data?.data;

      if (wareHouses && wareHouses?.length > 0) {
        localStorage.setItem("WAREHOUSE_LIST", JSON.stringify(wareHouses));
      }
    }
  } catch (error) {
    console.log({ error });
  }
};

export const getType = (obj: unknown) => {
  const lowerCaseTheFirstLetter = (str: string | any[]) => str[0].toLowerCase() + str.slice(1);
  const type = typeof obj;
  if (type !== "object") {
    return type;
  }

  return lowerCaseTheFirstLetter(
    Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, "$1")
  );
};
// getType([]); // "array"
// getType("123"); // "string"
// getType(null); // "null"
// getType(undefined); // "undefined"
// getType(); // "undefined"
// getType(function () {
//   console.log("Hello World");
// }); // "function"
// getType(/123/g); // "regExp"
// getType(new Date()); // "date"
// getType(new Map()); // "map"
// getType(new Set()); // "set"
const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

// Used for disabling date in the antd date picker
export const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today and after 10 years
  return (
    (current && current < moment().endOf("day")) ||
    (current && current > moment().endOf("day").add(10, "year"))
  );
};

// Used for disabling time in the antd date picker
export const disabledDateTime = (current: unknown) => {
  return {
    disabledHours: () => {
      if (current) {
        return [];
      }
      const startHour = new Date().getHours() + 1;
      return range(0, startHour);
    },
    disabledMinutes: () => {
      if (current) {
        return [];
      }
      return range(0, 60);
    },
    disabledSeconds: () => []
  };
};

// Product Status
export const getProductStatus = (status: number) => {
  switch (status) {
    case 0:
      return "Inactive";
    case 1:
      return "Active";
    default:
      return "";
  }
};

export const createFiltersFromFilterValue = ({
  filtersValue,
  equalKeys,
  substitueKeys
}: {
  filtersValue: Record<string, FilterValue | null>;
  equalKeys: string[];
  substitueKeys:
    | {
        actualKey: string;
        changeToKey: string;
      }[]
    | [];
}) => {
  try {
    if (Object.keys(filtersValue)?.length === 0) return "";

    const keys = Object.keys(filtersValue);
    let output = "";

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = filtersValue[key] && filtersValue[key]?.[0]?.toString();
      if (value) {
        // checking if key need to be changed with substitue key
        const keyTOBeUsed = keyPresentInArrayOfObjects(substitueKeys, key);
        if (equalKeys.includes(key)) {
          output += `${keyTOBeUsed}:equal:${value},`;
        } else {
          output += `${keyTOBeUsed}:like:${value},`;
        }
      }
    }

    // removing end coma
    if (output?.length > 0) {
      output = output.slice(0, -1);
    }

    return output;
  } catch (error) {
    console.log("createFiltersFromFilterValue error: ", error);
  }
  return "";
};

export const downloadPdfFromLink = (pdfLink: string, filename = "file.pdf") => {
  const link = document.createElement("a");
  link.href = pdfLink;
  link.download = filename;
  link.click();
};
export const keyPresentInArrayOfObjects = (
  array:
    | []
    | {
        actualKey: string;
        changeToKey: string;
      }[],
  key: string
) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].actualKey === key) {
      return array[i].changeToKey;
    }
  }

  return key;
};
export const getKeyLabelFromIdName = ({ id, name }: { id: number; name: string }) => {
  return {
    key: "" + id,
    label: name
  };
};

export const getFileSize = (size: number) => {
  if (size === 0) return "0 Bytes";

  const k = 1024;

  const sizes = ["Bytes", "KB", "MB", "BG", "TB"];

  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const checkNoDataInAObject = (obj: Record<string, any> | undefined) => {
  if (!obj || Object.keys(obj).length === 0) {
    return true;
  }
  return false;
};

export const getQueryValueFromKeyParams = ({ search, key }: { search: string; key: string }) => {
  try {
    if (!search) return "";

    const value = new URLSearchParams(search).get(key);
    return value;
  } catch (error) {
    console.log({ error });
  }
};

export const downloadCSVFile = ({
  data,
  fileName,
  fileType
}: {
  data: string;
  fileName: string;
  fileType: string;
}) => {
  try {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType });
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  } catch (error: any) {
    const msg = error?.response?.data?.message || ERROR_FALLBACK_TEXT;
    showErrorToast(msg);
  }
};

export const createQueryParamFromFilterValue = ({
  filtersValue,
  substitueKeys
}: {
  filtersValue: Record<string, FilterValue | null>;
  substitueKeys:
    | {
        actualKey: string;
        changeToKey: string;
      }[]
    | [];
}) => {
  try {
    if (!filtersValue || Object?.keys(filtersValue)?.length === 0) return "";

    const keys = Object.keys(filtersValue);
    let output = "";

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = filtersValue[key] && filtersValue[key]?.[0]?.toString();
      if (value) {
        // checking if key need to be changed with substitue key
        const keyTOBeUsed = keyPresentInArrayOfObjects(substitueKeys, key);

        output += `&${keyTOBeUsed}=${value}`;
      }
    }

    return output;
  } catch (error) {
    console.log("createFiltersFromFilterValue error: ", error);
  }
  return "";
};

interface DownloadImage {
  url: string;
  fileName: string;
  fileType: string;
}

export async function downloadImage({ url, fileName, fileType }: DownloadImage) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = fileName + fileType || ".jpg";
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error: any) {
    onErrorNotification(error);
  }
}
const getErrorMessages = (e: AxiosError) => {
  try {
    if (typeof e?.response?.data === "string") {
      return e.response.data || ERROR_FALLBACK_TEXT;
    }

    if (typeof e?.response?.data?.message === "string") {
      return e.response.data.message || ERROR_FALLBACK_TEXT;
    }

    if (typeof e?.response?.data?.error === "string") {
      return e.response.data.error || ERROR_FALLBACK_TEXT;
    }

    if (Array.isArray(e.response?.data?.message) && e.response?.data?.message?.length > 0) {
      const errorMessageArray = e.response?.data?.message;
      return errorMessageArray
        .map((item: Record<string, string>) => {
          return item.message;
        })
        .join(" & ");
    }
    const error = e?.response?.data?.error || e?.response?.data?.message || ERROR_FALLBACK_TEXT;

    return error;
  } catch (error) {
    return ERROR_FALLBACK_TEXT;
  }
};

export const logout = () => {
  clearCookiesAndLocalStorage();
  const url = process.env.REACT_APP_OLD_ADMIN_APP_URL + "/logout";
  window.location.href = url as string;
};

export const clearCookiesAndLocalStorage = () => {
  const cookieArray = document.cookie.split("; ");
  cookieArray.forEach((cookie) => {
    const key = cookie.split("=")[0];
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
  localStorage.clear();
};

export const checkJWTTokenChanged = () => {
  const JWT_TOKEN = getPhpToken();

  const copyJWTToken = localStorage.getItem(COPY_JWT_TOKEN);

  if (JWT_TOKEN && JWT_TOKEN === copyJWTToken) return false;

  return true;
};

export const generateLabelFromKey = (key: string) => {
  if (key.includes("_")) {
    const keyArray = key.split("_");
    for (let i = 0; i < keyArray.length; i++) {
      keyArray[i] = keyArray[i][0].toUpperCase() + keyArray[i].slice(1);
    }
    return keyArray.join(" ");
  }
  return key[0].toUpperCase() + key.slice(1);
};
