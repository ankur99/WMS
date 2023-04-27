import { FilterValue } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { nodeInstance } from "../../api/Api";
import { AuditCancelPayload, UseAuditViewDataProps } from "../../types/auditTypes";
import { createFiltersFromFilterValue } from "../../utils/helperFunctions";

export const getAuditViewFilters = (filtersValue: Record<string, FilterValue | null>) => {
  const filters = createFiltersFromFilterValue({
    filtersValue,
    equalKeys: ["audit_item_id", "product_id", "storage_id"],
    substitueKeys: [
      {
        actualKey: "audit_item_id",
        changeToKey: "id"
      },
      {
        actualKey: "product_name",
        changeToKey: "product.name"
      },
      {
        actualKey: "storage_name",
        changeToKey: "storage.label"
      },
      {
        actualKey: "assignee",
        changeToKey: "assignee.name"
      },
      {
        actualKey: "assigned_to",
        changeToKey: "employee.name"
      }
    ]
  });
  return filters;
};

const fetchAuditViewData = ({
  currentPage,
  pageSize,
  auditId,
  filtersValue
}: {
  currentPage: number;
  pageSize: number;
  auditId: number | string | undefined;
  filtersValue: Record<string, FilterValue | null>;
}) => {
  const params = `page=${currentPage}&limit=${pageSize}&audit_id=${auditId}`;
  const filters = getAuditViewFilters(filtersValue);
  if (filters) {
    return nodeInstance.get(`/api/v1/admin/audits/audit-view?${params}&filters=${filters}`);
  }
  return nodeInstance.get(`/api/v1/admin/audits/audit-view?${params}`);
};

export const UseAuditViewData = ({
  currentPage,
  pageSize,
  auditId,
  filtersValue,
  onError
}: UseAuditViewDataProps) => {
  return useQuery(
    Object.keys(filtersValue)?.length === 0
      ? ["fetch-audit-view", currentPage, pageSize, auditId]
      : ["fetch-audit-view", currentPage, pageSize, auditId, ...Object.values(filtersValue)],
    () => fetchAuditViewData({ currentPage, pageSize, auditId, filtersValue }),
    {
      onError,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data.data;
      }
    }
  );
};

// Confirm Audit
const auditConfirm = (payload: { audit_id: number | undefined }) => {
  return nodeInstance.post(`api/v1/admin/audits/audit-confirm`, payload);
};

export const useConfirmAudit = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(auditConfirm, {
    onSuccess: () => {
      onSuccess("Audit Confirmed Successfully");
      queryClient.invalidateQueries("fetch-audit-view");
    },
    onError
  });
};

interface AuditAssignProps {
  audit_item_ids: number[];
  assigned_to: number;
  audit_id: number | undefined | string;
}

// API for Audit Assign
const auditAssign = (payload: AuditAssignProps) => {
  return nodeInstance.post(`api/v1/admin/audits/audit-assign`, payload);
};
export const useAssignAudit = ({
  onError,
  onSuccess,
  type
}: {
  onError: (error: AxiosError) => void;
  onSuccess: ({ type }: { type: "Assign" | "BulkAssign" }) => void;
  type: "Assign" | "BulkAssign";
}) => {
  const queryClient = useQueryClient();
  return useMutation(auditAssign, {
    onSuccess: () => {
      onSuccess({ type });
      queryClient.invalidateQueries("fetch-audit-view");
    },
    onError
  });
};

//API for Audit Start
const auditStart = (payload: { audit_id: number | undefined }) => {
  return nodeInstance.post(`api/v1/admin/audits/audit-start`, payload);
};

export const useStartAudit = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(auditStart, {
    onSuccess: () => {
      onSuccess("Audit Started Successfully");
      queryClient.invalidateQueries("fetch-audit-view");
    },
    onError
  });
};

// API for Audit Cancel
const auditCancel = (payload: AuditCancelPayload) => {
  return nodeInstance.post(`api/v1/admin/audits/audit-cancel`, payload);
};

export const useAuditCancel = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(auditCancel, {
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries("fetch-audits");
      queryClient.invalidateQueries("fetch-audit-view");
    },
    onError
  });
};

interface AuditItemsCancelProps {
  audit_item_ids: number[];
  reason_id: number;
}

// API for Audit-Item-Cancel
const auditItemsCancel = (payload: AuditItemsCancelProps) => {
  return nodeInstance.post(`api/v1/admin/audits/audit-item-cancel`, payload);
};

export const useAuditItemsCancel = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(auditItemsCancel, {
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries("fetch-audit-view");
    },
    onError
  });
};

//API for Approve Start
const auditApprove = (payload: { audit_id: number | undefined }) => {
  return nodeInstance.post(`api/v1/admin/audits/audit-complete`, payload);
};

export const useApproveAudit = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(auditApprove, {
    onSuccess: () => {
      onSuccess("Audit Approved Successfully");
      queryClient.invalidateQueries("fetch-audit-view");
    },
    onError
  });
};

//API for Settle
const auditItemSettle = (payload: { audit_item_id: number | undefined; reason_id?: number }) => {
  return nodeInstance.post(`api/v1/admin/audits/audit-item-settle`, payload);
};

export const useAuditItemSettle = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(auditItemSettle, {
    onSuccess: () => {
      onSuccess("Audit Item Settled Successfully");
      queryClient.invalidateQueries("fetch-audit-view");
    },
    onError
  });
};
