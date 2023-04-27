import { useQuery, useQueryClient, useMutation } from "react-query";
import { AxiosError } from "axios";
import {
  UseStoreDataProps,
  UpdateStoreDetails,
  UpdateOwnerDetails,
  UpdateBusinessDetails,
  FileComingFrom,
  BusinessDocumentData,
  DocFileType,
  BusinessDocumentReceivedData,
  AllowedFileTypes,
  AllTags
} from "../types/updateStoreTypes";
import { changeYYYYMMDDToDDMMYYYY } from "../utils/constants";
import moment from "moment";
import { phpInstance } from "../api/Api";

//All Beats
const featchAllBeats = () => {
  return phpInstance.get(`/admin/v1/search/beats`);
};

export const useAllBeats = ({ onError }: { onError: (error: AxiosError) => void }) => {
  return useQuery(["fetch-all-beats"], () => featchAllBeats(), {
    onError,
    refetchOnWindowFocus: false,
    cacheTime: 1000 * 60 * 10, //10min cache time
    staleTime: 1000 * 60 * 10 //10min stale time
  });
};

//All Tags
const featchAllTags = () => {
  return phpInstance.get(`/admin/v1/search/tags?type=store`);
};

export const useAllTags = ({ onError }: { onError: (error: AxiosError) => void }) => {
  return useQuery(["fetch-all-tags"], () => featchAllTags(), {
    onError,
    refetchOnWindowFocus: false,
    cacheTime: 1000 * 60 * 10, //10min cache time
    staleTime: 1000 * 60 * 10 //10min stale time
  });
};

//All WareHouses
const featchAllWareHouses = () => {
  return phpInstance.get(`/admin/v1/search/warehouses`);
};

export const useAllWareHouses = ({ onError }: { onError: (error: AxiosError) => void }) => {
  return useQuery(["fetch-all-warehouses"], () => featchAllWareHouses(), {
    onError,
    refetchOnWindowFocus: false,
    cacheTime: 1000 * 60 * 10, //10min cache time
    staleTime: 1000 * 60 * 10 //10min stale time
  });
};

// All Franchise Fees
const featchAllFranchiseFees = () => {
  return phpInstance.get(`/admin/v1/stores/franchise-fees`);
};

export const useAllFranchiseFees = ({ onError }: { onError: (error: AxiosError) => void }) => {
  return useQuery(["fetch-all-franchise-fees"], () => featchAllFranchiseFees(), {
    onError,
    refetchOnWindowFocus: false,
    cacheTime: 1000 * 60 * 10, //10min cache time
    staleTime: 1000 * 60 * 10, //10min stale time
    select: (data) => {
      const temp = data?.data?.data;
      // console.log({ temp });

      const formattedTemp = temp?.map((item: { id: number; mrp: number; name: string }) => {
        return {
          id: item?.id,
          name: `${item.name}(Rs${item?.mrp}) `
        };
      });

      return formattedTemp;
    }
  });
};

//Store Details
const fetchStoreDetails = ({ storeId }: { storeId: number }) => {
  return phpInstance.get(`/admin/v1/stores/${storeId}/primary`);
};

