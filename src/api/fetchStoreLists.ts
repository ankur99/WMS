import { phpInstance } from "./Api";

export const fetchPinList = async (pin: string) => {
  if (!pin || pin?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    const response = await phpInstance.get(`/admin/v1/search/pincodes?term=${pin}`);
    // console.log("backend user fetch", Promise.resolve(response?.data?.data || []));
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};

export const fetchBeatList = async (beat: string) => {
  if (!beat || beat?.length === 0) {
    return Promise.resolve([]);
  }
  try {
    const response = await phpInstance.get(`/admin/v1/search/beats?keyword=${beat}`);
    // console.log("backend user fetch", Promise.resolve(response?.data?.data || []));
    return Promise.resolve(response?.data?.data || []);
  } catch (error) {
    console.log("error", error);
    return Promise.resolve([]);
  }
};
