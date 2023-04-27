import { useQuery, useMutation, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import {
  UseProductRequestsProps,
  UseProductRequestProps,
  ProductRequestComingFrom,
  UseProductRequestImageProps,
  ApproveProductRequestProps,
  ProductRequesImageKeys
} from "../types/productRequestTypes";
import { FilterValue } from "antd/lib/table/interface";
import { createFiltersFromFilterValue } from "../utils/helperFunctions";
import { changeDDMMYYYYToYYYYMMDD } from "../utils/constants";
import { nodeInstance } from "../api/Api";

export const getAllProductsRequestFilters = (filtersValue: Record<string, FilterValue | null>) => {
  const filters = createFiltersFromFilterValue({
    filtersValue,
    equalKeys: ["id", "status"],
    substitueKeys: [
      {
        actualKey: "brand",
        changeToKey: "brand.name"
      },
      {
        actualKey: "product_created_at",
        changeToKey: "created_at"
      }
    ]
  });

  return filters;
};

const fetchProductRequests = (
  currentPage: number,
  filtersValue: Record<string, FilterValue | null>
) => {
  // converting product_created_at date format
  const createdAt = filtersValue && filtersValue?.product_created_at?.[0];
  let newFiltersValue = null;

  if (filtersValue) {
    newFiltersValue = {
      ...filtersValue
    };
  }
  if (createdAt && newFiltersValue) {
    newFiltersValue.product_created_at = [changeDDMMYYYYToYYYYMMDD(createdAt as string)];
  }

  const params = `page=${currentPage}&limit=15`;
  const filters = getAllProductsRequestFilters(
    newFiltersValue as Record<string, FilterValue | null>
  );
  if (filters) {
    return nodeInstance.get(`/api/v1/product-requests?${params}&filters=${filters}`);
  }
  return nodeInstance.get(`/api/v1/product-requests?${params}`);
};

export const useAllProductRequestsData = ({
  currentPage,
  onError,
  filtersValue
}: UseProductRequestsProps) => {
  return useQuery(
    Object.keys(filtersValue)?.length === 0
      ? ["fetch-all-product-requests", currentPage]
      : ["fetch-all-product-requests", currentPage, ...Object.values(filtersValue)],
    () => fetchProductRequests(currentPage, filtersValue),
    {
      onError,
      refetchOnWindowFocus: false,

      //formatting and sanitizing data
      select: (data) => {
        return data?.data;
      }
    }
  );
};

// Getting specific product Request Data
const fetchProductRequest = (productRequestId: string | undefined) => {
  return nodeInstance.get(`/api/v1/product-requests/${productRequestId}`);
};

export const useProductRequestData = ({ productRequestId, onError }: UseProductRequestProps) => {
  return useQuery(
    ["fetch-product-request", productRequestId],
    () => fetchProductRequest(productRequestId),
    {
      onError,
      refetchOnWindowFocus: false,
      refetchInterval: 1000 * 60 * 4.5, //refetch is enabled, as it contains images, which expire after 5 mins
      enabled: productRequestId ? true : false,
      //formatting and sanitizing data
      select: (data) => {
        return data?.data;
      }
    }
  );
};

// creating product Request
const createProductRequest = (payload: FormData) => {
  return nodeInstance.post(`api/v1/product-requests/store`, payload);
};

export const useCreateProductRequest = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (productRequestId: number, comingFrom: ProductRequestComingFrom) => void;
}) => {
  return useMutation(createProductRequest, {
    onSuccess: (response) => {
      onSuccess(response?.data?.id, ProductRequestComingFrom.CREATE);
    },
    onError
  });
};

// // Update product Request
const updateProductRequestDetails = ({
  productRequestId,
  payload
}: {
  productRequestId: string;
  payload: FormData;
}) => {
  return nodeInstance.post(`api/v1/product-requests/${productRequestId}/update`, payload);
};

