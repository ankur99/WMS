import { FilterValue } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { nodeInstance } from "../../api/Api";
import {
  UseAuditTypeProps,
  UseProductHoldLogsTypeProps,
  UseProductHoldTypeProps
} from "../../types/auditTypes";
import { createFiltersFromFilterValue } from "../../utils/helperFunctions";

export const getAllAuditHoldListFilters = (filtersValue: Record<string, FilterValue | null>) => {
  const filters = createFiltersFromFilterValue({
    filtersValue,
    equalKeys: ["product_id"],
    substitueKeys: [
      {
        actualKey: "product_id",
        changeToKey: "ahi.product_id"
      },
      {
        actualKey: "product_name",
        changeToKey: "p.name"
      }
    ]
  });
  return filters;
};

const fetchAuditHoldListData = (
  currentPage: number,
  pageSize: number,
  filtersValue: Record<string, FilterValue | null>
) => {
  const params = `page=${currentPage}&limit=${pageSize}`;
  const filters = getAllAuditHoldListFilters(filtersValue);
  if (filters) {
    return nodeInstance.get(`/api/v1/admin/audits/hold-list?${params}&filters=${filters}`);
  }
  return nodeInstance.get(`/api/v1/admin/audits/hold-list?${params}`);
};

export const useAuditHoldListData = ({
  currentPage,
  onError,
  filtersValue,
  pageSize
}: UseAuditTypeProps) => {
  return useQuery(
    Object.keys(filtersValue)?.length === 0
      ? ["fetch-hold-list", currentPage, pageSize]
      : ["fetch-hold-list", currentPage, pageSize, ...Object.values(filtersValue)],
    () => fetchAuditHoldListData(currentPage, pageSize, filtersValue),
    {
      onError,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data.data;
      }
    }
  );
};

// Product Hold List
export const getAllProductHoldListFilters = (filtersValue: Record<string, FilterValue | null>) => {
  const filters = createFiltersFromFilterValue({
    filtersValue,
    equalKeys: ["audit_id", "storage_id"],
    substitueKeys: [
      {
        actualKey: "audit_id",
        changeToKey: "ahi.audit_id"
      },
      {
        actualKey: "storage_id",
        changeToKey: "ahi.storage_id"
      },
      {
        actualKey: "storage_label",
        changeToKey: "st.label"
      }
    ]
  });
  return filters;
};

const fetchProductHoldListData = (
  currentPage: number,
  pageSize: number,
  filtersValue: Record<string, FilterValue | null>,
  product_id: number | undefined
) => {
  const params = `page=${currentPage}&limit=${pageSize}`;
  const filters = getAllProductHoldListFilters(filtersValue);
  if (filters) {
    return nodeInstance.get(
      `/api/v1/admin/audits/hold-list/${product_id}?${params}&filters=${filters}`
    );
  }
  return nodeInstance.get(`/api/v1/admin/audits/hold-list/${product_id}?${params}`);
};

export const useProductHoldListData = ({
  currentPage,
  onError,
  filtersValue,
  pageSize,
  product_id
}: UseProductHoldTypeProps) => {
  return useQuery(
    Object.keys(filtersValue)?.length === 0
      ? ["fetch-product-hold-list", product_id, currentPage, pageSize]
      : [
          "fetch-product-hold-list",
          product_id,
          currentPage,
          pageSize,
          ...Object.values(filtersValue)
        ],
    () => fetchProductHoldListData(currentPage, pageSize, filtersValue, product_id),
    {
      onError,
      refetchOnWindowFocus: false,
      enabled: product_id ? true : false,
      select: (data) => {
        return data.data;
      }
    }
  );
};

// lOGS
const fetchProductHoldListLogsData = (
  currentPage: number,
  pageSize: number,
  product_id: number | undefined,
  storage_id: number | undefined
) => {
  const params = `page=${currentPage}&limit=${pageSize}`;
  return nodeInstance.get(
    `api/v1/admin/audits/hold-list-logs/${product_id}/${storage_id}?${params}`
  );
};

export const useProductHoldListLogsData = ({
  currentPage,
  onError,
  pageSize,
  product_id,
  storage_id
}: UseProductHoldLogsTypeProps) => {
  return useQuery(
    ["fetch-product-logs-hold-list", product_id, storage_id, currentPage, pageSize],
    () => fetchProductHoldListLogsData(currentPage, pageSize, product_id, storage_id),
    {
      onError,
      refetchOnWindowFocus: false,
      enabled: product_id && storage_id ? true : false,
      select: (data) => {
        return data.data;
      }
    }
  );
};

// All Hold List Sett;e
const holdListSettle = ({ product_id }: { product_id: number }) => {
  return nodeInstance.post(`api/v1/admin/audits/audit-settle-hold-item`, { product_id });
};

export const useHoldListSettle = ({
  onError,
  onSuccess,
  comingFrom
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
  comingFrom: "ProductHoldList" | "HoldList";
}) => {
  const queryClient = useQueryClient();

  return useMutation(holdListSettle, {
    onSuccess: () => {
      if (comingFrom === "HoldList") {
        onSuccess("Hold List Item Settled Successfully");
        queryClient.invalidateQueries("fetch-hold-list");
      }
      if (comingFrom === "ProductHoldList") {
        onSuccess("Hold List Item Settled Successfully");
        queryClient.invalidateQueries("fetch-product-logs-hold-list");
        queryClient.invalidateQueries("fetch-product-hold-list");
      }
    },
    onError
  });
};

// Single Product Id and Storage Id Settle
const individualHoldListSettle = (payload: { audit_hold_item: number; reason_id: number }) => {
  return nodeInstance.post(`api/v1/admin/audits/audit-hold-item-mark-loss-or-excess`, payload);
};

export const useIndividualHoldListSettle = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(individualHoldListSettle, {
    onSuccess: () => {
      onSuccess("Hold List Item Settled Successfully");
      queryClient.invalidateQueries("fetch-product-hold-list");
    },
    onError
  });
};
