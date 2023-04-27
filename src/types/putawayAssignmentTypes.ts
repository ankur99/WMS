import { FilterValue } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { uomTypes } from "../utils/constants";
import { VariantsProp } from "./commonTypes";

export interface UsePutawayAssignmentProps {
  currentPage: number;
  onError: (error: AxiosError) => void;
  // searchText: string;
  filtersValue: Record<string, FilterValue | null>;
  type: string;
}

export interface PutawayQuantityProp {
  employee_id: number;
  name: string;
  quantity: number;
}

export enum FreshPutawaySourceType {
  FRESH_INWARD = "putaway",
  STO = "putaway_sto",
  PUTAWAY_CANCELLED_SHIPMENT = "putaway_cancelled_shipment"
}

export enum ReturnPutawaySourceType {
  RETURN = "putaway_return",
  RTO = "putaway_rto",
  "PUTAWAY_CANCELLED_SHIPMENT" = "putaway_cancelled_shipment"
}

export interface PutawayApiReceiveDataProps {
  id: number;
  name: string;
  total_quantity: number;
  pending_quantity: number;
  inward_at: string;
  putaway_quantity: PutawayQuantityProp[];
  variants: VariantsProp[];
  barcode: string;
  source_id: number;
  source_type: string;
  putaway_type: FreshPutawaySourceType | ReturnPutawaySourceType;
  grn_id: number;
}

export interface FreshPutawayApiDataProps {
  key: string;
  pid: number;
  productName: string;
  // quantity: QuantityProp[];
  inwardAt: string;
  // inwardType: string;
  assignedTo: { id: number; name: string } | null;
  variants: VariantsProp[];
  quantityUnit: number;
  quantityOuter: number;
  quantityCase: number;
  barcode: string;
  sourceId: number;
  sourceType: string;
  putawayType: FreshPutawaySourceType | ReturnPutawaySourceType;
}

export interface ReturnPutawayApiDataProps {
  key: string;
  pid: number;
  productName: string;
  // quantity: QuantityProp[];
  inwardAt: string;
  // inwardType: string;
  assignedTo: { id: number; name: string } | null;
  variants: VariantsProp[];
  quantityUnit: number;
  quantityOuter: number;
  quantityCase: number;
  barcode: string;
  sourceId: number;
  sourceType: string;
  putawayType: ReturnPutawaySourceType;
}

interface ItemProp {
  product_id: number;
  quantity: number;
  variant: uomTypes;
  source_id: number;
  source_type: string;
  // putaway_type: FreshPutawaySourceType | ReturnPutawaySourceType;
}

interface PutawayReportItemProp {
  inventory_migration_id: number;
}

export interface UseAssignPutawayProps {
  assign_to: number;
  items: ItemProp[];
  // putaway_type?: string;
  putaway_type: FreshPutawaySourceType | ReturnPutawaySourceType;
}

export interface UseReAssignPutawayProps {
  assign_to: number;
  items: PutawayReportItemProp[];
}

export interface InitialRowData {
  assignedTo: string | undefined;
  quantityUnit?: number;
  quantityOuter?: number;
  quantityCase?: number;
}

interface AssignedProps {
  value: number;
}
export interface AssignDataProps {
  quantityUnit: string;
  quantityOuter: string;
  quantityCase: string;
  assignedTo: AssignedProps;
}

// *********************************************** New Putaway Types *********************************************** //
// New Putaway Types Date: 02/01/2023

export interface PutawayApiReceivedDataType {
  data: PutawayDataType[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface PutawayDataType {
  id: number;
  product_id: number;
  name: string;
  barcode: string;
  total_quantity: number;
  pending_quantity: number;
  // putaway_type: NewFreshPutawayType | NewReturnPutawayType;
  putaway_type: any;
  source_id: string;
  inward_at: string;
  // status: NewPutawayStatusType;
  status: any;
}

export enum NewFreshPutawayType {
  FRESH = "FRESH"
}
export enum NewReturnPutawayType {
  FRESH = "FRESH"
}

export enum NewPutawayStatusType {
  INITIATED = "initiated"
}

export interface PutawayPayloadType {
  assigned_to: number;
  items: PutawayPayloadItemType[];
}

export interface PutawayPayloadItemType {
  id: number;
  quantity: number;
}
