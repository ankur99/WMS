import { AxiosError } from "axios";
import { IdName } from "./commonTypes";

export enum FileComingFrom {
  FRONTEND = "FRONTEND",
  BACKEND = "BACKEND"
}

// export interface BusinessDocumentData {
//   label?: string;
//   url: string | null;
//   fileType: AllowedFileTypes | null;
//   required?: boolean;
//   fileComingFrom: FileComingFrom | null;
//   fileName: string | null;
// }

export interface NonEditableRowShowProps {
  // label: string;
  value: string | number | boolean | IdName[] | undefined | null;
  type: RowShowInputTypes;
}

export interface EditableRowShowProps {
  label: string;
  value?:
    | string
    | number
    | boolean
    | IdName[]
    | undefined
    | null
    | number[]
    | Record<string, unknown>;
  type: RowShowInputTypes;
  id: string | any;
  arrayData?: {
    id: number | string;
    name: string;
  }[];
  required?: boolean;
  disabled?: boolean;
  pattern?: RegExp;
  // fetchApi?: (search: string) => Promise<AxiosResponse<unknown, unknown>>;
  fetchApi?: any;
  labelToShow?: boolean;
  marginBottom?: boolean;
  mode?: "multiple";
  debounceId?: string;
  debounceName?: string;
  debounceName2?: string;
  clearOptionsAfterSelect?: boolean;
}

export interface RowShowProps {
  label: string;
  value: string | number | boolean | string[] | undefined;
  type: RowShowInputTypes;
}

export interface NonEditableStoreDetailsProps {
  handleEditStoreDetails: (value: boolean) => void;
  storeDetailsData: StoreDetailsData | undefined;
  title: string;
}

export interface EditableStoreDetailsProps {
  handleEditStoreDetails: (value: boolean) => void;
  storeDetailsData: StoreDetailsData | undefined;
  title: string;
  allTagsData: AllTags[] | undefined;
  // allBeatsData: AllBeats[] | undefined;
  allWareHousesData: AllWarehouses[] | undefined;
  allFranchiseFeesData: IdName[] | undefined;
}

export interface NonEditableOwnerDetailsProps {
  handleEditOwnerDetails: (value: boolean) => void;
  ownerDetailsData: OwnerDetailsData | undefined;
  title: string;
}

export interface EditableOwnerDetailsProps {
  handleEditOwnerDetails: (value: boolean) => void;
  ownerDetailsData: OwnerDetailsData | undefined;
  title: string;
}

export interface NonEditableBusinessDetailsProps {
  handleEditBusinessDetails: (value: boolean) => void;
  businessDetailsData: BusinessDetailsData | undefined;
  title: string;
}

export interface EditableBusinessDetailsProps {
  handleEditBusinessDetails: (value: boolean) => void;
  businessDetailsData: BusinessDetailsData | undefined;
  title: string;
}

export enum RowShowInputTypes {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  MULTI_TAGS = "MULTI_TAGS",
  TAG = "TAG",
  SINGLE_SELECT = "SINGLE_SELECT",
  DATE = "DATE",
  DEBOUNCE_SELECT = "DEBOUNCE_SELECT",
  PINCODE = "PINCODE",
  NUMBER_WITH_CUSTOM_RULE = "NUMBER_WITH_CUSTOM_RULE",
  STRING_WITH_CUSTOM_RULE = "STRING_WITH_CUSTOM_RULE",
  // RUPPEE = "RUPPEE"
  CHECKBOX = "CHECKBOX",
  RADIO_BUTTON = "RADIO_BUTTON",
  DEBOUNCE_SELECT_OPTION_GROUP = "DEBOUNCE_SELECT_OPTION_GROUP"
}

export enum FileUploadButtonType {
  NEW = "NEW",
  UPDATE = "UPDATE"
}

export enum AllowedFileTypes {
  IMAGE = "IMAGE",
  PDF = "PDF",
  CSV = "CSV",
  UNKNOWN = "UNKNOWN"
}

