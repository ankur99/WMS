import { phpInstance } from "./Api";

export const fetchMaterialsList = async (name: string) => {
  try {
    if (!name || name?.length === 0) {
      return Promise.resolve([]);
    }
    const response = await phpInstance.get(`/admin/v1/crate/searchMaterial?name=${name}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchItemsList = async (name: string) => {
  try {
    if (!name || name?.length === 0) {
      return Promise.resolve([]);
    }
    const response = await phpInstance.get(`/admin/v1/crate/searchColors?name=${name}`);
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};
