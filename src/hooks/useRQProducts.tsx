import { useMutation, useQuery, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import {
  ProductDataSend,
  ProductComingFrom,
  ProductData,
  UseProductProps,
  UseProductsProps,
  ProductVariant
} from "../types/ProductTypes";
import { FilterValue } from "antd/lib/table/interface";
import { createFiltersFromFilterValue } from "../utils/helperFunctions";
import { nodeInstance, phpInstance } from "../api/Api";

export const getAllProductsFilters = (filtersValue: Record<string, FilterValue | null>) => {
  const filters = createFiltersFromFilterValue({
    filtersValue,
    equalKeys: ["id", "status", "cl4_id", "group_id"],
    substitueKeys: [
      {
        actualKey: "brand",
        changeToKey: "brand.name"
      },
      {
        actualKey: "newCatL4",
        changeToKey: "newCatL4.name"
      },
      {
        actualKey: "class",
        changeToKey: "warehouseAbc.class_abc"
      },
      {
        actualKey: "class",
        changeToKey: "group.warehouseAbc.class"
      },
      {
        actualKey: "taxClass",
        changeToKey: "taxClass.name"
      },
      {
        actualKey: "tags",
        changeToKey: "tags.name"
      },
      {
        actualKey: "warehouseRacks",
        changeToKey: "warehouseRacks.reference"
      }
    ]
  });

  return filters;
};

const fetchAllProducts = (
  currentPage: number,
  filtersValue: Record<string, FilterValue | null>
) => {
  // console.log({ filtersValue });
  const params = `page=${currentPage}&limit=15`;
  const filters = getAllProductsFilters(filtersValue);
  if (filters) {
    return nodeInstance.get(`/api/v1/products?${params}&filters=${filters}`);
  }
  return nodeInstance.get(`/api/v1/products?${params}`);
};

export const useAllProductsData = ({ currentPage, onError, filtersValue }: UseProductsProps) => {
  return useQuery(
    Object.keys(filtersValue)?.length === 0
      ? ["fetch-all-products", currentPage]
      : ["fetch-all-products", currentPage, ...Object.values(filtersValue)],
    () => fetchAllProducts(currentPage, filtersValue),
    {
      onError,
      refetchOnWindowFocus: false,

      //formatting and sanitizing data
      select: (data) => {
        // console.log("all products", data?.data);
        return data?.data?.data;
      }
    }
  );
};

// Getting specific product Data
const fetchProduct = (productId: string | undefined) => {
  return nodeInstance.get(`/api/v1/products/${productId}`);
};

export const useProductData = ({ productId, onError }: UseProductProps) => {
  return useQuery(["fetch-product", productId], () => fetchProduct(productId), {
    onError,
    refetchOnWindowFocus: false,
    enabled: productId ? true : false,
    //formatting and sanitizing data
    select: (data) => {
      return data?.data?.data;
    }
  });
};

// Getting specific product attributes Data
const fetchAttributesData = (productId: string | undefined) => {
  return nodeInstance.get(`/api/v1/products/${productId}/attributes`);
};

export const useProductAttributesData = ({ productId, onError }: UseProductProps) => {
  return useQuery(["fetch-product-attributes", productId], () => fetchAttributesData(productId), {
    onError,
    refetchOnWindowFocus: false,
    enabled: productId ? true : false,
    //formatting and sanitizing data
    select: (data) => {
      return data?.data;
    }
  });
};

// Getting specific product misc info Data
const fetchMiscData = (productId: string | undefined) => {
  return nodeInstance.get(`/api/v1/products/${productId}/attributes/misc-info`);
};

export const useProductMiscData = ({ productId, onError }: UseProductProps) => {
  return useQuery(["fetch-product-misc", productId], () => fetchMiscData(productId), {
    onError,
    refetchOnWindowFocus: false,
    enabled: productId ? true : false,
    //formatting and sanitizing data
    select: (data) => {
      return data?.data?.data;
    }
  });
};

// creating product
const createProduct = (payload: ProductDataSend) => {
  return nodeInstance.post(`api/v1/products/store`, payload);
};

export const useCreateProduct = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (data: ProductData, comingFrom: ProductComingFrom) => void;
}) => {
  return useMutation(createProduct, {
    onSuccess: (response) => {
      onSuccess(response?.data?.data, ProductComingFrom.CREATE);
    },
    onError
  });
};

// Update product
const updateProductDetails = ({ productId, payload }: { productId: string; payload: unknown }) => {
  return nodeInstance.post(`api/v1/products/${productId}/update`, payload);
};