export const useStoreDetailsData = ({ storeId, onError }: UseStoreDataProps) => {
  return useQuery(["fetch-store-details", storeId], () => fetchStoreDetails({ storeId }), {
    onError,
    refetchOnWindowFocus: false,
    enabled: storeId && storeId > 0 ? true : false,
    cacheTime: 1000 * 60 * 10, //10min cache time
    staleTime: 1000 * 60 * 10, //10min stale time
    //formatting and sanitizing data
    select: (data) => {
      // console.log("store details data", data);
      const temp = data?.data?.data;
      if (temp) {
        const requiredFormattedTags = temp?.tags?.map((tag: AllTags) => tag.id);
        const requiredFormattedBeats = temp?.beat?.id;
        const franchise_fees_applicable = temp.franchise_fees_applicable === 1 ? true : false;
        const onboarding_fees_applicable = temp.onboarding_fees_applicable === 1 ? true : false;
        const credit_allowed = temp.credit_allowed === 1 ? true : false;
        // console.log({ requiredFormattedTags, requiredFormattedBeats });
        const fulfil_warehouse_name = temp.fulfil_warehouse_id ? temp.fulfil_warehouse_id.name : "";

        const fulfil_warehouse_id = temp.fulfil_warehouse_id ? temp.fulfil_warehouse_id.id : null;

        const franchise_fees_product_id = temp?.franchise_fees_amount
          ? temp?.franchise_fees_amount?.id
          : null;

        const franchise_fees_product_name = temp?.franchise_fees_amount
          ? `${temp?.franchise_fees_amount?.name} (${temp?.franchise_fees_amount?.mrp})`
          : null;

        const formattedFranchiseFeesStartDate = temp?.franchise_fees_start_date
          ? changeYYYYMMDDToDDMMYYYY(temp?.franchise_fees_start_date)
          : "";

        const momentFranchiseFeesStartDate = formattedFranchiseFeesStartDate
          ? moment(formattedFranchiseFeesStartDate, "DD-MM-YYYY")
          : null;

        const pincode =
          temp?.pincode && temp?.pincode?.id
            ? {
                key: temp.pincode.id,
                label: temp.pincode.pincode
              }
            : null;

        const beat = temp?.beat?.id
          ? {
              key: temp.beat.id,
              label: temp.beat.name
            }
          : null;

        return {
          ...temp,
          requiredFormattedTags,
          requiredFormattedBeats,
          franchise_fees_applicable,
          onboarding_fees_applicable,
          credit_allowed,
          momentFranchiseFeesStartDate,
          formattedFranchiseFeesStartDate,
          pincode,
          fulfil_warehouse_id,
          fulfil_warehouse_name,
          beat,
          franchise_fees_product_id,
          franchise_fees_product_name
        };
      }
    }
  });
};

const updateStoreDetails = ({ storeId, payload }: UpdateStoreDetails) => {
  const payloadToSend = {
    ...payload,
    // beat_id: payload.requiredFormattedBeats,
    beat_id: payload.beat ? payload.beat.key : null,
    tag_ids: payload.requiredFormattedTags,
    credit_allowed: payload.credit_allowed ? 1 : 0,
    franchise_fees_start_date: payload.momentFranchiseFeesStartDate
      ? moment(payload.momentFranchiseFeesStartDate).format("YYYY-MM-DD")
      : ""
  };

  delete payloadToSend?.requiredFormattedBeats;
  delete payloadToSend?.requiredFormattedTags;
  delete payloadToSend?.momentFranchiseFeesStartDate;

  return phpInstance.post(`admin/v1/stores/${storeId}/updatePrimaryDetails`, payloadToSend);
};

