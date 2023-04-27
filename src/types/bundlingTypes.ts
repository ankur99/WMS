export interface ProductFromDebounceSelect {
  label: string;
  value?: number;
  key: string | number;
  disabled?: boolean;
}

export interface ItemProp {
  id?: number | string;
  product: ProductFromDebounceSelect;
  quantity: number;
  // discount: number;
}

export interface ItemPropFrontend {
  id?: number | string;
  product: ProductFromDebounceSelect;
  quantity: number;
}

export interface ItemSendProp {
  product_id: number;
  quantity: number;
  // discount: number;
}
export interface RecipeCreateAndEditProps {
  items: ItemProp[];
  name: string;
  id: number;
  status: "unpublished" | "published";
  instruction_link: { url: string }[];
  productId: number | null;
}

export interface RecipeCreateAndEditAccordingToFrontendProps {
  instruction_link: { url: string }[];
  items: ItemPropFrontend[];
  name: string;
  id?: number;
  // discount: number;
  status: "unpublished" | "published";
  urls: { url: string }[];
}

export interface RecipeCreateSendData {
  payload: {
    name: string;
    items: ItemSendProp[];
    instruction_link?: { url: string }[];
  };
}

export interface RecipeCreateSendPayload {
  name: string;
  items: ItemSendProp[];
  instruction_link?: { url: string }[];
}

export interface BundlingProp {
  productId: number | null;
  id: number;
  name: string;
  status: "published" | "unpublished" | "executed" | "";
  // status: string;
  items: ItemProp[];
  instruction_link: { url: string }[];
  deleted_at?: string | null;
}
