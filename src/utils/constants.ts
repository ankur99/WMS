import moment from "moment";

export const timeToUndoDeleteRowForAddTask = 10;

export const getUniqueKey = () => {
  return Math.random().toString(16).slice(2);
};

export const trimNumbersToAFixedFigit = (value: number, fixedFigit = 2) => {
  return +parseFloat(value.toString()).toFixed(fixedFigit);
};

export const formatDate = (date: string | Date) => {
  if (!date) return "";
  try {
    const formatDate = moment(date).format("llll");
    return formatDate;
  } catch (error) {
    console.log(error);
  }
  return "--";
};

export const formatOnlyDate = (date: string) => {
  try {
    const formatDate = moment(date).format("ll");
    return formatDate;
  } catch (error) {
    console.log(error);
  }
  return "--";
};

// NOTE: Below one is actually variant, but during putaway, frontend was setup as uom, due to to change it, both
// frontend and backend will be changed.
export enum uomTypes {
  unit = "unit",
  outer = "outer",
  case = "case",
  each = "each"
}

export enum ActualUomTypes {
  pc = "pc",
  kg = "kg",
  l = "l",
  m = "m",
  ea = "ea"
}

export enum TaskStatus {
  pending = "pending",
  processing = "processing",
  completed = "completed"
}

export enum IATStatus {
  "assigned" = "assigned",
  "started" = "started",
  "completed" = "completed",
  "not_started" = "not_started"
}

export enum InventoryMigrationType {
  PUTAWAY = "putaway",
  MIGRATION = "migration",
  PUTAWAY_RETURN = "putaway_return",
  PUTAWAY_STO = "putaway_sto",
  PUTAWAY_RTO = "putaway_rto",
  NULL = "Null"
}

export enum InventoryMigrationStatus {
  CLOSED = "closed",
  OPEN = "open"
}

export enum InventoryMigrationItemsStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  PARTIAL = "partial"
}

export enum FilterTypes {
  input = "input",
  date = "date",
  select = "select",
  inputNumber = "inputNumber"
}

export const secondsToHms = (d: number) => {
  try {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    const formattedTime = (hDisplay + mDisplay + sDisplay).trim();

    if (formattedTime[formattedTime.length - 1] === ",") {
      return formattedTime.slice(0, formattedTime.length - 1);
    }
    return formattedTime;
  } catch (error) {
    console.log(error);
  }

  return "invalid Time";
};

//getting the token from cookies
export const hasRequiredCookies = () => {
  try {
    const JWT_TOKEN =
      document?.cookie
        ?.split("; ")
        ?.find((row) => row.startsWith("JWT_TOKEN="))
        ?.split("=")[1] || "";

    const WAREHOUSE_ID =
      document?.cookie
        ?.split("; ")
        ?.find((row) => row.startsWith("WAREHOUSE_ID="))
        ?.split("=")[1] || "";

    if (!JWT_TOKEN || !WAREHOUSE_ID) return false;

    // SETTING THE COPY FOR JWT_TOKEN

    const copyJWTToken = localStorage.getItem(COPY_JWT_TOKEN);
    if (!copyJWTToken) {
      localStorage.setItem(COPY_JWT_TOKEN, JWT_TOKEN);
    }

    return true;
  } catch (error) {
    console.log("Error", error);
  }

  return false;
};

export const getPhpToken = () => {
  try {
    const JWT_TOKEN =
      document?.cookie
        ?.split("; ")
        ?.find((row) => row.startsWith("JWT_TOKEN="))
        ?.split("=")[1] || "";

    if (!JWT_TOKEN) return false;

    return JWT_TOKEN;
  } catch (error) {
    console.log("Error", error);
  }
};

// export const getNodeToken = () => {
//   try {
//     const NODE_TOKEN =
//       document?.cookie
//         ?.split("; ")
//         ?.find((row) => row.startsWith("NODE_TOKEN="))
//         ?.split("=")[1] || "";

//     if (!NODE_TOKEN) return false;

//     return NODE_TOKEN;
//   } catch (error) {
//     console.log("Error", error);
//   }
// };

