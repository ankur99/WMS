import { BarcodeSearchProps, QCaddItemType } from "../types/crateQCTypes";
import { phpInstance } from "./Api";

export const createTemplate = async (params: Record<string, unknown>) => {
  const response = await phpInstance.post("/admin/v1/crate/templates/create", params);

  // console.log("backend user fetch", Promise.resolve(response?.data?.data || []));
  const data = response?.data?.data;
  return Promise.resolve(data || []);
};

export const getTemplates = async (params?: Record<string, unknown>) => {
  const response = await phpInstance.get(`/admin/v1/crate/templates?${params}`);
  const data = response?.data?.data;
  return Promise.resolve(data || []);
};

export const searchTemplates = async (keyword: string) => {
  try {
    if (!keyword || keyword?.length === 0) {
      return Promise.resolve([]);
    }
    const response = await phpInstance.get(`/admin/v1/crate/templates?name=${keyword}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const generateCrateIds = async (params: Record<string, unknown>) => {
  const response = await phpInstance.post("/admin/v1/crates/create", params);
  const data = response?.data?.data;
  return Promise.resolve(data || []);
};

export const getCrateStatus = async (params: Record<string, unknown>) => {
  const response = await phpInstance.get(`/admin/v1/crate/status`, { params });
  const data = response.data;
  return Promise.resolve(data || []);
};

export const getCrateStatusStats = async () => {
  const response = await phpInstance.get(`/admin/v1/crate/task-info`);
  const data = response.data;
  return Promise.resolve(data || []);
};

export const getTaskTypes = async () => {
  const response = await phpInstance.get(`/admin/v1/crate/task-types`);
  const data = response.data;
  return Promise.resolve(data || []);
};

export const getCrateProducts = async (taskId: number) => {
  const response = await phpInstance.get(`/admin/v1/crate/status/products?id=${taskId}`);
  const data = response.data;
  return Promise.resolve(data || []);
};

export const getQCDataBackend = async (params: Record<string, unknown>) => {
  const response = await phpInstance.get(`/admin/v1/qc/picklists`, { params });
  const data = response?.data;
  return Promise.resolve(data || []);
};

export const getQCOrdersOfAPicklist = async (
  picklist_id: string | undefined,
  params: Record<string, unknown>
) => {
  if (!picklist_id) return;
  const newParams = {
    ...params,
    picklist_id
  };
  const response = await phpInstance.get(`/admin/v1/qc/picklist-orders`, { params: newParams });
  const data = response?.data;
  return Promise.resolve(data || []);
};

export const getQCOrdersStatus = async (
  picklist_id: string | undefined,
  order_id: string | undefined,
  params: Record<string, unknown>,
  status: "pending" | "completed" | "iat" | "cart_scanner"
) => {
  if (!picklist_id || !order_id) return;
  const newParams = {
    ...params,
    picklist_id,
    order_id
  };
  const response = await phpInstance.get(`/admin/v1/qc/${status}`, { params: newParams });
  const data = response?.data;
  return Promise.resolve(data || []);
};

export const getProductsFromBarcode = async (params: BarcodeSearchProps) => {
  const response = await phpInstance.get(
    `admin/v1/qc/search?order_id=${params.order_id}&barcode=${params.barcode}&picklist_id=${params.picklist_id}`
  );
  const data = response?.data;
  return Promise.resolve(data || []);
};

export const QcSearchCrate = async (barcode: string, picklistId: string, orderId: string) => {
  const response = await phpInstance.get(
    `admin/v1/crate/search?reference_id=${barcode}&picklist_id=${picklistId}&order_id=${orderId}`
  );
  const data = response?.data;
  return Promise.resolve(data || []);
};

export const QcAddItem = async (params: QCaddItemType) => {
  const response = await phpInstance.post(`admin/v1/qc/add-item`, params);
  const data = response?.data;
  return Promise.resolve(data || []);
};

export const getQcCrateLedger = async (params: Record<string, unknown>) => {
  const response = await phpInstance.get(`/admin/v1/crates`, { params });
  const data = response?.data;
  return Promise.resolve(data || []);
};

export const getCrateLedgerStatusProducts = async (
  task_id: string,
  task_type: string,
  params: Record<string, unknown>,
  crate_id?: string
) => {
  const response = await phpInstance.get(
    `/admin/v1/crate/status-products?${
      crate_id ? `crate_id=${crate_id}&` : ""
    }task_id=${task_id}&task_type=${task_type}`,
    {
      params
    }
  );
  const data = response?.data;
  return Promise.resolve(data || []);
};

export const getQcCrateLedgerDetail = async (params: Record<string, unknown>, id: string) => {
  const response = await phpInstance.get(`/admin/v1/crates/${id}/ledger-task`, { params });
  const data = response?.data;
  return Promise.resolve(data || []);
};

export const getLedgerDetailStats = async (id: string) => {
  const response = await phpInstance.get(`/admin/v1/crates/${id}`);
  const data = response?.data;
  return Promise.resolve(data || []);
};

export const getCart = async (params: Record<string, unknown>) => {
  const response = await phpInstance.get(`/admin/v1/qc/saved-items`, { params });
  const data = response?.data;
  return Promise.resolve(data || []);
};

export const completeQcOrder = async (params: Record<string, unknown>) => {
  const response = await phpInstance.post(`/admin/v1/qc/order-completed/`, params);
  const data = response?.data;
  return Promise.resolve(data || []);
};

export const removeQcItem = async (params: Record<string, unknown>) => {
  const response = await phpInstance.post(`/admin/v1/qc/remove-item`, params);
  const data = response?.data;
  return Promise.resolve(data || []);
};

export const getCrateData = async (barcode: string) => {
  const response = await phpInstance.get(
    `/admin/v1/crate/search?type=unassigned&reference_id=${barcode}`
  );
  const data = response?.data;
  return Promise.resolve(data || {});
};

export const unassignCrateFromBackend = async (crateIds: number[]) => {
  const payload = {
    ids: crateIds
  };
  const response = await phpInstance.post("/admin/v1/crates/unassigned", payload);
  const data = response?.data?.data;
  return Promise.resolve(data || []);
};

export const crateInvoiceDownload = async (orderId: number) => {
  const response = await phpInstance({
    url: `/admin/v1/crate/${orderId}/download`,
    method: "GET",
    responseType: "blob" // important
  });
  const data = response?.data;

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Order Invoice(${orderId}).pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();

  return Promise.resolve(data || []);
};
