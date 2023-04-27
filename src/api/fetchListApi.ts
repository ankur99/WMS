import { nodeInstance, phpInstance } from "./Api";

export const fetchProductList = async (name: string) => {
  try {
    if (!name || name?.length === 0) {
      return Promise.resolve([]);
    }
    const response = await phpInstance.get(`admin/v1/search/products?term=${name}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchGroupIds = async (id: string) => {
  try {
    if (!id || id?.length === 0) {
      return Promise.resolve([]);
    }
    const response = await phpInstance.get(`admin/v1/search/product/groups?group_id=${id}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchBrandIds = async (id: string) => {
  try {
    if (!id || id?.length === 0) {
      return Promise.resolve([]);
    }
    const response = await phpInstance.get(`admin/v1/search/brands?brand_id=${id}`);
    return Promise.resolve(response?.data?.data || []);
    // console.log("backend user fetch", Promise.resolve(response?.data?.data || []));
    return Promise.resolve(response?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchVendorsList = async (name: string) => {
  try {
    if (!name || name?.length === 0) {
      return Promise.resolve([]);
    }
    const response = await nodeInstance.get(
      `/api/v1/non-inventory-order/vendors?search_term=${name}`
    );

    return Promise.resolve(response?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};
export const fetchVendorAddressFromGSTIN = async (vendor_id: string, gstin: string) => {
  try {
    if (!gstin || gstin?.length === 0 || !vendor_id || vendor_id?.length === 0) {
      return Promise.resolve([]);
    }
    const response = await nodeInstance.get(
      `/api/v1/non-inventory-order/getVendor-address?vendor_id=${vendor_id}&gstin=${gstin}`
    );
    return Promise.resolve(response?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};
export const fetchVendorAddressFromVendorId = async (vendor_id: string) => {
  try {
    if (!vendor_id || vendor_id?.length === 0) {
      return Promise.resolve([]);
    }
    const response = await nodeInstance.get(
      `/api/v1/non-inventory-order/getVendor-address?vendor_id=${vendor_id}`
    );
    return Promise.resolve(response?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchProductListNode = async (name: string) => {
  try {
    if (!name || name?.length === 0) {
      return Promise.resolve([]);
    }
    const response = await nodeInstance.get(
      `/api/v1/non-inventory-order/getProduct?search_term=${name}`
    );
    return Promise.resolve(response?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};
