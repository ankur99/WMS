import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { nodeInstance } from "../api/Api";

const downloadData = ({ currentPage, pageSize }: { currentPage: number; pageSize: number }) => {
  return nodeInstance.get(`api/v1/downloads/report-requests?page=${currentPage}&limit=${pageSize}`);
};

export const useDownloadAllData = ({
  currentPage,
  onError,
  pageSize
}: {
  currentPage: number;
  onError: (error: AxiosError) => void;
  pageSize: number;
}) => {
  return useQuery(
    ["fetch-download", currentPage, pageSize],
    () => downloadData({ currentPage, pageSize }),
    {
      onError,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data?.data;
      }
    }
  );
};
