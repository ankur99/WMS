export interface ShipmentPodImageList {
  url: string;
  id: number;
  file_type: string;
}

export interface PODListData {
  shipment_id: number;
  order_id: number;
  nt_order_id: string;
  shipment_has_pod_image: boolean;
  shipment_pods_img_list: ShipmentPodImageList[] | null | [];
}

export interface PODImagesData {
  url: string;
  id: number;
  file_type: string;
}
export interface PODData {
  pod_images: PODImagesData[];
}

export interface PODArrayData {
  pod_base_url: string;
  file_type: string;
}

export enum ReasonTypes {
  NOT_UPLOADED = "Pod not uploaded",
  NOT_CLEAR = "Pod image not clear"
}

export interface StoreResultDataTypes {
  store_id: number;
  order_id: number;
  shipment_id: number;
  nt_order_id: string;
  shipment_created_at: string;
  shipment_has_pod_image: boolean;
  store_name: string;
  reason: string | null;
}

export interface StoreApiRecievedData {
  results: StoreResultDataTypes[];
  count: number;
}
