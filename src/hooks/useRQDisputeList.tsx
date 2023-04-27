import { FilterValue } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { nodeInstance } from "../api/Api";
import { DisputeListAuditCreateAudit, UseDisputeListDataProps } from "../types/auditTypes";
import { changeDDMMYYYYToYYYYMMDD } from "../utils/constants";
import { createFiltersFromFilterValue } from "../utils/helperFunctions";

export const getDisputeListFilters = (filtersValue: Record<string, FilterValue | null>) => {
  const filters = createFiltersFromFilterValue({
    filtersValue,
    equalKeys: [""],
    substitueKeys: []
  });
  return filters;
};

const fetchDisputeListData = (
  currentPage: number,
  pageSize: number,
  filtersValue: Record<string, FilterValue | null>
) => {
  const formattedFiltersValues = { ...filtersValue };

  if (filtersValue.expiry_date && filtersValue.expiry_date[0]) {
    const newExpiryDate = changeDDMMYYYYToYYYYMMDD(filtersValue.expiry_date[0] as string);
    formattedFiltersValues.expiry_date = [newExpiryDate];
  }

  const params = `page=${currentPage}&limit=${pageSize}`;
  const filters = getDisputeListFilters(formattedFiltersValues);

  if (filters) {
    return nodeInstance.get(`/api/v1/admin/audits/dispute-list?${params}&filters=${filters}`);
  }
  return nodeInstance.get(`/api/v1/admin/audits/dispute-list?${params}`);
};

export const UseDisputeListData = ({
  currentPage,
  onError,
  filtersValue,
  pageSize
}: UseDisputeListDataProps) => {
  return useQuery(
    Object.keys(filtersValue)?.length === 0
      ? ["fetch-dispute-list", currentPage, pageSize]
      : ["fetch-dispute-list", currentPage, pageSize, ...Object.values(filtersValue)],
    () => fetchDisputeListData(currentPage, pageSize, filtersValue),
    {
      onError,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data.data;
      }
    }
  );
};

// Dispute List Create Audit
const dispuetListCreateAudit = (payload: DisputeListAuditCreateAudit) => {
  return nodeInstance.post(`api/v1/admin/audits/dispute-list-audit-create`, payload);
};

export const useDisputeListCreateAudit = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(dispuetListCreateAudit, {
    onSuccess: () => {
      onSuccess("Audit Created Successfully");
      queryClient.invalidateQueries("fetch-dispute-list");
    },
    onError
  });
};
