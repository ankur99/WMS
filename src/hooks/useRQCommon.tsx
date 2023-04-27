import { useQuery } from "react-query";
import { nodeInstance } from "../api/Api";
import { downloadCSVWithInstance, onError } from "../utils/helperFunctions";

const fetchTaxClass = () => {
  return nodeInstance.get(`/api/v1/search/tax-class`);
};

export const useTaxClassData = () => {
  return useQuery(["fetch-tax-class"], fetchTaxClass, {
    onError: onError,
    refetchOnWindowFocus: false,
    cacheTime: 1000 * 60 * 30, //30min cache time
    staleTime: 1000 * 60 * 30, //30min stale time
    //formatting and sanitizing data
    select: (data) => {
      return data?.data?.data;
    }
  });
};

export const downloadCSVReport = async ({
  uri,
  fileName,
  instanceType
}: {
  uri: string;
  fileName: string;
  instanceType: "php" | "node";
}) => {
  await downloadCSVWithInstance({
    uri,
    fileName: `${fileName}.csv`,
    instanceType
  });
};
