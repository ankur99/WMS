import { FilterValue } from "antd/lib/table/interface";
import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { nodeInstance } from "../api/Api";
import { createFiltersFromFilterValue, onErrorNotification } from "../utils/helperFunctions";

export const getStorePodfilters = (filtersValue: Record<string, FilterValue | null>) => {
  const filters = createFiltersFromFilterValue({
    filtersValue,
    equalKeys: ["store_id", "order_id", "shipment_id", "reason"],
    substitueKeys: [
      {
        actualKey: "store_id",
        changeToKey: "or.store_id"
      },
      {
        actualKey: "store_name",
        changeToKey: "str.name"
      },
      {
        actualKey: "order_id",
        changeToKey: "or.id"
      },
      {
        actualKey: "shipment_id",
        changeToKey: "shp.id"
      },
      {
        actualKey: "nt_order_id",
        changeToKey: "or.reference_id"
      },

      {
        actualKey: "reason",
        changeToKey: "sp.reason"
      }
    ]
  });
  return filters;
};

const fetchStoresPod = (
  currentPage: number,
  pageSize: number,
  filtersValue: Record<string, FilterValue | null>
) => {
  const params = `page=${currentPage}&limit=${pageSize}`;
  const filters = getStorePodfilters(filtersValue);
  if (filters) {
    return nodeInstance.get(`api/v1/store/stores-shipments-list?${params}&filters=${filters}`);
  }
  return nodeInstance.get(`api/v1/store/stores-shipments-list?${params}`);
};

export const useFetchStoresPod = ({
  currentPage,
  pageSize,
  filtersValue,
  onError
}: {
  currentPage: number;
  pageSize: number;
  filtersValue: Record<string, FilterValue | null>;
  onError: (error: AxiosError) => void;
}) => {
  return useQuery(
    Object.keys(filtersValue)?.length === 0
      ? ["fetch-stores", currentPage, pageSize]
      : ["fetch-stores", currentPage, pageSize, ...Object.values(filtersValue)],
    () => fetchStoresPod(currentPage, pageSize, filtersValue),
    {
      onError,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data?.data;
      }
    }
  );
};

const uploadPodImagesStore = ({ id, payload }: { id: string; payload: FormData }) => {
  return nodeInstance.post(`api/v1/store/pod-list/store-wise-upload-pods/${id}`, payload);
};

export const useUploadPodImagesStore = ({
  onError,
  onSuccess
}: {
  onError: (error: string) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(uploadPodImagesStore, {
    onSuccess: (data: AxiosResponse<any, any>) => {
      //
      const uploaded_pods = data?.data?.uploaded_pods;
      const unuploaded_pods = data?.data?.unuploaded_pods;
      if (uploaded_pods?.length > 0) {
        onSuccess(`Shipment id ${uploaded_pods} uploaded successfully`);
        queryClient.invalidateQueries("fetch-stores");
      }
      if (unuploaded_pods?.length > 0) {
        onError(`Items ${unuploaded_pods} are having invalid shipment id as name`);
      }
    },
    onError
  });
};

const uploadPodImages = (payload: FormData) => {
  return nodeInstance.post(`api/v1/store/pod-list/upload-pods`, payload);
};

export const useUploadPodImages = ({
  onError,
  onSuccess
}: {
  onError: (error: string) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(uploadPodImages, {
    onSuccess: (data: AxiosResponse<any, any>) => {
      const uploaded_pods = data?.data?.uploaded_pods;
      const unuploaded_pods = data?.data?.unuploaded_pods;

      if (uploaded_pods?.length > 0) {
        onSuccess(`Shipment id ${uploaded_pods} uploaded successfully`);
        queryClient.invalidateQueries("fetch-stores");
      }
      if (unuploaded_pods?.length > 0) {
        onError(`Items ${unuploaded_pods} are having invalid shipment id as name`);
      }
    },
    onError
  });
};

export const downloadPodListImages = async (
  args: number,
  filtersValue: Record<string, FilterValue | null>
) => {
  try {
    const filters = getStorePodfilters(filtersValue);

    if (filters) {
      const response = await nodeInstance.get(
        `api/v1/store/pod-list/download-pod-zip?filters=${filters}&finance_upload_pods=${args}`
      );
      return Promise.resolve(response?.data || {});
    } else {
      const response = await nodeInstance.get(
        `api/v1/store/pod-list/download-pod-zip?finance_upload_pods=${args}`
      );
      return Promise.resolve(response?.data || {});
    }
  } catch (error: any) {
    onErrorNotification(error);
    return Promise.resolve({});
  }
};

const fetchImagesPod = (shipment_id: string) => {
  return nodeInstance.get(`/api/v1/store/pod-list/view-image/${shipment_id}`);
};

export const useFetchImagesPod = ({
  shipment_id,
  onError
}: {
  shipment_id: string;
  onError: (error: AxiosError) => void;
}) => {
  return useQuery(["fetch-images", shipment_id], () => fetchImagesPod(shipment_id), {
    onError,
    refetchOnWindowFocus: false,
    select: (data) => {
      return data?.data;
    }
  });
};

export const fetchPodImages = async (shipment_id: string) => {
  try {
    const response = await nodeInstance.get(`/api/v1/store/pod-list/download-image/${shipment_id}`);
    return Promise.resolve(response?.data || {});
  } catch (error: any) {
    onErrorNotification(error);
    return Promise.resolve({});
  }
};
