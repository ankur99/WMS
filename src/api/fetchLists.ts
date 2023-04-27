import { nodeInstance, phpInstance } from "./Api";

export const fetchHSNList = async (hsn: string) => {
  if (!hsn || hsn?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    const response = await nodeInstance.get(`/api/v1/search/hsn-codes?term=${hsn}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchTagsList = async (tag: string) => {
  if (!tag || tag?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    const response = await phpInstance.get(`/admin/v1/search/tags?term=${tag}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchBrandsList = async (brand: string) => {
  if (!brand || brand?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    const response = await nodeInstance.get(`/api/v1/search/brands?term=${brand}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchTaxClassList = async (taxClass: string) => {
  if (!taxClass || taxClass?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    const response = await nodeInstance.get(`/api/v1/search/tax-class?term=${taxClass}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchPlacementList = async (racks: string) => {
  if (!racks || racks?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    const response = await nodeInstance.get(`/api/v1/search/racks?term=${racks}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchProductTagsList = async (tag: string) => {
  if (!tag || tag?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    const response = await nodeInstance.get(`/api/v1/search/product-tags?term=${tag}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchAttributesList = async (attribute: string) => {
  if (!attribute || attribute?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    const response = await nodeInstance.get(`/api/v1/search/attributes?term=${attribute}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchProductGroups = async (value: string) => {
  if (!value || value?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    const response = await nodeInstance.get(`/api/v1/search/product-groups?term=${value}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchClass2 = async (value: string) => {
  if (!value || value?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    const response = await nodeInstance.get(`/api/v1/search/newcat-l2?term=${value}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchClass4 = async (value: string) => {
  if (!value || value?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    const response = await nodeInstance.get(`/api/v1/search/newcat-l4?term=${value}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchClass1 = async (value: string) => {
  if (!value || value?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    const response = await nodeInstance.get(`/api/v1/search/newcat-l1?term=${value}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchClass3 = async (value: string) => {
  if (!value || value?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    const response = await nodeInstance.get(`/api/v1/search/newcat-l3?term=${value}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchProductSeach = async (value: string) => {
  if (!value || value?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    const response = await nodeInstance.get(`/api/v1/search/products?term=${value}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchHSNDependentList = async ({
  hsn,
  cl4_id,
  product_id,
  group_id
}: {
  hsn: string;
  cl4_id?: string | number;
  product_id?: string | number;
  group_id?: string | number;
}) => {
  if (!hsn || hsn?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    let params = "";
    if (cl4_id) {
      params += `&cl4_id=${cl4_id}`;
    }
    if (product_id) {
      params += `&product_id=${product_id}`;
    }
    if (group_id) {
      params += `&group_id=${group_id}`;
    }

    // console.log({ params });

    if (params.length > 0) {
      const response = await nodeInstance.get(
        `/api/v1/products/hsn-codes?term=${hsn}&page=1&limit=20${params}`
      );
      // console.log("dbbbb", response?.data?.data?.results);
      return Promise.resolve(response?.data?.data?.results || []);
    }
    const response = await nodeInstance.get(
      `/api/v1/products/hsn-codes?term=${hsn}&page=1&limit=20`
    );
    // console.log("daaaaaaa", response?.data);
    return Promise.resolve(response?.data?.data?.results || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};