export const useUpdateProductRequestDetails = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (productRequestId: number, comingFrom: ProductRequestComingFrom) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(updateProductRequestDetails, {
    onSuccess: (response) => {
      onSuccess(response?.data?.data, ProductRequestComingFrom.UPDATE);
      queryClient.invalidateQueries("fetch-product-request"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

// Images
const fetchProductRequestImages = ({
  productRequestId,
  imageKey
}: {
  productRequestId: string | undefined;
  imageKey: string;
}) => {
  return nodeInstance.get(`api/v1/product-requests/${productRequestId}/view-file/${imageKey}`);
};

export const useProductRequestImage = ({
  productRequestId,
  onError,
  shouldRefetch,
  imageKey
}: UseProductRequestImageProps) => {
  return useQuery(
    ["fetch-product-request-image", productRequestId, imageKey],
    () => fetchProductRequestImages({ productRequestId, imageKey }),
    {
      onError,
      refetchOnWindowFocus: false,
      enabled: productRequestId ? true : false,
      refetchInterval: shouldRefetch ? 1000 * 60 * 4.5 : false,
      // in above, since  the image is coming from s3, a temporaray url is provided which is valid for 5 minutes
      //formatting and sanitizing data
      select: (data) => {
        return data?.data?.data;
      }
    }
  );
};

const uploadProductRequestImage = ({
  imageType,
  productRequestId,
  payload
}: {
  imageType: string;
  productRequestId: string | undefined;
  payload: FormData;
}) => {
  return nodeInstance.post(
    `/api/v1/product-requests/${productRequestId}/upload-file/${imageType}`,
    payload
  );
};

export const useUploadProductRequestImage = ({
  onError,
  onSuccess,
  imageKey,
  productRequestId
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
  imageKey: ProductRequesImageKeys;
  productRequestId: string;
}) => {
  const queryClient = useQueryClient();
  return useMutation(uploadProductRequestImage, {
    onSuccess: () => {
      onSuccess("Image uploaded successfully");
      queryClient.invalidateQueries(["fetch-product-request-image", productRequestId, imageKey]); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

// Approve Product Request
const approveProductRequest = ({
  productRequestId,
  payload
}: {
  productRequestId: string;
  payload: ApproveProductRequestProps;
}) => {
  return nodeInstance.post(`api/v1/product-requests/${productRequestId}/approve`, payload);
};

export const useSaveProductRequest = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (type: "SAVE" | "APPROVED" | "DELETE") => void;
}) => {
  return useMutation(approveProductRequest, {
    onSuccess: () => {
      onSuccess("SAVE");
    },
    onError
  });
};

export const useApproveProductRequest = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (type: "SAVE" | "APPROVED" | "DELETE") => void;
}) => {
  return useMutation(approveProductRequest, {
    onSuccess: () => {
      onSuccess("APPROVED");
    },
    onError
  });
};

// Delete Product Request
const deleteProductRequest = ({ productRequestId }: { productRequestId: string }) => {
  return nodeInstance.post(`api/v1/product-requests/${productRequestId}/delete`);
};

export const useDeleteProductRequest = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (type: "APPROVED" | "DELETE") => void;
}) => {
  return useMutation(deleteProductRequest, {
    onSuccess: () => {
      onSuccess("DELETE");
    },
    onError
  });
};

// HSN List

export const fetchHSLists = ({
  hsn,
  cl4_id,
  product_id,
  group_id,
  currentPage,
  cl1_id,
  cl2_id,
  cl3_id
}: {
  hsn: string;
  cl4_id?: string | number;
  product_id?: string | number;
  group_id?: string | number;
  currentPage: number;
  cl1_id?: string | number;
  cl2_id?: string | number;
  cl3_id?: string | number;
}) => {
  let params = "";
  if (hsn) {
    params += `term=${hsn}`;
  }
  if (currentPage) {
    params = `&page=${currentPage}`;
  }
  if (cl4_id) {
    params += `&cl4_id=${cl4_id}`;
  }
  if (cl1_id) {
    params += `&cl1_id=${cl1_id}`;
  }
  if (cl2_id) {
    params += `&cl2_id=${cl2_id}`;
  }
  if (cl3_id) {
    params += `&cl3_id=${cl3_id}`;
  }
  if (product_id) {
    params += `&product_id=${product_id}`;
  }
  if (group_id) {
    params += `&group_id=${group_id}`;
  }

  if (params.length > 0) {
    return nodeInstance.get(`/api/v1/products/hsn-codes?${params}&limit=15`);
  }
  return nodeInstance.get(`/api/v1/products/hsn-codes?limit=15`);
};

export const useHSNFindersList = ({
  hsn,
  cl4_id,
  cl1_id,
  cl2_id,
  cl3_id,
  product_id,
  group_id,
  currentPage,
  onError
}: {
  hsn: string;
  cl4_id?: string | number;
  cl1_id?: string | number;
  cl2_id?: string | number;
  cl3_id?: string | number;
  product_id?: string | number;
  group_id?: string | number;
  currentPage: number;
  onError: (error: AxiosError) => void;
}) => {
  return useQuery(
    [
      "fetch-product-request",
      hsn,
      cl4_id,
      product_id,
      group_id,
      currentPage,
      cl1_id,
      cl2_id,
      cl3_id
    ],
    () =>
      fetchHSLists({
        hsn,
        cl4_id,
        product_id,
        group_id,
        currentPage,
        cl1_id,
        cl2_id,
        cl3_id
      }),
    {
      onError,
      refetchOnWindowFocus: false,
      enabled: false,
      //formatting and sanitizing data
      select: (data) => {
        return data?.data?.data;
      }
    }
  );
};
