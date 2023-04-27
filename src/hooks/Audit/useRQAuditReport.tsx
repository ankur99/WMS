import { FilterValue } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { nodeInstance } from "../../api/Api";
import { UseAuditReportDataProps } from "../../types/auditTypes";
import { changeDDMMYYYYToYYYYMMDD } from "../../utils/constants";
import { createFiltersFromFilterValue } from "../../utils/helperFunctions";

export const getAuditReportFilters = (filtersValue: Record<string, FilterValue | null>) => {
  const filters = createFiltersFromFilterValue({
    filtersValue,
    equalKeys: ["audit_id", "product_id", "storage_id", "employee_id"],
    substitueKeys: [
      {
        actualKey: "employee_id",
        changeToKey: "employee.id"
      },
      {
        actualKey: "timestamp",
        changeToKey: "audit.created_at"
      },
      {
        actualKey: "storage_label",
        changeToKey: "storage.label"
      },
      {
        actualKey: "employee_name",
        changeToKey: "employee.name"
      },
      {
        actualKey: "audit_type",
        changeToKey: "audit.type"
      }
    ]
  });
  return filters;
};

const fetchAuditReportData = (
  currentPage: number,
  pageSize: number,
  filtersValue: Record<string, FilterValue | null>
) => {
  const formattedFiltersValues = { ...filtersValue };

  if (filtersValue.timestamp && filtersValue.timestamp[0]) {
    const newTimestamp = changeDDMMYYYYToYYYYMMDD(filtersValue.timestamp[0] as string);
    formattedFiltersValues.timestamp = [newTimestamp];
  }

  const params = `page=${currentPage}&limit=${pageSize}`;
  const filters = getAuditReportFilters(formattedFiltersValues);
  if (filters) {
    return nodeInstance.get(`/api/v1/admin/audits/audit-report?${params}&filters=${filters}`);
  }
  return nodeInstance.get(`/api/v1/admin/audits/audit-report?${params}`);
};

export const UseAuditReportData = ({
  currentPage,
  pageSize,
  onError,
  filtersValue
}: UseAuditReportDataProps) => {
  return useQuery(
    Object.keys(filtersValue)?.length === 0
      ? ["fetch-audit-report", currentPage, pageSize]
      : ["fetch-audit-report", currentPage, pageSize, ...Object.values(filtersValue)],
    () => fetchAuditReportData(currentPage, pageSize, filtersValue),
    {
      onError,
      refetchOnWindowFocus: false,
      select: (auditReportData) => {
        return auditReportData.data;
      }
    }
  );
};

// Fetch Audit Report Expiry
const fetchAuditReportExpiry = ({
  productId,
  storageId
}: {
  productId: number;
  storageId: string;
}) => {
  return nodeInstance.get(
    `/api/v1/admin/audits/audit-report-expiry?product_id=${productId}&storage_id=${storageId}`
  );
};

export const useAuditReportExpiry = ({
  onError,
  productId,
  storageId
}: {
  onError: (error: AxiosError) => void;
  productId: number;
  storageId: string;
}) => {
  return useQuery(
    ["fetch-audit-report-expiry", storageId, productId],
    () => fetchAuditReportExpiry({ productId, storageId }),
    {
      onError,
      refetchOnWindowFocus: false,
      // cache time and stale time is kept as 10mins as url si temporaru url and will expire after 15mins
      cacheTime: 1000 * 60 * 10, //10min cache time
      staleTime: 1000 * 60 * 10, //10min stale time
      select: (data) => {
        return data?.data?.data;
      }
    }
  );
};
