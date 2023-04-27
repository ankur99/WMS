import { phpInstance } from "./Api";

export const searchStores = async (keyword: string) => {
  if (!keyword || keyword?.length === 0) {
    return Promise.resolve([]);
  }
  const response = await phpInstance.get(`/admin/v1/search/stores?keyword=${keyword}`);
  const data = response.data.data;
  return Promise.resolve(data || []);
};

export const searchWarehouse = async (keyword: string) => {
  if (!keyword || keyword?.length === 0) {
    return Promise.resolve([]);
  }
  const response = await phpInstance.get(`/admin/v1/search/warehouses?keyword=${keyword}`);
  const data = response.data.data;
  return Promise.resolve(data || []);
};
