export interface GstinType {
  id: number;
  gstin: string;
}

export interface VendorAddressType {
  vendor_name: string;
  vendor_id: number;
  gstins: GstinType[];
}

export interface AddressType {
  id: number;
  name: string;
}

export interface AddressDBType {
  id: number;
  full_address: string;
  vendor_id: number;
  gstin: string;
}

export interface ProductType {
  name: string;
  mrp: number;
  product_id: number;
}

export interface ProductFieldType {
  product: {
    label: string;
    value: number;
    key: string;
  };
  mrp: number;
  qty: number;
  selling_price: number;
  total: number;
}

export interface NonInventoryInvoicingFormValues {
  vendor: {
    label: string;
    value: string;
  };
  "billing-address": number;
  "shipping-address": any;
  products: ProductFieldType[];
  "same-as-billing-address": boolean;
}

export interface NonInventoryInvoicingPayloadType {
  gstin: string;
  vendor_id: number;
  billing_state_id: number;
  shipping_state_id: number;
  products: {
    product_id: number;
    quantity: number;
    selling_price: number;
  }[];
}

export enum InvoiceStatusType {
  pending = "pending",
  approved = "approved"
}

export interface NonInventoryInvoicingType {
  id: number;
  created_at: string;
  updated_at: string;
  vendor_id: number;
  warehouse_id: number;
  total: string;
  status: InvoiceStatusType;
  created_by_id: number;
  created_by_type: string;
  tax: string;
  subtotal: string;
}

export interface NonInventoryInvoicingsType {
  results: NonInventoryInvoicingType[];
  num_page: number;
  has_next: boolean;
  has_previous: boolean;
  next_page_number: number;
  previous_page_number: number;
  start_index: number;
  end_index: number;
  count: number;
  count_per_page: number;
}

export interface NonInventoryInvoicingDataType {
  vendor: {
    vendor_id: string;
    vendor_name: string;
    vendor_billing_address: string;
    vendor_shipping_address: string;
  };
  products: {
    id: number;
    product_name: string;
    product_id: number;
    mrp: string;
    quantity: number;
    selling_price: string;
    subtotal: string;
    rate: string;
    amount: string;
    igst?: {
      value: string;
      percentage: string;
    };
    cgst?: {
      value: string;
      percentage: string;
    };
    sgst?: {
      value: string;
      percentage: string;
    };
  }[];
  order_id: string;
  order_status: InvoiceStatusType;
}