export interface MultipleFileUploadProps {
  id: string;
  handleMultipleFileUpload: ({
    id,
    multipleParams,
    files
  }: {
    id: string;
    multipleParams: DocFileType[];
    files: File[];
  }) => void;
  buttonType: FileUploadButtonType;
  maxFileSizeInBytesAllowed: number;
  accept: string;
}

export interface MultipleFileUploadProps {
  id: string;
  handleMultipleFileUpload: ({
    id,
    multipleParams,
    files
  }: {
    id: string;
    multipleParams: DocFileType[];
    files: File[];
  }) => void;
  buttonType: FileUploadButtonType;
  maxFileSizeInBytesAllowed: number;
  accept: string;
}

export interface FileUploadProps {
  // index: number;
  buttonType: FileUploadButtonType;
  // fileParams: DocFileType;
  id: string;
  handleFileUpload: ({
    // index,
    id,
    fileParams,
    file
  }: {
    id: string;
    fileParams: DocFileType;
    file: File;
  }) => void;
  maxFileSizeInBytesAllowed?: number;
  accept: string;
}

export interface UseStoreDataProps {
  storeId: number;
  onError: (error: AxiosError) => void;
}

export interface UpdateStoreDetails {
  storeId: number;
  payload: StoreDetailsUpdateData;
}
export interface UpdateOwnerDetails {
  storeId: number;
  payload: OwnerDetailsData;
}

export interface UpdateBusinessDetails {
  storeId: number;
  payload: BusinessDetailsData;
}

export interface AllBeats {
  id: number;
  name: string;
}

export interface AllTags {
  id: number;
  name: string;
}

export interface AllWarehouses {
  id: number;
  name: string;
}
export interface ArrayData {
  id: number | string;
  name: string;
}

export interface StoreDetailsUpdateData {
  id: number;
  name: string;
  // beat: AllBeats;
  beat: {
    key: number;
    label: string;
  };
  address: string;
  gstin: string;
  lat: number;
  lng: number;
  landmark: string;
  // pincode: string;
  pincode: string | number;
  verified: boolean;
  contact_person: string;
  contact_mobile: string;
  credit_allowed: 1 | 0;
  tags: AllTags[];
  requiredFormattedTags?: number[];
  requiredFormattedBeats?: number;
  onboarding_fees_applicable: 1 | 0;
  onboarding_fees_amount?: number;
  franchise_fees_applicable: 1 | 0;
  franchise_fees_amount?: number;
  franchise_fees_start_date?: string;
  formattedFranchiseFeesStartDate?: string;
  momentFranchiseFeesStartDate?: moment.Moment | null;
  // fulfil_warehouse_id: null | AllWarehouses;
  fulfil_warehouse_id: null | number | undefined;
  fulfil_warehouse_name?: string;
  can_edit_fulfil_warehouse_id: boolean;
}
export interface StoreDetailsData {
  id: number;
  name: string;
  // beat: AllBeats;
  beat: {
    key: number;
    label: string;
  };
  address: string;
  gstin: string;
  lat: number;
  lng: number;
  landmark: string;
  // pincode: string;
  pincode: {
    key: number;
    label: string;
  };
  verified: boolean;
  contact_person: string;
  contact_mobile: string;
  credit_allowed: boolean;
  tags: AllTags[];
  requiredFormattedTags?: number[];
  requiredFormattedBeats?: number;
  onboarding_fees_applicable: boolean;
  onboarding_fees_amount?: number;
  franchise_fees_applicable: boolean;
  // franchise_fees_amount?: number;
  franchise_fees_amount?: null | {
    id: number;
    name: string;
    mrp: number;
  };
  franchise_fees_amount_name?: number;
  // franchise_fees_amount_id?: number;
  franchise_fees_product_id?: number;
  franchise_fees_start_date?: string;
  formattedFranchiseFeesStartDate?: string;
  momentFranchiseFeesStartDate?: moment.Moment | null;
  // isAdmin: boolean;
  // fulfil_warehouse_id?: null | AllWarehouses;
  fulfil_warehouse_id?: null | number;
  fulfil_warehouse_name?: string;
  can_edit_fulfil_warehouse_id?: boolean;
  bd_store_id?: string;
}

