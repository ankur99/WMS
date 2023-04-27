import { VariantsProp } from "./commonTypes";
import { TaskStatus } from "../utils/constants";
import { AxiosError } from "axios";
import { FreshPutawaySourceType, ReturnPutawaySourceType } from "./putawayAssignmentTypes";

export interface UsePutawayReportProps {
  currentPage: number;
  onError: (error: AxiosError) => void;
  id: string | null;
  name: string | null;
  status: string | null;
  employee_name: string | null;
  grn_created_at: string | null;
  created_at: string | null;
  completed_at: string | null;
  rangePickerDate: [string, string];
  barcode: string | null;
}

export interface PutawayReportApiReceiveDataProps {
  id: number;
  name: string;
  quantity: number;
  status: TaskStatus;
  created_at: string;
  completed_at: string;
  variants: VariantsProp[];
  employee_name: string;
  migration_id: number;
  time_taken: number;
  grn_created_at: string;
  inventory_migration_id: number;
  barcode: string;
  inward_type: string;
}

export interface PutawayReportApiDataProps {
  key: string;
  id: number;
  name: string;
  quantityUnit: number;
  quantityOuter: number;
  quantityCase: number;
  status: TaskStatus;
  created_at: string;
  completed_at: string | null;
  variants: VariantsProp[];
  employee_name: string;
  migration_id: number;
  time_taken: number | string;
  grn_created_at: string;
  inventory_migration_id: number;
  barcode: string;
  inward_type: string;
}

export interface UsePutawayReportSummaryProps {
  totat_items: number;
  average_time: null | number;
  avg_items_per_employee: null | number;
}
