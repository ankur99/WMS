import { FilterValue } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { ActualUomTypes, uomTypes } from "../utils/constants";

export enum ProductComingFrom {
  UPDATE = "UPDATE",
  CREATE = "CREATE"
}

export interface ProductData {
  id: number;
  group_id: number;
  name: string;
  brand_id: number;
  description: string | null;
  type: ProductType;
  barcode: string;
  marketer_barcode: string;
  hsn_sac_code: string;
  code: string;
  uom: ActualUomTypes;
  status: 1 | 0;
  is_app_saleable: 0;
  is_pos_saleable: 0;
  is_returnable: 1;
  tax_class_id: number;
  cl4_id: number;
  allow_back_orders: 0 | 1;
  brand: ProductBrand;
  tags: ProductTags[];
  warehouseRacks: WarehouseRack[];
  group: ProductGroup;
  // account: ProductAccount;
  // misc_info: string;
  // sales_info: ProductSalesInfo;
  attributes: ProductAttributesGet[];
  cl2: {
    id: number;
    name: string;
  };
  cl4: {
    id: number;
    name: string;
  };
  variants: ProductVariant[];
  taxClass: {
    id: number;
    name: string;
  };
  flatInventories: FlatInventories[];
  inventoryCount: [{ stock: number }];
  blockedInventoryCount: [{ orders_count: number }];
  newCatL4: {
    id: number;
    name: string;
  };
  min_price: number | null;
  mrp: number | null;
  warehouseAbc: WarehouseAbc;
}

export interface UseProduct {
  results: ProductData[];
  count: number;
}

export enum ProductType {
  PRODUCT = "PRODUCT",
  SERVICE = "SERVICE"
}

export enum ProductAccount {
  expense_amount = "Expense Amount",
  cogs = "Cogs"
}

export enum ProductSalesInfo {
  sales = "Sales",
  interest_income = "Interest Income",
  other_income = "Other Income"
}

export interface ProductBrand {
  id: number;
  name: string;
  logo: string;
}

export interface ProductCollection {
  id: number;
  name: string;
  status: 1 | 0;
}

export interface ProductTags {
  id: number;
  name: string;
  type: ProductType;
  status: 1 | 0;
  created_at: Date;
  updated_at: Date;
}

export interface ProductGroup {
  id: number;
  name: string;
  brand_id: number;
  // warehouseAbc: WarehouseAbc;
}

export interface WarehouseAbc {
  group_id: number;
  group_name: string;
  // sale: "24.820000";
  // qty_sold: "3.000000";
  qty_per_day: string;
  cumulative_qty: string;
  total_qty_sold: string;
  cum_qty_share: string;
  class_abc: string;
  // date_from: "2021-02-07T00:00:00.000Z";
  // date_to: "2021-03-06T00:00:00.000Z";
  // period_days: 100;
  // outer_quantity: 0;
  // case_quantity: 0;
  unit_mrp: string;
  // reorder_level_days: "7.00";
  // reorder_level_units: "1.000000";
  // reorder_quantity_days: "21.00";
  // reorder_quantity_units: "3.000000";
  // reorder_sku_value: "unit";
  // reorder_sku_quantity: "1.000000";
  stock: string;
  // demand_units_final: "10.000000";
  // demand_sku_quantity_final: "10.000000";
  // demand_generated: 1;
  // last_run: "2021-03-10T11:44:47.000Z";
}

export interface WarehouseRack {
  id: number;
  warehouse_id: number;
  reference: string;
  type_id: number;
  "sub-type": string;
  location: null | string;
  // name: string;
}

export interface FlatInventories {
  count: number;
  orders_count: number;
}

export interface ProductVariant {
  id: number;
  max_price: string;
  min_price: string;
  moq: number;
  mrp: number;
  price: string;
  product_id: number;
  quantity: string;
  sku: string;
  uom: ActualUomTypes;
  value: uomTypes;
  weight: number;
  length: number;
  width: number;
  height: number;
  deleted_at: string;
}

export interface UseProductsProps {
  currentPage: number;
  onError: (error: AxiosError) => void;
  filtersValue: Record<string, FilterValue | null>;
}

export interface UseProductProps {
  productId: string | undefined;
  onError: (error: AxiosError) => void;
  shouldRefetch?: boolean;
}

export interface ProductBasicInfoForm {
  name: string;
  type: ProductType;
  hsn_sac: KeyValueLabel | null;
  brand: KeyValueLabel;
  taxClass: KeyValueLabel;
  tags?: KeyValueLabel[];
  // status?: 1 | 0;
  barcode?: string;
  code?: string;
  allow_back_orders?: boolean;
  uom?: ActualUomTypes;
  racks?: KeyValueLabel[];
  description: string | null;
  mrp: number | null;
  min_price: number | null;
}

export interface KeyValueLabel {
  label: string;
  value?: string | number;
  key: string;
}

export interface ProductDataSend {
  name: string;
  description: string;
  type: ProductType;
  hsn_sac_code: number;
  brand_id: number;
  tax_class_id: number;
  tags?: number[];
  // status?: 1 | 0;
  barcode?: string | null;
  code?: string | null;
  allow_back_orders?: 1 | 0;
  uom: ActualUomTypes;
  racks: number[];
  mrp: number;
  min_mrp: number;
}

export interface ProductAttributesForm {
  attribute: KeyValueLabel;
  value: string;
}
export interface ProductAttributesSend {
  id: number;
  value: string;
}

export interface ProductAttributesGet {
  id: number;
  name: string;
  value: string;
}

export interface ProductGroupForm {
  group: KeyValueLabel;
  // cl2: KeyValueLabel;
  cl4: KeyValueLabel;
}

export interface MiscInfoForm {
  // account: "expense_amount" | "cogs";
  account?: ProductAccount;
  is_app_saleable: boolean;
  is_pos_saleable: boolean;
  is_returnable: boolean;
  misc_info?: string;
  // sales_info: "sales" | "interest_income" | "other_income";
  sales_info?: ProductSalesInfo;
}

export interface AttributesDataReceived {
  data:
    | null
    | {
        id: number;
        name: string;
        value: string;
      }[]
    | [];
}

export interface MiscInfoDataReceived {
  sales_info: ProductSalesInfo;
  account: ProductAccount;
  misc_info: string;
}