export interface StoreDetailsReceiveData {
  id: number;
  name: string;
  // beat: AllBeats;
  beat: {
    key: number;
    label: string;
  };
  address: string;
  gstin: string;
  lat: number;
  lng: number;
  landmark: string;
  // pincode: string;
  pincode: {
    id: number;
    pincode: string;
  };
  verified: boolean;
  contact_person: string;
  contact_mobile: string;
  credit_allowed: 1 | 0;
  tags: AllTags[];
  requiredFormattedTags?: number[];
  requiredFormattedBeats?: number;
  onboarding_fees_applicable: 1 | 0;
  onboarding_fees_amount?: number;
  franchise_fees_applicable: 1 | 0;
  franchise_fees_amount?: number;
  franchise_fees_start_date?: string;
  formattedFranchiseFeesStartDate?: string;
  momentFranchiseFeesStartDate?: moment.Moment | null;
  // fulfil_warehouse_id: null | AllWarehouses;
  fulfil_warehouse_id: null | number;
  fulfil_warehouse_name?: string;
  can_edit_fulfil_warehouse_id: boolean;
}

export interface OwnerDetailsData {
  id: number;
  owner_name: string;
  father_name: string;
  aadhar: string;
  pan: string;
  date_of_birth: string;
  present_address: string;
  permanent_address: string;
  bank_account: string;
  bank_ifsc: string;
  formattedDataOfBirth: string;
  momentDateOfBirth?: moment.Moment | null;
}

export interface BusinessDetailsData {
  id: number;
  gstin_number: string | null;
  gstin_document: string | null;
  business_pan: string | null;
  business_pan_document: string | null;
  shop_establishment_act: string | null;
  shop_establishment_act_document: string | null;
  fssai_license: string | null;
  fssai_license_document: string | null;
  trade_license: string | null;
  trade_license_document: string | null;
  udyog_aadhar: string | null;
  udyog_aadhar_document: string | null;
}

export interface BusinessDocumentReceivedData {
  pan_document: null | string;
  aadhar_front_document: null | string;
  aadhar_back_document: null | string;
  gstin_number_document: null | string;
  business_pan_document: null | string;
  shop_establishment_act_document: null | string;
  fssai_license_document: null | string;
  trade_license_document: null | string;
  udyog_aadhar_document: null | string;
}

export interface BusinessDocumentDataNew {
  pan_document: null | DocFileType;
  aadhar_front_document: null | DocFileType;
  aadhar_back_document: null | DocFileType;
  gstin_number_document: null | DocFileType;
  business_pan_document: null | DocFileType;
  shop_establishment_act_document: null | DocFileType;
  fssai_license_document: null | DocFileType;
  trade_license_document: null | DocFileType;
  udyog_aadhar_document: null | DocFileType;
}

export interface BusinessDocumentData {
  id: number;
  pan_document: DocFileType;
  aadhar_front_document: DocFileType;
  aadhar_back_document: DocFileType;
  gstin_number_document: DocFileType;
  business_pan_document: DocFileType;
  shop_establishment_act_document: DocFileType;
  fssai_license_document: DocFileType;
  trade_license_document: DocFileType;
  udyog_aadhar_document: DocFileType;
}

export interface DocFileType {
  url: string | null;
  fileType: AllowedFileTypes | null;
  fileName?: string | null;
  fileComingFrom: FileComingFrom | null;
}

export interface RenderFile {
  fileType: AllowedFileTypes;
  url: string;
  fileName: string;
}