export const useUpdateStoreDetails = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(updateStoreDetails, {
    onSuccess: () => {
      onSuccess("Store Details Updated Successfully");
      queryClient.invalidateQueries("fetch-store-details"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

//Owner Details
const fetchOwnerDetails = ({ storeId }: { storeId: number }) => {
  return phpInstance.get(`/admin/v1/stores/${storeId}/owner-details`);
};

export const useOwnerDetailsData = ({ storeId, onError }: UseStoreDataProps) => {
  return useQuery(["fetch-owner-details", storeId], () => fetchOwnerDetails({ storeId }), {
    onError,
    refetchOnWindowFocus: false,
    enabled: storeId && storeId > 0 ? true : false,
    cacheTime: 1000 * 60 * 10, //10min cache time
    staleTime: 1000 * 60 * 10, //10min stale time
    //formatting and sanitizing data
    select: (data) => {
      const temp = data?.data?.data;
      const formattedDataOfBirth = temp?.date_of_birth
        ? changeYYYYMMDDToDDMMYYYY(temp?.date_of_birth)
        : null;
      const momentDateOfBirth = formattedDataOfBirth
        ? moment(formattedDataOfBirth, "DD-MM-YYYY")
        : null;
      return {
        ...temp,
        formattedDataOfBirth,
        momentDateOfBirth
      };
    }
  });
};

const updateOwnerDetails = ({ storeId, payload }: UpdateOwnerDetails) => {
  const payloadToSend = {
    ...payload,
    date_of_birth: moment(payload.momentDateOfBirth).format("YYYY-MM-DD")
  };

  delete payloadToSend?.momentDateOfBirth;
  return phpInstance.post(`admin/v1/stores/${storeId}/updateOwnerDetails`, payloadToSend);
};

export const useUpdateOwnerDetails = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(updateOwnerDetails, {
    onSuccess: () => {
      onSuccess("Owner Details Updated Successfully");
      queryClient.invalidateQueries("fetch-owner-details"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

//Business Details
const fetchBusinessDetails = ({ storeId }: { storeId: number }) => {
  return phpInstance.get(`/admin/v1/stores/${storeId}/business-details`);
};

export const useBusinessDetailsData = ({ storeId, onError }: UseStoreDataProps) => {
  return useQuery(["fetch-business-details", storeId], () => fetchBusinessDetails({ storeId }), {
    onError,
    refetchOnWindowFocus: false,
    enabled: storeId && storeId > 0 ? true : false,
    cacheTime: 1000 * 60 * 10, //10min cache time
    staleTime: 1000 * 60 * 10 //10min stale time
  });
};

const updateBusinessDetails = ({ storeId, payload }: UpdateBusinessDetails) => {
  return phpInstance.post(`admin/v1/stores/${storeId}/updateBusinessDetails`, payload);
};

export const useUpdateBusinessDetails = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(updateBusinessDetails, {
    onSuccess: () => {
      onSuccess("Business Details Updated Successfully");
      queryClient.invalidateQueries("fetch-business-details"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

//Business Documnents
const fetchBusinessDocuments = ({ storeId }: { storeId: number }) => {
  return phpInstance.get(`/admin/v1/stores/${storeId}/business-documents`);
};

export const useBusinessDocumentsData = ({ storeId, onError }: UseStoreDataProps) => {
  return useQuery(
    ["fetch-business-documents", storeId],
    () => fetchBusinessDocuments({ storeId }),
    {
      onError,
      refetchOnWindowFocus: false,
      enabled: storeId && storeId > 0 ? true : false,
      cacheTime: 1000 * 60 * 10, //10min cache time
      staleTime: 1000 * 60 * 10, //10min stale time
      //formatting and sanitizing data
      select: (data) => {
        const temp = data?.data?.data;
        // const temp = data;
        const formattedBusinessDocuments: BusinessDocumentData | Record<string, DocFileType> = {};
        for (const item in temp) {
          if (temp[item as keyof BusinessDocumentReceivedData] && item && item !== "id") {
            let fileType = "";
            const fileUrl = (temp[item as keyof BusinessDocumentReceivedData] as string) || "";
            if (fileUrl.toString().slice(-3) === "pdf") {
              fileType = AllowedFileTypes.PDF;
            } else {
              fileType = AllowedFileTypes.IMAGE;
            }
            formattedBusinessDocuments[item] = {
              url: temp[item as keyof BusinessDocumentReceivedData],
              fileComingFrom: FileComingFrom.BACKEND,
              fileType: fileType as AllowedFileTypes
            };
          } else {
            formattedBusinessDocuments[item] = {
              url: null,
              fileType: null,
              fileComingFrom: FileComingFrom.BACKEND
            };
          }
        }
        // console.log({ formattedBusinessDocuments });
        return formattedBusinessDocuments as unknown as BusinessDocumentData;
      }
    }
  );
};

//Upload Business Documents
const uploadBusinessDocuments = ({ storeId, payload }: { storeId: number; payload: FormData }) => {
  return phpInstance.post(`/admin/v1/stores/${storeId}/upload`, payload);
};

export const useUploadBusinessDocuments = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(uploadBusinessDocuments, {
    onSuccess: () => {
      onSuccess("Document Uploaded Successfully");
      queryClient.invalidateQueries("fetch-business-documents"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};