export const getNodeToken = () => {
  try {
    const NODE_TOKEN = localStorage.getItem("NODE_TOKEN");
    if (!NODE_TOKEN) return false;
    return NODE_TOKEN;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const getWareHouseId = () => {
  try {
    const WAREHOUSE_ID =
      document?.cookie
        ?.split("; ")
        ?.find((row) => row.startsWith("WAREHOUSE_ID="))
        ?.split("=")[1] || "";

    if (!WAREHOUSE_ID) return false;

    return WAREHOUSE_ID;
  } catch (error) {
    console.log("Error", error);
  }
};

export const getFormattedTodayDate = () => {
  try {
    const today = new Date().toLocaleDateString("en-GB");
    const split = today.split("/");
    return split[0] + "-" + split[1] + "-" + split[2];
  } catch (error) {
    console.log("Error: ", error);
  }
  return "";
};

export const getLastWeekFormattedDate = () => {
  try {
    const today = new Date();
    const prevWeek = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);

    const temp = new Date(prevWeek).toLocaleDateString("en-GB");
    const split = temp.split("/");
    return split[0] + "-" + split[1] + "-" + split[2];
  } catch (error) {
    console.log("Error: ", error);
  }
  return "";
};

//GETTING 17-03-2022 AND SENDS 2022-03-17
export const changeDDMMYYYYToYYYYMMDD = (date: string) => {
  try {
    const split = date.split("-");
    return split[2] + "-" + split[1] + "-" + split[0];
  } catch (error) {
    console.log("Error: ", error);
  }
  return "";
};

//GETTING 17-03-2022 AND SENDS 22-03-17
export const changeDDMMYYYYToYYMMDD = (date: string) => {
  try {
    const split = date.split("-");
    return split[2].slice(2) + "-" + split[1] + "-" + split[0];
  } catch (error) {
    console.log("Error: ", error);
  }
  return "";
};

export const basicColorsList = [
  {
    label: "Black",
    color: "black",
    hexCode: "#000000"
  },
  {
    label: "Silver",
    color: "silver",
    hexCode: "#c0c0c0"
  },
  {
    label: "Gray",
    color: "gray",
    hexCode: "#808080"
  },
  {
    label: "White",
    color: "White",
    hexCode: "#ffffff"
  },
  {
    label: "Maroon",
    color: "maroon",
    hexCode: "#800000"
  },
  {
    label: "Red",
    color: "red",
    hexCode: "#ff0000"
  },
  {
    label: "Purple",
    color: "Purple",
    hexCode: "#800080"
  },
  {
    label: "Pink",
    color: "deeppink",
    hexCode: "#ff1493"
  },
  {
    label: "green",
    color: "Green",
    hexCode: "#008000"
  },
  {
    label: "Lime",
    color: "lime",
    hexCode: "#00ff00"
  },
  {
    label: "Olive",
    color: "olive",
    hexCode: "#808000"
  },
  {
    label: "Yellow",
    color: "yellow",
    hexCode: "#ffff00"
  },
  {
    label: "Navy",
    color: "navy",
    hexCode: "#000080"
  },
  {
    label: "Blue",
    color: "blue",
    hexCode: "#0000ff"
  },
  {
    label: "Teal",
    color: "teal",
    hexCode: "#008080"
  },
  {
    label: "Aqua",
    color: "aqua",
    hexCode: "#00ffff"
  },
  {
    label: "Other",
    color: "darkgrey",
    hexCode: "#a9a9a9"
  }
];
//GETTING 2022-03-20 AND SENDS 20-03-2022
export const changeYYYYMMDDToDDMMYYYY = (date: string) => {
  try {
    const split = date.split("-");
    return split[2] + "-" + split[1] + "-" + split[0];
  } catch (error) {
    console.log("Error: ", error);
  }
  return "";
};

//Tags Colors
export const tagsColor = {
  activeTagColor: "#00C6AE",
  inactiveTagColor: "#D3D3D3",
  disabledTagColor: "#D3D3D3",
  dangerTagColor: "#FF4D4F",
  warningTagColor: "#FAAD14",
  successTagColor: "#52C41A",
  completedTagColor: "#00BC14",
  primaryTagColor: "#2db7f5"
};

//allTagsTypes
export const allTags = ["1K", "Club 1K", "Retail", "Semi-Wholesale", "Wholesale"];

export const businessDocumentsInfo = [
  "Only Image and PDF type is allowed",
  "Maximum of 2MB per file is allowed"
];

export const maxSizeForUpload = 2 * 1024 * 1024;
export const twoMb = 2 * 1024 * 1024;
export const tenMb = 10 * 1024 * 1024;

export const timeForToastSuccess = 5; //in seconds
export const timeForToastError = 7; //in seconds

export const reAssignText =
  "Are you sure you want to reassign? Please ensure that all the items are handed over to the new assignee.";

export const ERROR_FALLBACK_TEXT = "Something went wrong, Please try again later!";

export const CSV_DOWNLOAD_LIMIT = 1000;
export const DEFAULT_PAGE_SIZE = 15;

export const POPCONFIRM_TEXT = "Are you sure？";

export const COPY_JWT_TOKEN = "COPY_JWT_TOKEN";
