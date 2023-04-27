export interface ContainerProps {
  id: number;
  crate_code: string;
  template_name: string;
}

export interface QCDataProps {
  id: number;
  order_count: number;
  picker_id: number;
  picked_by: string;
  created_by: string;
  created_at: string;
  containers: ContainerProps[];
}

export interface QCRecevied {
  data: QCDataProps[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface QCOrdersProps {
  id: number;
  order_id: string;
}

export interface QCOrdersOfAPicklist {
  id: number;
  picker_id: number;
  picked_by: string;
  orders: QCOrdersProps[];
}

export interface QCOrdersOfAPicklistReceivedData {
  data: QCOrdersOfAPicklist[];
}

export interface QCOrdersPending {
  picklist_id: number;
  order_id: number;
  product_id: number;
  name: string;
  quantity: number;
}

export interface QCOrdersPendingReceivedData {
  data: QCOrdersPending;
}

export interface BarcodeSearchProps {
  barcode: string;
  picklist_id: string;
  order_id: string;
}

export interface ProductType {
  product_id: number;
  name: string;
  barcode: number;
  stock: number;
  brand: string;
  image: string;
  variants: ProductVariantType[];
}

export interface ProductVariantType {
  id: number;
  price: string;
  value: string;
  quantity: string;
  moq: number;
}

export interface QCaddItemType {
  order_id: number;
  quantity: number;
  variant_id: number;
  crate_id: number;
  template_id: number;
  picklist_id: number;
}

export interface QCcrateLedgerItemType {
  id: number;
  reference_id: string;
  template_id: number;
  is_temporary: number;
  status: string;
  description: string;
  created_by: string;
  created_at: string;
  template: TemplateType;
}

export interface TemplateType {
  id: number;
  name: string;
  dimensions: string;
  color: string;
  type: string;
  material: string;
  is_temporary: number;
  description: string;
  status: number;
  created_at: string;
}

export interface CartType {
  crate_used: number;
  picked_items: number;
  picked_qty: number;
  subtotal: number;
  tax: number;
  total: number;
  items: CartCratesType[];
}

export interface CartCratesType {
  id: number;
  crate_code: string;
  template_name: string;
  items: CartItemType[];
}

export interface CartItemType {
  id: number;
  crate_transaction_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  barcode: string;
  price: number;
  name: string;
  variant: string;
  image: string;
}
