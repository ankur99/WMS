import { FilterValue } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { ActualUomTypes } from "../utils/constants";
import { IdName } from "./commonTypes";
import { KeyValueLabel, ProductBrand } from "./ProductTypes";

export enum ProductRequestStatus {
  pending = "pending",
  product_created = "product_created"
}

export enum ProductRequestComingFrom {
  UPDATE = "UPDATE",
  CREATE = "CREATE"
}

export interface UseProductRequest {
  results: ProductRequestData[];
  count: number;
}

export interface ProductRequestData {
  id: number;
  group_id: number;
  cl4_id: number | null;
  is_requested_group: 0 | 1;
  name: string;
  barcode: string;
  auto_assign_barcode: 0 | 1;
  description: string;
  brand_id: number;
  collection_id: number;
  uom: ActualUomTypes;
  unit_mrp: number;
  outer_units: number;
  case_units: number;
  tax_class_id: number;
  product_id: number | null;
  hsn_code: null | number;
  //   file: null;
  source: string;
  status: ProductRequestStatus;
  source_id: number;
  created_at: Date;
  updated_at: Date;
  brand: ProductBrand;
  //   brand: {
  //     id: number;
  //     marketer_id: number;
  //     name: string;
  //     // logo: "5d8dbc9a9edf4.jpeg";
  //     // slug: "clinic-plus";
  //     // lft: 56;
  //     // rgt: 57;
  //     // is_visible: 1 | 0;
  //     // status: 1 | 0;
  //     // created_at: "2019-09-27T07:39:06.000Z";
  //     // updated_at: "2020-03-03T07:38:52.000Z";
  //   };
  // collections: ProductCollection;
  //   collections: {
  //     id: 10;
  //     name: "Personal Care";
  //     slug: "personal-care";
  //     icon: "5d5e79f1046ec.png";
  //     lft: 33;
  //     rgt: 34;
  //     is_visible: 1;
  //     status: 1;
  //     created_at: "2019-06-12T03:32:13.000Z";
  //     updated_at: "2019-12-14T07:34:57.000Z";
  //   };
  newCatL4: {
    id: number;
    name: string;
    // newcat_l3_id: 8;
    // created_at: "2021-03-20T06:48:26.000Z";
    // updated_at: "2021-03-20T06:48:26.000Z";
  };
}

export interface UseProductRequestsProps {
  currentPage: number;
  onError: (error: AxiosError) => void;
  filtersValue: Record<string, FilterValue | null>;
}

export interface UseProductRequestProps {
  productRequestId: string | undefined;
  onError: (error: AxiosError) => void;
  shouldRefetch?: boolean;
}

export interface UseProductRequestImageProps {
  productRequestId: string | undefined;
  onError: (error: AxiosError) => void;
  shouldRefetch: boolean;
  imageKey: string;
}

export interface ProductRequestReceived {
  name: string;
  barcode?: string;
  uom: ActualUomTypes;
  outer_units: number;
  case_units: number;
  auto_assign_barcode?: boolean | 0 | 1;
  //images
  image_front: string | null;
  image_back: string | null;
  mrp_details: string | null;
  marketer_details: string | null;
  fssai_license: string | null;
  description: string | null;
  unit_mrp: number | null;
  brand: IdName | null;
  group: IdName | null;
  newCatL4: IdName | null;
  hsn_code: string | null;
  save_permission: boolean;
  approve_permission: boolean;
}

export interface ProductRequestBasic {
  name: string;
  barcode?: string;
  uom: ActualUomTypes;
  outer_units: number;
  case_units: number;
  auto_assign_barcode?: boolean | 0 | 1;
  //images
  image_front: string | null;
  image_back: string | null;
  mrp_details: string | null;
  marketer_details: string | null;
  fssai_license: string | null;
  // description: string | null;
  // unit_mrp: number | null;
  source_id?: number;
  source?: string;
}

export interface PlanningInfoForm {
  name: string;
  description?: string | null;
  unit_mrp: number | null;
  brand: KeyValueLabel | undefined;
  group: KeyValueLabel | undefined;
  cl4: KeyValueLabel | undefined;
  hsn_sac: KeyValueLabel | undefined;
}

export interface ApproveProductRequestProps {
  name: string;
  description: string;
  unit_mrp: number;
  brand_id: string;
  group_id: string;
  cl4_id: string;
  hsn_code: string;
  type?: "approve";
  // tax_class_id: string;
  // collection_id: string;
}

export enum ProductRequesImageKeys {
  FRONT = "image_front",
  BACK = "image_back",
  MRP = "mrp_details",
  MANUFACTURER = "marketer_details",
  FSAAI_LICENSE = "fssai_license"
}
