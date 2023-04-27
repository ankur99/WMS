import { FilterValue } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { IdName, NodeBaseApiCall } from "./commonTypes";

export enum AuditType {
  Product = "Product",
  Location = "Storage",
  Shelf_Life_Product = "Shelf Life Product",
  Shelf_Life_Location = "Shelf Life Storage",
  ProductId = 0,
  LocationId = 1,
  Shelf_Life_Product_Id = 2,
  Shelf_Life_Location_Id = 3
}

export enum AuditReasonsType {
  create = "create",
  cancel = "cancel",
  loss = "loss",
  reject = "reject",
  release = "release",
  hold = "hold",
  badinventory = "badinventory",
  excess = "excess"
}

export type AuditStatusType =
  | "Generated"
  | "Confirmed"
  | "Started"
  | "Approved"
  | "Completed"
  | "Cancelled";

export type AuditItemsStatusType =
  | "Generated"
  | "Assigned"
  | "In Progress"
  | "Pending Approval"
  | "Pending Action"
  | "Resolved"
  | "Cancelled";

export interface AuditTableProps {
  audit_id: number;
  id: number;
  name: string;
  type: string;
  created_by: number;
  created_by_name: string;
  reason: string;
  created_at: string;
  status: IdName;
  no_of_items: number;
}
export interface UseAuditTypeProps {
  currentPage: number;
  pageSize: number;
  onError: (error: AxiosError) => void;
  filtersValue: Record<string, FilterValue | null>;
}

export interface UseAuditReportDataProps {
  currentPage: number;
  pageSize: number;
  onError: (error: AxiosError) => void;
  filtersValue: Record<string, FilterValue | null>;
}

export interface UseDisputeListDataProps {
  currentPage: number;
  onError: (error: AxiosError) => void;
  filtersValue: Record<string, FilterValue | null>;
  pageSize: number;
}

export interface UseAuditViewDataProps {
  currentPage: number;
  pageSize: number;
  auditId: string | undefined;
  onError: (error: AxiosError) => void;
  filtersValue: Record<string, FilterValue | null>;
}

export interface AuditsReceivedData {
  count: number;
  count_per_page: number;
  results: AuditsData[];
}

export interface AuditsData {
  id: number;
  name: string;
  type: "Product" | "Location";
  created_by: IdName;
  reason: string;
  created_at: string;
  status: {
    id: number;
    name: "Started";
  };
  auto_settle: 0 | 1;
}

export interface DisputeListProps {
  id: number;
  product_id: number;
  product_name: string;
  storage_id: number;
  storage_name: string;
  quantity: number;
  expiry_date: string;
  task: string;
  employee_id: number;
  time_stamp: string;
}

export interface AuditReportProps {
  audit_id: number;
  audit_name: string;
  product_id: number;
  storage_id: number;
  employee_id: number;
  time_stamp: string;
  audit_result: string;
}

export interface AuditReasonsAllData {
  results: {
    results: AuditReasonsData[];
    total: number;
  };
  count: number;
  count_per_page: number;
}

export interface AuditReasonsData {
  id: number;
  source_type: string;
  reason_type: AuditReasonsType;
  reason_text: string;
}

export interface AuditCancelPayload {
  audit_id: number;
  reason_id: number;
}

export interface CreateAuditFormProps {
  audit_name: string;
  audit_reason: number;
  audit_type: number;
  auto_settle: boolean;
}

export interface AuditStatusData {
  results: {
    key: number;
    name: string;
  }[];
}

// Audit View
export interface AuditViewProps {
  results: {
    can_approve_audit: boolean;
    data: AuditViewData;
  };
  count: number;
  count_per_page: number;
}

export interface AuditViewData {
  id: number;
  audit_id: number;
  name: string;
  type: AuditType;
  created_by: IdName;
  audit_items: AuditViewDataItems[];
  created_at: Date;
  status: IdName;
  auto_settle: 1 | 0;
}

export interface AuditViewDataItems {
  id: number;
  audit_item_id: number;
  product: IdName;
  storage: IdName;
  system_quantity: number;
  status: IdName;
  created_at: Date;
  assigned_to: IdName;
  reported_variance: null | number;
  final_variance: null | number;
  actual_quantity: null;
  audit_result: AuditResultProps;
  action_taken: AuditResultProps;
  damaged_quantity: number;
  expired_quantity: number;
  good_quantity: number;
  assignee: IdName | null;
  start_time: Date;
  end_time: Date;
}

export type AuditResultProps = null | [] | { result: string }[];

export interface AuditReportReceivedData {
  count: number;
  count_per_page: number;
  results: AuditReportData[];
}

export interface AuditReportData {
  audit_id: number;
  audit_item_id: number;
  audit_name: string;
  audit_type: number;
  product_id: number;
  product_name: string;
  storage_id: string;
  storage_label: string;
  employee_id: number;
  employee_name: string;
  timestamp: string;
  damaged_quantity: number;
  actual_quantity: number;
  expired_quantity: number;
  good_quantity: number;
}

export interface DisputeListReceivedData {
  results: DisputeListData[];
  count: number;
}

export interface DisputeListData {
  id: number;
  product_id: number;
  product_name: string;
  storage_id: number;
  storage_label: string;
  timestamp: string;
  in_audit: boolean;
}

export type AuditReportExpiryData = {
  expiry_date: string;
  quantity: number;
}[];

export interface DisputeListAuditCreateFormProps {
  audit_name: string;
  audit_type: number;
  reason_id: number;
  auto_settle: number;
}

export interface DisputeListAuditCreateAudit extends DisputeListAuditCreateFormProps {
  data: {
    storage_id: number;
    product_id: number;
  }[];
}

export interface UseProductHoldTypeProps extends UseAuditTypeProps {
  product_id: number | undefined;
}

export interface AuditHoldListReceivedData extends NodeBaseApiCall {
  results: AuditHoldListData[] | [];
}

export interface AuditHoldListData {
  product_id: number;
  product_name: string;
  variance: string;
}

export interface ProductHoldListReceivedData extends NodeBaseApiCall {
  results: {
    data: ProductHoldListData[] | [];
    can_manage_hold_list: boolean;
  };
}

export interface ProductHoldListData {
  product_id: number;
  audit_id: number;
  product_name: string;
  storage_id: number;
  storage: string;
  variance: string;
  hold_item_id: number;
}

export interface UseProductHoldLogsTypeProps {
  product_id: number | undefined;
  storage_id: number | undefined;
  currentPage: number;
  pageSize: number;
  onError: (error: AxiosError) => void;
}

export interface ProductHoldListLogsReceivedData extends NodeBaseApiCall {
  results: ProductHoldListLogsData[] | [];
}

export interface ProductHoldListLogsData {
  product_id: number;
  variance: number;
  storage_id: number;
  audit_id: number;
  created_at: Date;
}
