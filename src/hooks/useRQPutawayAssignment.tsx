import { useMutation, useQuery, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { UsePutawayAssignmentProps, PutawayPayloadType } from "../types/putawayAssignmentTypes";

import { createQueryParamFromFilterValue, downloadCSVWithInstance } from "../utils/helperFunctions";
import { phpInstance } from "../api/Api";
import { FilterValue } from "antd/lib/table/interface";

export const getPutawayAssignmentFilters = (filtersValue: Record<string, FilterValue | null>) => {
  const filters = createQueryParamFromFilterValue({
    filtersValue,
    substitueKeys: [
      {
        actualKey: "pid",
        changeToKey: "id"
      },
      {
        actualKey: "productName",
        changeToKey: "name"
      }
    ]
  });

  return filters;
};

const fetchPutawayAssignment = (
  currentPage: number,
  filtersValue: Record<string, FilterValue | null>,
  type: string
) => {
  let params = `page=${currentPage}`;
  const filters = getPutawayAssignmentFilters(filtersValue);
  if (filters) {
    params += filters;
  }
  return phpInstance.get(`/admin/v1/putaway/get/${type}?${params}`);
};

export const usePutawayAssignmentData = ({
  currentPage,
  onError,
  filtersValue,
  type
}: UsePutawayAssignmentProps) => {
  return useQuery(
    Object.keys(filtersValue)?.length === 0
      ? ["fetch-putaway-assignment", currentPage, type]
      : ["fetch-putaway-assignment", currentPage, type, ...Object.values(filtersValue)],
    () => fetchPutawayAssignment(currentPage, filtersValue, type),
    {
      onError,
      refetchOnWindowFocus: false,
      select: (res) => {
        return res.data;
      }
    }
  );
};

const assignPutawayAssignment = (payload: PutawayPayloadType) => {
  return phpInstance.post("admin/v1/putaway/assignitems", payload);
};

export const useAssignPutawayAssignment = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(assignPutawayAssignment, {
    onSuccess: () => {
      onSuccess("The task has been successfully assigned");
      queryClient.invalidateQueries("fetch-putaway-assignment"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

export const downloadPutawayAssignment = async ({
  filtersValue,
  type
}: {
  filtersValue: Record<string, FilterValue | null>;
  type: "fresh" | "return";
}) => {
  let uri = "";
  let params = ``;
  let filters = getPutawayAssignmentFilters(filtersValue);
  if (filters[0] === "&") {
    filters = filters.slice(1);
  }
  if (filters) {
    params += filters;
  }
  if (params && params.length > 0) {
    uri = `/admin/v1/putaway/${type}/download?${params}`;
  } else uri = `/admin/v1/putaway/${type}/download`;

  await downloadCSVWithInstance({
    uri,
    fileName: type === "fresh" ? "FreshPutawayAssignment.csv" : "ReturnPutawayAssignment.csv",
    instanceType: "php"
  });
};