export const useUpdateProductDetails = ({
  onError,
  onSuccess,
  shouldInvalidate = true
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (data: ProductData, comingFrom: ProductComingFrom) => void;
  shouldInvalidate?: boolean;
}) => {
  const queryClient = useQueryClient();

  return useMutation(updateProductDetails, {
    onSuccess: (response) => {
      onSuccess(response?.data?.data, ProductComingFrom.UPDATE);
      shouldInvalidate && queryClient.invalidateQueries("fetch-product"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

// Varinats
const createVariant = ({ payload, productId }: { payload: ProductVariant; productId: string }) => {
  return nodeInstance.post(`api/v1/products/${productId}/variants/create`, payload);
};

export const useCreateVariant = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  return useMutation(createVariant, {
    onSuccess: () => {
      onSuccess("Variant created successfully");
    },
    onError
  });
};

const deleteVariant = ({ variantId, productId }: { variantId: number; productId: string }) => {
  return nodeInstance.post(`api/v1/products/${productId}/variants/${variantId}/delete`);
};

export const useDeleteVariant = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(deleteVariant, {
    onSuccess: () => {
      onSuccess("Variant Deleted successfully");
      queryClient.invalidateQueries("fetch-product");
    },
    onError
  });
};

const updateVariant = ({
  payload,
  productId,
  variantId
}: {
  payload: ProductVariant;
  productId: string;
  variantId: string;
}) => {
  return nodeInstance.post(`api/v1/products/${productId}/variants/${variantId}/update`, payload);
};

export const useUpdateVariant = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(updateVariant, {
    onSuccess: () => {
      onSuccess("Variant updated successfully");
      queryClient.invalidateQueries("fetch-product");
    },
    onError
  });
};

const restoreVariant = ({ variantId }: { variantId: number }) => {
  return nodeInstance.post(`api/v1/products/${variantId}/variants/restore`);
};

export const useRestoreVariant = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(restoreVariant, {
    onSuccess: () => {
      onSuccess("Variant Restored successfully");
      queryClient.invalidateQueries("fetch-product");
    },
    onError
  });
};

// Images
const fetchProductImages = ({ productId }: { productId: string | undefined }) => {
  return nodeInstance.get(`api/v1/products/${productId}/view-images`);
};

export const useProductImage = ({ productId, onError, shouldRefetch }: UseProductProps) => {
  return useQuery(["fetch-product-image", productId], () => fetchProductImages({ productId }), {
    onError,
    refetchOnWindowFocus: false,
    enabled: productId ? true : false,
    refetchInterval: shouldRefetch ? 1000 * 60 * 4.5 : false,
    // in above, since  the image is coming from s3, a temporaray url is provided which is valid for 5 minutes
    //formatting and sanitizing data
    select: (data) => {
      return data?.data?.data;
    }
  });
};

const uploadProductImage = ({
  productId,
  payload
}: {
  productId: string | undefined;
  payload: FormData;
}) => {
  return nodeInstance.post(`/api/v1/products/${productId}/upload`, payload);
};

export const useUploadProductImage = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(uploadProductImage, {
    onSuccess: () => {
      onSuccess("Product Images Uploaded Successfully");
      queryClient.invalidateQueries("fetch-product-image"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

// Delete Product Image
const deleteProductImage = ({ imageId }: { imageId: number }) => {
  return nodeInstance.post(`/api/v1/products/image/${imageId}/delete`);
};

export const useDeleteProductImage = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(deleteProductImage, {
    onSuccess: () => {
      onSuccess("Image Deleted Successfully");
      queryClient.invalidateQueries("fetch-product-image"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

// Assign Barcode
const assignBarcodeProduct = ({ productId }: { productId: string | undefined }) => {
  return nodeInstance.post(`api/v1/products/${productId}/assign-barcode`);
};

export const useAssignBarcodeProduct = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(assignBarcodeProduct, {
    onSuccess: () => {
      onSuccess("Barcode Assigned Successfully");
      queryClient.invalidateQueries("fetch-product");
      window.location.reload();
    },
    onError
  });
};

// Sync Products
const syncProduct = ({ productId }: { productId: string | undefined }) => {
  if (productId) {
    return phpInstance.post(`admin/v1/products/sync`, { productId: +productId });
  }
  return phpInstance.post(`admin/v1/products/sync`, { productId });
};

export const useSyncProduct = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  return useMutation(syncProduct, {
    onSuccess: () => {
      onSuccess("Product Synced Successfully");
    },
    onError
  });
};

// Sync Price
const syncPrice = ({ productId }: { productId: string | undefined }) => {
  if (productId) {
    return phpInstance.post(`api/v1/products/price/sync`, { productId: +productId });
  }
  return phpInstance.post(`api/v1/products/price/sync`, { productId });
};

export const useSyncPrice = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  return useMutation(syncPrice, {
    onSuccess: () => {
      onSuccess("Price Synced Successfully");
    },
    onError
  });
};
