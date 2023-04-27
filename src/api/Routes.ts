import { phpInstance } from "./Api";

export const getRoutes = async (params: any) => {
  const response = await phpInstance.get(`/admin/v1/routes?page=${params.current_page}`);
  const data = response.data;
  return Promise.resolve(data || []);
};

export const uploadRoute = async (params: any, type: string, id?: string) => {
  let url = "";
  if (type == "create") {
    url = `/admin/v1/routes/create`;
  }
  if (type == "update") {
    url = `/admin/v1/routes/${id}/update`;
  }

  const response = await phpInstance.post(url, params);
  const data = response.data.data;
  return Promise.resolve(data || []);
};

export const deleteRoute = async (id: number) => {
  const response = await phpInstance.post(`/admin/v1/routes/${id}/delete`);
  const data = response.data.message;
  return Promise.resolve(data || []);
};

export const changeRouteStatus = async (id: number, type: string) => {
  const response = await phpInstance.post(`/admin/v1/routes/${id}/${type}`);
  const data = response.data.data;
  return Promise.resolve(data || []);
};

export const getRoutesByID = async (id: string | undefined) => {
  const response = await phpInstance.get(`/admin/v1/routes/${id}`);
  const data = response.data.data;
  return Promise.resolve(data || []);
};
