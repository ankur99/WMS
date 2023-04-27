import { FilterValue } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { nodeInstance } from "../api/Api";
import { NonInventoryInvoicingPayloadType } from "../types/nonInventoryInvoicingTypes";
import { createFiltersFromFilterValue } from "../utils/helperFunctions";

export const getNonInventoryInvoicingFilters = (
  filtersValue: Record<string, FilterValue | null>
) => {
  const filters = createFiltersFromFilterValue({
    filtersValue,
    equalKeys: ["id", "status"],
    substitueKeys: []
  });
  return filters;
};

// Fetch Non Inventory Invoicings
const fetchNonInventoryInvoicings = (
  currentPage: number,
  pageSize: number,
  filtersValue: Record<string, FilterValue | null>
) => {
  const params = `page=${currentPage}&limit=${pageSize}`;
  const filters = getNonInventoryInvoicingFilters(filtersValue);
  if (filters) {
    return nodeInstance.get(
      `/api/v1/non-inventory-order/get-all-non-inventory-items?${params}&filters=${filters}`
    );
  }
  return nodeInstance.get(`/api/v1/non-inventory-order/get-all-non-inventory-items?${params}`);
};

export const useNonInventoryInvoicingsData = ({
  currentPage,
  pageSize,
  onError,
  filtersValue
}: any) => {
  return useQuery(
    Object.keys(filtersValue)?.length === 0
      ? ["fetch-non-inventory-invoicings", currentPage, pageSize]
      : ["fetch-non-inventory-invoicings", currentPage, pageSize, ...Object.values(filtersValue)],
    () => fetchNonInventoryInvoicings(currentPage, pageSize, filtersValue),
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

// Fetch Specific Non Inventory Invoicing
const fetchNonInventoryInvoicing = (invoiceId: string | undefined) => {
  return nodeInstance.get(`/api/v1/non-inventory-order/get-order-detail-by-id/${invoiceId}`);
};

export const useNonInventoryInvoicingData = ({
  invoiceId,
  onError
}: {
  invoiceId: string | undefined;
  onError: (error: AxiosError) => void;
}) => {
  return useQuery(
    ["fetch-non-inventory-invoicing", invoiceId],
    () => fetchNonInventoryInvoicing(invoiceId),
    {
      onError,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data?.data;
      }
    }
  );
};

// Create Non Inventory Invoicing Data
const createNonInventoryInvoicing = (payload: NonInventoryInvoicingPayloadType) => {
  return nodeInstance.post(
    `/api/v1/non-inventory-order/create-non-inventory-item-invoice`,
    payload
  );
};

export const useCreateNonInventoryInvoicing = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: () => void;
}) => {
  return useMutation(createNonInventoryInvoicing, {
    onSuccess: () => {
      onSuccess();
    },
    onError
  });
};

// Download Non Inventory Invoicing PDF

const downloadNonInventoryInvoicePDF = (invoiceId: string | undefined) => {
  return nodeInstance.get(`/api/v1/non-inventory-order/getNonInventoryPDF?order_id=${invoiceId}`);
};

export const useDownloadNonInventoryInvoicePDF = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (link: string) => void;
}) => {
  return useMutation(downloadNonInventoryInvoicePDF, {
    onError,
    onSuccess: (data) => {
      onSuccess(data?.data?.pdf_format);
    }
  });
};

// Update Non Inventory Status
const updateNonInventoryStatus = (invoiceId: string | undefined) => {
  return nodeInstance.get(
    `/api/v1/non-inventory-order/updateStatus-non-inventory-order/${invoiceId}`
  );
};

export const useUpdateNonInventoryStatus = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(updateNonInventoryStatus, {
    onError,
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries("fetch-non-inventory-invoicing");
    }
  });
};

// Discard non inventory invoice
const discardNonInventoryInvoicing = (invoiceId: string | undefined) => {
  return nodeInstance.get(`/api/v1/non-inventory-order/discard-order/${invoiceId}`);
};

export const useDiscardNonInventoryInvoicing = ({
  onError,
  onSuccessDiscard
}: {
  onError: (error: AxiosError) => void;
  onSuccessDiscard: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(discardNonInventoryInvoicing, {
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries("fetch-non-inventory-invoicings");
      onSuccessDiscard();
    }
  });
};
