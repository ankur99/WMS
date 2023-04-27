import { FilterValue } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { nodeInstance } from "../../api/Api";
import { AuditReasonsType, UseAuditTypeProps } from "../../types/auditTypes";
import { createFiltersFromFilterValue } from "../../utils/helperFunctions";

export const getAllAuditFilters = (filtersValue: Record<string, FilterValue | null>) => {
  const filters = createFiltersFromFilterValue({
    filtersValue,
    equalKeys: ["id"],
    substitueKeys: [
      {
        actualKey: "created_by",
        changeToKey: "employee.name"
      },
      {
        actualKey: "reason",
        changeToKey: "reason.id"
      }
    ]
  });
  return filters;
};

const fetchAuditsData = (
  currentPage: number,
  pageSize: number,
  filtersValue: Record<string, FilterValue | null>
) => {
  const params = `page=${currentPage}&limit=${pageSize}`;
  const filters = getAllAuditFilters(filtersValue);
  if (filters) {
    return nodeInstance.get(`/api/v1/admin/audits/audits?${params}&filters=${filters}`);
  }
  return nodeInstance.get(`/api/v1/admin/audits/audits?${params}`);
};

export const useAuditsData = ({
  currentPage,
  onError,
  filtersValue,
  pageSize
}: UseAuditTypeProps) => {
  return useQuery(
    Object.keys(filtersValue)?.length === 0
      ? ["fetch-audits", currentPage, pageSize]
      : ["fetch-audits", currentPage, pageSize, ...Object.values(filtersValue)],
    () => fetchAuditsData(currentPage, pageSize, filtersValue),
    {
      onError,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data.data;
      }
    }
  );
};

const createAudit = (payload: FormData) => {
  return nodeInstance.post(`api/v1/admin/audits/audit-create`, payload);
};

export const useCreateAudit = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(createAudit, {
    onSuccess: () => {
      onSuccess("Audit Created Successfully");
      queryClient.invalidateQueries("fetch-audits");
    },
    onError
  });
};

// Fetch Audit Reasons
const fetchAuditReasons = (reasonType?: AuditReasonsType) => {
  if (reasonType) {
    return nodeInstance.get(
      `/api/v1/admin/audits/audit-reasons?page=1&limit=100&filters=reason_type:equal:${reasonType}`
    );
  }
  return nodeInstance.get(`/api/v1/admin/audits/audit-reasons?page=1&limit=100`);
};

export const useAuditReasons = ({
  onError,
  reasonType
}: {
  onError: (error: AxiosError) => void;
  reasonType?: AuditReasonsType | null;
}) => {
  return useQuery(
    ["fetch-audit-reaons", reasonType],
    () => (reasonType ? fetchAuditReasons(reasonType) : fetchAuditReasons()),
    {
      onError,
      refetchOnWindowFocus: false,
      // cache time and stale time is kept as 10mins as url si temporaru url and will expire after 15mins
      cacheTime: 1000 * 60 * 10, //10min cache time
      staleTime: 1000 * 60 * 10, //10min stale time
      select: (data) => {
        return data?.data;
      }
    }
  );
};

// Fetch Audit Reasons
const fetchAuditStatus = () => {
  return nodeInstance.get(`/api/v1/admin/audits/audit-status`);
};

export const useAuditStatus = ({ onError }: { onError: (error: AxiosError) => void }) => {
  return useQuery("fetch-audit-status", fetchAuditStatus, {
    onError,
    refetchOnWindowFocus: false,
    // cache time and stale time is kept as 10mins as url si temporaru url and will expire after 15mins
    cacheTime: 1000 * 60 * 10, //10min cache time
    staleTime: 1000 * 60 * 10, //10min stale time
    select: (data) => {
      return data?.data;
    }
  });
};
